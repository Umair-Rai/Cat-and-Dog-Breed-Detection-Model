'''
import torch
print(torch.cuda.is_available())  # Should return True
print(torch.cuda.get_device_name())  # Should print: NVIDIA GeForce RTX 3060 Ti''
'''
import matplotlib.pyplot as plt
from collections import Counter
from torchvision import transforms
import random

# ✅ utils.py


def oversample_dataset(dataset, target_count=300):
    label_to_indices = {}
    for idx, (_, label) in enumerate(dataset):
        label_to_indices.setdefault(label, []).append(idx)

    class_to_idx = dataset.class_to_idx  # preserve

    new_samples = []
    augmentation = transforms.Compose([
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(20),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1),
        transforms.RandomResizedCrop(size=(224, 224), scale=(0.8, 1.0)),
    ])

    for label, indices in label_to_indices.items():
        samples = [dataset[i] for i in indices]
        if len(samples) >= target_count:
            new_samples.extend(samples[:target_count])
        else:
            for _ in range(target_count - len(samples)):
                img, lbl = random.choice(samples)
                img = augmentation(img)
                img = transforms.ToTensor()(img)
                new_samples.append((img, lbl))
            new_samples.extend(samples)

    # Convert to custom dataset with class_to_idx
    oversampled_dataset = new_samples
    oversampled_dataset.class_to_idx = class_to_idx  # manually attach

    return oversampled_dataset
'''
def oversample_dataset(dataset, target_count=300):
    label_to_indices = {}
    for idx, (_, label) in enumerate(dataset):
        label_to_indices.setdefault(label, []).append(idx)

    new_samples = []

    augmentation = transforms.Compose([
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(20),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1),
        transforms.RandomResizedCrop(size=(224, 224), scale=(0.8, 1.0)),
    ])

    for label, indices in label_to_indices.items():
        samples = [dataset[i] for i in indices]
        if len(samples) >= target_count:
            new_samples.extend(samples[:target_count])
        else:
            repeat_times = target_count - len(samples)
            for _ in range(repeat_times):
                img, lbl = random.choice(samples)
                img = augmentation(img)  # keep as PIL image
                new_samples.append((img, lbl))
            new_samples.extend(samples)

    return new_samples


def oversample_dataset(dataset, target_count=300):
    label_to_indices = {}
    for idx, (_, label) in enumerate(dataset):
        label_to_indices.setdefault(label, []).append(idx)

    new_indices = []

    for label, indices in label_to_indices.items():
        if len(indices) >= target_count:
            new_indices.extend(indices[:target_count])  # trim to target count
        else:
            repeat_times = target_count // len(indices)
            remainder = target_count % len(indices)

            # Repeat full set and add a few more randomly sampled
            new_indices.extend(indices * repeat_times)
            new_indices.extend(random.choices(indices, k=remainder))

    oversampled_dataset = Subset(dataset, new_indices)
    return oversampled_dataset
'''


def visualize_class_distribution(dataset, title="Class Distribution", class_names=None):
    label_counts = Counter([label for _, label in dataset])
    labels, counts = zip(*label_counts.items())

    # Use passed class_names if provided, else try getting from dataset
    if class_names is None and hasattr(dataset, 'classes'):
        class_names = [dataset.classes[i] for i in labels]
    elif class_names is not None:
        class_names = [class_names[i] for i in labels]
    else:
        class_names = [str(i) for i in labels]  # fallback: use label IDs

    plt.figure(figsize=(24, 10))
    plt.bar(class_names, counts, color='skyblue')
    plt.title(title, fontsize=16)
    plt.xlabel("Classes", fontsize=14)
    plt.ylabel("Number of Images", fontsize=14)
    plt.xticks(rotation=90, fontsize=8)
    plt.tight_layout()
    plt.show()
