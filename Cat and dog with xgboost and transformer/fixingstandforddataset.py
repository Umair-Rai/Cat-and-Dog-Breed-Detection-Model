import os
import re
import shutil


# Path to your dataset
base_dir = r"C:\Users\Hamma\PycharmProjects\ml1Project\stanford_dogs\Images"

# Loop through all subfolders
for folder in os.listdir(base_dir):
    old_folder_path = os.path.join(base_dir, folder)

    # Make sure it's a directory and follows the expected pattern
    if os.path.isdir(old_folder_path) and '-' in folder:
        # Extract class name and make it lowercase
        new_folder_name = folder.split('-')[1].lower()
        new_folder_path = os.path.join(base_dir, new_folder_name)

        # Rename the folder
        os.rename(old_folder_path, new_folder_path)

        # Loop through all images inside this folder
        for filename in os.listdir(new_folder_path):
            file_path = os.path.join(new_folder_path, filename)

            # Check if it's a file and matches pattern like: n02085620_7.jpg
            match = re.match(r'^.+?_(\d+)\.jpg$', filename)
            if match:
                number = match.group(1)
                new_filename = f"{new_folder_name}_40{number}.jpg"
                new_file_path = os.path.join(new_folder_path, new_filename)
                # Rename the image
                os.rename(file_path, new_file_path)

