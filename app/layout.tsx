import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import ThemeInitializer from '@/app/components/ThemeInitializer';

export const metadata: Metadata = {
  title: {
    template: '%s | soapnotescribe',
    default: 'soapnotescribe',
  },
  description: 'Automatically draft SOAP notes.',
  metadataBase: new URL('https://soapnotescribe.com/'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${GeistSans.className} antialiased `}>
        <ThemeInitializer />
        {children}
      </body>
    </html>
  );
}
