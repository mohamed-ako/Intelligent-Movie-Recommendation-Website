# Intelligent Hybrid Movie Recommendation Website 

## Project Overview

This Bachelor's final year project delivers a fully functional **Intelligent Hybrid Movie Recommendation System**. It addresses the challenge of content overload, offering **personal, accurate, and real-time recommendations** based on individual taste rather than simple popularity.

### Key Features & Contributions

  * **Hybrid Model:** Combines **Content-Based** filtering (using movie features) and **User Action** tracking (clicks/favorites) for superior recommendation accuracy.
  * **Real-time Personalization:** The system is highly responsive, achieving extremely fast recommendation speeds, averaging **0.15 - 0.3 seconds** for personalized results.
  * **Cold-Start Solution:** Handles new users and new movies effectively, overcoming a major weakness of traditional Collaborative Filtering methods.
  * **High Performance:** Achieved a superior **Precision@10 of 85%** on practical user testing, significantly outperforming Pure Content-Based (70%) and Popularity-Based (58%) systems.
  * **Functional Prototype:** A complete, working website with a clean interface and end-to-end functionality, including user account management.

### Video Overview

[![Click to Watch!](https://youtu.be/EZ7PLJ-qDoo)]

-----


## Technical Stack 

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **React.js** | User interface built with `react-router-dom` and **Redux Toolkit (RTK Query)**. |
| **Backend** | **Flask** (Python) | RESTful API server responsible for processing ML requests and serving recommendations. |
| **Database** | **MongoDB Atlas** | Stores user interaction data (clicks, favorites) and manages user account persistence. |
| **Data Source** | **TMDb API** | Movie metadata (title, overview, genres, popularity) gathered using custom Python scraping. |
| **ML Libraries** | **Scikit-learn** | Utilized for the implementation of **CountVectorizer** and **Cosine Similarity**. |

-----

## Core Recommendation Logic 

The system operates via two integrated components: a pre-calculated content core and a real-time personalization engine.

### 1\. Content-Based Core (Pre-calculated)

This core establishes a baseline for movie similarity using text features.

1.  **Preprocessing:** Movie `title`, `overview`, and `genres` are combined into a single feature text string and then cleaned (e.g., lowercased, stop words removed).
2.  **Vectorization:** **CountVectorizer** converts this text into numerical sparse vectors based on word frequencies, filtering out common English words.
3.  **Similarity Matrix:** **Cosine Similarity** calculates the angular relationship between every movie vector, yielding a matrix that defines movie-to-movie relatedness. This computationally intensive matrix is calculated once and saved for fast lookups.

### 2\. Personalized Hybrid Aggregation (Real-time)

This logic executes instantaneously when a user requests recommendations.

1.  **Find User History:** Retrieves all movies the current user has **clicked** or **favorited** from the MongoDB database.
2.  **Calculate Score:** Uses the pre-calculated **Similarity Matrix** to determine the average similarity score of **all unseen movies** to the user's previously liked items.
3.  **Filter and Rank:** Sorts the movies by this aggregated score, filters out seen movies, and presents the **Top 10 Personal Recommendations**.

-----

## API Endpoints (Backend) 

The Flask API provides the necessary functionality for the frontend application:

| Endpoint | Method | Function | Requires Auth |
| :--- | :--- | :--- | :--- |
| `/recommend` | `GET` | Retrieves general similar movies (non-personalized). | No |
| `/recommend/personal`| `GET` | Generates the Top 10 personalized movie recommendations. | Yes |
| `/search` | `GET` | Executes movie searches by name. | No |
| `/user/clicked` | `PUT` | Saves a movie click event for user profiling. | Yes |
| `/user/favorites` | `PUT/DELETE` | Adds or removes a movie from the user's favorites list. | Yes |
| `/register`, `/login` | `POST` | Handles user account creation and authentication. | No |

-----

## Setup and Installation 

The system is designed to be fully reproducible, with dependencies tracked in `requirements.txt` (Python) and `package.json` (React).

1.  **Clone the Repository**
2.  **Backend Setup** (in the `back-end` folder):
    ```bash
    pip install -r requirements.txt
    # Configure your MongoDB Atlas connection string and TMDb API key
    python app.py # Or your main server file
    ```
3.  **Frontend Setup** (in the `front-end` folder):
    ```bash
    npm install
    npm start
    ```
      * ***Note:*** If `front-end` was previously tracked as a Git Submodule, ensure the internal `.git` folder has been removed to allow standard tracking of the content.

-----

## Future Work & Improvements 

Based on the project's limitations, key areas for future development include:

  * **Smarter Text Processing:** Integrating advanced NLP models like **BERT** or **Word Embeddings** to move beyond simple word counts and better understand the deep, semantic meaning of movie plots.
  * **Advanced Models:** Experimenting with **Matrix Factorization** or **Deep Learning** techniques to further enhance recommendation accuracy and capture latent user-item relationships.
  * **Scalability:** Utilizing Big Data tools such as **Spark** or **Approximate Nearest Neighbor (ANN) Search** to efficiently handle datasets with millions of movies in real-time.
  * **Enhanced Interface:** Adding features like user ratings, watchlists, and social interaction capabilities to improve the overall user experience.
