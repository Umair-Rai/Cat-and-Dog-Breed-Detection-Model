import os
import shutil



"""  To get breeds name

# Path to the images folder
images_path = r"C:\Users\Hamma\PycharmProjects\ml1Project\oxford_pet_data\images"

# Get all filenames in the directory
all_files = os.listdir(images_path)

# Extract unique class names from filenames (before the last underscore)
class_names = set()
for file in all_files:
    if file.endswith(".jpg"):
        class_name = "_".join(file.split("_")[:-1])  # Removes the last part (usually a number)
        class_names.add(class_name)

# Sort the class names
class_names = sorted(class_names)

# Save to a text file
output_file = os.path.join(images_path, "class_names.txt")
with open(output_file, 'w') as f:
    for cls in class_names:
        f.write(cls + '\n')

print(f"Saved {len(class_names)} class names to {output_file}")


"""


# Directory containing all images
base_dir = r"C:\Users\Hamma\PycharmProjects\ml1Project\oxford_pet_data\images"

# List of breeds (folder names) from your description
breeds = [
    "Abyssinian", "Bengal", "Birman", "Bombay", "British_Shorthair",
    "Egyptian_Mau", "Maine_Coon", "Persian", "Ragdoll", "Russian_Blue",
    "Siamese", "Sphynx", "american_bulldog", "american_pit_bull_terrier",
    "basset_hound", "beagle", "boxer", "chihuahua", "english_cocker_spaniel",
    "english_setter", "german_shorthaired", "great_pyrenees", "havanese",
    "japanese_chin", "keeshond", "leonberger", "miniature_pinscher",
    "newfoundland", "pomeranian", "pug", "saint_bernard", "samoyed",
    "scottish_terrier", "shiba_inu", "staffordshire_bull_terrier",
    "wheaten_terrier", "yorkshire_terrier"
]

# Convert breed names to lowercase
breeds = [breed.lower() for breed in breeds]

# Process each file in the images directory
for filename in os.listdir(base_dir):
    if filename.lower().endswith(".jpg"):
        # Identify breed name prefix from the filename
        for breed in breeds:
            if filename.lower().startswith(breed):
                breed_folder = os.path.join(base_dir, breed)

                # Create breed folder if not exists
                os.makedirs(breed_folder, exist_ok=True)

                # Move file to the appropriate folder
                src_path = os.path.join(base_dir, filename)
                dst_path = os.path.join(breed_folder, filename)

                shutil.move(src_path, dst_path)
                break  # Found the breed, no need to check others
