const { spawn } = require("child_process");
const path = require("path");

const scriptPath = path.resolve(__dirname, "recordingtest.cjs");

function recordLoop() {
    const child = spawn("node", [scriptPath], { stdio: "inherit" });

    child.on("exit", (code) => {
        console.log(`Recording finished with code ${code}. Starting again...`);
        setTimeout(recordLoop, 1000);
    });
}

recordLoop();