const fs = require('fs');
const pdf = require('pdf-parse');

const extractPdfText = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
};

module.exports = extractPdfText;
