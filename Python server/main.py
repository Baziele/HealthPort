from escpos.printer import Usb
from PIL import Image  # Add this import at the top
import os

# Your printer's Vendor ID and Product ID:
VENDOR_ID = 0x6868
PRODUCT_ID = 0x0200

try:
    p = Usb(VENDOR_ID, PRODUCT_ID, 0)
    
    # Open and resize image before printing
    img = Image.open("logo3.png")
    
    # Calculate new width while maintaining aspect ratio
    printer_width = 384  # Standard width for many thermal printers
    ratio = printer_width / float(img.size[0])
    new_height = int(float(img.size[1]) * ratio)
    
    # Resize and convert to black and white
    img_resized = img.resize((printer_width, new_height), Image.Resampling.LANCZOS)
    img_bw = img_resized.convert('1')  # Convert to binary (black and white)
    
    # Print the processed image
    p.image(img_bw)
    p.text("\n") # Newline

    p.text("--- Health Report ---\n")
    p.text("\n")
    p.text("Details:\n")
    p.text("Name: Saah Francis Mbah\n")
    p.text("Age: 25\n")
    p.text("Gender: Male\n")
    p.text("Height: 162cm\n")
    p.text("Weight: 63Kg\n")
    p.text("\n")
    p.set(font='b') # Set alignment to center and font 'b'
    p.text("Prescription\n")
    p.set(align='left', font='a')   # Reset to left align and font 'a' (normal font)
    p.text("1. Paracetamol 500mg\n")
    p.text("2. Ibuprofen 200mg\n")
    p.text("3. Amoxicillin 250mg\n")
    p.text("\n")
    p.text("Instructions:\n")
    p.text("1. Take Paracetamol 500mg every 6 hours as needed for pain.\n")
    p.text("2. Take Ibuprofen 200mg every 8 hours for inflammation.\n")
    p.text("3. Take Amoxicillin 250mg every 12 hours for 7 days.\n")
    p.text("\n")
    p.text("Follow up in 2 weeks or sooner if symptoms worsen.\n")
    p.text("\n")
    p.text("Scan the QR Code to access results\n")
    p.set(align='center', font='a')
    p.qr("https://healthport.com", 
        size=8,           # Size of the QR code (1-16)
        ec=1,   # Error correction level: L, M, Q, H
        center=True)
    p.text("\n")
    p.barcode('123456789012', 'EAN13', 64, 2, '', '') # Example Barcode
    p.text("\n")
    

    # # Attempt 1: Try setting the font to 'b' for bold/emphasized text
    # p.text("If you are happy and you know it clap your hands. clap!! clap!!\n")



    # p.text("\n") # Newline
    #  # Newline
    # p.qr("https://example.com", 
    #     size=8,           # Size of the QR code (1-16)
    #     ec=1,   # Error correction level: L, M, Q, H
    #     center=True)      # Center the QR code
    
    # p.text("\n") # Newline
    p.cut() # Cut the paper

    print("Print job sent successfully!")

except Exception as e:
    print(f"Error connecting to or printing: {e}")
    print("Please ensure:")
    print(f"  1. The printer is connected via USB and powered on.")
    print(f"  2. Your user ({os.getenv('USER')}) has permissions to access USB devices.")
    print(f"     * Make sure you've logged out and back in after adding your user to 'lp' and 'dialout' groups.")
    print(f"     * **Crucially, ensure a UDEV rule is set up for your printer (see previous instructions).**")
    print(f"     * After creating the UDEV rule, unplug and replug the printer.")
    print(f"  3. The Vendor ID (0x{hex(VENDOR_ID)[2:]}) and Product ID (0x{hex(PRODUCT_ID)[2:]}) are correct.")
    print(f"  4. The USB bus number (0 in this example) is correct for your setup. You might need to check `lsusb` output for this.")
    print(f"  5. If you're still getting style errors, try commenting out the styling lines (`p.set`, `p.bold`) and just print plain text to confirm basic connectivity.")