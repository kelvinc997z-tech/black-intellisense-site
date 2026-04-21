'use client';

import React, { useState, useEffect } from 'react';

export default function LandingPage() {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const missionImages = [
    { src: '/mission-2.jpg', title: 'PRICE AGGREGATION', desc: 'Real-time multi-exchange price feeds.' },
    { src: '/mission-3.jpg', title: 'ORDER MANAGEMENT', desc: 'Institutional order lifecycle tracking.' },
    { src: '/mission-4.jpg', title: 'SENSE 50 ANALYTICS', desc: 'Advanced liquidity analytics engine.' },
    { src: '/intellitrade-preview.jpg', title: 'OTC PORTAL', desc: 'Secure high-volume trade execution.' },
  ];

  const pillars = [
    { id: '01', title: 'Infrastructure First', desc: 'We enable your business, we don’t compete with it. No conflicts of interest.', sub: 'Non-Brokerage Model' },
    { id: '02', title: 'Automation / Control', desc: 'Automate the routine, elevate the human. Preservation of dealer judgment.', sub: 'Human-in-the-Loop' },
    { id: '03', title: 'Accuracy Over Speed', desc: 'Fast is good, right is essential. Precision execution in all market conditions.', sub: 'Reliability First' },
    { id: '04', title: 'Modular Scalability', desc: 'Grow your business, not your burden. Modular design for zero complexity.', sub: 'No Rip-and-Replace' },
  ];

  useEffect(() => {
    const canvas = document.getElementById('network-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    const particleCount = 70;
    const connectionDistance = 180;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 1.5 + 0.5,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - dist / connectionDistance)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize(); animate();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="min-h-screen bg-[#020205] text-white selection:bg-blue-500/30 font-sans tracking-tight overflow-x-hidden">
      {/* Lightbox */}
      {activeImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-4 animate-in fade-in duration-300" onClick={() => setActiveImage(null)}>
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-all scale-100 hover:scale-110 z-10">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <img src={activeImage} className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-[0_0_100px_rgba(59,130,246,0.2)] animate-in zoom-in-95 duration-500 border border-white/10" alt="Interface View" />
        </div>
      )}

      {/* Background Layer */}
      <div className="fixed inset-0 z-0 bg-black pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(29,78,216,0.2),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 mix-blend-overlay"></div>
        <canvas id="network-canvas" className="absolute inset-0 opacity-50"></canvas>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-black/60 backdrop-blur-2xl border-white/5 py-4' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-0 group-hover:opacity-40 transition-opacity"></div>
                <img src="/logo.jpg" alt="Logo" className="relative w-12 h-12 object-contain rounded-xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-[10deg]" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black tracking-[0.05em] italic uppercase">BLACK<span className="text-blue-500 ml-1">INTELLI</span></span>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-12 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
              {['challenge', 'products', 'philosophy'].map((item) => (
                <a key={item} href={`#${item}`} className="hover:text-white transition-colors relative group py-2">
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-500"></span>
                </a>
              ))}
              <a href="#contact" className="bg-white text-black px-10 py-3.5 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-2xl font-black italic tracking-widest text-[11px]">CONNECT</a>
            </div>

            <button className="lg:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <div className="w-8 h-5 flex flex-col justify-between">
                <span className={`h-1 w-full bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`h-1 w-full bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`h-1 w-full bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        <div className={`lg:hidden fixed inset-x-0 top-0 h-screen bg-black/98 backdrop-blur-3xl transition-all duration-700 flex flex-col justify-center items-center gap-12 z-[-1] ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
            {['challenge', 'products', 'philosophy'].map((item) => (
              <a key={item} href={`#${item}`} onClick={() => setMobileMenuOpen(false)} className="text-3xl font-black uppercase tracking-[0.5em] text-white/50 hover:text-blue-500 transition-colors italic">{item}</a>
            ))}
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="bg-blue-600 text-white px-16 py-6 rounded-full font-black italic tracking-[0.2em] text-xl">CONNECT</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 z-10 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-blue-400 text-[11px] font-black tracking-[0.4em] uppercase mb-12 animate-in fade-in slide-in-from-top-8 duration-1000 shadow-[0_0_40px_rgba(59,130,246,0.1)] backdrop-blur-xl">
            <span className="flex h-2.5 w-2.5 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span></span>
            The Single Intelligent Layer for Global Markets
          </div>
          <h1 className="text-6xl md:text-[9rem] font-black tracking-[-0.04em] text-white mb-10 leading-[0.85] uppercase italic drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <span className="block animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-100 fill-mode-both">Modern</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-500 to-blue-900 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">Infrastructure</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-2xl text-white/40 mb-16 font-medium leading-relaxed tracking-tight animate-in fade-in duration-1000 delay-500 fill-mode-both px-4">
            Transforming institutional <span className="text-white">liquidity discovery</span>, <span className="text-white">execution</span>, and <span className="text-white">settlement</span> through high-performance modular technology.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700 fill-mode-both">
            <a href="#products" className="group relative px-16 py-7 bg-white text-black rounded-full font-black text-xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]">
              <span className="relative z-10 italic">EXPLORE SUITE</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
            <a href="#contact" className="group px-16 py-7 bg-transparent border-2 border-white/10 rounded-full font-black text-xl hover:bg-white/5 hover:border-white transition-all duration-500 flex items-center justify-center gap-4">
              DEMO REQUEST
              <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>
          </div>
        </div>
      </section>

      {/* Chapter 01: The Challenge */}
      <section id="challenge" className="relative py-48 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-blue-500 font-black text-[11px] tracking-[0.6em] uppercase mb-8 italic">Chapter 01 // The Problem</h2>
              <h3 className="text-5xl md:text-7xl font-black text-white mb-12 tracking-tighter leading-[0.95] uppercase">Institutional <br /> Fragmentation</h3>
              <p className="text-xl md:text-2xl text-white/40 mb-16 font-bold leading-relaxed italic border-l-4 border-blue-600 pl-8">
                "Liquidity sources are scattered, systems operate in silos, and settlement workflows remain manual and error-prone."
              </p>
              <div className="space-y-12">
                {[
                  { t: 'Disconnected Systems', d: 'Global venues lack a unified intelligent discovery layer.' },
                  { t: 'Execution Silos', d: 'Isolated technology preventing end-to-end trade visibility.' },
                  { t: 'Operational Risk', d: 'Manual settlement dependencies creating critical failure points.' }
                ].map((item) => (
                  <div key={item.t} className="flex gap-8 group">
                    <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 group-hover:bg-blue-600 transition-all duration-500 group-hover:scale-110 shadow-2xl">
                       <span className="text-blue-500 group-hover:text-white font-black text-2xl italic">!</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="text-white font-black uppercase text-xl tracking-tighter mb-2 italic">{item.t}</h5>
                      <p className="text-white/30 text-sm md:text-base font-medium leading-relaxed uppercase tracking-wider">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 relative aspect-square group">
               <div className="absolute inset-0 bg-blue-600/10 blur-[150px] rounded-full animate-pulse group-hover:bg-blue-600/20 transition-all duration-1000"></div>
               <div className="relative h-full w-full border border-white/5 rounded-[5rem] p-16 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-3xl flex flex-col justify-center items-center text-center shadow-[0_0_100px_rgba(0,0,0,0.8)] border-t-white/10 border-l-white/10 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
                  <div className="text-blue-500 font-black text-8xl md:text-[12rem] italic tracking-tighter leading-none mb-6 drop-shadow-[0_0_60px_rgba(59,130,246,0.5)] scale-100 group-hover:scale-110 transition-transform duration-700">84%</div>
                  <h6 className="text-white font-black uppercase tracking-[0.4em] text-[11px] mb-12">Target Risk Reduction</h6>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <p className="mt-12 text-white/30 text-xs md:text-sm font-black uppercase tracking-[0.2em] max-w-xs leading-loose">By Unifying discovery, execution, and settlement.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 02: Product Ecosystem */}
      <section id="products" className="relative py-48 z-10 bg-[#05050a]/80 backdrop-blur-3xl border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-blue-500 font-black text-[11px] tracking-[0.6em] uppercase mb-8 italic">Chapter 02 // The Solution</h2>
          <h3 className="text-6xl md:text-[10rem] font-black text-white leading-[0.8] tracking-tighter uppercase mb-32">Proprietary <br /> Suite</h3>
          
          <div className="grid lg:grid-cols-2 gap-16 text-left">
            {/* Sense 50 */}
            <div className="group relative bg-gradient-to-b from-blue-900/20 to-black border border-white/10 rounded-[4rem] p-1 shadow-2xl transition-all duration-700 hover:scale-[1.02] hover:border-blue-500/40">
              <div className="bg-[#020205]/90 backdrop-blur-3xl rounded-[3.9rem] p-12 md:p-20 h-full flex flex-col border border-white/5 shadow-[inset_0_0_80px_rgba(59,130,246,0.05)]">
                <div className="flex justify-between items-start mb-20">
                  <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.5)] rotate-3 group-hover:rotate-0 transition-all duration-1000">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <div className="text-white/5 font-black text-8xl md:text-[12rem] leading-none select-none uppercase -translate-y-8">50</div>
                </div>
                <h4 className="text-5xl font-black text-white mb-8 uppercase italic tracking-tighter group-hover:text-blue-400 transition-colors">Sense 50 <span className="text-blue-500 block text-[11px] tracking-[0.5em] font-black not-italic mt-4 opacity-60 uppercase">High-Performance Bridge</span></h4>
                <p className="text-2xl text-white/40 mb-16 leading-relaxed font-bold tracking-tight italic">Aggregating depth from global venues into a single intelligent stream with sub-millisecond routing.</p>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-10 mb-20 border-t border-white/5 pt-16">
                  {['Sub-ms Aggregation', 'Rules-Based Routing', 'API-First Design', 'Multi-Venue Discovery'].map(f => (
                    <div key={f} className="border-l-2 border-blue-600 pl-6 group/feat">
                      <div className="text-white font-black text-[10px] uppercase tracking-[0.3em] group-hover/feat:text-blue-400 transition-colors">{f}</div>
                    </div>
                  ))}
                </div>
                
                <div className="relative mt-auto cursor-zoom-in group/img overflow-hidden rounded-3xl" onClick={() => setActiveImage('/sense50-preview.jpg')}>
                  <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover/img:opacity-100 transition-opacity z-10 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white font-black tracking-widest text-xs border border-white/20 px-6 py-2 rounded-full uppercase">Inspect Interface</span>
                  </div>
                  <img src="/sense50-preview.jpg" alt="Sense 50" className="w-full grayscale group-hover/img:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                </div>
              </div>
            </div>

            {/* IntelliTrade */}
            <div className="group relative bg-gradient-to-b from-white/10 to-black border border-white/10 rounded-[4rem] p-1 shadow-2xl transition-all duration-700 hover:scale-[1.02] hover:border-white/20">
              <div className="bg-[#020205]/90 backdrop-blur-3xl rounded-[3.9rem] p-12 md:p-20 h-full flex flex-col border border-white/5 shadow-[inset_0_0_80px_rgba(255,255,255,0.02)]">
                <div className="flex justify-between items-start mb-20">
                  <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)] -rotate-3 group-hover:rotate-0 transition-all duration-1000">
                    <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                  </div>
                  <div className="text-white/5 font-black text-8xl md:text-[12rem] leading-none select-none uppercase italic -translate-y-8">Trade</div>
                </div>
                <h4 className="text-5xl font-black text-white mb-8 uppercase italic tracking-tighter group-hover:text-blue-400 transition-colors">IntelliTrade <span className="text-white block text-[11px] tracking-[0.5em] font-black not-italic mt-4 opacity-60 uppercase">Professional OTC Portal</span></h4>
                <p className="text-2xl text-white/40 mb-16 leading-relaxed font-bold tracking-tight italic">Secure, high-volume environment for institutional clients with dealer-controlled markup workflows.</p>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-10 mb-20 border-t border-white/5 pt-16">
                  {['Dealer Markup Control', 'Professional UX/UI', 'Real-time Reporting', 'Audit-Ready History'].map(f => (
                    <div key={f} className="border-l-2 border-white/20 pl-6 group/feat">
                      <div className="text-white font-black text-[10px] uppercase tracking-[0.3em] group-hover/feat:text-blue-400 transition-colors">{f}</div>
                    </div>
                  ))}
                </div>
                
                <div className="relative mt-auto cursor-zoom-in group/img overflow-hidden rounded-3xl" onClick={() => setActiveImage('/intellitrade-preview.jpg')}>
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/img:opacity-100 transition-opacity z-10 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white font-black tracking-widest text-xs border border-white/20 px-6 py-2 rounded-full uppercase">Inspect Interface</span>
                  </div>
                  <img src="/intellitrade-preview.jpg" alt="IntelliTrade" className="w-full grayscale group-hover/img:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-24 px-6 py-4 bg-white/5 border border-white/10 rounded-full inline-block">
            <p className="text-white/30 font-black uppercase tracking-[0.6em] text-[9px] md:text-[10px]">Currently Active: Crypto Assets (Spot) • Roadmap: FX, Derivates & Structured Products</p>
          </div>
        </div>
      </section>

      {/* Chapter 03: The 4 Pillars */}
      <section id="philosophy" className="relative py-48 z-10 bg-white text-black rounded-[5rem] mx-4 md:mx-12 shadow-[0_-50px_100px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-40">
            <h2 className="text-blue-600 font-black text-[11px] tracking-[0.6em] uppercase mb-8 italic">Chapter 03 // Core Values</h2>
            <h3 className="text-6xl md:text-9xl font-black text-black leading-[0.8] tracking-tighter uppercase italic">The 4 <br /> Pillars</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {pillars.map(p => (
              <div key={p.id} className="group border-t-4 border-black/10 pt-12 transition-all hover:border-blue-600">
                <div className="text-blue-600 font-black text-[4rem] mb-10 italic tracking-tighter leading-none group-hover:translate-x-2 transition-transform duration-500">{p.id}</div>
                <h5 className="text-2xl font-black uppercase mb-6 tracking-tighter leading-none italic">{p.title}</h5>
                <p className="text-base font-bold text-black/40 mb-8 leading-relaxed uppercase tracking-wide">{p.desc}</p>
                <div className="inline-block px-4 py-1.5 bg-black/5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-black/60 italic border border-black/5">{p.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Vision Grid */}
      <section id="vision" className="relative py-48 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-32 items-center">
            <div className="lg:w-[45%] text-left">
              <h2 className="text-blue-500 font-black text-[11px] tracking-[0.6em] uppercase mb-10 italic">Strategic Vision // Scaling Global</h2>
              <h3 className="text-6xl md:text-8xl font-black mb-12 leading-[0.85] tracking-tight uppercase italic">The Nervous <br /> System</h3>
              <p className="text-2xl md:text-3xl text-white/40 mb-20 leading-tight font-bold tracking-tight italic border-l-4 border-white/10 pl-8">"Building the intelligence between liquidity and global markets through a single modular source of truth."</p>
              <a href="/Black_IntelliSense_Deck.pdf" download="Black_IntelliSense_Deck.pdf" className="group bg-blue-600 text-white px-16 py-8 rounded-full font-black text-2xl hover:bg-white hover:text-black transition-all duration-700 flex items-center justify-between shadow-2xl uppercase italic tracking-tighter w-full max-w-sm">
                <span>GET THE DECK</span>
                <div className="bg-black/10 rounded-full p-2 group-hover:translate-y-2 transition-transform">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7-7-7m12-8l-7 7-7-7"></path></svg>
                </div>
              </a>
            </div>
            <div className="lg:w-[55%] grid grid-cols-2 gap-6 md:gap-10">
              <div className="space-y-6 md:space-y-10">
                {missionImages.slice(0, 2).map((img, i) => (
                  <div key={img.src} className={`relative rounded-[3rem] overflow-hidden shadow-2xl group cursor-zoom-in border border-white/5 ${i === 0 ? 'aspect-[4/5]' : 'aspect-square'}`} onClick={() => setActiveImage(img.src)}>
                    <img src={img.src} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale-0 hover:brightness-110" alt="Interface" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-10 backdrop-blur-[2px]">
                      <h6 className="text-white font-black text-2xl italic mb-3 tracking-tighter uppercase">{img.title}</h6>
                      <p className="text-blue-400 text-xs font-black uppercase tracking-[0.2em]">{img.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-6 md:space-y-10 pt-16">
                {missionImages.slice(2, 4).map((img, i) => (
                  <div key={img.src} className={`relative rounded-[3rem] overflow-hidden shadow-2xl group cursor-zoom-in border border-white/5 ${i === 0 ? 'aspect-square' : 'aspect-[4/5]'}`} onClick={() => setActiveImage(img.src)}>
                    <img src={img.src} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale-0 hover:brightness-110" alt="Interface" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-10 backdrop-blur-[2px]">
                      <h6 className="text-white font-black text-2xl italic mb-3 tracking-tighter uppercase">{img.title}</h6>
                      <p className="text-blue-400 text-xs font-black uppercase tracking-[0.2em]">{img.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Onboarding */}
      <section id="contact" className="relative py-48 z-10 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-blue-800 via-blue-950 to-black rounded-[5rem] p-12 md:p-32 relative overflow-hidden shadow-[0_0_150px_rgba(59,130,246,0.1)] border border-white/10">
            <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 blur-[150px] rounded-full"></div>
            
            <div className="relative z-10 text-center mb-24">
               <h2 className="text-6xl md:text-[10rem] font-black tracking-tighter text-white mb-10 uppercase italic leading-[0.8] drop-shadow-2xl">Join The <br /> Future</h2>
               <p className="text-xl md:text-3xl text-blue-300 font-bold uppercase tracking-[0.4em] italic">Institutional Onboarding</p>
            </div>
            
            <form className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-2">
                <label className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] ml-6">ENTITY NAME</label>
                <input type="text" placeholder="CORPORATE NAME" className="w-full bg-black/40 border-2 border-white/5 rounded-full px-10 py-7 font-black tracking-widest text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500 focus:bg-black/60 transition-all uppercase text-lg" />
              </div>
              <div className="space-y-2">
                <label className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] ml-6">WORK EMAIL</label>
                <input type="email" placeholder="OFFICIAL EMAIL" className="w-full bg-black/40 border-2 border-white/5 rounded-full px-10 py-7 font-black tracking-widest text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500 focus:bg-black/60 transition-all uppercase text-lg" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] ml-6">REQUIREMENTS</label>
                <textarea rows={4} placeholder="HOW CAN WE ENABLE YOUR BUSINESS?" className="w-full bg-black/40 border-2 border-white/5 rounded-[3rem] px-10 py-10 font-black tracking-widest text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500 focus:bg-black/60 transition-all uppercase text-lg"></textarea>
              </div>
              <button className="md:col-span-2 bg-white text-black py-10 rounded-full font-black text-3xl tracking-tighter hover:bg-blue-600 hover:text-white transition-all duration-700 shadow-2xl uppercase italic mt-8">INITIATE CONNECTION</button>
            </form>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-32 z-10 relative px-6 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
          <div className="flex flex-col items-center gap-6">
            <img src="/logo.jpg" className="w-16 h-16 object-contain" alt="Logo" />
            <span className="text-4xl font-black italic tracking-[-0.04em] uppercase text-center">BLACK <br className="md:hidden" /><span className="text-blue-500">INTELLISENSE</span></span>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.8em] text-center">Infrastructure for Modern Markets</p>
          </div>
          <div className="h-px w-32 bg-white/10"></div>
          <div className="text-white/10 text-[9px] font-black uppercase tracking-[1em] text-center max-w-lg leading-loose">
            © 2026 PT. PERDAGANGAN TEKNOLOGI INTELLISENSE. ALL RIGHTS RESERVED. <br />
            STRICTLY FOR INSTITUTIONAL USE.
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        html { scroll-behavior: smooth; }
        body { background-color: #020205; color-scheme: dark; }
        ::placeholder { color: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
}
