import '@/styles/globals.css';

export const metadata = {
    title: 'CV Generator',
    description: 'Generate a professional CV using OpenAI',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
