from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import json
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os
import pickle

from pymongo import MongoClient
import datetime

from bson.objectid import ObjectId
import bcrypt
# Initialize Flask app


import jwt
from functools import wraps
SECRET_KEY = "MAKO1207"

app = Flask(__name__)
# CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}})  # Less strict


# Global variables
global_similarity_matrix = None
title_to_index = {}
movie_data = []
users = {}
# API configuration
api_key = 'd65821928415d293f804ec773c41cce5'


# MONGO_URI = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority"
MONGO_URI = "mongodb+srv://mohamedako:mohend1221@cluster0.jixjkxt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)

try:
    client.admin.command('ping')
    print("✅ Connected to MongoDB successfully!")
except Exception as e:
    print("❌ Connection failed:", e)
    
db = client['movie_db']
user_behavior_col = db['user_behavior']
users_col = db['users']
movies_col = db['movies']

def hash_password(password):

    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
def scraping():
    """Scrapes movie data from TMDb API"""
    print("Scraping process is starting...", flush=True)
    page = 1
    while True:
        url = f"https://api.themoviedb.org/3/movie/popular?api_key={api_key}&language=en-US&page={page}"
        response = requests.get(url)
        if response.status_code != 200:
            break
        movie_data.extend(response.json()["results"])
        page += 1
    
    print(f"Collected {len(movie_data)} movies!", flush=True)
    addingGenres()

def addingGenres():
    """Adds genre names to movie data"""
    global movie_data
    
    # Fetch genre list
    url_g = f"https://api.themoviedb.org/3/genre/movie/list?api_key={api_key}&language=en-US"
    response = requests.get(url_g)
    genres_list = response.json().get("genres", [])
    
    # Create genre mapping
    genre_dict = {genre["id"]: genre["name"] for genre in genres_list}
    
    # Replace genre IDs with names
    for movie in movie_data:
        if "genre_ids" in movie and movie["genre_ids"]:
            movie["genres"] = [genre_dict.get(gid, "Unknown") for gid in movie["genre_ids"]]
        else:
            movie["genres"] = ["Unknown"]
        movie.pop("genre_ids", None)
    
    cleaning()

def cleaning():
    """Cleans and prepares data for recommendations"""
    global movie_data, global_similarity_matrix, title_to_index
    
    # Step 1: Convert list of movie dictionaries to DataFrame (like a table)
    df = pd.DataFrame(movie_data)
    
    # Step 2: Remove movies missing important info
    df.dropna(subset=['popularity', 'vote_average', 'genres'], inplace=True)
    df = df[df['genres'].apply(lambda x: isinstance(x, list) and len(x) > 0)]
    
    # Step 3: Remove duplicate movies
    df['genres_str'] = df['genres'].apply(lambda x: ','.join(x))
    df.drop_duplicates(subset=['genres_str', 'popularity', 'vote_average'], inplace=True)
    df.drop(columns=['genres_str'], inplace=True)
    
    # Step 4: Clean and combine text info (title, overview, genres)
    df['title'] = df['title'].str.strip().str.lower()
    df['overview'] = df['overview'].fillna('').str.strip().str.lower()
    df['genres_str'] = df['genres'].apply(lambda x: ' '.join([g.strip().lower() for g in x]) if isinstance(x, list) else '')
    df['content'] = df['title'] + ' ' + df['overview'] + ' ' + df['genres_str']
    
    # Step 5: Turn text into numbers using CountVectorizer
    count = CountVectorizer(stop_words='english')
    count_matrix = count.fit_transform(df['content'])
    
    # Step 6: Calculate similarity between all movies
    cosine_sim = cosine_similarity(count_matrix)
    
    # Step 7: Save data to files so we can load it later
    pickle.dump(df[['title', 'id']], open('movies_list.pkl', 'wb'))
    pickle.dump(cosine_sim, open('similarity.pkl', 'wb'))
    
    # Step 8: Update global variables for later use
    global_similarity_matrix = cosine_sim
    title_to_index = pd.Series(df.index, index=df['title']).to_dict()
    
    # Step 9: Save the cleaned movie data to a JSON file
    movie_data = df.to_dict(orient="records")
    with open("all_movies.json", "w", encoding="utf-8") as file:
        json.dump(movie_data, file, ensure_ascii=False)

    movies_col.delete_many({})  # Clear existing movies (optional)
    movies_col.insert_many(movie_data)
    
    print(f"Saved {len(movie_data)} movies!")


def load_models():
    """Loads precomputed models from disk"""
    global global_similarity_matrix, title_to_index
    
    if os.path.exists('similarity.pkl'):
        global_similarity_matrix = pickle.load(open('similarity.pkl', 'rb'))
    
    if os.path.exists('movies_list.pkl'):
        movies_df = pickle.load(open('movies_list.pkl', 'rb'))
        title_to_index = pd.Series(movies_df.index, index=movies_df['title']).to_dict()

