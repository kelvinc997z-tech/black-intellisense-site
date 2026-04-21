'use client';

import React, { useState, useEffect } from 'react';

export default function LandingPage() {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    const particleCount = 60;
    const connectionDistance = 150;

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
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
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
        ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 * (1 - dist / connectionDistance)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
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
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans tracking-tight overflow-x-hidden">
      {/* Lightbox / Zoom Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-12 animate-in fade-in duration-300" onClick={() => setActiveImage(null)}>
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-10">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <img src={activeImage} className="max-w-full max-h-full object-contain rounded-xl shadow-[0_0_80px_rgba(59,130,246,0.3)] animate-in zoom-in-95 duration-500" alt="Zoomed Interface" />
        </div>
      )}

      {/* Network Background */}
      <div className="fixed inset-0 z-0 bg-black pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,78,216,0.15),transparent_70%)]"></div>
        <canvas id="network-canvas" className="absolute inset-0 opacity-40"></canvas>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-md opacity-0 group-hover:opacity-60 transition-opacity"></div>
                <img src="/logo.jpg" alt="Black IntelliSense Logo" className="relative w-11 h-11 object-contain rounded-lg transition-all duration-700 group-hover:scale-110" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl md:text-2xl font-black tracking-tighter italic uppercase">BLACK <span className="text-blue-500">INTELLI</span></span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-10 text-[11px] font-black uppercase tracking-[0.3em] text-white/40">
              <a href="#challenge" className="hover:text-white transition-colors relative group">Problem<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span></a>
              <a href="#products" className="hover:text-white transition-colors relative group">Suite<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span></a>
              <a href="#philosophy" className="hover:text-white transition-colors relative group">Philosophy<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span></a>
              <a href="#contact" className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] font-black italic uppercase text-[10px] tracking-widest">Connect</a>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="lg:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu overlay */}
        <div className={`lg:hidden fixed inset-x-0 top-20 bg-black/95 backdrop-blur-2xl border-b border-white/5 transition-all duration-500 overflow-hidden ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
          <div className="p-8 flex flex-col gap-6 text-center font-black uppercase tracking-[0.4em] text-sm">
            <a href="#challenge" onClick={() => setMobileMenuOpen(false)} className="text-white/60 hover:text-blue-400 py-2">Problem</a>
            <a href="#products" onClick={() => setMobileMenuOpen(false)} className="text-white/60 hover:text-blue-400 py-2">Suite</a>
            <a href="#philosophy" onClick={() => setMobileMenuOpen(false)} className="text-white/60 hover:text-blue-400 py-2">Philosophy</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="bg-blue-600 text-white py-4 rounded-2xl">Connect</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden z-10 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-[10px] font-black tracking-[0.3em] uppercase mb-10 animate-fade-in shadow-2xl backdrop-blur-md">
            <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span>
            A Single Intelligent Layer for Global Markets
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.9] uppercase animate-in slide-in-from-bottom-12 duration-1000 ease-out">
            The Infrastructure <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-500 to-blue-800 drop-shadow-[0_0_20px_rgba(59,130,246,0.2)]">of Intelligence</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-white/40 mb-12 font-medium leading-relaxed tracking-tight">
            Enabling institutional <span className="text-white">liquidity discovery</span>, precision <span className="text-white">execution</span>, and automated <span className="text-white">settlement</span> across global financial venues.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <a href="#products" className="group relative px-12 py-6 bg-white text-black rounded-full font-black text-xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] active:scale-95">
              <span className="relative z-10">Explore Ecosystem</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
            <a href="#contact" className="group px-12 py-6 bg-transparent border-2 border-white/10 rounded-full font-black text-xl hover:bg-white/5 hover:border-white transition-all duration-500 flex items-center justify-center gap-3">
              Request Demo
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>
          </div>
        </div>
      </section>

      {/* The Fragmentation Problem */}
      <section id="challenge" className="relative py-24 md:py-48 z-10 border-y border-white/5 bg-black/80 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-32 items-center">
            <div>
              <h2 className="text-blue-500 font-black text-xs md:text-sm tracking-[0.5em] uppercase mb-6 md:mb-10 italic">Chapter 01: The Problem</h2>
              <h3 className="text-4xl md:text-6xl font-black text-white mb-8 md:mb-12 tracking-tighter leading-none uppercase">The Fragmentation <br /> Challenge</h3>
              <p className="text-lg md:text-xl text-white/40 mb-10 md:text-16 font-bold leading-relaxed italic">
                "Liquidity sources are scattered, systems operate in silos, and settlement workflows remain manual and error-prone."
              </p>
              <div className="space-y-6 md:space-y-8">
                {[
                  { t: 'Disconnected Systems', d: 'Lack of unified price discovery across disparate venues.' },
                  { t: 'Manual Workflows', d: 'High operational risk due to legacy settlement dependencies.' },
                  { t: 'Execution Silos', d: 'Isolated technology preventing end-to-end trade lifecycle visibility.' }
                ].map((item) => (
                  <div key={item.t} className="flex gap-4 md:gap-6 group border-b border-white/5 pb-6 last:border-0">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
                       <span className="text-blue-500 font-black text-lg italic">!</span>
                    </div>
                    <div>
                      <h5 className="text-white font-black uppercase text-base md:text-lg tracking-tighter mb-1">{item.t}</h5>
                      <p className="text-white/40 text-xs md:text-sm font-bold leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative p-8 md:p-12 bg-white/5 rounded-[2.5rem] md:rounded-[4rem] border border-white/5 backdrop-blur-2xl">
               <div className="text-center">
                  <div className="text-blue-500 font-black text-7xl md:text-[10rem] italic tracking-tighter leading-none mb-4 drop-shadow-[0_0_50px_rgba(59,130,246,0.3)]">84%</div>
                  <h6 className="text-white font-black uppercase tracking-[0.3em] text-xs">Target Risk Reduction</h6>
                  <p className="mt-6 md:mt-8 text-white/30 text-[10px] md:text-sm font-medium">By unifying liquidity, execution, and settlement into a single intelligent layer.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Ecosystem Section */}
      <section id="products" className="relative py-48 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-32">
            <h2 className="text-blue-500 font-black text-sm tracking-[0.5em] uppercase mb-8 italic">Chapter 02: Our Products</h2>
            <h3 className="text-6xl md:text-8xl font-black text-white leading-[1] tracking-tighter uppercase">Modular Ecosystem</h3>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Sense 50 */}
            <div className="group relative bg-gradient-to-b from-[#0f172a] to-black border border-white/5 rounded-[3rem] p-1 shadow-2xl transition-all duration-700 hover:scale-[1.02]">
              <div className="bg-black/40 backdrop-blur-3xl rounded-[2.9rem] p-10 md:p-14 h-full flex flex-col">
                <div className="flex justify-between items-start mb-12">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <div className="text-white/5 font-black text-8xl leading-none select-none uppercase">Sense50</div>
                </div>
                <h4 className="text-3xl font-black text-white mb-6 uppercase italic">Bridge Engine <span className="text-blue-500 block text-[10px] tracking-[0.5em] font-black not-italic mt-2 opacity-60 uppercase">Price Aggregation</span></h4>
                <p className="text-lg text-white/40 mb-10 leading-relaxed font-bold tracking-tight">High-performance discovery across best bid/ask sources with sub-millisecond execution logic.</p>
                <div className="grid grid-cols-2 gap-4 mb-12">
                  {['Sub-ms Aggregation', 'Rules-Based Routing', 'API-First Design', 'Multi-Venue Discovery'].map(f => (
                    <div key={f} className="border-l border-white/10 pl-4 hover:border-blue-500 transition-colors">
                      <div className="text-white font-black text-[9px] uppercase tracking-[0.2em]">{f}</div>
                    </div>
                  ))}
                </div>
                <div className="relative mt-auto cursor-zoom-in group/img" onClick={() => setActiveImage('/sense50-preview.jpg')}>
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group-hover/img:border-blue-500/50 transition-all duration-500">
                    <img src="/sense50-preview.jpg" alt="Sense 50" className="w-full grayscale group-hover/img:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* IntelliTrade */}
            <div className="group relative bg-gradient-to-b from-[#1e1b4b] to-black border border-white/5 rounded-[3rem] p-1 shadow-2xl transition-all duration-700 hover:scale-[1.02]">
              <div className="bg-black/40 backdrop-blur-3xl rounded-[2.9rem] p-10 md:p-14 h-full flex flex-col">
                <div className="flex justify-between items-start mb-12">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500">
                    <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                  </div>
                  <div className="text-white/5 font-black text-8xl leading-none select-none uppercase italic">Trade</div>
                </div>
                <h4 className="text-3xl font-black text-white mb-6 uppercase italic">IntelliTrade <span className="text-blue-400 block text-[10px] tracking-[0.5em] font-black not-italic mt-2 opacity-60 uppercase">OTC Trading Platform</span></h4>
                <p className="text-lg text-white/40 mb-10 leading-relaxed font-bold tracking-tight">Professional interface built for institutional high-volume environments with secure confirmation workflows.</p>
                <div className="grid grid-cols-2 gap-4 mb-12">
                  {['Dealer Markup Control', 'Professional Client UX', 'Real-time Reporting', 'Unified Execution'].map(f => (
                    <div key={f} className="border-l border-white/10 pl-4 hover:border-blue-400 transition-colors">
                      <div className="text-white font-black text-[9px] uppercase tracking-[0.2em]">{f}</div>
                    </div>
                  ))}
                </div>
                <div className="relative mt-auto cursor-zoom-in group/img" onClick={() => setActiveImage('/intellitrade-preview.jpg')}>
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group-hover/img:border-blue-400/50 transition-all duration-500">
                    <img src="/intellitrade-preview.jpg" alt="IntelliTrade" className="w-full grayscale group-hover/img:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 text-center">
            <p className="text-white/20 font-black uppercase tracking-[0.6em] text-xs">Currently Supporting: Crypto Assets (Spot) • Future Expansion: FX & Derivatives</p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="relative py-48 z-10 bg-white text-black rounded-[4rem] mx-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-32">
            <h2 className="text-blue-600 font-black text-sm tracking-[0.5em] uppercase mb-8 italic">Chapter 03: Our Philosophy</h2>
            <h3 className="text-6xl md:text-8xl font-black text-black leading-[1] tracking-tighter uppercase">The 4 Pillars</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map(p => (
              <div key={p.id} className="group border-t-2 border-black/10 pt-10 hover:border-blue-600 transition-all">
                <div className="text-blue-600 font-black text-4xl mb-6 italic tracking-tighter">{p.id}</div>
                <h5 className="text-xl font-black uppercase mb-4 tracking-tighter">{p.title}</h5>
                <p className="text-sm font-bold text-black/40 mb-6 leading-relaxed">{p.desc}</p>
                <div className="inline-block px-3 py-1 bg-black/5 rounded-full text-[9px] font-black uppercase tracking-widest text-black/60 italic">{p.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Vision Grid */}
      <section id="mission" className="relative py-48 z-10 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-24 items-center">
            <div className="lg:w-[45%]">
              <h2 className="text-blue-500 font-black text-sm tracking-[0.4em] uppercase mb-10 italic">Strategic Vision</h2>
              <h3 className="text-6xl md:text-8xl font-black mb-12 leading-[0.85] tracking-tighter uppercase">The Nervous <br /> System</h3>
              <p className="text-2xl text-white/40 mb-16 leading-relaxed font-bold tracking-tight italic">"Building the intelligence between liquidity and global markets through a single modular source of truth."</p>
              <a href="/Black_IntelliSense_Deck.pdf" download="Black_IntelliSense_Deck.pdf" className="group bg-blue-600 text-white px-12 py-6 rounded-full font-black text-xl hover:bg-white hover:text-black transition-all flex items-center gap-6 shadow-2xl inline-block italic uppercase tracking-tighter">
                <span>Download Executive Deck</span>
                <svg className="w-6 h-6 group-hover:translate-y-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7-7-7m12-8l-7 7-7-7"></path></svg>
              </a>
            </div>
            <div className="lg:w-[55%] grid grid-cols-2 gap-8 items-start">
              <div className="space-y-8">
                {missionImages.slice(0, 2).map((img, i) => (
                  <div key={img.src} className={`relative rounded-3xl overflow-hidden shadow-2xl group cursor-zoom-in ${i === 0 ? 'aspect-[4/5]' : 'aspect-square'}`} onClick={() => setActiveImage(img.src)}>
                    <img src={img.src} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" alt="Interface" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 backdrop-blur-sm">
                      <h6 className="text-white font-black text-xl italic mb-2 tracking-tighter uppercase">{img.title}</h6>
                      <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">{img.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-8 pt-16">
                {missionImages.slice(2, 4).map((img, i) => (
                  <div key={img.src} className={`relative rounded-3xl overflow-hidden shadow-2xl group cursor-zoom-in ${i === 0 ? 'aspect-square' : 'aspect-[4/5]'}`} onClick={() => setActiveImage(img.src)}>
                    <img src={img.src} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" alt="Interface" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 backdrop-blur-sm">
                      <h6 className="text-white font-black text-xl italic mb-2 tracking-tighter uppercase">{img.title}</h6>
                      <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">{img.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Contact Form */}
      <section id="contact" className="relative py-48 z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-br from-blue-700 via-blue-900 to-black rounded-[4rem] p-12 md:p-24 relative overflow-hidden shadow-2xl border border-white/10">
            <div className="relative z-10 text-center mb-20">
               <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-8 uppercase italic leading-[0.85]">Join The <br /> Infrastructure</h2>
               <p className="text-xl md:text-2xl text-blue-300 font-bold uppercase tracking-widest">Global Institutional Onboarding</p>
            </div>
            <form className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <input type="text" placeholder="FULL NAME" className="bg-black/40 border-2 border-white/5 rounded-3xl px-8 py-6 font-black tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500 transition-all uppercase" />
              <input type="email" placeholder="INSTITUTIONAL EMAIL" className="bg-black/40 border-2 border-white/5 rounded-3xl px-8 py-6 font-black tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500 transition-all uppercase" />
              <textarea rows={4} placeholder="HOW CAN WE ENABLE YOUR BUSINESS?" className="md:col-span-2 bg-black/40 border-2 border-white/5 rounded-[2rem] px-8 py-8 font-black tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500 transition-all uppercase"></textarea>
              <button className="md:col-span-2 bg-white text-black py-8 rounded-[2rem] font-black text-2xl tracking-tighter hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-2xl uppercase italic">Submit Inquiry</button>
            </form>
          </div>
        </div>
      </section>

      <footer className="py-20 z-10 relative px-6 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center gap-3 mb-8">
            <img src="/logo.jpg" className="w-8 h-8 object-contain" alt="Logo" />
            <span className="text-2xl font-black italic tracking-tighter uppercase">Black IntelliSense</span>
          </div>
          <p className="text-white/10 text-[9px] font-black uppercase tracking-[1em]">© 2026 PT. PERDAGANGAN TEKNOLOGI INTELLISENSE. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        html { scroll-behavior: smooth; }
        body { background-color: black; color-scheme: dark; }
      `}</style>
    </div>
  );
}
