from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import shutil
import os
import time
import numpy as np
import cv2  # Required for Adaptive Thresholding
from PIL import Image, ImageChops

from metadata import scan_metadata
from predict import predict_forgery

app = FastAPI()

# Enable CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create and mount the storage folder
UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/files", StaticFiles(directory=UPLOAD_DIR), name="files")

# --- STEP 3: ADAPTIVE OTSU THRESHOLDING ENGINE (REFINED) ---
def apply_adaptive_threshold(heatmap_path):
    """
    Cleans ONLY the heatmap. 
    It wipes out 'Google Sand' but preserves the forgery 'Glow'.
    """
    try:
        # 1. Load the generated heatmap
        img_bgr = cv2.imread(heatmap_path)
        if img_bgr is None:
            return None
            
        # 2. Convert to Grayscale for mathematical analysis
        gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        
        # 3. Smooth out minor pixel jitter (Internet Sand)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # 4. OTSU'S AUTOMATIC THRESHOLDING
        # This mathematically finds the 'noise floor' of the internet compression
        ret, mask = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # 5. Apply the mask ONLY to the heatmap image
        # This keeps the 'forgery' pixels and turns 'noise' pixels to pure black
        cleaned_heatmap = cv2.bitwise_and(img_bgr, img_bgr, mask=mask)
        
        # 6. Save the refined evidence (Overwriting the heatmap file only)
        cv2.imwrite(heatmap_path, cleaned_heatmap)
        
        print(f"📊 Adaptive Engine: Noise Gate set to {ret}")
        return ret
    except Exception as e:
        print(f"Adaptive Thresholding Error: {e}")
        return None

@app.post("/analyze/")
async def analyze_image(file: UploadFile = File(...)):
    # 1. Create unique filenames
    timestamp = int(time.time())
    base_name = os.path.basename(file.filename).replace(" ", "_")
    safe_filename = f"{timestamp}_{base_name}"
    
    # file_path is the ORIGINAL image (Needs to stay bright)
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    
    # 2. Save the original file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # 3. RUN ENGINES
    # Metadata Engine (Uses the original file)
    meta_results = scan_metadata(file_path)
    
    # AI Prediction Engine 
    # Important: predict_forgery should return a path to a NEW file (the heatmap)
    # and NOT modify the original 'file_path'.
    heatmap_path = predict_forgery(file_path)
    
    # --- PHASE 3: APPLY ADAPTIVE FINE-TUNING TO HEATMAP ONLY ---
    # We pass 'heatmap_path', NOT 'file_path'. This keeps your lion photo bright.
    auto_threshold_val = apply_adaptive_threshold(heatmap_path)
    
    # Optional: Update metadata with the AI's confidence score
    if auto_threshold_val:
        meta_results["auto_threshold"] = round(auto_threshold_val, 2)
    
    # 4. Prepare Response
    # final_original_url points to the untouched, bright upload
    final_original_url = safe_filename
    # final_heatmap_url points to the dark, cleaned-up forensic map
    final_heatmap_url = os.path.basename(heatmap_path)
    
    return {
        "filename": final_original_url,
        "heatmap_filename": final_heatmap_url,
        "metadata": meta_results
    }

