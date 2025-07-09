// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{Manager, Window};
use std::process::{Command, Stdio};
use std::io::{BufReader, BufRead};
use std::thread;

#[tauri::command]
fn start_recording(window: Window) -> Result<(), String> {
    // Path to node and your script - adjust as needed
    let node_path = "node"; // Assumes node is in PATH
    let script_path = "./src-tauri/node/recordingDaemon.js";

    let mut child = Command::new(node_path)
        .arg(script_path)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to spawn node process: {}", e))?;

    let stdout = child.stdout.take().unwrap();
    let stderr = child.stderr.take().unwrap();

    let window_clone = window.clone();
    thread::spawn(move || {
        let reader = BufReader::new(stdout);
        for line in reader.lines() {
            if let Ok(line) = line {
                // Send stdout lines to frontend as event
                let _ = window_clone.emit("recording-stdout", line);
            }
        }
    });

    let window_clone = window.clone();
    thread::spawn(move || {
        let reader = BufReader::new(stderr);
        for line in reader.lines() {
            if let Ok(line) = line {
                // Send stderr lines to frontend as event
                let _ = window_clone.emit("recording-stderr", line);
            }
        }
    });

    // Detach child, or you can hold child handle somewhere for process management
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_recording])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
