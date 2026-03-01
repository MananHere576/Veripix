import torch
import segmentation_models_pytorch as smp

def get_forgery_model():
    """
    Builds the Efficient-U-Net model.
    - Backbone: EfficientNet-B0 (lightweight but highly accurate)
    - Weights: Pre-trained on ImageNet to recognize basic shapes and edges
    - in_channels: 3 (Standard RGB image)
    - classes: 1 (Binary output: Black for authentic, White for forged)
    """
    model = smp.Unet(
        encoder_name="efficientnet-b0", 
        encoder_weights="imagenet",     
        in_channels=3,                  
        classes=1,                      
    )
    return model

if __name__ == "__main__":
    # 1. Check for the RTX 3050 (The GPU Check)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"🔥 Your project is currently running on: {device}")

    if device.type == "cuda":
        print(f"GPU Name: {torch.cuda.get_device_name(0)}")
        print("CUDA is successfully configured!")
    else:
        print("Warning: PyTorch is using the CPU. We may need to install the CUDA version of PyTorch.")

    # 2. Load the model AND move it to the GPU
    print("\nLoading Efficient-U-Net...")
    model = get_forgery_model().to(device) # The .to(device) is the magic link!
    print("Model loaded successfully!")
    
    # 3. Simulate an image passing through the network
    # We must also send this dummy image to the GPU so it matches the model
    dummy_image = torch.randn(1, 3, 256, 256).to(device)
    output_mask = model(dummy_image)
    
    print(f"\nInput Image Shape: {dummy_image.shape}")
    print(f"Output Mask Shape: {output_mask.shape} --> (Batch, Class, Height, Width)")