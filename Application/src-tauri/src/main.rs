#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{command, Builder, generate_context, generate_handler, Emitter, Window};
use std::{
  io::{BufRead, BufReader},
  process::{Command, Stdio},
  thread,
};

#[command]
fn start_recording(window: Window) -> Result<(), String> {
  let mut child = Command::new("node")
    .arg("./node/recorder.cjs")
    .stdout(Stdio::piped())
    .stderr(Stdio::piped())
    .spawn()
    .map_err(|e| format!("spawn error: {}", e))?;

  let stdout = child.stdout.take().unwrap();
  let stderr = child.stderr.take().unwrap();

  let win = window.clone();
  thread::spawn(move || {
    for line in BufReader::new(stdout).lines().flatten() {
      let _ = win.emit("recording-stdout", line);
    }
  });

  let win = window;
  thread::spawn(move || {
    for line in BufReader::new(stderr).lines().flatten() {
      let _ = win.emit("recording-stderr", line);
    }
  });

  Ok(())
}

fn main() {
  Builder::default()
    .invoke_handler(generate_handler![start_recording])
    .run(generate_context!())
    .expect("error while running tauri application");
}
