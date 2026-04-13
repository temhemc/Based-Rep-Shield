'use client';

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield, CheckCircle2, AlertCircle, Trophy, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cüzdan bağlandığında rastgele bir "Reputation Score" simüle edelim
  // Gerçek projende burayı onchain verilere bağlayabiliriz
  useEffect(() => {
    if (isConnected && address) {
      setLoading(true);
      const timer = setTimeout(() => {
        setScore(85); // Örnek puan: 85
        setLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setScore(null);
    }
  }, [isConnected, address]);

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
            <div className="bg-white/10 p-4 rounded-full relative">
              <Shield className="w-16 h-16 text-white drop-shadow-lg" />
              {isConnected && score && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-[10px] px-2 py-1 rounded-full font-bold border-2 border-[#0052FF]">
                  ACTIVE
                </div>
              )}
            </div>
          </div>
          
          <h1 className="text-4xl font-black mb-4 tracking-tighter italic text-white">
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
              {loading ? (
                <div className="flex items-center justify-center gap-2 text-white/50 animate-pulse">
                  <Activity className="animate-spin" size={20} />
                  <span>Scanning Base activities...</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                      <div className="text-white/40 text-[10px] uppercase font-bold mb-1">Reputation Score</div>
                      <div className="text-3xl font-black text-green-400 flex items-center justify-center gap-2">
                        <Trophy size={24} />
                        {score}
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-center">
                      <div className="text-white/40 text-[10px] uppercase font-bold mb-1">Status</div>
                      <div className="text-sm font-bold text-green-100 flex items-center justify-center gap-1">
                        <CheckCircle2 size={14} /> Verified
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-white/30 bg-black/20 p-3 rounded-xl break-all font-mono">
                    {address}
                  </div>
                </>
              )}

              {chain?.id !== 8453 && !loading && (
                <p className="text-orange-300 text-xs font-bold flex items-center justify-center gap-2 bg-orange-500/10 p-2 rounded-lg">
                  <AlertCircle size={14} />
                  Please switch to Base Mainnet
                </p>
              )}
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
              <p className="text-sm text-white/40 leading-relaxed italic">
                Connect your wallet to scan your Base builder activity and secure your reputation shield.
              </p>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-white/10 text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">
            Built on Base • BasedRep v1.0
          </div>
        </div>
      </main>
    </>
  );
}
