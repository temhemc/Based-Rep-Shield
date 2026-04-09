import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Base Shield',
  projectId: 'YOUR_PROJECT_ID', // WalletConnect ID'n
  chains: [base], // Sadece base kalsın
  ssr: true,
});