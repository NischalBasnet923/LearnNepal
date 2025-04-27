from flask import Flask, request, jsonify
import pandas as pd
import pickle
from surprise import Reader, Dataset, SVD

app = Flask(__name__)

# Recommend function
def recommend_courses_for_user(user_id, top_n=10):
    # Load latest data
    ratings_df = pd.read_csv("ratings.csv")
    prefs_df = pd.read_csv("prefs.csv")
    courses_df = pd.read_csv("courses.csv")

    # Train model
    reader = Reader(rating_scale=(1, 5))
    data = Dataset.load_from_df(ratings_df[['user_id', 'course_id', 'rating']], reader)
    trainset = data.build_full_trainset()
    model = SVD()
    model.fit(trainset)

    user_categories = prefs_df[prefs_df['user_id'] == user_id]['category_id'].tolist()

    if not user_categories:
        print(f"⚠️ No category preferences found for user {user_id}")
        return []

    rated_courses = ratings_df[ratings_df['user_id'] == user_id]['course_id'].tolist()

    print("User categories:", user_categories)
    print("Rated courses:", rated_courses)

    candidate_courses = courses_df[
        (courses_df['category_id'].isin(user_categories)) &
        (~courses_df['course_id'].isin(rated_courses))
    ]

    if candidate_courses.empty:
        print("⚠️ No candidate courses for user:", user_id)
        print("Available courses in categories:")
        print(courses_df[courses_df['category_id'].isin(user_categories)][['course_id', 'category_id']])
        return []

    candidate_courses['predicted_rating'] = candidate_courses['course_id'].apply(
        lambda cid: model.predict(user_id, cid).est
    )

    top_courses = candidate_courses.sort_values(by='predicted_rating', ascending=False).head(top_n)
    return top_courses[['course_id', 'predicted_rating']].to_dict(orient="records")

# API route
@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "Missing user_id in request"}), 400

    result = recommend_courses_for_user(user_id)
    if isinstance(result, tuple):  # error message and status
        return jsonify({"message": result[0]['message']}), result[1]

    return jsonify({"recommended": result}), 200

if __name__ == "__main__":
    app.run(port=5001, debug=True)
