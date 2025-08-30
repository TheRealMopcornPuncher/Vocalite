const naudiodon = require("naudiodon");

function getInputDevices() {
    let devices = naudiodon.getDevices();
    return devices
        .filter(device => device.maxInputChannels > 0)
        .map(device => device.name); // just names
}

console.log(JSON.stringify(getInputDevices()));