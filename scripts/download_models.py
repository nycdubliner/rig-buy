import os
import sys
from huggingface_hub import hf_hub_download

def main():
    repo_id = "havenoammo/Qwen3.6-35B-A3B-MTP-GGUF"
    filename = "Qwen3.6-35B-A3B-MTP-UD-Q4_K_XL.gguf"
    local_dir = "/home/tdeburca/git/rig-buy/models"

    print(f"=== Starting Download ===")
    print(f"Repository: {repo_id}")
    print(f"Filename:   {filename}")
    print(f"Target Dir: {local_dir}")

    try:
        path = hf_hub_download(
            repo_id=repo_id,
            filename=filename,
            local_dir=local_dir,
            local_dir_use_symlinks=False
        )
        print(f"=== Download Complete ===")
        print(f"Model saved to: {path}")
    except Exception as e:
        print(f"Error downloading model: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
