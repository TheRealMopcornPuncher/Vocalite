const fs = require("fs");
const path = require("path");
const recorder = require("mic");
const naudiodon = require("naudiodon");

const devices = naudiodon.getDevices();

// Filter devices that support input channels (> 0)
const inputOnly = devices.filter(device => device.maxInputChannels > 0);

console.log("Input devices found:");

inputOnly.forEach(device => {
  console.log(`- ${device.name}`);
});

const settings = recorder({
    device: `plughw: 0`,
    rate: 16000,
    channels: 1,
    bitwidth: 16,
    debug: true,
    fileType: "wav"
});

const input = settings.getAudioStream();
const outputPath = path.resolve(__dirname, 'output.wav');
const outputFileStream = fs.createWriteStream(outputPath);

input.pipe(outputFileStream);
input.resume();

input.on('data', data => {
    console.log("Input stream received: " + data.length);
});

input.on('error', err => {
    console.log("Error in Input Stream: " + err);
});

// After startComplete has occured, start 10 second timer to finish
input.on('startComplete', () => {
    console.log("Recording started, will stop in 10 seconds...");
    setTimeout(() => {
        settings.stop();
    }, 10000);
});

input.on('stopComplete', () => {
    console.log("Recording stopped");
    outputFileStream.end();
});

input.on('processExitComplete', () => {
    console.log("Recording process exited");
});

settings.start();