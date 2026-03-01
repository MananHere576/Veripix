import torch
import matplotlib.pyplot as plt
from PIL import Image
import torchvision.transforms as transforms
import os
import numpy as np

from model import get_forgery_model

# 🔥 LOAD MODEL ONCE (GLOBAL)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = get_forgery_model()
model.load_state_dict(torch.load("forgery_model_weights.pth", map_location=device))
model.to(device)
model.eval()

print(f"🚀 Model loaded on {device}")


def predict_forgery(image_path):
    print(f"🧠 AI scanning {image_path}...")

    transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.ToTensor(),
    ])

    raw_image = Image.open(image_path).convert("RGB")
    display_image = raw_image.resize((256, 256), Image.Resampling.LANCZOS)
    input_tensor = transform(raw_image).unsqueeze(0).to(device)

    with torch.no_grad():
        raw_prediction = model(input_tensor)
        probability_mask = torch.sigmoid(raw_prediction)

    heatmap = probability_mask.squeeze().cpu().numpy()

    if heatmap.max() > 0:
        heatmap = (heatmap - heatmap.min()) / (heatmap.max() - heatmap.min() + 1e-8)

    plt.figure(figsize=(12, 6))

    plt.subplot(1, 2, 1)
    plt.title("Evidence: Original Image", fontsize=12, fontweight='bold')
    plt.imshow(display_image)
    plt.axis("off")

    plt.subplot(1, 2, 2)
    plt.title("Analysis: Forgery Heatmap", fontsize=12, fontweight='bold')
    plt.imshow(heatmap, cmap='magma', interpolation='bilinear')
    plt.axis("off")

    plt.tight_layout()

    output_filename = f"heatmap_{os.path.basename(image_path)}.png"
    output_path = os.path.join("temp_uploads", output_filename)

    os.makedirs("temp_uploads", exist_ok=True)

    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

    return output_path