import os
from huggingface_hub import hf_hub_download

def download_file(repo_id, filename, local_dir):
    print(f"Starting download for {repo_id}/{filename}...")
    os.makedirs(local_dir, exist_ok=True)
    file_path = hf_hub_download(
        repo_id=repo_id,
        filename=filename,
        local_dir=local_dir,
        local_dir_use_symlinks=False
    )
    print(f"Successfully downloaded {filename} to {file_path}\n")

if __name__ == "__main__":
    local_models_dir = "/home/tdeburca/git/rig-buy/models"
    
    # Download the main 31B model
    download_file(
        repo_id="bartowski/google_gemma-4-31B-it-GGUF",
        filename="google_gemma-4-31B-it-Q4_K_M.gguf",
        local_dir=local_models_dir
    )
    
    # Download the draft E2B model
    download_file(
        repo_id="bartowski/google_gemma-4-E2B-it-GGUF",
        filename="google_gemma-4-E2B-it-Q4_K_M.gguf",
        local_dir=local_models_dir
    )
