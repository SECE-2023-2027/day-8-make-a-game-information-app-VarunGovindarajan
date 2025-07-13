import { Inter } from 'next/font/google';
import './globals.css';
import SearchBar from './components/SearchBar';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'IGDB Clone',
  description: 'A Next.js clone of the Internet Game Database',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <nav className="bg-gray-800 p-4 border-b border-gray-700">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-purple-400 hover:text-purple-300">
              GameDB
            </Link>
            <div className="w-1/2">
               <SearchBar />
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
