import os
import shutil
import sklearn.model_selection

def split_dataset_into_train_val(source_dir, output_dir, val_ratio=0.2, seed=42):
    """
    Splits dataset of images organized by class folders into train and val folders.

    Args:
        source_dir (str): Path to original dataset directory containing breed folders.
        output_dir (str): Path to output directory where 'train' and 'val' folders will be created.
        val_ratio (float): Fraction of data to reserve for validation.
        seed (int): Random seed for reproducibility.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    train_dir = os.path.join(output_dir, "train")
    val_dir = os.path.join(output_dir, "val")

    for folder in [train_dir, val_dir]:
        if not os.path.exists(folder):
            os.makedirs(folder)

    breeds = [d for d in os.listdir(source_dir) if os.path.isdir(os.path.join(source_dir, d))]

    for breed in breeds:
        breed_path = os.path.join(source_dir, breed)
        images = [f for f in os.listdir(breed_path) if f.lower().endswith((".jpg", ".jpeg", ".png"))]

        train_imgs, val_imgs = sklearn.model_selection.train_test_split(
            images,
            test_size=val_ratio,
            random_state=seed,
            stratify=[breed]*len(images)
        )

        # Create breed subfolders in train and val dirs
        breed_train_dir = os.path.join(train_dir, breed)
        breed_val_dir = os.path.join(val_dir, breed)
        os.makedirs(breed_train_dir, exist_ok=True)
        os.makedirs(breed_val_dir, exist_ok=True)

        # Copy train images
        for img in train_imgs:
            shutil.copy2(os.path.join(breed_path, img), os.path.join(breed_train_dir, img))

        # Copy val images
        for img in val_imgs:
            shutil.copy2(os.path.join(breed_path, img), os.path.join(breed_val_dir, img))

    print(f"Dataset split into train and val folders at '{output_dir}'.")



if __name__ == "__main__":
    split_dataset_into_train_val("stanford_dogs/Images", "images_split", val_ratio=0.2)