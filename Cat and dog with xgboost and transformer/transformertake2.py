import torch
import numpy as np
from PIL import Image
from transformers import ViTForImageClassification, ViTImageProcessor, Trainer, TrainingArguments
from datasets import load_dataset
from evaluate import load
from torchvision.datasets import ImageFolder
from torchvision import transforms
from torch.utils.data import Dataset
from utils import visualize_class_distribution, oversample_dataset
import json
import os

# ✅ Data Loader
def load_data(data_dir, processor, is_train=False, target_count=300):
    transform = transforms.Resize((224, 224))
    raw_dataset = ImageFolder(data_dir, transform=transform)

    label_map_path = "saved_model/trainlabel_mapping.json"
    if os.path.exists(label_map_path):
        with open(label_map_path, "r") as f:
            class_to_idx = json.load(f)
        raw_dataset.class_to_idx = class_to_idx
    else:
        class_to_idx = raw_dataset.class_to_idx
        if is_train:
            os.makedirs("saved_model/", exist_ok=True)
            with open(label_map_path, "w") as f:
                json.dump(class_to_idx, f)

    if is_train:
        print("📊 Class distribution before oversampling...")
        # visualize_class_distribution(raw_dataset, "Before Oversampling")
        raw_dataset = oversample_dataset(raw_dataset, target_count=target_count)
        print("📈 Class distribution after oversampling...")
        visualize_class_distribution(raw_dataset, "After Oversampling", class_names=ImageFolder(data_dir).classes)

    def transform_example(example):
        image, label = example
        if not isinstance(image, Image.Image):
            image = transforms.ToPILImage()(image)
        if image.mode != "RGB":
            image = image.convert("RGB")
        inputs = processor(images=image, return_tensors="pt")
        return {"pixel_values": inputs["pixel_values"][0], "label": label}

    processed_dataset = [transform_example(ex) for ex in raw_dataset]
    return processed_dataset

# ✅ Wrap into torch Dataset
class CustomDataset(Dataset):
    def __init__(self, data):
        self.data = data

    def __getitem__(self, idx):
        return self.data[idx]

    def __len__(self):
        return len(self.data)

# ✅ Metrics
def compute_metrics(p):
    metric = load("accuracy")
    return metric.compute(predictions=np.argmax(p.predictions, axis=1), references=p.label_ids)

# ✅ Main function
def main():
    train_dir = "images_split/train"
    val_dir = "images_split/val"
    save_dir = "saved_model/"
    target_count = 300  # 🔁 Updated to oversample each class to 300 images

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print("🔧 Using device:", device)

    model_name = "google/vit-base-patch16-224-in21k"
    processor = ViTImageProcessor.from_pretrained(model_name)

    label_map_path = os.path.join(save_dir, "trainlabel_mapping.json")
    with open(label_map_path) as f:
        label_map = json.load(f)
    num_classes = len(label_map)

    model = ViTForImageClassification.from_pretrained(model_name, num_labels=num_classes).to(device)

    print("📦 Loading datasets...")
    train_dataset = CustomDataset(load_data(train_dir, processor, is_train=True, target_count=target_count))
    val_dataset = CustomDataset(load_data(val_dir, processor))

    training_args = TrainingArguments(
        output_dir=os.path.join(save_dir, "vit_output"),
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
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
    model_path = os.path.join(save_dir, "vit_transformer")
    trainer.save_model(model_path)
    print(f"✅ ViT model saved at {model_path}!")

if __name__ == "__main__":
    main()
