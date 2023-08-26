const express = require('express');
const multer = require('multer');
const Jimp = require('jimp');
const path = require('path');

const app = express();
const port = 3000;

// Set up Multer middleware for uploading files
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Serve HTML form for uploading files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle file upload and invisible watermarking
app.post('/upload', upload.array('images', 10), async (req, res) => {
  try {
    // Load invisible watermark image (transparent)
    const invisibleWatermark = await Jimp.read('watermark.png');

    // Process each uploaded image
    for (const image of req.files) {
      // Load the uploaded image
      const uploadedImage = await Jimp.read(image.buffer);

      // Calculate position for watermark
      const x = 0; // Adjust as needed
      const y = 0; // Adjust as needed

      // Apply invisible watermark to the image
      uploadedImage.composite(invisibleWatermark, x, y, {
        mode: Jimp.BLEND_SOURCE_OVER, // Blend mode
        opacitySource: 0.5, // Adjust the opacity of the watermark
      });

      // Save the watermarked image with timestamp
      const timestamp = new Date().getTime();
      const outputFilename = `watermark_${timestamp}_${image.originalname}`;
      await uploadedImage.writeAsync(outputFilename);
    }

    res.send('Images uploaded and invisibly watermarked successfully!');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred');
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
