import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/store/AuthContext';
import { ThemeProvider } from '@/store/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BHEMED - Educación farmacéutica y gestión de medicamentos',
  description: 'Aplicación segura, intuitiva y accesible para conocer tus medicamentos y organizar tus tratamientos.',
  keywords: ['medicamentos', 'farmacia', 'salud', 'tratamientos', 'recordatorios'],
  authors: [{ name: 'BHEMED' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} h-full`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}