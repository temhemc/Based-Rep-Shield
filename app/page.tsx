'use client';
import { useAccount, useDisconnect, useConnect, useSwitchChain } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useState, useEffect } from 'react';
import { base } from 'wagmi/chains';
import { createPublicClient, http, formatEther } from 'viem';

export default function Home() {
  const { address, isConnected, chainId } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  
  const [ethBalance, setEthBalance] = useState<string>("0.00");
  const [score, setScore] = useState<number>(85);
  const [isSyncing, setIsSyncing] = useState(false);

  // 1. GÜVENLİK HATTI: ASLA HATA VERMEYEN FORMATLAYICILAR
  const safeAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Disconnected";

  // 2. KESİN ÇÖZÜM: BAKİYEYİ DOĞRUDAN BASE RPC ÜZERİNDEN ÇEK
  const fetchAbsoluteBalance = async () => {
    if (!address) return;
    setIsSyncing(true);
    try {
      const client = createPublicClient({ 
        chain: base,
        transport: http() 
      });
      const balance = await client.getBalance({ address });
      const formatted = formatEther(balance);
      setEthBalance(parseFloat(formatted).toFixed(3));
      
      // 0.312 ETH varsa skoru %99 yap
      if (parseFloat(formatted) > 0) {
        setScore(99);
      }
    } catch (err) {
      console.error("Balance fetch error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchAbsoluteBalance();
    } else {
      setScore(85);
      setEthBalance("0.00");
    }
  }, [isConnected, address, chainId]);

  return (
    <main className="min-h-screen bg-[#0052FF] text-white flex flex-col items-center justify-center p-6 font-sans select-none">
      <div className="bg-black/20 p-10 rounded-[40px] border border-white/10 backdrop-blur-2xl max-w-xl w-full text-center shadow-2xl">
        <div className="text-6xl mb-4 drop-shadow-xl">🛡️</div>
        <h1 className="text-4xl font-black mb-6 italic tracking-tighter uppercase">Base Shield</h1>
        
        {isConnected && chainId !== base.id && (
          <button 
            onClick={() => switchChain({ chainId: base.id })}
            className="mb-6 bg-yellow-400 text-black px-6 py-2 rounded-full text-[10px] font-black animate-bounce border-2 border-black"
          >
            ⚠️ SWITCH TO BASE MAINNET
          </button>
        )}

        {!isConnected ? (
          <button 
            onClick={() => connect({ connector: injected() })}
            className="bg-white text-[#0052FF] px-12 py-4 rounded-full font-black text-lg hover:scale-105 transition-all shadow-xl"
          >
            VERIFY WALLET
          </button>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white/10 p-6 rounded-3xl border border-white/20 shadow-inner">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Builder Reputation:</span>
                <span className="text-3xl font-black text-green-400">%{score}</span>
              </div>
              <div className="w-full bg-black/30 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-green-400 h-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(74,222,128,0.5)]"
                  style={{ width: `${score}%` }}
                ></div>
              </div>
              
              <div className="mt-6 flex justify-between items-center text-[11px] font-mono">
                <div className="bg-black/40 px-3 py-2 rounded-xl border border-white/5">
                  <p className="opacity-40 text-[8px] uppercase">Balance</p>
                  <p className="font-bold">{isSyncing ? "..." : `${ethBalance} ETH`}</p>
                </div>
                <div className="bg-black/40 px-3 py-2 rounded-xl border border-white/5 text-right">
                  <p className="opacity-40 text-[8px] uppercase">Identity</p>
                  <p className="font-bold">{safeAddress}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.open(`https://warpcast.com/~/compose?text=My Base Score: %${score}! 🛡️`, '_blank')}
                className="bg-[#472a91] py-4 rounded-2xl font-black hover:brightness-110 transition-all shadow-lg active:scale-95"
              >
                Share on Farcaster
              </button>
              <button 
                onClick={fetchAbsoluteBalance}
                className="text-[10px] opacity-30 hover:opacity-100 underline uppercase tracking-[0.2em] py-2"
              >
                {isSyncing ? "Checking Blockchain..." : "Manual Sync"}
              </button>
            </div>
            
            <button onClick={() => disconnect()} className="text-[10px] opacity-10 hover:opacity-50 mt-4 uppercase font-bold">Disconnect</button>
          </div>
        )}
      </div>
      <p className="mt-8 text-[9px] opacity-20 uppercase tracking-[0.5em]">Verified Onchain Legacy • 2026</p>
    </main>
  );
}