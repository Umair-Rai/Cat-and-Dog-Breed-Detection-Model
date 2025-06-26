# 🐾 Petify AI - Cat & Dog Breed Recognition using Deep Learning

Welcome to the **Petify AI** project — an intelligent pet breed detection system that utilizes computer vision to identify cat and dog breeds using deep learning. This repository contains the full implementation, training pipeline, and model evaluation for detecting pet breeds using a combination of the **Stanford Dogs Dataset** and **Oxford-IIIT Pet Dataset**.

---

## 📌 Project Overview

**Petify AI** is part of a broader platform designed to simplify pet care by integrating intelligent services. This module focuses on breed identification for cats and dogs using a convolutional neural network (CNN)-based model trained on high-quality datasets. The goal is to assist pet owners, breeders, and vets in instantly recognizing pet breeds with high accuracy.

---

## 📊 Key Highlights

- 🐶 **Cat and Dog breed detection**
- 📦 **Datasets Used**: 
  - [Stanford Dogs Dataset](http://vision.stanford.edu/aditya86/ImageNetDogs/)
  - [Oxford-IIIT Pet Dataset](https://www.robots.ox.ac.uk/~vgg/data/pets/)
- 🧠 **Model Accuracy**: Achieved **87.5%** accuracy on the validation set
- 💻 **Framework**: TensorFlow/Keras
- 🎯 **Model Type**: Transfer Learning using **EfficientNetB0**

---

## 🧠 Model Architecture

We leveraged **transfer learning** by fine-tuning the EfficientNetB0 model, known for its efficiency and high performance on image classification tasks. The architecture includes:

- Input layer for image resizing
- Data augmentation layers (rotation, flip, zoom)
- EfficientNetB0 base (pre-trained on ImageNet)
- Global average pooling
- Dense layers with Dropout
- Final softmax classification layer

---

## 📂 Folder Structure

```bash
├── data/                      # Image data (train/test split)
├── notebooks/                 # Jupyter Notebooks for EDA, training, evaluation
├── models/                    # Saved model weights
├── utils/                     # Helper scripts
├── petify_ai_train.py         # Main training script
├── requirements.txt
├── README.md
└── results/                   # Accuracy/loss plots, confusion matrix
