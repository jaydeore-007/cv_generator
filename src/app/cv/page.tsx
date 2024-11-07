"use client";

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { jsPDF } from 'jspdf';

const CVPage = () => {
    const searchParams = useSearchParams();
    const summary = searchParams.get('summary');  
    const router = useRouter();

    const handleBack = () => {
        router.push('/');  
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        doc.text("Generated CV Summary", 10, 10);
    
       
        const startY = 20;
        const margin = 10; 
        const pageWidth = doc.internal.pageSize.getWidth() - margin * 2; 
        const lines = doc.splitTextToSize(summary || "No summary available.", pageWidth);
        
        doc.text(lines, margin, startY);
        doc.save("cv_summary.pdf");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
                <h1 className="text-2xl font-semibold text-center text-blue-600 mb-4">Generated CV</h1>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Summary</h2>
                    <p className="text-gray-600 text-base">{summary}</p>
                </div>

                <button
                    onClick={downloadPDF}
                    className="mt-6 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300 w-full"
                >
                    Download PDF
                </button>

                <button
                    onClick={handleBack}
                    className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300 w-full"
                >
                    Back to Form
                </button>
            </div>
        </div>
    );
};

export default CVPage;