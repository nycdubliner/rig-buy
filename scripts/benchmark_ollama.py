import requests
import time
import json
import statistics
import os

OLLAMA_URL = "http://localhost:11434/api/generate"
MODELS = ["qwen2.5-coder:32b", "gemma2:27b"]
NUM_RUNS = 3
OUTPUT_FILE = "benchmark_results.json"

def run_benchmark(model, prompt, stream=False):
    data = {
        "model": model,
        "prompt": prompt,
        "stream": stream,
        "options": {
            "temperature": 0
        }
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=data, timeout=300)
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
    except Exception as e:
        print(f"Exception during benchmark: {e}")
        return None

def print_stats(model, name, stats):
    print(f"\n--- {model} | {name} ---")
    print(f"Total Time: {stats['total_time']:.2f}s")
    print(f"Prefill: {stats['prefill_tokens']} tokens @ {stats['prefill_tps']:.2f} t/s")
    print(f"Decode: {stats['decode_tokens']} tokens @ {stats['decode_tps']:.2f} t/s")

if __name__ == "__main__":
    results = {}
    
    prompts = {
        "short": "Explain the difference between a mutex and a semaphore in 3 paragraphs.",
        "long": ("User: You are a helpful assistant.\n" * 100) + "Now, summarize the above instructions."
    }
    
    for model in MODELS:
        print(f"\nBenchmarking model: {model}")
        results[model] = {}
        for prompt_name, prompt in prompts.items():
            run_stats = []
            for i in range(NUM_RUNS):
                print(f"  Run {i+1}/{NUM_RUNS} for {prompt_name} prompt...")
                stats = run_benchmark(model, prompt)
                if stats:
                    run_stats.append(stats)
            
            if run_stats:
                # Average the results
                avg_stats = {
                    "total_time": statistics.mean([s['total_time'] for s in run_stats]),
                    "load_time": statistics.mean([s['load_time'] for s in run_stats]),
                    "prefill_tokens": run_stats[0]['prefill_tokens'],
                    "prefill_time": statistics.mean([s['prefill_time'] for s in run_stats]),
                    "prefill_tps": statistics.mean([s['prefill_tps'] for s in run_stats]),
                    "decode_tokens": run_stats[0]['decode_tokens'],
                    "decode_time": statistics.mean([s['decode_time'] for s in run_stats]),
                    "decode_tps": statistics.mean([s['decode_tps'] for s in run_stats])
                }
                results[model][prompt_name] = avg_stats
                print_stats(model, prompt_name, avg_stats)

    # Save results to file
    final_data = {
        "engine": "ollama",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "results": results
    }
    
    # Load existing results if any
    if os.path.exists(OUTPUT_FILE):
        try:
            with open(OUTPUT_FILE, "r") as f:
                all_results = json.load(f)
        except:
            all_results = []
    else:
        all_results = []
        
    all_results.append(final_data)
    
    with open(OUTPUT_FILE, "w") as f:
        json.dump(all_results, f, indent=4)
    
    print(f"\nResults saved to {OUTPUT_FILE}")
