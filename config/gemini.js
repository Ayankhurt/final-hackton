import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the Gemini model - Using gemini-2.5-flash for latest features
export const getGeminiModel = (modelName = 'gemini-2.5-flash') => {
  return genAI.getGenerativeModel({ model: modelName });
};

// Analyze medical report with Gemini
export const analyzeMedicalReport = async (fileBuffer, fileName, mimeType) => {
  try {
    const model = getGeminiModel();
    
    // Convert file buffer to base64
    const base64Data = fileBuffer.toString('base64');
    
    // Create the prompt for medical analysis
    const prompt = `
    You are a medical AI assistant analyzing a medical report. Provide a concise analysis in the following JSON format:

    {
      "summaryEnglish": "Brief summary in English (max 300 words)",
      "summaryRomanUrdu": "Same summary in Roman Urdu (max 300 words)",
      "abnormalValues": [
        {
          "parameter": "Parameter name",
          "value": "Actual value",
          "normalRange": "Normal range",
          "severity": "low/moderate/high/critical",
          "description": "Brief explanation (max 100 words)"
        }
      ],
      "doctorQuestions": [
        {
          "question": "Important question to ask doctor (max 100 words)",
          "priority": "low/medium/high"
        }
      ],
      "foodRecommendations": {
        "avoid": [
          {
            "food": "Food item to avoid",
            "reason": "Brief reason (max 50 words)"
          }
        ],
        "include": [
          {
            "food": "Food item to include",
            "benefit": "Brief benefit (max 50 words)"
          }
        ]
      },
      "disclaimer": "This analysis is for informational purposes only. Always consult your doctor for proper medical advice and treatment."
    }

    IMPORTANT: 
    - Return ONLY valid JSON, no additional text or markdown
    - Keep summaries under 300 words
    - Be concise and focus on key findings only
    - Ensure all fields are present in the JSON response
    `;

    // Prepare the file data for Gemini
    const fileData = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    };

    // Generate content
    const result = await model.generateContent([prompt, fileData]);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON response
    try {
      // Clean the response text first
      let cleanText = text.trim();
      
      // Remove any markdown code blocks
      cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Try to find JSON object in the response
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        
        // Ensure summaries are within character limits
        if (analysis.summaryEnglish && analysis.summaryEnglish.length > 2000) {
          analysis.summaryEnglish = analysis.summaryEnglish.substring(0, 1997) + '...';
        }
        if (analysis.summaryRomanUrdu && analysis.summaryRomanUrdu.length > 2000) {
          analysis.summaryRomanUrdu = analysis.summaryRomanUrdu.substring(0, 1997) + '...';
        }
        
        return analysis;
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError.message);
      console.error('Raw response:', text.substring(0, 500));
      throw new Error(`Failed to parse AI response: ${parseError.message}`);
    }

  } catch (error) {
    console.error('Gemini AI analysis error:', error);
    throw new Error(`AI analysis failed: ${error.message}`);
  }
};

// Generate dynamic analysis based on report metadata
export const generateDynamicAnalysis = async (reportType, fileName, reportData) => {
  try {
    const model = getGeminiModel();
    
    // Create a prompt based on report metadata
    const prompt = `
You are a medical AI assistant. Based on the following report information, provide a concise health analysis:

Report Type: ${reportType}
File Name: ${fileName}
File Size: ${reportData.fileSize ? Math.round(reportData.fileSize / 1024) + ' KB' : 'Unknown'}
Upload Date: ${reportData.uploadDate ? new Date(reportData.uploadDate).toLocaleDateString() : 'Unknown'}
Family Member: ${reportData.familyMember ? `${reportData.familyMember.name} (${reportData.familyMember.relationship})` : 'Self'}

Provide a brief analysis in the following JSON format:
{
  "summaryEnglish": "Concise analysis in English (max 300 words)",
  "summaryRomanUrdu": "Concise analysis in Roman Urdu (max 300 words)",
  "abnormalValues": [
    {
      "parameter": "Parameter name",
      "value": "Value",
      "normalRange": "Normal range",
      "severity": "low/moderate/high/critical",
      "description": "Brief description (max 100 words)"
    }
  ],
  "doctorQuestions": [
    {
      "question": "Question to ask doctor (max 100 words)",
      "priority": "low/medium/high"
    }
  ],
  "foodRecommendations": {
    "avoid": [
      {
        "food": "Food to avoid",
        "reason": "Brief reason (max 50 words)"
      }
    ],
    "include": [
      {
        "food": "Food to include",
        "benefit": "Brief benefit (max 50 words)"
      }
    ]
  },
  "disclaimer": "This analysis is for informational purposes only. Always consult your doctor for proper medical advice and treatment."
}

IMPORTANT: 
- Return ONLY valid JSON, no additional text or markdown
- Keep summaries under 300 words
- Be concise and specific to the report type
- Ensure all fields are present in the JSON response
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON response
    try {
      // Clean the response text first
      let cleanText = text.trim();
      
      // Remove any markdown code blocks
      cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Try to find JSON object in the response
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        
        // Ensure summaries are within character limits
        if (analysis.summaryEnglish && analysis.summaryEnglish.length > 2000) {
          analysis.summaryEnglish = analysis.summaryEnglish.substring(0, 1997) + '...';
        }
        if (analysis.summaryRomanUrdu && analysis.summaryRomanUrdu.length > 2000) {
          analysis.summaryRomanUrdu = analysis.summaryRomanUrdu.substring(0, 1997) + '...';
        }
        
        return analysis;
      } else {
        throw new Error('No valid JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError.message);
      console.error('Raw response:', text.substring(0, 500));
      throw new Error(`Failed to parse AI response: ${parseError.message}`);
    }
    
  } catch (error) {
    console.error('Dynamic analysis generation error:', error);
    throw new Error(`AI analysis failed: ${error.message}`);
  }
};

export default genAI;
