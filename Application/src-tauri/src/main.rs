#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::process::Command;
use tauri::command;

#[command]
fn run_recording_script() -> Result<String, String> {
    let script_path = "./node/recording/recordingTest.cjs";
    let output = Command::new("node")
        .arg(script_path)
        .output()
        .map_err(|e| format!("Failed to start script: {}", e))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
fn list_microphones() -> Result<Vec<String>, String> {
    let script_path = "./node/recording/micList.cjs";
    let output = std::process::Command::new("node")
        .arg(script_path)
        .output()
        .map_err(|e| format!("Failed to start script: {}", e))?;

    if output.status.success() {
        let stdout_str = String::from_utf8_lossy(&output.stdout);
        serde_json::from_str::<Vec<String>>(&stdout_str)
            .map_err(|e| format!("Failed to parse microphone list: {}", e))
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![run_recording_script])
        .invoke_handler(tauri::generate_handler![list_microphones])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

