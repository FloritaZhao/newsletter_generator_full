
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Newsletter Generator',
  description: 'Generate newsletters from your sources'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-white shadow">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <h1 className="text-xl font-bold">Newsletter Generator</h1>
            <nav className="mt-2 space-x-4">
              <a href="/" className="text-blue-600 hover:underline">Home</a>
              <a href="/sources" className="text-blue-600 hover:underline">Sources</a>
              <a href="/articles" className="text-blue-600 hover:underline">Articles</a>
              <a href="/newsletters" className="text-blue-600 hover:underline">Newsletters</a>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
