'use client';

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const [mounted, setMounted] = useState(false);

  // Hydration hatasını önlemek için
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <head>
        <title>Based Rep Shield</title>
        <meta 
          name="talentapp:project_verification" 
          content="7dce36405144977ee058bf2b066b671e4159a051a7701606fc5b883ebee079569352c17454ed11274714ed2bfd1a4601ee1c325d7e1a611bd7ac21677146cc11" 
        />
      </head>

      <main className="min-h-screen bg-[#0052FF] text-white flex flex-col items-center justify-center p-6 font-sans select-none">
        <div className="bg-black/20 p-10 rounded-[40px] border border-white/10 backdrop-blur-2xl max-w-xl w-full text-center shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 p-4 rounded-full">
              <Shield className="w-16 h-16 text-white drop-shadow-lg" />
            </div>
          </div>
          
          <h1 className="text-4xl font-black mb-4 tracking-tighter italic">
            BASED REP SHIELD
          </h1>
          
          <p className="text-white/70 mb-8 text-lg font-medium">
            Verify your onchain reputation on Base.
          </p>

          <div className="flex justify-center mb-8">
            <ConnectButton />
          </div>

          {isConnected ? (
            <div className="space-y-4 animate-in fade-in zoom-in duration-500">
              <div className="bg-green-500/20 border border-green-500/50 p-4 rounded-2xl flex items-center justify-center gap-3">
                <CheckCircle2 className="text-green-400" />
                <span className="font-bold text-green-100">Wallet Verified</span>
              </div>
              <div className="text-sm text-white/50 bg-white/5 p-3 rounded-xl break-all">
                {address}
              </div>
              {chain?.id !== 8453 && (
                <p className="text-orange-300 text-sm font-bold flex items-center justify-center gap-2">
                  <AlertCircle size={16} />
                  Please switch to Base Mainnet
                </p>
              )}
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
              <p className="text-sm text-white/40 leading-relaxed">
                Connect your wallet to scan your Base builder activity and secure your reputation shield.
              </p>
            </div>
          ) }

          <div className="mt-10 pt-6 border-t border-white/10 text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">
            Built on Base • Powered by Rep Shield
          </div>
        </div>
      </main>
    </>
  );
}
