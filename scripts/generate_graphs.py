import matplotlib.pyplot as plt
import numpy as np
import json
import os

def generate_graphs():
    models = ['Qwen 2.5 Coder 32B', 'Gemma 2 27B']
    
    # Prefill TPS (Prompt Evaluation)
    prefill_data = {
        'Ollama (HIP)': [327, 493],
        'llama.cpp (HIP)': [496, 651],
        'llama.cpp (Vulkan)': [433, 539]
    }
    
    # Decode TPS (Token Generation)
    decode_data = {
        'Ollama (HIP)': [10.4, 30.4],
        'llama.cpp (HIP)': [17.0, 28.9],
        'llama.cpp (Vulkan)': [24.0, 26.5]
    }
    
    x = np.arange(len(models))
    width = 0.25
    
    # 1. Prefill Graph
    fig, ax = plt.subplots(figsize=(12, 7))
    rects1 = ax.bar(x - width, prefill_data['Ollama (HIP)'], width, label='Ollama (HIP)', color='#2563eb')
    rects2 = ax.bar(x, prefill_data['llama.cpp (HIP)'], width, label='llama.cpp (HIP)', color='#10b981')
    rects3 = ax.bar(x + width, prefill_data['llama.cpp (Vulkan)'], width, label='llama.cpp (Vulkan)', color='#f59e0b')
    
    ax.set_ylabel('Tokens Per Second (t/s)')
    ax.set_title('Prefill Performance Comparison (Higher is Better)')
    ax.set_xticks(x)
    ax.set_xticklabels(models)
    ax.legend()
    
    ax.bar_label(rects1, padding=3)
    ax.bar_label(rects2, padding=3)
    ax.bar_label(rects3, padding=3)
    
    fig.tight_layout()
    plt.savefig('benchmark_prefill.png')
    
    # 2. Decode Graph
    fig, ax = plt.subplots(figsize=(12, 7))
    rects1 = ax.bar(x - width, decode_data['Ollama (HIP)'], width, label='Ollama (HIP)', color='#2563eb')
    rects2 = ax.bar(x, decode_data['llama.cpp (HIP)'], width, label='llama.cpp (HIP)', color='#10b981')
    rects3 = ax.bar(x + width, decode_data['llama.cpp (Vulkan)'], width, label='llama.cpp (Vulkan)', color='#f59e0b')
    
    ax.set_ylabel('Tokens Per Second (t/s)')
    ax.set_title('Decode Performance Comparison (Higher is Better)')
    ax.set_xticks(x)
    ax.set_xticklabels(models)
    ax.legend()
    
    ax.bar_label(rects1, padding=3)
    ax.bar_label(rects2, padding=3)
    ax.bar_label(rects3, padding=3)
    
    fig.tight_layout()
    plt.savefig('benchmark_decode.png')

if __name__ == "__main__":
    generate_graphs()
