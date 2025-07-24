const fs = require("fs");
const { execSync } = require("child_process");
const ffmpegPath = require("ffmpeg-static");
const { SpeechRecorder, devices } = require("speech-recorder");

// List available devices
console.log("Devices:", devices());

const mic = devices()[0];
if (!mic) {
  console.error("No microphone devices found. Exiting...");
  process.exit(1);
}
console.log("Using microphone:", mic.label);

// Ensure output directory exists
const outputDir = "./output";
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

// Create SpeechRecorder instance
const recorder = new SpeechRecorder({
  device: mic.deviceId,
  sampleRate: 16000,
  samplesPerFrame: 480,
  onChunkStart: () => console.log("Chunk started"),
  // onAudio is set later in the recordingDaemon function
  onAudio: () => {},
  onChunkEnd: () => console.log("Chunk ended"),
});

function recordingDaemon() {
  let currentSpeechStream = null;
  let currentBaseName = null;
  let currentSpeechPath = null;

  function startNewRecording() {
    currentBaseName = `recording_${new Date().toISOString().replace(/[:.]/g, "-")}`;
    currentSpeechPath = `${outputDir}/${currentBaseName}_speech_audio.raw`;
    currentSpeechStream = fs.createWriteStream(currentSpeechPath);

    recorder.onAudio = ({ audio, speech, probability, volume }) => {
      if (speech) currentSpeechStream.write(audio);
      console.log("Audio frame:", { speech, probability, volume });
    };
  }

  // Start first recording
  startNewRecording();
  recorder.start();
  console.log("Recording daemon active.");

  setInterval(() => {
    recorder.stop();
    if (currentSpeechStream) {
      currentSpeechStream.end();
    }
    console.log("Attempting to save buffer:", currentBaseName);

    try {
      execSync(
        `"${ffmpegPath}" -y -f s16le -ar 16000 -ac 1 -i "${currentSpeechPath}" "${outputDir}/${currentBaseName}_speech_audio.m4a"`
      );
      fs.unlinkSync(currentSpeechPath);
      console.log("Converted to M4A and deleted raw file.");
    } catch (e) {
      console.error("ffmpeg conversion failed:", e.message);
    }

    startNewRecording();
    recorder.start();
    console.log("New buffer started.");
  }, 10000);
}

recordingDaemon();
