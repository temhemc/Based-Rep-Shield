import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Base Reputation Shield',
  description: 'Verify your onchain legacy on Base',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}