const { OpenAI } = require('openai');
const extractPdfText = require('./extractPdfText');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const analyzeResume = async (filePath, jobDescription, maxRetries = 3) => {
  const resumeText = await extractPdfText(filePath);
  const prompt = `Analyze the following resume and job description, and provide key insights in about the fit, strengths, and weaknesses:
  Resume: ${resumeText}
  Job Description: ${jobDescription}`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ "role": "user", "content": prompt }],
        // response_format: { type: "json_object" },
        max_tokens: 1500,
      });

    //   const parsedResponse = JSON.parse(response.choices[0].message.content);
      const parsedResponse = response.choices[0].message.content;
      return parsedResponse;
    } catch (error) {
      if (attempt === maxRetries) {
        console.error('Error analyzing resume after multiple attempts:', error);
        throw error;
      }
    }
  }
};

const writePoints = async (filePath, jobDescription, maxRetries = 3) => {
  const resumeText = await extractPdfText(filePath);
  const prompt = `Given this resume \n${resumeText}\n rewrite the bullet points to use keywords in this job description \n${jobDescription}. Provide the response in a way that can be displayed on a webpage`;;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ "role": "user", "content": prompt }],
        // response_format: { type: "json_object" },
        max_tokens: 1500,
      });

      
      // const parsedResponse = JSON.parse(response.choices[0].message.content);
      const parsedResponse = response.choices[0].message.content;
      return parsedResponse;
    } catch (error) {
      if (attempt === maxRetries) {
        console.error('Error rewriting resume points after multiple attempts:', error);
        throw error;
      }
    }
  }
};

const resumeQuestions = async (filePath, jobDescription, maxRetries = 3) => {
    const resumeText = await extractPdfText(filePath);
    const prompt = `Given this resume \n${resumeText}\n 
    write some questions and answers an interviewer would ask based on the
    experiences and job description in this job \n${jobDescription}.`;
  
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ "role": "user", "content": prompt }],
          // response_format: { type: "json_object" },
          max_tokens: 1500,
      });

      // const parsedResponse = JSON.parse(response.choices[0].message.content);
      const parsedResponse = response.choices[0].message.content;
      return parsedResponse;
      } catch (error) {
        if (attempt === maxRetries) {
          console.error('Error rewriting resume points after multiple attempts:', error);
          throw error;
        }
      }
    }
  };

module.exports = { analyzeResume, writePoints, resumeQuestions };
