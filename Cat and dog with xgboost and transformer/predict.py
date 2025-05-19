import joblib
import numpy as np
import cv2
import os

IMG_SIZE = (64, 64)

def preprocess_image(img_path):
    img = cv2.imread(img_path)
    if img is None:
        raise ValueError(f"Image not found at {img_path}")
    img = cv2.resize(img, IMG_SIZE)
    img = img / 255.0  # Normalize if needed
    img = np.expand_dims(img, axis=0)  # Shape: (1, 64, 64, 3)
    return img

def predict_breed(img_path):
    # Load model and label encoder
    model = joblib.load("saved_model/random_forest_model2.joblib")
    le = joblib.load("saved_model/label_encoder2.joblib")

    img = preprocess_image(img_path)
    img_flat = img.reshape((1, -1))  # Flatten for RandomForest

    pred = model.predict(img_flat)
    breed = le.inverse_transform(pred)[0]
    print(f"🐶 Predicted Breed: {breed}")

if __name__ == "__main__":
    test_image_path = "c.jpg"  # Replace with your test image
    predict_breed(test_image_path)
