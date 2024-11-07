import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, 
});

interface CVData {
    fullName: string;
    jobTitle: string;
    workExperience: string; 
    skills: string;
}

export async function generateCVSummary(data: CVData): Promise<string> {
    const { fullName, jobTitle, workExperience, skills } = data;

    const response = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "You are an assistant that generates detailed CV summaries.",
            },
            {
                role: "user",
                content: `Generate a detailed CV summary for ${fullName}, a ${jobTitle}. Work experience includes: ${workExperience}. Key skills are: ${skills}.`,
            },
        ],
        max_tokens: 1000,
        model: 'gpt-4',
    });

    return response.choices[0].message?.content || 'No summary generated.';
}