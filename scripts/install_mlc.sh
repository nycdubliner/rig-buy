#!/bin/bash
set -e
export CONDA_PLUGINS_AUTO_ACCEPT_TOS=yes

WORKSPACE_DIR="/home/tdeburca/git/rig-buy"
MINICONDA_DIR="$WORKSPACE_DIR/miniconda"
INSTALLER_PATH="$WORKSPACE_DIR/Miniconda3-latest-Linux-x86_64.sh"

if [ ! -f "$MINICONDA_DIR/bin/conda" ]; then
    echo "=== Downloading Miniconda ==="
    wget -q -O "$INSTALLER_PATH" https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh

    echo "=== Installing Miniconda to $MINICONDA_DIR ==="
    bash "$INSTALLER_PATH" -b -u -p "$MINICONDA_DIR"
    rm -f "$INSTALLER_PATH"
else
    echo "=== Miniconda already installed at $MINICONDA_DIR, skipping installation ==="
fi

echo "=== Creating Conda Environment (Python 3.11) ==="
if "$MINICONDA_DIR/bin/conda" env list | grep -q "mlc-env"; then
    echo "=== Removing existing mlc-env to ensure clean state ==="
    "$MINICONDA_DIR/bin/conda" env remove -y -n mlc-env
fi
"$MINICONDA_DIR/bin/conda" create -y -n mlc-env -c conda-forge --override-channels python=3.11 pip cmake ninja rust

# Active environment path variables
export PATH="$MINICONDA_DIR/envs/mlc-env/bin:$PATH"
export LD_LIBRARY_PATH="$WORKSPACE_DIR/lib:$LD_LIBRARY_PATH"

echo "=== Building Apache TVM from source ==="
cd "$WORKSPACE_DIR/mlc-llm/3rdparty/tvm"
mkdir -p build
cat <<EOF > build/config.cmake
set(USE_CUDA OFF)
set(USE_ROCM ON)
set(USE_VULKAN OFF)
set(USE_METAL OFF)
set(USE_OPENCL OFF)
set(USE_LLVM /usr/bin/llvm-config-21)
set(USE_RPC ON)
set(USE_SORT ON)
set(USE_RANDOM ON)
set(TVM_FFI_USE_LIBBACKTRACE ON)
set(TVM_FFI_BACKTRACE_ON_SEGFAULT ON)
EOF

cd build
cmake -G Ninja ..
cmake --build . --config Release -j \$(nproc)

echo "=== Installing TVM Python bindings ==="
cd "$WORKSPACE_DIR/mlc-llm/3rdparty/tvm"
pip install -e .

echo "=== Building MLC LLM from source ==="
cd "$WORKSPACE_DIR/mlc-llm"
mkdir -p build
cat <<EOF > build/config.cmake
set(TVM_SOURCE_DIR 3rdparty/tvm)
set(CMAKE_BUILD_TYPE Release)
set(USE_CUDA OFF)
set(USE_CUTLASS OFF)
set(USE_CUBLAS OFF)
set(USE_ROCM ON)
set(USE_VULKAN OFF)
set(USE_METAL OFF)
set(USE_OPENCL OFF)
set(USE_OPENCL_ENABLE_HOST_PTR OFF)
EOF

cd build
cmake -G Ninja ..
cmake --build . --config Release -j \$(nproc)

echo "=== Installing MLC LLM Python bindings ==="
cd "$WORKSPACE_DIR/mlc-llm/python"
pip install -e .

echo "=== Verifying MLC LLM Installation ==="
python -c "import tvm; import mlc_llm; print('MLC LLM installed successfully!')"