@app.route('/recommend')
def recommend():
    """Returns similar movies based on title"""
    global global_similarity_matrix, title_to_index, movie_data
    
    if global_similarity_matrix is None:
        return jsonify({"error": "Recommendation system not initialized."}), 500

    movie_title = request.args.get('title', '').strip().lower()
    if not movie_title:
        return jsonify({"error": "No movie title provided."}), 400
    
    # Find closest match
    matched_titles = [title for title in title_to_index if movie_title in title]
    
    if not matched_titles:
        return jsonify({"error": "Movie not found in database."}), 404

    best_match = matched_titles[0]
    idx = title_to_index[best_match]

    sim_scores = list(enumerate(global_similarity_matrix[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:6]

    movie_indices = [i[0] for i in sim_scores]
    
    try:
        recommended_movies = [movie_data[i] for i in movie_indices]
        if not matched_titles:
            recommended_movies =[]

    except IndexError:
        return jsonify({"error": "Recommendation generation failed."}), 500

    return jsonify(recommended_movies), 200

@app.route('/all_movies', methods=['GET'])
def get_movies():
    """Returns all movies from the database"""
    try:
        if not os.path.exists('all_movies.json') or os.stat('all_movies.json').st_size == 0:
            print("JSON file not found, scraping needed!", flush=True)
            scraping()
        else:
            print("JSON file is found, no need to scrap again!", flush=True)
            with open("all_movies.json", "r", encoding="utf-8") as file:
                movies = json.load(file)
        return jsonify(movies), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/search')
def search():
    """Searches movies by title"""
    try:
        if not os.path.exists('all_movies.json'):
            scraping()
        
        with open("all_movies.json", "r", encoding="utf-8") as file:
            movies = json.load(file)
        
        search_term = request.args.get('search', '').strip().lower()
        if search_term:
            searched_movies = [m for m in movies if search_term in m.get('title', '').lower()]
        else:
            searched_movies = []
            
        return jsonify(searched_movies), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500





@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    # Check if user exists in MongoDB
    if users_col.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    hashed_password = hash_password(password)
    user_doc = {
        "email": email,
        "password": hashed_password,
        "name": name
    }
    users_col.insert_one(user_doc)
    return jsonify({"message": "User registered"}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = users_col.find_one({"email": email})
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password']):
        return jsonify({"error": "Invalid credentials"}), 401

    token = jwt.encode({"user_id": str(user["_id"])}, SECRET_KEY, algorithm="HS256")
    return jsonify({"message": "Login successful!", "token": token}), 200



def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Token is missing!"}), 401
        try:
            if token.startswith("Bearer "):
                token = token.split(" ")[1]
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = users_col.find_one({"_id": ObjectId(data["user_id"])})
        except Exception as e:
            print("JWT Decode Error:", e)
            return jsonify({"error": "Token is invalid!"}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@app.route("/user/clicked", methods=["PUT"])
@token_required
def add_clicked_movie(current_user):
    data = request.get_json()
    movie_id = data.get("movieId")
    users_col.update_one(
        {"_id": current_user["_id"]},
        {"$addToSet": {"clicked": movie_id}}  # Avoid duplicates
    )
    return jsonify({"message": "Movie added to clicked list!"}), 200

@app.route("/user/favorites", methods=["PUT"])
@token_required
def add_favorite(current_user):
    data = request.get_json()
    movie_id = data.get("movieId")
    users_col.update_one(
        {"_id": current_user["_id"]},
        {"$addToSet": {"favorites": movie_id}}
    )
    return jsonify({"message": "Movie added to favorites!"}), 200

@app.route("/user/favorites", methods=["DELETE"])
@token_required
def remove_favorite(current_user):
    data = request.get_json()
    movie_id = data.get("movieId")
    users_col.update_one(
        {"_id": current_user["_id"]},
        {"$pull": {"favorites": movie_id}}
    )
    return jsonify({"message": "Movie removed from favorites!"}), 200

@app.route("/recommend/personal", methods=["GET"])
@token_required
def recommend_personal(current_user):
    global global_similarity_matrix, movie_data
    
    # Get user's interacted movie IDs
    clicked_ids = current_user.get("clicked", [])
    favorites_ids = current_user.get("favorites", [])
    interacted_ids = list(set(clicked_ids + favorites_ids))

    if not interacted_ids:
        return jsonify({"message": "No user behavior data found."}), 200

    # Load movie index mapping
    id_to_index = {movie["id"]: i for i, movie in enumerate(movie_data)}
    valid_indices = [id_to_index[movie_id] for movie_id in interacted_ids if movie_id in id_to_index]

    if not valid_indices:
        return jsonify({"message": "No matching movies found in dataset."}), 200

    # Average similarity scores
    scores = sum(global_similarity_matrix[i] for i in valid_indices) / len(valid_indices)
    similar_indices = sorted(enumerate(scores), key=lambda x: x[1], reverse=True)

    # Filter out already interacted movies
    recommended = []
    for idx, _ in similar_indices:
        movie_id = movie_data[idx]['id']
        if movie_id not in interacted_ids:
            recommended.append(movie_data[idx])
        if len(recommended) >= 10:
            break

    return jsonify(recommended), 200


@app.route("/auth/profile", methods=["GET"])
@token_required
def get_profile(current_user):
    user_data = {
        "id": str(current_user["_id"]),
        "email": current_user["email"],
        "name": current_user.get("name", ""),
        "favorites": current_user.get("favorites", []),
        "clicked": current_user.get("clicked", []),
    }
    return jsonify(user_data), 200


# @app.route('/scrape', methods=['POST'])
# def trigger_scraping():
#     scraping()
#     return jsonify({"message": "Scraping completed!"}), 200


# Initialize the app
if __name__ == '__main__':
    print("The Back-End is Starting... ")
    
    # Load models or create new ones
    if os.path.exists("all_movies.json"):
        with open("all_movies.json", "r", encoding="utf-8") as file:
            movie_data = json.load(file)
        load_models()
        
        if global_similarity_matrix is None:
            cleaning()
            load_models()
    else:
        scraping()
        load_models()
    
    # Start the app
    app.run(debug=True)