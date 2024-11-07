import { NextRequest, NextResponse } from 'next/server';
import { generateCVSummary } from '../../../../utils/openai';


export async function POST(request: NextRequest) {
    const data = await request.json();

    console.log('Received Data:', data); 

    const { fullName, jobTitle, workExperience, skills } = data;

    // Validate required fields
    if (!fullName || !jobTitle || !workExperience || !skills) {
        return NextResponse.json({ summary: "Please provide all required fields." }, { status: 400 });
    }

    // Generate the CV summary
    const summary = await generateCVSummary({ fullName, jobTitle, workExperience, skills });
    console.log('Generated Summary:', summary); 

    return NextResponse.json({ summary });
}

