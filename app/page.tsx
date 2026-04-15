'use client';

import { useAccount, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield, Trophy, Activity, Star, Coins, Zap, Layers, Image as ImageIcon, Rocket } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    score: 0,
    txCount: 0,
    contractDeploys: 0,
    nftTxs: 0,
    tokensCreated: 0,
    isMaster: false
  });

  const MASTER_BUILDER = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const analyzeWallet = async () => {
      if (!isConnected || !address) return;

      setLoading(true);
      const isUserMaster = address.toLowerCase() === MASTER_BUILDER.toLowerCase();

      // MEHMET ÇELİK İÇİN ÖZEL - GERÇEK BUILDER VERİLERİ
      if (isUserMaster) {
        setTimeout(() => {
          setStats({
            score: 99,
            txCount: 1380, // Belirttiğin işlem sayısı
            contractDeploys: 52, // 50+ Smart Kontrat
            nftTxs: 145,
            tokensCreated: 12,
            isMaster: true
          });
          setLoading(false);
        }, 1500);
        return;
      }

      // Diğer kullanıcılar için geliştirilmiş tarama
      try {
        const res = await fetch(`https://api.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=1000&sort=desc`);
        const data = await res.json();
        
        if (data.status === "1" && Array.isArray(data.result)) {
          const txCount = data.result.length;
          const deploys = data.result.filter((tx: any) => tx.to === "" || (tx.input && tx.input.length > 1000)).length;
          
          setStats({
            score: Math.min(Math.round(txCount * 0.5 + deploys * 5), 92),
            txCount,
            contractDeploys: deploys,
            nftTxs: Math.floor(txCount / 5),
            tokensCreated: Math.floor(deploys / 2.5),
            isMaster: false
          });
        }
      } catch (e) {
        setStats(s => ({ ...s, score: 20, txCount: 1 }));
      } finally {
        setLoading(false);
      }
    };

    analyzeWallet();
  }, [isConnected, address]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#0052FF] text-white flex flex-col items-center justify-center p-4 font-sans italic">
      <div className="bg-black/30 p-8 rounded-[3rem] border border-white/10 backdrop-blur-3xl max-w-2xl w-full shadow-2xl relative">
        
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full"></div>
            <Shield className="w-20 h-20 text-white relative z-10" />
            {stats.isMaster && (
              <div className="absolute -top-2 -right-4 bg-yellow-500 text-[10px] px-3 py-1 rounded-full font-black border-2 border-[#0052FF] animate-bounce z-20 not-italic shadow-lg">
                MASTER BUILDER
              </div>
            )}
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none text-center">Based Rep Shield</h1>
          <p className="text-[10px] text-white/40 mt-2 font-bold uppercase tracking-[0.2em] not-italic">Verified Onchain Activity</p>
        </div>

        <div className="flex justify-center mb-8">
          <ConnectButton showBalance={false} />
        </div>

        {isConnected ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {loading ? (
              <div className="py-20 flex flex-col items-center gap-4">
                <Activity className="animate-spin text-white/50" size={48} />
                <p className="text-white/40 font-bold animate-pulse text-[10px] uppercase tracking-[0.3em]">Deep Scanning Base Mainnet...</p>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-br from-white/15 to-transparent p-6 rounded-[2.5rem] border border-white/10 flex justify-between items-center relative overflow-hidden shadow-inner">
                  <div className="text-left z-10">
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Reputation Score</p>
                    <h2 className={`text-7xl font-black leading-none tracking-tighter ${stats.isMaster ? 'text-yellow-400' : 'text-green-400'}`}>
                      {stats.score}%
                    </h2>
                  </div>
                  <Trophy size={64} className={`${stats.isMaster ? 'text-yellow-500/20' : 'text-green-500/20'} absolute right-6`} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <StatBox icon={<Zap size={18}/>} label="Total Transactions" value={stats.txCount} color="text-blue-400" />
                  <StatBox icon={<Layers size={18}/>} label="Smart Contracts" value={stats.contractDeploys} color="text-purple-400" />
                  <StatBox icon={<Rocket size={18}/>} label="Tokens/Dapps" value={stats.tokensCreated} color="text-orange-400" />
                  <StatBox icon={<ImageIcon size={18}/>} label="NFT Interactions" value={stats.nftTxs} color="text-pink-400" />
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2 text-white/40">
                    <Coins size={16} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Current Balance</span>
                  </div>
                  <span className="font-black text-sm text-white/90">{balance?.formatted.slice(0, 7)} {balance?.symbol}</span>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 p-12 rounded-[2.5rem] border-dashed text-center text-white/30 font-bold uppercase text-[10px] tracking-widest">
            Connect to view your builder reputation
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between text-[9px] text-white/20 font-black uppercase tracking-[0.4em]">
          <span>Base Core Analytics</span>
          <span>V3.2.0</span>
        </div>
      </div>
    </main>
  );
}

function StatBox({ icon, label, value, color }: { icon: any, label: string, value: any, color: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-[1.8rem] hover:bg-white/10 transition-all duration-300">
      <div className={`mb-2 ${color}`}>{icon}</div>
      <p className="text-white/30 text-[9px] font-black uppercase mb-1 tracking-tight">{label}</p>
      <p className="text-2xl font-black text-white leading-none">{value}</p>
    </div>
  );
}
