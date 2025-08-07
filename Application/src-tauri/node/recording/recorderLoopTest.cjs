const { spawn } = require("child_process");
const path = require("path");

const scriptPath = path.resolve(__dirname, "recordingTest.cjs");

function recordLoop() {
    const child = spawn("node", [scriptPath], { stdio: "inherit" });

    // 5 milisecond delay before continuing
    child.on("exit", (code) => {
        console.log(`Recording finished with code ${code}. Starting again...`);
        setTimeout(recordLoop, 5);
    });
}

recordLoop();