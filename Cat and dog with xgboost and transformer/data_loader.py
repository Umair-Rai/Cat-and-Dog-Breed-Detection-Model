import os
import tarfile

def extract_dataset(tar_path, extract_path="images"):
    if not os.path.exists(extract_path):
        os.makedirs(extract_path)
        with tarfile.open(tar_path, "r") as tar:
            tar.extractall(path=extract_path)
        print("✅ Dataset extracted.")
    else:
        print("ℹ️ Dataset already extracted.")

