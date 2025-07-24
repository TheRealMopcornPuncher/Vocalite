import fs from "fs";
import path from "path";
import chokidar from "chokidar";
import whisper from "whisper-node";

// Define constants for current configuration
const outputDir = "./output";
const modelName = "tiny.en";
const MAX_CONCURRENT = 2;
const MAX_RETRIES = 3;
const RETRY_DELAY = 3000;

// Safeguard: File queue to prevent duplicate processing
const fileQueue = [];
let runningCount = 0;
const processedFiles = new Set();
const retryCounts = new Map();

let shuttingDown = false;  // Track shutdown state

// Ensure that file is no longer being written to before processing
async function waitForFileStability(filePath, timeout = 2000, interval = 200) {
  return new Promise((resolve) => {
    let lastSize = 0;
    let stableCounter = 0;
    const check = () => {
      fs.stat(filePath, (err, stats) => {
        if (err) {
          stableCounter = 0;
        } else {
          if (stats.size === lastSize) {
            stableCounter++;
          } else {
            stableCounter = 0;
            lastSize = stats.size;
          }
        }
        if (stableCounter * interval >= timeout) {
          resolve();
        } else {
          setTimeout(check, interval);
        }
      });
    };
    check();
  });
}

// Transcribe audio file using whisper
async function transcribeFile(filePath) {
  try {
    console.log(`Transcribing ${filePath}...`);
    const result = await whisper.transcribe({ filePath, modelName });
    const txtPath = filePath.replace(/\.m4a$/, ".txt");
    fs.writeFileSync(txtPath, result.text, "utf-8");
    console.log(`Saved transcription to ${txtPath}`);
    return true;
  } catch (error) {
    console.error(`Failed to transcribe ${filePath}:`, error);
    return false;
  }
}

// Iterate through the file queue and continue processing files (Concurrency control and retries)
async function processNext() {
  if (shuttingDown) return;   // Stop processing new items during shutdown
  if (fileQueue.length === 0 || runningCount >= MAX_CONCURRENT) return;

  const filePath = fileQueue.shift();
  runningCount++;

  await waitForFileStability(filePath);

  let success = await transcribeFile(filePath);

  if (!success) {
    const retries = retryCounts.get(filePath) || 0;
    if (retries < MAX_RETRIES) {
      console.log(`Retrying ${filePath} in ${RETRY_DELAY}ms... (${retries + 1}/${MAX_RETRIES})`);
      retryCounts.set(filePath, retries + 1);
      setTimeout(() => {
        fileQueue.push(filePath);
        processNext();
      }, RETRY_DELAY);
    } else {
      console.error(`Giving up on ${filePath} after ${MAX_RETRIES} retries.`);
      processedFiles.add(filePath);
      retryCounts.delete(filePath);
    }
  } else {
    processedFiles.add(filePath);
    retryCounts.delete(filePath);
  }

  runningCount--;
  processNext();
}

// Chokidar watcher monitors output directory for new buffers
const watcher = chokidar.watch(path.join(outputDir, "*_speech_audio.m4a"), {
  persistent: true,
  ignoreInitial: true,
});

// Handle new files added to the watcher
watcher.on("add", (filePath) => {
  if (shuttingDown) {
    console.log(`Ignoring new file during shutdown: ${filePath}`);
    return;
  }

  console.log(`Detected new audio file: ${filePath}`);

  if (!fileQueue.includes(filePath) && !processedFiles.has(filePath)) {
    fileQueue.push(filePath);
    processNext();
  } else {
    console.log(`File already queued or processed: ${filePath}`);
  }
});

// Shutdown gracefully by closing the watcher and waiting for transcriptions to finish
function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log("\nShutting down...");

  watcher.close().then(() => {
    console.log("File watcher closed.");
    // Wait for running transcriptions to finish before exit
    const checkFinished = () => {
      if (runningCount === 0) {
        console.log("All transcriptions complete. Exiting.");
        process.exit(0);
      } else {
        console.log(`Waiting for ${runningCount} transcription(s) to finish...`);
        setTimeout(checkFinished, 1000);
      }
    };
    checkFinished();
  });
}

// Handle process termination signals for graceful shutdown
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log(`Watching ${outputDir} for new speech audio files with concurrency, retry, and graceful shutdown...`);
