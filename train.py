import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from tqdm import tqdm 

# Import the brain and the data pipeline we already built
from model import get_forgery_model
from dataset import ForgeryDataset

def train_model():
    # 1. Wake up the RTX 3050
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"🚀 Firing up training on: {device}")

    # 2. Load the Efficient-U-Net and send it to the GPU
    model = get_forgery_model().to(device)

    # 3. Connect the Data
    # Pointing exactly to where our prep script saved the clean 4982 images
    train_dataset = ForgeryDataset(
        images_dir="datasets/casia_v2/images", 
        masks_dir="datasets/casia_v2/masks"
    )
    
    # Batch size of 8 perfectly fills your 6GB VRAM without crashing
    train_loader = DataLoader(train_dataset, batch_size=8, shuffle=True)

    # 4. The Math (How the AI learns)
    # BCEWithLogitsLoss compares the AI's fake-pixel heatmap against the real mask
    criterion = nn.BCEWithLogitsLoss() 
    # Adam optimizer mathematically adjusts the AI's brain to fix its mistakes
    optimizer = optim.Adam(model.parameters(), lr=0.0001) 

    # 5. The Training Loop
    epochs = 3 # Let's do 3 rounds over the data for our first test
    
    for epoch in range(epochs):
        model.train() # Lock the model into learning mode
        running_loss = 0.0
        
        # This creates the beautiful loading bar in your terminal
        progress_bar = tqdm(train_loader, desc=f"Epoch {epoch+1}/{epochs}")
        
        for images, masks in progress_bar:
            # Move the images and masks to the RTX 3050
            images = images.to(device)
            masks = masks.to(device)

            # Step A: Clear the old math
            optimizer.zero_grad()

            # Step B: AI guesses where the forgery is
            predictions = model(images)

            # Step C: Calculate how wrong the guess was
            loss = criterion(predictions, masks)

            # Step D: Backpropagation (Learn from the mistake)
            loss.backward()

            # Step E: Update the brain weights
            optimizer.step()

            # Update the progress bar with the current loss
            running_loss += loss.item()
            progress_bar.set_postfix({"Loss": f"{loss.item():.4f}"})
            
        # Print the final score for the epoch
        epoch_loss = running_loss / len(train_loader)
        print(f"✅ End of Epoch {epoch+1} | Average Loss: {epoch_loss:.4f}\n")

    # 6. Save the trained brain!
    torch.save(model.state_dict(), "forgery_model_weights.pth")
    print("🎉 Training Complete! Weights saved as 'forgery_model_weights.pth'")

if __name__ == "__main__":
    train_model()