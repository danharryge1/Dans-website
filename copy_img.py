import os
import shutil

src_path = os.path.expanduser("~/.gemini/antigravity/brain/747f0ad8-903b-442f-8360-d9d15e0fce5e/next_up_co_exact_replica_16_9_1776463217424.png")
dest_path = "temp_mockup.png"

shutil.copy(src_path, dest_path)
print("Copied successfully.")
