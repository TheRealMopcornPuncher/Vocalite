const fs = require("fs");
const { SpeechRecorder, devices } = require("speech-recorder");

// List devices
console.log("Devices:", devices());

const mic = devices()[0]; // pick first device or let user choose
console.log("Using microphone:", mic.label);

if (!fs.existsSync("./output")) fs.mkdirSync("./output");

const rawStream = fs.createWriteStream("./output/raw_audio.raw");
const speechStream = fs.createWriteStream("./output/speech_audio.raw");

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
}, 5000);
