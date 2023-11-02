const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

// Remember to change the file name on imageFilePath
const imageFilePath = './AnnexG_PyschEval_Written_page-0001.jpg'; 
const outputDir = 'output'; // Directory to save OCR results


// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  const timestamp = Date.now(); // Generate a timestamp as a unique identifier
  const outputTextFilePath = path.join(outputDir, `output_${timestamp}.txt`);


// Recognizes text from the image
Tesseract.recognize(
  imageFilePath,
  'eng', // You can specify the language needed here
  { logger: (info) => console.log(info) } // for logging progress
)
  .then(({ data: { text } }) => {
    // Save the recognized text to a text file
    fs.writeFileSync(outputTextFilePath, text);
    console.log('Text saved to ' + outputTextFilePath);
  })
  .catch((error) => console.error(error));