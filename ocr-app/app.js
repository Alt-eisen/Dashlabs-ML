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

    // Split the segmented text into lines
    const lines = segmentedText.split('\n');

    // Create an array to hold the data for each processed document
    const documents = [];

    // Iterate through the lines and extract the fields (Name, Address, Allergies, etc.)
    for (const line of lines) {
      const [name, address, allergies, etc] = line.split('|').map((field) => field.trim());
      documents.push({ Name: name, Address: address, Allergies: allergies, Etc: etc });
    }

 // Create a data frame from the documents array
const df = new TextSegmentation.DataFrame(documents);

    // Now you have a data frame with the structured data
    console.log(df.toString());
  })
  .catch((error) => console.error(error));