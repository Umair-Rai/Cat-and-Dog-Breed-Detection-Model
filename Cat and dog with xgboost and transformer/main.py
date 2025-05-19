from data_loader import extract_dataset

def main():
    extract_dataset("stanford.tar", "stanford")
    extract_dataset("oxford.tar", "images")



if __name__ == "__main__":
    main()
