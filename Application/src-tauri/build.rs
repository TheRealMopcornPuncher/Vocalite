use std::env;
use std::path::{Path, PathBuf};
use std::process::Command;

fn main() {
    let manifest_dir = env::var("CARGO_MANIFEST_DIR").unwrap();
    let model_path = Path::new(&manifest_dir)
        .join("models")
        .join("ggml-tiny.en.bin");

    // Only download if model is missing
    if !model_path.exists() {
        let script_path: PathBuf;
        let mut command: Command;

        if cfg!(target_os = "windows") {
            script_path = Path::new(&manifest_dir)
                .join("models")
                .join("download-ggml-model.cmd");

            command = Command::new("cmd");
            command.arg("/C");
            command.arg(script_path.to_str().unwrap());
            command.arg("tiny.en");
        } else {
            script_path = Path::new(&manifest_dir)
                .join("models")
                .join("download-ggml-model.sh");

            command = Command::new("sh");
            command.arg(script_path.to_str().unwrap());
            command.arg("tiny.en");
        }

        let output = command
            .output()
            .expect("Failed to execute model download script");

        // Print script stdout/stderr for visibility
        eprintln!("stdout:\n{}", String::from_utf8_lossy(&output.stdout));
        eprintln!("stderr:\n{}", String::from_utf8_lossy(&output.stderr));

        if !output.status.success() {
            panic!("Model download failed with exit code {}", output.status);
        }
    }

    tauri_build::build();
}
