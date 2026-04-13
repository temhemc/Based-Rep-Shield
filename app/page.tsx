'use client';

import { useAccount, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield, CheckCircle2, Trophy, Activity, Star, Coins, Zap, Layers, Image as ImageIcon, Rocket } from 'lucide-react';
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
      if (isConnected && address) {
        setLoading(true);
        const isUserMaster = address.toLowerCase() === MASTER_BUILDER.toLowerCase();

        try {
          // BaseScan API sorgusu
          const res = await fetch(`https://api.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc`);
          const data = await res.json();
          
          if (data.status === "1" && Array.isArray(data.result)) {
            const txs = data.result;
            const txCount = txs.length;
            const deploys = txs.filter((tx: any) => tx.to === "" || tx.contractAddress !== "").length;
            const nfts = txs.filter((tx: any) => tx.functionName?.toLowerCase().includes('mint')).length;

            if (isUserMaster) {
              // Mehmet Çelik için özel Master istatistikleri
              setStats({
                score: 99,
                txCount: Math.max(txCount, 1850),
                contractDeploys: Math.max(deploys, 15),
                nftTxs: Math.max(nfts, 120),
                tokensCreated: 5,
                isMaster: true
              });
            } else {
              // Diğer kullanıcılar için gerçek veri
              let calculatedScore = Math.min((txCount * 0.4) + (deploys * 12) + (nfts * 3), 94);
              setStats({
                score: Math.round(calculatedScore),
                txCount,
                contractDeploys: deploys,
                nftTxs: nfts,
                tokensCreated: Math.floor(deploys / 2),
                isMaster: false
              });
            }
          }
        } catch (e) {
          if (isUserMaster) setStats(s => ({ ...s, score: 99, isMaster: true }));
        } finally {
          setLoading(false);
        }
      }
    };
    analyzeWallet();
  }, [isConnected, address]);

  if (!mounted) return null;

  return (
    <>
      <main className="min-h-screen bg-[#0052FF] text-white flex flex-col items-center justify-center p-4 font-sans italic">
        <div className="bg-black/30 p-8 rounded-[3rem] border border-white/10 backdrop-blur-3xl max-w-2xl w-full shadow-2xl relative">
          
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full"></div>
              <Shield className="w-20 h-20 text-white relative z-10" />
              {stats.isMaster && (
                <div className="absolute -top-2 -right-4 bg-yellow-500 text-[10px] px-3 py-1 rounded-full font-black border-2 border-[#0052FF] animate-bounce z-20 not-italic">
                  MASTER
                </div>
              )}
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Based Rep Shield</h1>
          </div>

          <div className="flex justify-center mb-8">
            <ConnectButton showBalance={true} />
          </div>

          {isConnected ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {loading ? (
                <div className="py-20 flex flex-col items-center gap-4">
                  <Activity className="animate-spin text-white/50" size={48} />
                  <p className="text-white/40 font-bold animate-pulse text-xs uppercase">Scanning Base Blockchain...</p>
                </div>
              ) : (
                <>
                  <div className="bg-white/10 p-6 rounded-[2.5rem] border border-white/10 flex justify-between items-center relative overflow-hidden">
                    <div className="text-left z-10">
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Reputation Score</p>
                      <h2 className={`text-7xl font-black leading-none ${stats.isMaster ? 'text-yellow-400' : 'text-green-400'}`}>
                        {stats.score}%
                      </h2>
                    </div>
                    <Trophy size={64} className={`${stats.isMaster ? 'text-yellow-500/20' : 'text-green-500/20'} absolute right-6`} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <StatBox icon={<Zap size={18}/>} label="Total TXs" value={stats.txCount} color="text-blue-400" />
                    <StatBox icon={<Layers size={18}/>} label="Contracts" value={stats.contractDeploys} color="text-purple-400" />
                    <StatBox icon={<Rocket size={18}/>} label="Launched" value={`${stats.tokensCreated} Tokens`} color="text-orange-400" />
                    <StatBox icon={<ImageIcon size={18}/>} label="NFT Activity" value={stats.nftTxs} color="text-pink-400" />
                  </div>

                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/40">
                      <Coins size={16} />
                      <span className="text-[10px] font-black uppercase">ETH Balance</span>
                    </div>
                    <span className="font-black text-sm">{balance?.formatted.slice(0, 6)} {balance?.symbol}</span>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 p-12 rounded-[2.5rem] border-dashed text-center text-white/30 font-bold uppercase text-xs">
              Connect Wallet to Reveal Reputation
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/5 flex justify-between text-[9px] text-white/20 font-black uppercase tracking-[0.3em]">
            <span>Base Ecosystem</span>
            <span>V2.2.0</span>
          </div>
        </div>
      </main>
    </>
  );
}

function StatBox({ icon, label, value, color }: { icon: any, label: string, value: any, color: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-[1.5rem]">
      <div className={`mb-2 ${color}`}>{icon}</div>
      <p className="text-white/30 text-[9px] font-black uppercase mb-1">{label}</p>
      <p className="text-xl font-black text-white">{value}</p>
    </div>
  );
}
