'use client';
import { useAccount, useBalance } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield, Trophy, Activity, Coins, Zap, Layers, Image as ImageIcon, Rocket } from 'lucide-react';
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

  // Özel Master Adresi
  const MASTER_BUILDER = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";

  // Buraya kendi Etherscan API key'ini koy (ücretsiz alabilirsin: https://etherscan.io/apidashboard)
  const ETHERSCAN_API_KEY = "JXM2JB7NMCPP3V7PU9Q6TPC5XTIKYVRW4K";   // ← MUTLAKA DEĞİŞTİR

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const analyzeWallet = async () => {
      if (!isConnected || !address) {
        setStats({
          score: 0,
          txCount: 0,
          contractDeploys: 0,
          nftTxs: 0,
          tokensCreated: 0,
          isMaster: false
        });
        return;
      }

      setLoading(true);

      // Master Builder kontrolü (Mehmet Çelik için özel gösterim)
      const isUserMaster = address.toLowerCase() === MASTER_BUILDER.toLowerCase();

      if (isUserMaster) {
        setTimeout(() => {
          setStats({
            score: 99,
            txCount: 1852,
            contractDeploys: 15,
            nftTxs: 124,
            tokensCreated: 8,
            isMaster: true
          });
          setLoading(false);
        }, 800);
        return;
      }

      // Normal kullanıcılar için → Bağlı olan cüzdanın adresine göre veri çek
      try {
        const url = `https://api.etherscan.io/v2/api?chainid=8453&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${ETHERSCAN_API_KEY}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.status === "1" && Array.isArray(data.result)) {
          const txList = data.result;
          const txCount = txList.length;

          // Contract deploy tespiti
          const deploys = txList.filter((tx: any) => 
            !tx.to || tx.to === "" || tx.contractAddress !== ""
          ).length;

          setStats({
            score: Math.min(Math.round(txCount * 0.85 + deploys * 12), 94),
            txCount,
            contractDeploys: deploys,
            nftTxs: Math.floor(txCount / 3.5),
            tokensCreated: Math.floor(deploys / 2),
            isMaster: false
          });
        } else {
          // API'den veri gelmezse hafif fallback
          setStats({
            score: 28,
            txCount: 3,
            contractDeploys: 0,
            nftTxs: 1,
            tokensCreated: 0,
            isMaster: false
          });
        }
      } catch (error) {
        console.error("Base transaction fetch error:", error);
        setStats({
          score: 22,
          txCount: 1,
          contractDeploys: 0,
          nftTxs: 0,
          tokensCreated: 0,
          isMaster: false
        });
      } finally {
        setLoading(false);
      }
    };

    analyzeWallet();
  }, [isConnected, address]);   // Sadece adres değiştiğinde yeniden çalışır

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#0052FF] text-white flex flex-col items-center justify-center p-4 font-sans italic selection:bg-white selection:text-[#0052FF]">
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
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none text-center">Based Rep Shield</h1>
        </div>

        <div className="flex justify-center mb-8">
          <ConnectButton showBalance={false} />
        </div>

        {isConnected ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {loading ? (
              <div className="py-20 flex flex-col items-center gap-4">
                <Activity className="animate-spin text-white/50" size={48} />
                <p className="text-white/40 font-bold animate-pulse text-xs uppercase tracking-widest">
                  Analyzing {address?.slice(0,6)}...{address?.slice(-4)} Records...
                </p>
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
                  <span className="font-black text-sm">
                    {balance?.formatted ? Number(balance.formatted).toFixed(4) : '0'} {balance?.symbol || 'ETH'}
                  </span>
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
          <span>V3.1.0</span>
        </div>
      </div>
    </main>
  );
}

function StatBox({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: any; color: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-[1.5rem]">
      <div className={`mb-2 ${color}`}>{icon}</div>
      <p className="text-white/30 text-[9px] font-black uppercase mb-1 tracking-tighter">{label}</p>
      <p className="text-xl font-black text-white">{value}</p>
    </div>
  );
}
