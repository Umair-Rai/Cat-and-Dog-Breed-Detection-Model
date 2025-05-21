import torch
import matplotlib.pyplot as plt
from collections import Counter
from torchvision import transforms
import random
from torch.utils.data import Dataset
from tqdm import tqdm
from PIL import Image

# ✅ Oversampling

class OversampledDataset(Dataset):
    def __init__(self, samples, class_to_idx):
        self.samples = samples
        self.class_to_idx = class_to_idx

    def __getitem__(self, idx):
        return self.samples[idx]

    def __len__(self):
        return len(self.samples)

def oversample_dataset(dataset, target_count=300):
    label_to_indices = {}
    for idx, (_, label) in enumerate(dataset):
        label_to_indices.setdefault(label, []).append(idx)

    class_to_idx = dataset.class_to_idx
    new_samples = []

    augmentation = transforms.Compose([
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(20),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1),
        transforms.RandomResizedCrop(size=(224, 224), scale=(0.8, 1.0)),
    ])

    print("🔁 Oversampling classes...")
    for label, indices in tqdm(label_to_indices.items(), desc="Oversampling", total=len(label_to_indices)):
        samples = [dataset[i] for i in indices]
        if len(samples) >= target_count:
            new_samples.extend(samples[:target_count])
        else:
            for _ in range(target_count - len(samples)):
                img, lbl = random.choice(samples)

                # Convert to PIL if it's a tensor
                if isinstance(img, torch.Tensor):
                    img = transforms.ToPILImage()(img)

                # Apply augmentation and ensure output is PIL
                img = augmentation(img)
                if isinstance(img, torch.Tensor):
                    img = transforms.ToPILImage()(img)

                new_samples.append((img, lbl))
            new_samples.extend(samples)

    return OversampledDataset(new_samples, class_to_idx)

# ✅ Visualization
def visualize_class_distribution(dataset, title="Class Distribution", class_names=None):
    label_counts = Counter([label for _, label in dataset])
    labels, counts = zip(*label_counts.items())
    if class_names is None and hasattr(dataset, 'classes'):
        class_names = [dataset.classes[i] for i in labels]
    elif class_names is not None:
        class_names = [class_names[i] for i in labels]
    else:
        class_names = [str(i) for i in labels]

    plt.figure(figsize=(24, 10))
    plt.bar(class_names, counts, color='skyblue')
    plt.title(title, fontsize=16)
    plt.xlabel("Classes", fontsize=14)
    plt.ylabel("Number of Images", fontsize=14)
    plt.xticks(rotation=90, fontsize=8)
    plt.tight_layout()
    plt.show()
