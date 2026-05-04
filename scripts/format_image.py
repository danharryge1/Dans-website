import sys
from PIL import Image

def process_image(input_path, output_path, target_width, target_height):
    img = Image.open(input_path)
    w, h = img.size
    
    # Scale width to target_width
    new_w = target_width
    new_h = int(h * (target_width / w))
    
    # If the scaled height is somehow less than target_height, scale by height instead
    if new_h < target_height:
        new_h = target_height
        new_w = int(w * (target_height / h))
        
    img_resized = img.resize((new_w, new_h), Image.LANCZOS)
    
    # Crop center
    left = (new_w - target_width) // 2
    top = (new_h - target_height) // 2
    right = left + target_width
    bottom = top + target_height
    
    img_cropped = img_resized.crop((left, top, right, bottom))
    img_cropped.save(output_path, "WEBP")

if __name__ == "__main__":
    process_image(sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]))
