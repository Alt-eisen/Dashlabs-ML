const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const TextSegmentation = require('text-segmentation');

// Remember to change the file name on imageFilePath
const imageFilePath = './AnnexG_PyschEval_Written_page-0001.jpg'; 
const outputDir = 'output'; // Directory to save OCR results

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const timestamp = Date.now(); // Generate a timestamp as a unique identifier
const outputTextFilePath = path.join(outputDir, `output_${timestamp}.txt`);
const segmentedTextFilePath = path.join(outputDir, `segmented_text_${timestamp}.txt`);

const TesseractOptions = {
  tessedit_pageseg_mode: 3, // Set the Page Segmentation Mode to AUTO
  logger: (info) => console.log(info),
};

// Recognizes text from the image with the specified language
Tesseract.recognize(
  imageFilePath,
  'eng', // You can specify the language needed here
  TesseractOptions
)
  .then(({ data: { text } }) => {
    // Save the recognized text to a text file
    fs.writeFileSync(outputTextFilePath, text);
    console.log('Text saved to ' + outputTextFilePath);

    // Use the "text-segmentation" library to perform text segmentation
    const segmentedText = TextSegmentation(text);

    // Save the segmented text to a file
    fs.writeFileSync(segmentedTextFilePath, segmentedText);
    console.log('Segmented text saved to ' + segmentedTextFilePath);
  })
  .catch((error) => console.error(error));