# Benchmarking Reproduction Guide (May 2026)

This document ensures that the performance metrics gathered for the Dual RX 7800 XT rig can be reproduced or updated after OS/ROCm upgrades.

## 1. Prerequisites
* **OS:** Ubuntu 26.04 LTS (Resolute)
* **Kernel:** 7.0.0+
* **ROCm:** 7.1.1 (installed via `apt install rocm-dev rocm-smi`)
* **Drivers:** `amdgpu-install --usecase=rocm`

## 2. Model Management (Symlinks)
To avoid duplicating 20GB+ blobs, we symlink Ollama's internal storage to our benchmark directory:
```bash
mkdir -p models
# Qwen 2.5 Coder 32B
ln -s /usr/share/ollama/.ollama/models/blobs/sha256-ac3d1ba8aa7... models/qwen2.5-coder-32b.gguf
# Gemma 2 27B
ln -s /usr/share/ollama/.ollama/models/blobs/sha256-d7e4b00a7d7... models/gemma2-27b.gguf
```
*Note: Use `ollama show <model> --modelfile` to find the exact sha256 path.*

## 3. Building llama.cpp for RDNA3
The standard build is CPU-only. For Dual 7800 XT, use these exact flags:
```bash
git clone https://github.com/ggerganov/llama.cpp.git
cd llama.cpp
mkdir build && cd build
cmake .. -DGGML_HIP=ON -DGPU_TARGETS=gfx1101 -DCMAKE_BUILD_TYPE=Release
cmake --build . --config Release -j $(nproc)
```

## 4. Running the Benchmark Suite
### Ollama
Ensure the Ollama service is running, then execute:
```bash
python3 scripts/benchmark_ollama.py
```

### llama.cpp (Manual)
To test raw throughput with multi-GPU layer splitting:
```bash
./bin/llama-bench -m ../../models/qwen2.5-coder-32b.gguf -p 512,1024 -n 128 -o json
```

### Automated Suite
```bash
python3 scripts/benchmark_llamacpp.py
python3 scripts/generate_graphs.py
```

## 5. Environment Alignment
If Python 3.14+ is used, certain packages like `vllm` may fail. Use a venv:
```bash
python3 -m venv venv
source venv/bin/activate
pip install requests matplotlib numpy
```

## 6. Success Baselines (May 17, 2026)
* **Qwen 32B (llama.cpp):** ~16.3 t/s Decode
* **Gemma 2 27B (Ollama):** ~30.4 t/s Decode
* **Combined VRAM Usage:** ~20-24GB (fits in 32GB total)
