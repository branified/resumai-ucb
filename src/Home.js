import React, { useState } from 'react';
import axios from 'axios';

function Home() {
  const [file, setFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [points, setPoints] = useState('');
  const [questions, setQuestions] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    setAnalysis('');
    setPoints('');
    setQuestions('');
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobDescription', textInput);

    try {
      const response = await axios.post('http://localhost:5001/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const { analysis, points, questions } = response.data;
      setAnalysis(analysis); // Update state with analysis
      setPoints(points); // Update state with points
      setQuestions(questions); // Update state with questions
      setError(''); // Clear any previous error messages
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Error uploading file. Please try again.'); // Set error state
    }
  };

  const getQuestionsArray = (analysisString) => {
    return analysisString.split('\n');
  };

  const getSections = (analysisString) => {
    const sections = { fit: '', strengths: '', weaknesses: '' };
    const regex = /Fit:|Strengths:|Weaknesses:/g;
    const parts = analysisString.split(regex);

    const matches = analysisString.match(regex);
    if (matches) {
      matches.forEach((match, index) => {
        const key = match.toLowerCase().replace(':', '');
        sections[key] = parts[index + 1]?.trim() || '';
      });
    }
    
    return sections;
  };

  const renderAnalysisSections = (analysis) => {
    const sections = getSections(analysis);

    return (
      <div>
        {sections.fit && (
          <div>
            <h3>Fit</h3>
            <p>{sections.fit}</p>
          </div>
        )}
        {sections.strengths && (
          <div>
            <h3>Strengths</h3>
            <p>{sections.strengths}</p>
          </div>
        )}
        {sections.weaknesses && (
          <div>
            <h3>Weaknesses</h3>
            <p>{sections.weaknesses}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h1>Home</h1>

      <form onSubmit={handleFileUpload}>
      <div className="form-group">
          <label htmlFor="jobDescription">Job Description:</label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            value={textInput}
            onChange={handleTextChange}
            className="textarea"
          />
        </div>
        <div className="form-group">
          <label htmlFor="fileUpload">Upload a resume:</label>
          <input
            type="file"
            id="fileUpload"
            name="file"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Upload</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {Object.keys(analysis).length > 0 && (
        <div>
          <h2>Resume Analysis</h2>
          <p>{renderAnalysisSections(analysis)}</p>
          <h2>Resume Points</h2>
          <p>{points}</p>
          <h2>Questions</h2>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {getQuestionsArray(questions).map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Home;
