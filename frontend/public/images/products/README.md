# Product Images Directory

This directory is for storing product images locally. Add your makhana air fried chips product images here.

## Image Files to Add

Add the following image files to this directory (JPG or PNG format):

### Makhana Products
- `himalayan-pink-salt-makhana.jpg` - Himalayan Pink Salt Makhana
- `peri-peri-makhana.jpg` - Peri Peri Makhana
- `butter-herbs-makhana.jpg` - Butter & Herbs Makhana

### Air Fried Chips Products
- `classic-salted-chips.jpg` - Classic Salted Air Fried Chips
- `masala-chips.jpg` - Masala Air Fried Chips
- `beetroot-spinach-chips.jpg` - Beetroot & Spinach Chips

### Diet Mix Products
- `protein-power-mix.jpg` - Protein Power Diet Mix
- `trail-mix-supreme.jpg` - Trail Mix Supreme
- `chaat-mixture.jpg` - Chaat Flavoured Roasted Mixture

## How to Add Images

1. **Take product photos:**
   - Use a clean background (white or neutral color)
   - Ensure good lighting
   - Keep product centered in frame
   - Use square or consistent aspect ratio (500x500px recommended)

2. **Save images:**
   - File format: JPG or PNG
   - Size: Keep under 500KB each for web performance
   - Quality: Use 80-90% JPEG quality for balance

3. **Copy to this directory:**
   - Place images in `frontend/public/images/products/`
   - Use exact filenames as listed above

4. **Test:**
   - Images will automatically appear on:
     - Home page (Featured Products & Best Sellers)
     - Shop page (product grid)
     - Product detail pages

## Notes

- Images are referenced in:
  - `frontend/app/page.tsx` (home page mock data)
  - `frontend/app/shop/page.tsx` (shop page mock products)
- Once you have a backend API, update the database instead of the mock data
- Current paths: `/images/products/[filename].jpg`
