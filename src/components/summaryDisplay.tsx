interface SummaryDisplayProps {
    summary: string;
}

export default function SummaryDisplay({ summary }: SummaryDisplayProps) {
    return (
        <section>
            <h2>Generated CV Summary</h2>
            <p>{summary}</p>
        </section>
    );
}
