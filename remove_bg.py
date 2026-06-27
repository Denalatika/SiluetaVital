import cv2
import numpy as np
import sys

img_path = 'public/images/logo_icon.jpg'
out_path = 'public/images/logo_icon_transparent.png'

# Read image
img = cv2.imread(img_path)
if img is None:
    print("Could not read image")
    sys.exit(1)

# Convert to RGBA
rgba = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)

# Define black threshold (pixels darker than this will be transparent)
lower_black = np.array([0, 0, 0, 255])
upper_black = np.array([50, 50, 50, 255]) # Adjust threshold as needed

# Create mask of black pixels
mask = cv2.inRange(rgba, lower_black, upper_black)

# Set alpha to 0 for black pixels
rgba[mask > 0] = [0, 0, 0, 0]

# Write output
cv2.imwrite(out_path, rgba)
print("Saved transparent image to", out_path)
