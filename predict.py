import torch
import cv2
import numpy as np
from PIL import Image
import torchvision.transforms as transforms
import os

from model import get_forgery_model

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = get_forgery_model()
model.load_state_dict(torch.load("forgery_model_weights.pth", map_location=device))
model.to(device)
model.eval()

def predict_forgery(image_path):
    transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.ToTensor(),
    ])

    raw_image = Image.open(image_path).convert("RGB")
    input_tensor = transform(raw_image).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(input_tensor)
        mask = torch.sigmoid(output).squeeze().cpu().numpy()

    # Normalize
    mask = (mask - mask.min()) / (mask.max() - mask.min() + 1e-8)

    # Convert to heatmap using OpenCV
    heatmap = np.uint8(mask * 255)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_MAGMA)

    output_filename = f"heatmap_{os.path.basename(image_path)}.png"
    output_path = os.path.join("temp_uploads", output_filename)

    os.makedirs("temp_uploads", exist_ok=True)
    cv2.imwrite(output_path, heatmap)

    return output_path