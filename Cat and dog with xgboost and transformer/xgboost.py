import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import VGG16
from tensorflow.keras.applications.vgg16 import preprocess_input
from sklearn.metrics import classification_report
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE
import joblib

# ✅ Allow GPU usage (remove force-CPU line if present)
# os.environ["CUDA_VISIBLE_DEVICES"] = "-1"  # ❌ Don't use this

# 📂 Dataset loader
def load_dataset(directory, img_size=(224, 224), batch_size=64):
    return tf.keras.preprocessing.image_dataset_from_directory(
        directory,
        image_size=img_size,
        batch_size=batch_size,
        label_mode='int',
        shuffle=True
    )

# 🧠 Feature extractor using VGG16
def extract_features_vgg(dataset, model):
    features, labels = [], []
    for batch_images, batch_labels in dataset:
        batch_images = preprocess_input(batch_images.numpy())
        batch_features = model.predict(batch_images, verbose=0)
        batch_features = batch_features.reshape(batch_features.shape[0], -1)
        features.append(batch_features)
        labels.append(batch_labels.numpy())

    return np.vstack(features), np.hstack(labels)

# ⚖️ Apply SMOTE
def apply_smote(X, y):
    sm = SMOTE(random_state=42)
    return sm.fit_resample(X, y)

# 🏁 Train XGBoost with GPU
def train_xgboost(X_train, y_train, X_test, y_test, le):
    print("🚀 Training XGBoost classifier with GPU...")
    model = XGBClassifier(
        use_label_encoder=False,
        eval_metric='mlogloss',
        verbosity=0,
        n_jobs=-1,
        tree_method='gpu_hist'  # ✅ Enable GPU training
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    print("📊 Classification Report:")
    print(classification_report(y_test, preds, target_names=le.classes_))

    os.makedirs("saved_model", exist_ok=True)
    joblib.dump(model, "saved_model/xgboost_vgg_model.joblib")
    joblib.dump(le, "saved_model/label_encoder.joblib")
    print("✅ Model and LabelEncoder saved to 'saved_model/'")

# 🔁 Main
if __name__ == "__main__":

    train_dir = "images_split/train"
    val_dir = "images_split/val"

    print("📂 Loading datasets...")
    train_ds = load_dataset(train_dir)
    val_ds = load_dataset(val_dir)

    print("📸 Initializing VGG16 model (GPU-enabled TensorFlow)...")
    base_model = VGG16(weights="imagenet", include_top=False, input_shape=(224, 224, 3))
    feature_model = tf.keras.models.Model(inputs=base_model.input, outputs=base_model.output)

    print("🔍 Extracting features (VGG16)...")
    X_train, y_train = extract_features_vgg(train_ds, feature_model)
    X_val, y_val = extract_features_vgg(val_ds, feature_model)

    print("⚖️ Applying SMOTE...")
    X_train_res, y_train_res = apply_smote(X_train, y_train)

    print("🧠 Encoding labels and training...")
    le = LabelEncoder()
    y_train_res_encoded = le.fit_transform(y_train_res)
    y_val_encoded = le.transform(y_val)

    train_xgboost(X_train_res, y_train_res_encoded, X_val, y_val_encoded, le)
