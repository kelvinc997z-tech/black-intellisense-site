"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, ShieldCheck, Cpu, ArrowRight, Ghost, Eye, Terminal, Activity, Lock, Globe, ZapOff, BarChart3, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BlackIntellisenseLanding() {
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const html = document.documentElement;
    html.classList.add('dark');
    
    const interval = setInterval(() => {
      const newLine = `[${new Date().toLocaleTimeString()}] AUTH_LINK: 0x${Math.random().toString(16).slice(2, 10).toUpperCase()} >> SIG_CONFIRM: ${Math.floor(Math.random() * 100)}%`;
      setTerminalLines(prev => [...prev.slice(-15), newLine]);
    }, 1500);

    return () => {
      html.classList.remove('dark');
      clearInterval(interval);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 selection:bg-emerald-500/30 overflow-x-hidden font-mono tracking-tight">
      {/* Immersive Noir Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(16,185,129,0.05),transparent_60%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.05] bg-black/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-emerald-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-full h-full bg-white text-black flex items-center justify-center font-black text-xl clip-path-polygon">
                B
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-[0.4em] uppercase">BlackIntellisense</span>
              <span className="text-[8px] text-emerald-500 font-bold tracking-[0.2em] uppercase">Protocol v4.2.0</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-8">
            <Link href="/login" className="hidden md:block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 hover:text-white transition-colors">
              [ TERMINAL_AUTH ]
            </Link>
            <Link href="/vault-control-panel" className="hidden md:block text-[10px] font-bold tracking-[0.2em] uppercase text-red-500 hover:text-red-400 transition-colors">
              [ VAULT_COMMAND ]
            </Link>
            <Link href="/signup" className="relative group px-6 py-2 overflow-hidden border border-white/10 hover:border-emerald-500/50 transition-colors">
              <div className="absolute inset-0 bg-emerald-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative text-[10px] font-black uppercase tracking-[0.2em]">Initialize</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-48 pb-32 text-center md:text-left">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-3/5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-3 px-3 py-1 bg-zinc-900 border border-white/5 text-emerald-500 text-[9px] font-black uppercase tracking-[0.3em] mb-10">
                  <Activity className="w-3 h-3 animate-pulse" />
                  Satellite Grid Linked
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] uppercase italic">
                  Trade The <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-400 to-zinc-800 text-glow">Unseen Alpha.</span>
                </h1>
                
                <p className="text-xl text-zinc-500 mb-12 max-w-xl leading-relaxed font-medium">
                  Operating in the blind spots of standard retail tools. We scan the neural outputs of institutional dark pools to find accumulation before the first candle forms.
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Link href="/intellitrade" className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest transition-all hover:bg-emerald-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center gap-3 group">
                    Enter Terminal
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="px-10 py-5 bg-zinc-900 border border-white/5 hover:border-white/20 text-white font-black uppercase tracking-widest transition-all">
                    System Specs
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="lg:w-2/5 w-full">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative aspect-square bg-[#050505] border border-white/[0.05] p-6 shadow-2xl glass-reflection"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1),transparent_70%)]" />
                <div className="relative h-full flex flex-col justify-between overflow-hidden">
                  <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Neural_Scanner_v4.2</span>
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-900/50" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                  
                  <div className="flex-1 py-4 font-mono text-[9px] leading-relaxed text-zinc-600">
                    <AnimatePresence>
                      {terminalLines.map((line, i) => (
                        <motion.div
                          key={`${i}-${line}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="whitespace-nowrap"
                        >
                          <span className="text-emerald-500/40 mr-2">&gt;</span> {line}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[8px] font-bold text-zinc-500">
                    <span>ST-SEC_OVERRIDE: [ON]</span>
                    <span className="animate-pulse">SYSTEM_STABLE_100%</span>
                  </div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Ghost className="w-32 h-32 text-emerald-500/10 animate-pulse blur-sm" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Dynamic Stats */}
        <section className="border-y border-white/[0.05] bg-zinc-950/50 py-20 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { icon: <Globe className="w-5 h-5" />, label: "Nodes Connected", val: "128" },
                { icon: <ZapOff className="w-5 h-5" />, label: "Latency (ms)", val: "< 0.4" },
                { icon: <Database className="w-5 h-5" />, label: "Data Processed", val: "4.2 PB" },
                { icon: <Lock className="w-5 h-5" />, label: "Security Layer", val: "Tier-5" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="text-emerald-500 mb-2">{item.icon}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">{item.label}</div>
                  <div className="text-2xl font-black text-white">{item.val}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="container mx-auto px-6 py-40">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Dark Pool Intel",
                desc: "Identify institutional footprint in private dark pools before they hit the public tape.",
                icon: <Eye className="w-10 h-10" />
              },
              {
                title: "Neural Backtesting",
                desc: "Stress-test strategies against a decade of proprietary neural-flow data with zero curve fitting.",
                icon: <BarChart3 className="w-10 h-10" />
              },
              {
                title: "Zero-Knowledge API",
                desc: "Execute orders via an encrypted tunnel. No metadata leaks. No broker front-running.",
                icon: <Terminal className="w-10 h-10" />
              }
            ].map((feature, i) => (
              <div key={i} className="p-10 bg-[#050505] border border-white/[0.03] hover:border-emerald-500/30 transition-all group rounded-sm">
                <div className="text-emerald-500 mb-8 transform group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">{feature.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 bg-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black text-xs clip-path-polygon">B</div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em]">BlackIntellisense © 2026</span>
          </div>
          <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">
             <Link href="#" className="hover:text-emerald-500 transition-colors">P_Protocol</Link>
             <Link href="#" className="hover:text-emerald-500 transition-colors">E_Network</Link>
             <Link href="#" className="hover:text-emerald-500 transition-colors">S_Audit</Link>
          </div>
          <div className="text-[8px] text-zinc-800 font-mono tracking-widest uppercase">
            // END_OF_LINE // SYSTEM_STABLE // NO_LEAKS
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .clip-path-polygon {
          clip-path: polygon(20% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%, 0% 20%);
        }
        .text-glow {
          text-shadow: 0 0 30px rgba(16, 185, 129, 0.2);
        }
        .glass-reflection::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
