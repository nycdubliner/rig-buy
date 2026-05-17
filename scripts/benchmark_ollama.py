import requests
import time
import json
import statistics

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "qwen2.5-coder:32b"

def run_benchmark(prompt, stream=False):
    data = {
        "model": MODEL,
        "prompt": prompt,
        "stream": stream,
        "options": {
            "temperature": 0
        }
    }
    
    start_time = time.time()
    response = requests.post(OLLAMA_URL, json=data)
    end_time = time.time()
    
    if response.status_code != 200:
        print(f"Error: {response.status_code}")
        return None
    
    result = response.json()
    
    # Ollama returns durations in nanoseconds
    total_duration = result.get("total_duration", 0) / 1e9
    load_duration = result.get("load_duration", 0) / 1e9
    prompt_eval_count = result.get("prompt_eval_count", 0)
    prompt_eval_duration = result.get("prompt_eval_duration", 0) / 1e9
    eval_count = result.get("eval_count", 0)
    eval_duration = result.get("eval_duration", 0) / 1e9
    
    prefill_tps = prompt_eval_count / prompt_eval_duration if prompt_eval_duration > 0 else 0
    decode_tps = eval_count / eval_duration if eval_duration > 0 else 0
    
    return {
        "total_time": total_duration,
        "load_time": load_duration,
        "prefill_tokens": prompt_eval_count,
        "prefill_time": prompt_eval_duration,
        "prefill_tps": prefill_tps,
        "decode_tokens": eval_count,
        "decode_time": eval_duration,
        "decode_tps": decode_tps
    }

def print_stats(name, stats):
    print(f"\n--- {name} ---")
    print(f"Total Time: {stats['total_time']:.2f}s")
    print(f"Prefill: {stats['prefill_tokens']} tokens @ {stats['prefill_tps']:.2f} t/s")
    print(f"Decode: {stats['decode_tokens']} tokens @ {stats['decode_tps']:.2f} t/s")

if __name__ == "__main__":
    print(f"Starting benchmark for {MODEL}...")
    
    # 1. Short Prompt (Logic)
    short_prompt = "Explain the difference between a mutex and a semaphore in 3 paragraphs."
    stats_short = run_benchmark(short_prompt)
    if stats_short:
        print_stats("Short Prompt (Small Context)", stats_short)
    
    # 2. Long Prompt (Context Heavy)
    # Creating a dummy long context
    long_context = "User: You are a helpful assistant.\n" * 100
    long_prompt = long_context + "Now, summarize the above instructions."
    stats_long = run_benchmark(long_prompt)
    if stats_long:
        print_stats("Long Prompt (Large Context)", stats_long)
