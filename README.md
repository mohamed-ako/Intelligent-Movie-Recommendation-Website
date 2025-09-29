# Intelligent Hybrid Movie Recommendation Website 

## Project Overview

This project is the final year work for my Bachelor's degree, which delivers an **Intelligent Hybrid Movie Recommendation System** in the form of a fully functional end-to-end website.

[cite\_start]The core challenge addressed is the overwhelming number of online movies, which makes it hard for users to find quality content[cite: 273]. [cite\_start]Our solution uses a hybrid machine learning approach to provide **personal, accurate, and real-time recommendations** based on individual taste, not just popularity[cite: 274].

### Key Features & Contributions

  * [cite\_start]**Hybrid Model:** Combines **Content-Based** filtering (using movie features) and **User Action** tracking (clicks/favorites) for superior accuracy[cite: 331, 335, 507].
  * [cite\_start]**Real-time Personalization:** Achieves extremely fast recommendation speeds, averaging **0.15 - 0.3 seconds** for personal results[cite: 295, 484, 509].
  * [cite\_start]**Cold-Start Solution:** Handles new users and new movies effectively, a weakness of traditional Collaborative Filtering[cite: 341, 347].
  * [cite\_start]**High Performance:** Achieved a **Precision@10 of 85%** on practical user testing, significantly outperforming Pure Content-Based (70%) and Popularity-Based (58%) systems[cite: 480, 483].
  * [cite\_start]**Functional Prototype:** Developed a complete, working website with user accounts and a smooth interface[cite: 296, 344, 506].

-----

## Technical Stack 🛠️

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **React.js** | [cite\_start]User interface, built with `react-router-dom` and **Redux Toolkit (RTK Query)**[cite: 497]. |
| **Backend** | **Flask** (Python) | [cite\_start]RESTful API server for handling user requests and serving recommendations[cite: 461, 503]. |
| **Database** | **MongoDB Atlas** | [cite\_start]Used to store user interaction data (clicks, favorites) and user accounts[cite: 315, 503]. |
| **Data Source** | **TMDb API** | [cite\_start]Movie metadata (title, overview, genres, popularity) gathered using Python scraping[cite: 314, 349, 350]. |
| **ML Libraries** | [cite\_start]**Scikit-learn** (for **CountVectorizer** and **Cosine Similarity**)[cite: 336, 446]. |

-----

## Core Recommendation Logic 

The system combines two primary components:

### 1\. Content-Based Core (Pre-calculated)

[cite\_start]This component uses text data to determine movie similarity[cite: 446].

1.  [cite\_start]**Preprocessing:** Movie `title`, `overview`, and `genres` are combined into a single text string and cleaned (e.g., lowercased, stop words removed)[cite: 433, 459].
2.  [cite\_start]**Vectorization:** **CountVectorizer** converts this text into numerical vectors based on word frequencies, filtering out common English words[cite: 435, 439, 451].
3.  [cite\_start]**Similarity Matrix:** **Cosine Similarity** is used to calculate the angle between every movie vector, resulting in a matrix that shows how related every movie is to every other movie[cite: 441, 443, 452]. [cite\_start]This matrix is calculated once and saved for fast lookups[cite: 460].

### 2\. Personalized Hybrid Aggregation (Real-time)

[cite\_start]This logic runs in real-time when a logged-in user requests recommendations[cite: 453, 457].

1.  [cite\_start]**Find User History:** Retrieve all movies the current user has **clicked** or **favorited** (from MongoDB)[cite: 315, 453].
2.  [cite\_start]**Calculate Score:** Use the pre-calculated **Similarity Matrix** to find the average similarity score of **all unseen movies** to the user's history[cite: 454, 455].
3.  [cite\_start]**Filter and Rank:** Sort the unseen movies by this average score and present the **Top 10 Personal Recommendations**[cite: 456, 457].

-----

## API Endpoints (Backend) 

The Flask backend exposes several key endpoints for the frontend application:

| Endpoint | Method | Function | Requires Auth |
| :--- | :--- | :--- | :--- |
| `/recommend` | `GET` | [cite\_start]Get general similar movies (non-personal)[cite: 466]. | No |
| `/recommend/personal`| `GET` | [cite\_start]Get Top 10 personal recommendations[cite: 466]. | Yes |
| `/search` | `GET` | [cite\_start]Find movies by name[cite: 467]. | No |
| `/user/clicked` | `PUT` | [cite\_start]Save a movie the user clicked[cite: 468]. | Yes |
| `/user/favorites` | `PUT/DELETE` | [cite\_start]Add or remove a movie from user's favorites[cite: 468]. | Yes |
| `/register`, `/login` | `POST` | [cite\_start]User account management[cite: 468]. | No |

-----

## Setup and Installation 

[cite\_start]You can set up and run this system using the contents of `requirements.txt` (for Python backend) and `package.json` (for React frontend)[cite: 473].

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
      * *Note: Ensure you have deleted the `.git` folder inside the `front-end` directory if it still exists from the previous submodule configuration\!*

-----

## Future Work 

Based on the project's limitations, future improvements could include:

  * [cite\_start]**Smarter Text Processing:** Integrating advanced NLP models like **BERT** or **Word Embeddings** to better understand the deep meaning of movie plots[cite: 510, 514].
  * [cite\_start]**Advanced Models:** Experimenting with **Matrix Factorization** or **Deep Learning** techniques to improve recommendation accuracy[cite: 513].
  * [cite\_start]**Scalability:** Utilizing tools like **Spark** or **ANN Search** to handle millions of movies in real-time[cite: 512, 515].
  * [cite\_start]**Enhanced Interface:** Adding features like user ratings, watchlists, and social sharing[cite: 516].
