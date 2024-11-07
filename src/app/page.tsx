"use client"; 
import Form from '@/components/form';
import SummaryDisplay from '@/components/summaryDisplay';
import { useState } from 'react';

export default function HomePage() {
    const [summary, setSummary] = useState<string | null>(null);

    const handleSummaryGenerated = (generatedSummary: string) => {
        setSummary(generatedSummary);
    };

    return (
        <main>
            <h1>CV Generator</h1>
            <Form onSummaryGenerated={handleSummaryGenerated} />
            {summary && <SummaryDisplay summary={summary} />}
        </main>
    );
}