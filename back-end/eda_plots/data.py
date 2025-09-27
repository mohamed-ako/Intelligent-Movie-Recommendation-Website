import pandas as pd
import json
import matplotlib.pyplot as plt
import seaborn as sns
import os

# --- Configuration ---
DATA_FILE = 'all_movies.json'
OUTPUT_DIR = 'eda_plots'

# Create output directory if it doesn't exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

# --- 1. Load Data ---
try:
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        movie_data = json.load(f)
    df = pd.DataFrame(movie_data)
    print(f"Loaded {len(df)} movies.")
except FileNotFoundError:
    print(f"Error: '{DATA_FILE}' not found. Run your Flask app to generate it first.")
    exit()

# --- 2. Popularity Distribution Histogram ---
plt.figure(figsize=(8, 5))
sns.histplot(df['popularity'], bins=50, kde=True, color='skyblue')
plt.title('Distribution of Movie Popularity')
plt.xlabel('Popularity Score')
plt.ylabel('Number of Movies')
plt.grid(axis='y', alpha=0.75)
plt.savefig(os.path.join(OUTPUT_DIR, 'popularity_distribution.png'))
plt.close()
print("Saved 'popularity_distribution.png'")

# --- 3. Top N Genre Distribution Bar Chart ---
if 'genres' in df.columns and df['genres'].apply(lambda x: isinstance(x, list)).any():
    all_genres = df['genres'].explode()
    genre_counts = all_genres.value_counts().head(10)
    
    plt.figure(figsize=(10, 6))
    sns.barplot(x=genre_counts.index, y=genre_counts.values, palette='viridis')
    plt.title('Top 10 Most Frequent Movie Genres')
    plt.xlabel('Genre')
    plt.ylabel('Number of Movies')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig(os.path.join(OUTPUT_DIR, 'top_genres_distribution.png'))
    plt.close()
    print("Saved 'top_genres_distribution.png'")
else:
    print("Skipping genre distribution: 'genres' column not in expected format.")

print("EDA plots generation complete.")