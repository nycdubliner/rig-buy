#!/bin/bash
set -e

# Path to MLC environment binaries
MLC_BIN_DIR="/home/tdeburca/git/rig-buy/miniconda/envs/mlc-env/bin"
MLC_LLM="${MLC_BIN_DIR}/mlc_llm"

# Define directories
MODELS_DIR="/home/tdeburca/git/rig-buy/models"
MAIN_MODEL_DIR="${MODELS_DIR}/gemma-4-31B-it"
MAIN_DIST_DIR="${MAIN_MODEL_DIR}/dist"
DRAFT_MODEL_DIR="${MODELS_DIR}/gemma-4-E2B-it"
DRAFT_DIST_DIR="${DRAFT_MODEL_DIR}/dist"

echo "=== Processing Main Model: Gemma-4-31B-it ==="
mkdir -p "${MAIN_DIST_DIR}"

echo "[1/3] Generating chat config..."
${MLC_LLM} gen_config "${MAIN_MODEL_DIR}" \
  --quantization q4f16_1 \
  --conv-template gemma3_instruction \
  --pipeline-parallel-stages 2 \
  --output "${MAIN_DIST_DIR}"

echo "[2/3] Converting weights (quantizing to q4f16_1)..."
${MLC_LLM} convert_weight "${MAIN_MODEL_DIR}" \
  --quantization q4f16_1 \
  --output "${MAIN_DIST_DIR}"

# Copy tokenizer and other config files
echo "Copying tokenizer and config files to dist..."
cp ${MAIN_MODEL_DIR}/tokenizer* "${MAIN_DIST_DIR}/" 2>/dev/null || true
cp ${MAIN_MODEL_DIR}/*.json "${MAIN_DIST_DIR}/" 2>/dev/null || true

echo "[3/3] Compiling model library for ROCm..."
${MLC_LLM} compile "${MAIN_DIST_DIR}" \
  --device rocm \
  --output "${MAIN_MODEL_DIR}/gemma-4-31B-it-q4f16_1-ROCm.so"


echo "=== Processing Draft Model: Gemma-4-E2B-it ==="
mkdir -p "${DRAFT_DIST_DIR}"

echo "[1/3] Generating chat config..."
${MLC_LLM} gen_config "${DRAFT_MODEL_DIR}" \
  --quantization q4f16_1 \
  --conv-template gemma3_instruction \
  --output "${DRAFT_DIST_DIR}"

echo "[2/3] Converting weights (quantizing to q4f16_1)..."
${MLC_LLM} convert_weight "${DRAFT_MODEL_DIR}" \
  --quantization q4f16_1 \
  --output "${DRAFT_DIST_DIR}"

# Copy tokenizer and other config files
echo "Copying tokenizer and config files to dist..."
cp ${DRAFT_MODEL_DIR}/tokenizer* "${DRAFT_DIST_DIR}/" 2>/dev/null || true
cp ${DRAFT_MODEL_DIR}/*.json "${DRAFT_DIST_DIR}/" 2>/dev/null || true

echo "[3/3] Compiling model library for ROCm..."
${MLC_LLM} compile "${DRAFT_DIST_DIR}" \
  --device rocm \
  --output "${DRAFT_MODEL_DIR}/gemma-4-E2B-it-q4f16_1-ROCm.so"

echo "=== All compilations completed successfully! ==="
