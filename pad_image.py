import os
from PIL import Image

src_path = os.path.expanduser("~/.gemini/antigravity/brain/747f0ad8-903b-442f-8360-d9d15e0fce5e/next_up_co_exact_replica_16_9_1776463217424.png")
dest_path = "Next_Up_Co_Mockup_16_9.png" # Saving in the workspace

try:
    img = Image.open(src_path)
    w, h = img.size
    
    # We want a 16:9 aspect ratio, keeping height the same and padding width
    new_w = int(h * 16 / 9)
    new_h = h
    
    # Sample background color from the top left corner (or middle left edge)
    bg_color = img.getpixel((5, int(h/2)))
    
    # Create new image with padding
    new_img = Image.new(img.mode, (new_w, new_h), bg_color)
    
    # Paste the original image into the center
    offset_x = (new_w - w) // 2
    new_img.paste(img, (offset_x, 0))
    
    new_img.save(dest_path)
    print(f"Successfully saved 16:9 image to {dest_path}")
    
except Exception as e:
    print(f"Error: {e}")
