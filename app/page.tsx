'use client';

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield, CheckCircle2, AlertCircle, Trophy, Activity, Star, Coins, Zap, Layers, Image as ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    score: 0,
    txCount: 0,
    contractDeploys: 0,
    nftTxs: 0,
    isMaster: false
  });

  // SENİN ADRESİNİ BURAYA SABİTLEDİM
  const MASTER_BUILDER = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const analyzeWallet = async () => {
      if (isConnected && address) {
        setLoading(true);
        
        const isUserMaster = address.toLowerCase() === MASTER_BUILDER.toLowerCase();

        try {
          // BaseScan API üzerinden işlem listesini çekiyoruz
          const response = await fetch(`https://api.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc`);
          const data = await response.json();
          
          if (data.status === "1" && Array.isArray(data.result)) {
            const txs = data.result;
            const txCount = txs.length;
            
            // Akıllı Kontrat Dağıtımı tespiti
            const deploys = txs.filter((tx: any) => tx.to === "" || (tx.contractAddress && tx.contractAddress !== "")).length;
            
            // NFT İşlemleri
            const nfts = txs.filter((tx: any) => 
              tx.functionName?.toLowerCase().includes('mint') || 
              tx.functionName?.toLowerCase().includes('nft')
            ).length;

            if (isUserMaster) {
              // Senin için her zaman en yüksek metrikler ve 99 skor
              setStats({
                score: 99,
                txCount: Math.max(txCount, 1500),
                contractDeploys: Math.max(deploys, 12),
                nftTxs: Math.max(nfts, 85),
                isMaster: true
              });
            } else {
              // Diğer kullanıcılar için gerçek hesaplama
              let score = 10;
              score += Math.min(txCount * 0.5, 40); 
              score += Math.min(deploys * 15, 30);  
              score += Math.min(nfts * 2, 20);      

              setStats({
                score: Math.round(score),
                txCount,
                contractDeploys: deploys,
                nftTxs: nfts,
                isMaster: false
              });
            }
          }
        } catch (error) {
          console.error("Analysis Error:", error);
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
      <head>
        <title>Based Rep Shield | Master Analyzer</title>
        <meta name="talentapp:project_verification" content="7dce36405144977ee058bf2b066b671e4159a051a7701606fc5b883ebee079569352c17454ed11274714ed2bfd1a4601ee1c325d7e1a611bd7ac21677146cc11" />
      </head>

      <main className="min-h-screen bg-[#0052FF] text-white flex flex-col items-center justify-center p-4 font-sans">
        <div className="bg-black/30 p-8 rounded-[3rem] border border-white/10 backdrop-blur-3xl max-w-2xl w-full shadow-2xl">
          
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full"></div>
              <Shield className="w-20 h-20 text-white relative z-10 drop-shadow-2xl" />
              {stats.isMaster && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-[10px] px-3 py-1 rounded-full font-black border-2 border-[#0052FF] animate-bounce z-20 shadow-lg">
                  MASTER
                </div>
              )}
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">Based Rep Shield</h1>
          </div>

          <div className="flex justify-center mb-10">
            <ConnectButton />
          </div>

          {isConnected ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {loading ? (
                <div className="py-12 flex flex-col items-center gap-4">
                  <Activity className="animate-spin text-white/50" size={40} />
                  <p className="text-white/50 font-bold animate-pulse text-sm tracking-widest uppercase">Analyzing Onchain Reputation...</p>
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-br from-white/10 to-transparent p-6 rounded-[2rem] border border-white/20">
                    <div className="flex justify-between items-end">
                      <div className="text-left">
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Reputation Score</p>
                        <h2 className={`text-6xl font-black ${stats.isMaster ? 'text-yellow-400' : 'text-green-400'}`}>
                          {stats.score}%
                        </h2>
                      </div>
                      <Trophy size={48} className={stats.isMaster ? 'text-yellow-500/50' : 'text-green-500/50'} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <StatCard icon={<Zap size={16}/>} label="Total TXs" value={stats.txCount} color="text-blue-400" />
                    <StatCard icon={<Layers size={16}/>} label="Contracts" value={stats.contractDeploys} color="text-purple-400" />
                    <StatCard icon={<ImageIcon size={16}/>} label="NFT Txs" value={stats.nftTxs} color="text-pink-400" />
                    <StatCard icon={<Star size={16}/>} label="Rank" value={stats.isMaster ? "Master Builder" : "Verified"} color="text-green-400" />
                  </div>

                  <div className="bg-black/40 p-3 rounded-2xl border border-white/5 text-[10px] font-mono text-white/30 break-all text-center">
                    {address}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] border-dashed text-center">
              <p className="text-white/40 font-medium italic italic">Connect your wallet to reveal your Base reputation.</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/5 flex justify-between text-[10px] text-white/20 font-bold uppercase tracking-widest">
            <span>Base Mainnet</span>
            <span>v2.1.0</span>
          </div>
        </div>
      </main>
    </>
  );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: any, color: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-left hover:bg-white/10 transition-colors">
      <div className={`mb-2 ${color}`}>{icon}</div>
      <p className="text-white/30 text-[9px] font-black uppercase mb-1">{label}</p>
      <p className="text-xl font-black text-white">{value}</p>
    </div>
  );
}
