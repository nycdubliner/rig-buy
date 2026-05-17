import matplotlib.pyplot as plt
import numpy as np
import json
import os

def generate_graphs():
    # Data from benchmarks
    # Note: Using approximate averages from the collected JSONs
    
    models = ['Qwen 2.5 Coder 32B', 'Gemma 2 27B']
    engines = ['Ollama', 'llama.cpp']
    
    # Prefill TPS (Prompt Evaluation)
    prefill_data = {
        'Ollama': [327, 493],
        'llama.cpp': [494, 425]
    }
    
    # Decode TPS (Token Generation)
    decode_data = {
        'Ollama': [10.4, 30.4],
        'llama.cpp': [16.3, 29.5]
    }
    
    x = np.arange(len(models))
    width = 0.35
    
    # 1. Prefill Graph
    fig, ax = plt.subplots(figsize=(10, 6))
    rects1 = ax.bar(x - width/2, prefill_data['Ollama'], width, label='Ollama', color='#2563eb')
    rects2 = ax.bar(x + width/2, prefill_data['llama.cpp'], width, label='llama.cpp', color='#10b981')
    
    ax.set_ylabel('Tokens Per Second (t/s)')
    ax.set_title('Prefill Performance (Higher is Better)')
    ax.set_xticks(x)
    ax.set_xticklabels(models)
    ax.legend()
    
    ax.bar_label(rects1, padding=3)
    ax.bar_label(rects2, padding=3)
    
    fig.tight_layout()
    plt.savefig('benchmark_prefill.png')
    print("Generated benchmark_prefill.png")
    
    # 2. Decode Graph
    fig, ax = plt.subplots(figsize=(10, 6))
    rects1 = ax.bar(x - width/2, decode_data['Ollama'], width, label='Ollama', color='#2563eb')
    rects2 = ax.bar(x + width/2, decode_data['llama.cpp'], width, label='llama.cpp', color='#10b981')
    
    ax.set_ylabel('Tokens Per Second (t/s)')
    ax.set_title('Decode Performance (Higher is Better)')
    ax.set_xticks(x)
    ax.set_xticklabels(models)
    ax.legend()
    
    ax.bar_label(rects1, padding=3)
    ax.bar_label(rects2, padding=3)
    
    fig.tight_layout()
    plt.savefig('benchmark_decode.png')
    print("Generated benchmark_decode.png")

if __name__ == "__main__":
    generate_graphs()
