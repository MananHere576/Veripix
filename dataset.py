import os
from PIL import Image
import torch
from torch.utils.data import Dataset
import torchvision.transforms as transforms

class ForgeryDataset(Dataset):
    def __init__(self, images_dir, masks_dir):
        """
        Initializes the dataset loader.
        images_dir: Path to the folder with color photos.
        masks_dir: Path to the folder with black-and-white ground truth masks.
        """
        self.images_dir = images_dir
        self.masks_dir = masks_dir
        # Get a list of all image filenames in the images directory
        self.image_names = os.listdir(images_dir)
        
        # We must resize everything to 256x256 so the RTX 3050 doesn't run out of VRAM
        self.transform_image = transforms.Compose([
            transforms.Resize((256, 256)),
            transforms.ToTensor(), # Converts to PyTorch format (scales pixels 0 to 1)
        ])
        
        self.transform_mask = transforms.Compose([
            transforms.Resize((256, 256)),
            transforms.ToTensor(),
        ])

    def __len__(self):
        # Tells PyTorch how many images we have in total
        return len(self.image_names)

    def __getitem__(self, idx):
        # 1. Get the filename for the current image
        img_name = self.image_names[idx]
        
        # 2. Construct the full file paths
        img_path = os.path.join(self.images_dir, img_name)
        
        # MAGIC FIX: Swap .jpg for .png so it finds the right mask file!
        # Our prepare_data.py script saved images as .jpg and masks as .png
        mask_name = img_name.replace('.jpg', '.png')
        mask_path = os.path.join(self.masks_dir, mask_name) 

        # 3. Open the images using Pillow
        image = Image.open(img_path).convert("RGB")
        mask = Image.open(mask_path).convert("L") # "L" means grayscale

        # 4. Apply the resizes and tensor conversions
        image = self.transform_image(image)
        mask = self.transform_mask(mask)

        # 5. Ensure the mask is strictly binary (0.0 for real, 1.0 for forged)
        mask = torch.round(mask)

        return image, mask