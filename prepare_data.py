import os
import shutil
from pathlib import Path
from tqdm import tqdm

def prepare_casia_dataset():
    # --- UPDATE THIS PATH to where your downloaded CASIA2 folder is ---
    raw_dataset_path = r"D:\forgery_project\datasets\CASIA2"
    
    tp_dir = os.path.join(raw_dataset_path, "Tp")
    gt_dir = os.path.join(raw_dataset_path, "CASIA 2 Groundtruth")
    
    # Where we want the clean data to go for our PyTorch model
    out_images_dir = "datasets/casia_v2/images"
    out_masks_dir = "datasets/casia_v2/masks"
    
    os.makedirs(out_images_dir, exist_ok=True)
    os.makedirs(out_masks_dir, exist_ok=True)
    
    # Get all masks
    mask_files = [f for f in os.listdir(gt_dir) if f.endswith(('.png', '.jpg', '.tif'))]
    
    print(f"Found {len(mask_files)} masks. Matching with images...")
    
    success_count = 0
    
    for mask_name in tqdm(mask_files):
        # CASIA masks are usually named like: "Tp_D_CRN_S_N_ani00073_ani00068_00018_gt.png"
        # The actual image is named: "Tp_D_CRN_S_N_ani00073_ani00068_00018.jpg" (or .tif)
        
        # Remove the "_gt" and the extension to get the core file name
        core_name = mask_name.rsplit('_gt', 1)[0]
        
        # We need to find the matching image in the Tp folder (it could be .jpg or .tif)
        matching_img_path = None
        for ext in ['.jpg', '.tif', '.png']:
            possible_path = os.path.join(tp_dir, core_name + ext)
            if os.path.exists(possible_path):
                matching_img_path = possible_path
                break
                
        if matching_img_path:
            # We found a match! Copy both to our clean folders with exact same names
            clean_filename = f"forged_{success_count}.jpg"
            clean_maskname = f"forged_{success_count}.png"
            
            shutil.copy(matching_img_path, os.path.join(out_images_dir, clean_filename))
            shutil.copy(os.path.join(gt_dir, mask_name), os.path.join(out_masks_dir, clean_maskname))
            
            success_count += 1

    print(f"\nData Prep Complete! Successfully paired {success_count} images and masks.")

if __name__ == "__main__":
    prepare_casia_dataset()