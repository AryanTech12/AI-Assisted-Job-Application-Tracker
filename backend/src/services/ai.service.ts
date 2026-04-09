import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const parseJobDescription = async (jdText: string) => {
  const prompt = `
  You are an expert technical recruiter and resume writer. I will provide you with a job description. 
  Extract the following information and return ONLY a structured JSON object. 
  
  Do not include any markdown, explanation, or code blocks outside of the JSON. Make sure keys match exactly:
  {
    "company": "Company Name (or Unknown if not found)",
    "role": "Role Title",
    "seniority": "e.g., Junior, Mid, Senior (or Unknown)",
    "location": "e.g., Remote, San Francisco, CA (or Unknown)",
    "skills": ["Array of up to 10 key technical skills"],
    "resume_suggestions": ["Array of 3 to 5 specific, tailored resume bullet point suggestions perfectly suited for this role."]
  }

  Job Description:
  ${jdText}
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2, // Low temp for more deterministic output
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (content) {
       return JSON.parse(content);
    }
    throw new Error('AI returned empty response');
  } catch (error) {
    if (error instanceof Error) {
        throw new Error(`AI Parsing failed: ${error.message}`);
    }
    throw new Error('AI Parsing failed: unknown error');
  }
};
