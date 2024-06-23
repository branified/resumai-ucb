const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { analyzeResume, writePoints, resumeQuestions } = require('./analyzeText');
const fs = require('fs');

const app = express();
const port = 5001; // Adjusted port number

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.post('/upload-resume', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const jobDescription = req.body.jobDescription;
  try {
    const analysis = await analyzeResume(filePath, jobDescription); // Assuming analyzeResume returns some text
    const points = await writePoints(filePath, jobDescription);
    const questions = await resumeQuestions(filePath, jobDescription);
    res.json({ analysis, points, questions });
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).send('Error analyzing resume');
  } finally {
    fs.unlinkSync(filePath); // Delete the file after analysis
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
