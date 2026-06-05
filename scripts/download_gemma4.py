import os
from huggingface_hub import snapshot_download

def download_model(repo_id, local_dir):
    print(f"Starting download for {repo_id}...")
    os.makedirs(local_dir, exist_ok=True)
    # Using snapshot_download to download all model weights, tokenizer, config files
    snapshot_download(
        repo_id=repo_id,
        local_dir=local_dir,
        local_dir_use_symlinks=False,
        max_workers=4
    )
    print(f"Successfully downloaded {repo_id} to {local_dir}\n")

if __name__ == "__main__":
    # Define models and their paths
    models = {
        "google/gemma-4-31B-it": "/home/tdeburca/git/rig-buy/models/gemma-4-31B-it",
        "google/gemma-4-E2B-it": "/home/tdeburca/git/rig-buy/models/gemma-4-E2B-it"
    }
    
    for repo_id, path in models.items():
        download_model(repo_id, path)
