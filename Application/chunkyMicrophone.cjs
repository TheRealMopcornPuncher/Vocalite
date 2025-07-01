const fs = require("fs");
const { execSync } = require("child_process");
const { SpeechRecorder, devices } = require("speech-recorder");

// List devices
console.log("Devices:", devices());

const mic = devices()[0]; // pick first device or let user choose
console.log("Using microphone:", mic.label);

if (!fs.existsSync("./output")) fs.mkdirSync("./output");

// Generate unique base name using timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const baseName = `recording_${timestamp}`;

const rawPath = `./output/${baseName}_raw_audio.raw`;
const speechPath = `./output/${baseName}_speech_audio.raw`;
const rawStream = fs.createWriteStream(rawPath);
const speechStream = fs.createWriteStream(speechPath);

const recorder = new SpeechRecorder({
  device: mic.deviceId,
  sampleRate: 16000,
  samplesPerFrame: 480,
  onChunkStart: ({ audio }) => console.log("Chunk started"),
  onAudio: ({ audio, speech, probability, volume }) => {
    rawStream.write(audio);
    if (speech) speechStream.write(audio);
    console.log("Audio frame:", { speech, probability, volume });
  },
  onChunkEnd: () => console.log("Chunk ended"),
});

console.log("Recording for 5 seconds...");
recorder.start();

setTimeout(() => {
  recorder.stop();
  rawStream.end();
  speechStream.end();
  console.log("Recording complete.");

  // Convert raw PCM to M4A using ffmpeg
  // 16kHz, 16-bit, mono PCM
  try {
    execSync(
      `ffmpeg -y -f s16le -ar 16000 -ac 1 -i "${rawPath}" ./output/${baseName}_uncut_audio.m4a`
    );
    execSync(
      `ffmpeg -y -f s16le -ar 16000 -ac 1 -i "${speechPath}" ./output/${baseName}_speech_audio.m4a`
    );
    // Delete raw files after conversion
    fs.unlinkSync(rawPath);
    fs.unlinkSync(speechPath);
    console.log("Converted to M4A and deleted raw files.");
  } catch (e) {
    console.error("ffmpeg conversion failed:", e.message);
  }
}, 5000);
