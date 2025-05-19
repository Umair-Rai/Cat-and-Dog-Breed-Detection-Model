import torch
import numpy as np
from PIL import Image
from transformers import ViTForImageClassification, ViTImageProcessor, Trainer, TrainingArguments
from datasets import load_dataset
from evaluate import load
from torchvision.datasets import ImageFolder
from torchvision import transforms
from utils import visualize_class_distribution, oversample_dataset  # Adjust import path if needed
from torch.utils.data import Subset
import json
import os

def load_data(data_dir, processor, is_train=False, target_count=300):
    transform = transforms.Resize((224, 224))

    raw_dataset = ImageFolder(data_dir, transform=transform)

    label_map_path = "saved_model/trainlabel_mapping.json"
    if os.path.exists(label_map_path):
        with open(label_map_path, "r") as f:
            class_to_idx = json.load(f)
        raw_dataset.class_to_idx = class_to_idx  # 🔁 overwrite default
    else:
        class_to_idx = raw_dataset.class_to_idx
        if is_train:
            with open(label_map_path, "w") as f:
                json.dump(class_to_idx, f)

    if is_train:
        print("📊 Visualizing class distribution (before oversampling)...")
        visualize_class_distribution(raw_dataset, title="Before Oversampling")
        print("📈 OverSampling...")
        class_names = raw_dataset.classes  # save before overwriting raw_dataset

        raw_dataset = oversample_dataset(raw_dataset, target_count=target_count)

        print("📈 Visualizing class distribution (after oversampling)...")
        visualize_class_distribution(raw_dataset, title="After Oversampling", class_names=class_names)

    def transform_examples(example):
        image, label = example

        if image.mode != "RGB":
            image = image.convert("RGB")

        inputs = processor(images=image, return_tensors="pt")

        return {
            'pixel_values': inputs['pixel_values'][0],
            'label': label
        }

    processed_dataset = [transform_examples(example) for example in raw_dataset]

    return processed_dataset

def compute_metrics(p):
    metric = load("accuracy")
    return metric.compute(predictions=np.argmax(p.predictions, axis=1), references=p.label_ids)
'''
def main():
    train_dir = "images_split/train"
    val_dir = "images_split/val"

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print("🔧 Device:", device)

    model_name = "google/vit-base-patch16-224-in21k"
    processor = ViTImageProcessor.from_pretrained(model_name)
    model = ViTForImageClassification.from_pretrained(model_name, num_labels=120).to(device)

    print("📦 Loading datasets...")
    train_dataset = load_data(train_dir, processor)
    val_dataset = load_data(val_dir, processor)

    training_args = TrainingArguments(
        output_dir="./vit_output",
        per_device_train_batch_size=16,
        per_device_eval_batch_size=16,
        num_train_epochs=3,
        evaluation_strategy="epoch",
        save_strategy="epoch",
        logging_dir="./logs",
        load_best_model_at_end=True,
        fp16=torch.cuda.is_available(),
        report_to="none"
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset["train"],
        eval_dataset=val_dataset["train"],  # val_dataset is under "train" split by default
        compute_metrics=compute_metrics,
        tokenizer=processor  # optional, helps Trainer preprocess input
    )

    trainer.train()
    trainer.save_model("saved_model/vit_transformer")
    print("✅ ViT model saved!")
'''
def main():
    train_dir = "images_split/train"
    val_dir = "images_split/val"

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print("🔧 Device:", device)

    model_name = "google/vit-base-patch16-224-in21k"
    processor = ViTImageProcessor.from_pretrained(model_name)
    with open("saved_model/trainlabel_mapping.json") as f:
        label_map = json.load(f)

    num_classes = len(label_map)

    model = ViTForImageClassification.from_pretrained(model_name, num_labels=num_classes)


    print("📦 Loading datasets...")
    train_dataset = load_data(train_dir, processor, is_train=True, target_count=300)
    val_dataset = load_data(val_dir, processor, is_train=False)

    training_args = TrainingArguments(
        output_dir="./vit_output",
        per_device_train_batch_size=16,
        per_device_eval_batch_size=16,
        num_train_epochs=3,
        logging_dir="./logs",
        report_to="none"
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        compute_metrics=compute_metrics,
        tokenizer=processor
    )

    trainer.train()
    trainer.save_model("saved_model/vit_transformer")
    print("✅ ViT model saved!")

if __name__ == "__main__":
    main()
