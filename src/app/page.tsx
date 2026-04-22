'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Web3SignIn from '@/components/Web3SignIn';
import { 
  Zap, ArrowRight, ShieldCheck, Globe, Cpu, 
  ChevronRight, Play, ExternalLink, BarChart3, 
  Lock, Terminal as TerminalIcon, Smartphone, Mail
} from 'lucide-react';

export default function LandingPage() {
  const [lang, setLang] = useState<'EN' | 'ID'>('EN');
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = {
    EN: {
      hero: {
        badge: 'Institutional-Grade Blockchain Infrastructure',
        title: 'Decoding Future Markets with',
        titleAccent: 'Intelligence.',
        desc: 'Pioneering the intelligent nexus between deep liquidity and precision execution. We build the architecture for the next era of global finance.',
        btn1: 'Explore Suite',
        btn2: 'Institutional Access'
      },
      stats: [
        { label: 'Network Uptime', val: '99.99%' },
        { label: 'Settlement Speed', val: '< 2s' },
        { label: 'Security Protocols', val: 'AES-8192' }
      ],
      features: [
        { title: 'S50 Market Aggregator', desc: 'Consolidating global market depth into a single, high-throughput intelligent feed.' },
        { title: 'IntelliTrade v6-PRO', desc: 'The most advanced institutional OTC portal with on-chain settlement and audit reporting.' },
        { title: 'Quantum Guard', desc: 'Multi-layer security framework protecting assets with biometric and blockchain encryption.' }
      ]
    },
    ID: {
      hero: {
        badge: 'Infrastruktur Blockchain Kelas Institusi',
        title: 'Mendekode Pasar Masa Depan dengan',
        titleAccent: 'Kecerdasan.',
        desc: 'Mempelopori hubungan cerdas antara likuiditas mendalam dan eksekusi presisi. Kami membangun arsitektur untuk era baru keuangan global.',
        btn1: 'Jelajahi Suite',
        btn2: 'Akses Institusi'
      },
      stats: [
        { label: 'Waktu Aktif Jaringan', val: '99.99%' },
        { label: 'Kecepatan Settlement', val: '< 2d' },
        { label: 'Protokol Keamanan', val: 'AES-8192' }
      ],
      features: [
        { title: 'Agregator Pasar S50', desc: 'Mengonsolidasikan kedalaman pasar global ke dalam satu umpan cerdas berkapasitas tinggi.' },
        { title: 'IntelliTrade v6-PRO', desc: 'Portal OTC institusi tercanggih dengan penyelesaian on-chain dan laporan audit.' },
        { title: 'Quantum Guard', desc: 'Kerangka keamanan berlapis yang melindungi aset dengan enkripsi biometrik dan blockchain.' }
      ]
    }
  };

  const curr = t[lang];

  // Particle background logic
  useEffect(() => {
    const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let particles: any[] = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    const init = () => {
      particles = [];
      for(let i=0; i<100; i++) particles.push({
        x: Math.random()*canvas.width, y: Math.random()*canvas.height,
        v: Math.random()*0.5+0.2, s: Math.random()*2
      });
    };
    const anim = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
      particles.forEach(p => {
        p.y -= p.v; if(p.y < 0) p.y = canvas.height;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI*2); ctx.fill();
      });
      requestAnimationFrame(anim);
    };
    resize(); init(); anim();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="min-h-screen bg-[#020204] text-white selection:bg-blue-600/30 overflow-x-hidden font-sans">
      
      {/* Dynamic Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.1),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay"></div>
        <canvas id="hero-canvas" className="absolute inset-0 opacity-30"></canvas>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-black/80 backdrop-blur-2xl border-b border-white/5 py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4 group cursor-pointer">
            <img src="/logo.jpg" alt="Logo" className="w-10 h-10 object-contain rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform duration-500" />
            <span className="text-xl font-black tracking-tighter uppercase italic">
              BLACKINTELLI<span className="text-blue-500">SENSE</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
              <button onClick={() => setLang('EN')} className={`px-4 py-1.5 rounded-full text-[9px] font-black transition-all ${lang === 'EN' ? 'bg-white text-black shadow-xl' : 'text-white/40 hover:text-white'}`}>EN</button>
              <button onClick={() => setLang('ID')} className={`px-4 py-1.5 rounded-full text-[9px] font-black transition-all ${lang === 'ID' ? 'bg-white text-black shadow-xl' : 'text-white/40 hover:text-white'}`}>ID</button>
            </div>
            <a href="/intellitrade" className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 hover:text-blue-300 transition-colors">IntelliTrade v6</a>
            <Web3SignIn />
            <a href="#contact" className="bg-white text-black px-8 py-3 rounded-full font-black text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-2xl uppercase italic">Initiate Connection</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-64 pb-32 px-6 z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-600/5 border border-blue-500/20 mb-12 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-blue-400">{curr.hero.badge}</span>
          </div>
          
          <h1 className="text-[10vw] lg:text-[7vw] font-black uppercase italic leading-[0.9] tracking-tighter mb-12 animate-fade-in [animation-delay:200ms]">
            {curr.hero.title}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-400 to-blue-500">
              {curr.hero.titleAccent}
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg md:text-xl text-zinc-500 font-bold uppercase tracking-wider leading-relaxed mb-20 animate-fade-in [animation-delay:400ms]">
            {curr.hero.desc}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-fade-in [animation-delay:600ms]">
            <a href="#suite" className="group w-full md:w-auto bg-blue-600 text-white px-12 py-7 rounded-full font-black text-lg tracking-tighter hover:bg-white hover:text-black transition-all duration-500 shadow-[0_0_50px_rgba(37,99,235,0.3)] uppercase italic flex items-center justify-center gap-4">
              {curr.hero.btn1} <ChevronRight className="group-hover:translate-x-2 transition-transform" />
            </a>
            <a href="#contact" className="w-full md:w-auto border border-white/10 hover:border-white/30 text-white px-12 py-7 rounded-full font-black text-lg tracking-tighter transition-all duration-500 uppercase italic">
              {curr.hero.btn2}
            </a>
          </div>

          <div className="mt-40 grid grid-cols-2 md:grid-cols-3 gap-12 border-t border-white/5 pt-20 max-w-4xl mx-auto">
            {curr.stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4">{s.label}</p>
                <h4 className="text-4xl font-black italic tracking-tighter text-white">{s.val}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Suite Section */}
      <section id="suite" className="relative py-48 z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <div className="space-y-6">
              <span className="text-blue-500 font-black text-[10px] uppercase tracking-[1em]">Proprietary Suite</span>
              <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">Engineering<br />The Nexus.</h2>
            </div>
            <p className="max-w-md text-zinc-500 font-bold uppercase tracking-widest text-sm leading-relaxed text-right">
              Our ecosystem bridges the gap between traditional finance and the future of decentralized settlement.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {curr.features.map((f, i) => (
              <div key={i} className="group bg-[#08080a] border border-white/5 p-12 rounded-[3rem] hover:bg-blue-600 transition-all duration-700 hover:-translate-y-4">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-white group-hover:text-blue-600 transition-colors duration-500">
                  {i === 0 ? <Globe size={28}/> : i === 1 ? <BarChart3 size={28}/> : <ShieldCheck size={28}/>}
                </div>
                <h4 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-6 group-hover:text-white">{f.title}</h4>
                <p className="text-sm font-bold uppercase tracking-widest leading-relaxed text-zinc-500 group-hover:text-white/80">{f.desc}</p>
                <div className="mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-3 text-[10px] font-black text-white uppercase tracking-widest italic">
                  Learn More <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Terminal Preview Section */}
      <section className="relative py-48 z-10">
        <div className="max-w-7xl mx-auto px-6">
           <div className="bg-gradient-to-br from-zinc-900 to-black rounded-[4rem] border border-white/10 p-4 md:p-12 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent"></div>
              <div className="flex flex-col lg:flex-row gap-16 items-center">
                 <div className="flex-1 space-y-10">
                    <div className="flex items-center gap-4">
                       <TerminalIcon size={24} className="text-blue-500" />
                       <span className="text-[10px] font-black uppercase tracking-[0.8em] text-zinc-500">System Interface</span>
                    </div>
                    <h3 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-tight text-white">Advanced<br />Auditability.</h3>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                       Real-time blockchain explorer integration and automated institutional reporting. Every trade ticket is a verified immutable record.
                    </p>
                    <a href="/intellitrade" className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full font-black text-sm uppercase italic tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-500">
                       Launch Terminal <Play size={14} />
                    </a>
                 </div>
                 <div className="flex-1 w-full">
                    <div className="bg-black/50 border border-white/5 rounded-[2.5rem] p-4 aspect-video relative group overflow-hidden shadow-2xl">
                       <div className="absolute inset-0 bg-blue-600/10 blur-[100px] group-hover:bg-blue-600/20 transition-all"></div>
                       <video 
                         autoPlay 
                         loop 
                         muted 
                         playsInline
                         className="w-full h-full object-cover rounded-[2rem] opacity-50 group-hover:scale-105 transition-transform duration-1000"
                       >
                         <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-blockchain-technology-network-31742-large.mp4" type="video/mp4" />
                       </video>
                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl">
                             <Activity size={32} className="animate-pulse" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-48 z-10 px-6 text-center">
         <div className="max-w-4xl mx-auto space-y-16">
            <div className="space-y-6">
               <span className="text-blue-500 font-black text-[10px] uppercase tracking-[1em]">Global Onboarding</span>
               <h2 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-none text-white">Connect.<br />Scale.</h2>
            </div>
            
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
               <input type="text" placeholder="CORPORATE_ENTITY" className="w-full bg-white/5 border border-white/10 rounded-full px-10 py-6 font-black tracking-widest text-xs uppercase focus:outline-none focus:border-blue-600 transition-all text-white placeholder:text-zinc-700" />
               <input type="email" placeholder="INSTITUTIONAL_EMAIL" className="w-full bg-white/5 border border-white/10 rounded-full px-10 py-6 font-black tracking-widest text-xs uppercase focus:outline-none focus:border-blue-600 transition-all text-white placeholder:text-zinc-700" />
               <textarea rows={3} placeholder="HOW_CAN_WE_ENABLE_YOUR_BUSINESS?" className="md:col-span-2 w-full bg-white/5 border border-white/10 rounded-[3rem] px-10 py-8 font-black tracking-widest text-xs uppercase focus:outline-none focus:border-blue-600 transition-all text-white placeholder:text-zinc-700"></textarea>
               <button className="md:col-span-2 w-full bg-white text-black py-10 rounded-full font-black text-4xl tracking-tighter hover:bg-blue-600 hover:text-white transition-all duration-700 uppercase italic shadow-2xl">Initiate Protocol</button>
            </form>

            <div className="flex flex-wrap justify-center gap-12 opacity-30 pt-20">
               <div className="flex items-center gap-3"><Smartphone size={14}/> Mobile Optimised</div>
               <div className="flex items-center gap-3"><Lock size={14}/> Secure Encrypted</div>
               <div className="flex items-center gap-3"><Mail size={14}/> Priority Support</div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 z-10 relative px-6 border-t border-white/5">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-zinc-900 border border-white/10 rounded-lg">
                <Cpu size={24} className="text-zinc-500" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic text-zinc-500">BLACKINTELLISENSE</span>
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.8em] text-zinc-700">© 2024 Institutional FinTech Infrastructure</p>
            <div className="flex items-center gap-8">
               <a href="#" className="text-zinc-600 hover:text-white transition-colors"><ExternalLink size={18}/></a>
               <a href="#" className="text-zinc-600 hover:text-white transition-colors font-black text-[10px] tracking-widest uppercase italic underline">Privacy_Policy</a>
            </div>
         </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        
        body {
          background-color: #020204;
          font-family: 'Inter', sans-serif;
          color-scheme: dark;
        }

        @keyframes fade-in { 
          from { opacity: 0; transform: translateY(30px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in { animation: fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1a1a1a; }
      `}</style>
    </div>
  );
}
