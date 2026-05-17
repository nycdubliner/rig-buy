import subprocess
import json
import os

LLAMA_BENCH_PATH = "/home/tdeburca/rig-buy/llama.cpp/build/bin/llama-bench"
MODELS = {
    "qwen": "models/qwen2.5-coder-32b.gguf",
    "gemma": "models/gemma2-27b.gguf"
}

def run_bench(name, path):
    print(f"Running llama-bench for {name}...")
    cmd = [
        LLAMA_BENCH_PATH,
        "-m", path,
        "-p", "512,1024",
        "-n", "128",
        "-o", "json"
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        with open(f"llamacpp_{name}.json", "w") as f:
            f.write(result.stdout)
        print(f"Saved results to llamacpp_{name}.json")
    else:
        print(f"Error running bench for {name}: {result.stderr}")

if __name__ == "__main__":
    if not os.path.exists(LLAMA_BENCH_PATH):
        print(f"llama-bench not found at {LLAMA_BENCH_PATH}. Please build llama.cpp first.")
    else:
        for name, path in MODELS.items():
            if os.path.exists(path):
                run_bench(name, path)
            else:
                print(f"Model not found at {path}")
