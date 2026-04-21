'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function LandingPage() {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth) - 0.5, y: (e.clientY / window.innerHeight) - 0.5 });
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
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
    const particleCount = 80;
    const connectionDistance = 200;

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
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 0.5,
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
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 * (1 - dist / connectionDistance)})`;
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
      {/* Dynamic Cursor Halo */}
      <div 
        className="fixed pointer-events-none z-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full hidden lg:block transition-transform duration-300 ease-out"
        style={{ transform: `translate(${mousePos.x * 100}px, ${mousePos.y * 100}px)`, top: '50%', left: '50%', marginTop: '-300px', marginLeft: '-300px' }}
      ></div>

      {/* Lightbox */}
      {activeImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-4 animate-in fade-in duration-500" onClick={() => setActiveImage(null)}>
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-all scale-100 hover:scale-110 z-10 p-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <div className="relative group/modal max-w-6xl w-full flex items-center justify-center">
             <img src={activeImage} className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-[0_0_100px_rgba(59,130,246,0.3)] animate-in zoom-in-90 duration-700 border border-white/10" alt="Full View" />
          </div>
        </div>
      )}

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(29,78,216,0.2),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
        <canvas id="network-canvas" className="absolute inset-0 opacity-40"></canvas>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 border-b ${scrolled ? 'bg-black/60 backdrop-blur-3xl border-white/5 py-4' : 'bg-transparent border-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-0 group-hover:opacity-50 transition-all duration-700"></div>
                <img src="/logo.jpg" alt="Logo" className="relative w-14 h-14 object-contain rounded-xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-[360deg]" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-3xl font-black tracking-tighter italic uppercase text-white">BLACKINTELLI<span className="text-blue-500">SENSE</span></span>
                <span className="text-[8px] font-black tracking-[0.6em] text-white/20 mt-1 uppercase">Infrastructure v.15</span>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-16 text-[11px] font-black uppercase tracking-[0.5em] text-white/30">
              {['challenge', 'products', 'philosophy'].map((item) => (
                <a key={item} href={`#${item}`} className="hover:text-white transition-all duration-500 relative group py-2">
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-500 group-hover:w-full transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)"></span>
                </a>
              ))}
              <a href="#contact" className="bg-white text-black px-12 py-4 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-700 shadow-3xl font-black italic tracking-widest text-[12px] group relative overflow-hidden">
                <span className="relative z-10">CONNECT</span>
                <div className="absolute inset-0 bg-blue-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </a>
            </div>

            <button className="lg:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <div className="w-10 h-6 flex flex-col justify-between">
                <span className={`h-1 w-full bg-white transition-all duration-500 ${mobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
                <span className={`h-1 w-full bg-white transition-all duration-500 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`h-1 w-full bg-white transition-all duration-500 ${mobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-40 pb-20 z-10 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="inline-flex items-center gap-4 px-8 py-3.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-[12px] font-black tracking-[0.5em] uppercase mb-16 animate-in fade-in slide-in-from-top-12 duration-1000 shadow-inner backdrop-blur-2xl">
            <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span></span>
            A Single Intelligent Layer for Global Markets
          </div>
          
          <h1 className="text-7xl md:text-[11rem] font-black tracking-[-0.05em] text-white mb-12 leading-[0.8] uppercase italic mix-blend-difference">
            <span className="block animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-100 fill-mode-both">Modern</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-500 to-blue-900 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-400 fill-mode-both drop-shadow-[0_20px_50px_rgba(59,130,246,0.3)]">Infrastructure</span>
          </h1>
          
          <p className="max-w-4xl mx-auto text-xl md:text-3xl text-white/40 mb-20 font-medium leading-[1.4] tracking-tight animate-in fade-in duration-1000 delay-600 fill-mode-both px-4">
            Pioneering the intelligent nexus between <span className="text-white hover:text-blue-400 transition-colors cursor-default">liquidity discovery</span> and <span className="text-white hover:text-blue-400 transition-colors cursor-default">execution</span>. Engineering the future of institutional finance.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-800 fill-mode-both">
            <a href="#products" className="group relative px-20 py-8 bg-white text-black rounded-full font-black text-2xl overflow-hidden transition-all duration-700 hover:scale-105 hover:shadow-[0_0_80px_rgba(255,255,255,0.3)]">
              <span className="relative z-10 italic uppercase tracking-tighter">Enter Suite</span>
              <div className="absolute inset-0 bg-blue-600 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-700"></div>
            </a>
            <a href="#contact" className="group px-20 py-8 bg-transparent border-2 border-white/10 rounded-full font-black text-2xl hover:bg-white/5 hover:border-blue-500 transition-all duration-700 flex items-center justify-center gap-5 uppercase tracking-tighter">
              Demo Request
              <svg className="w-8 h-8 group-hover:translate-x-3 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>
          </div>
        </div>
      </section>

      {/* Content Sections with Parallax Reveal */}
      <section id="challenge" className="relative py-60 z-10 border-y border-white/5 bg-gradient-to-b from-transparent via-[#05050a] to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            <div className="order-2 lg:order-1 reveal">
              <h2 className="text-blue-500 font-black text-[12px] tracking-[0.8em] uppercase mb-10 italic opacity-50">01 // The Fragmentation Problem</h2>
              <h3 className="text-6xl md:text-8xl font-black text-white mb-16 tracking-tighter leading-[0.9] uppercase italic">Systemic <br /> Inefficiency</h3>
              <p className="text-2xl md:text-4xl text-white/40 mb-20 font-bold leading-[1.2] tracking-tighter italic border-l-[12px] border-blue-600 pl-12 py-4">
                "Liquidity sources are scattered, systems operate in silos, and workflows remain error-prone."
              </p>
              <div className="space-y-16">
                {[
                  { t: 'Disconnected Venues', d: 'Global liquidity lacks a unified intelligent layer for real-time discovery.' },
                  { t: 'Fragmented Execution', d: 'Legacy silos preventing comprehensive end-to-end trade visibility.' },
                  { t: 'Operational Fragility', d: 'Manual dependencies creating systemic risks in settlement workflows.' }
                ].map((item) => (
                  <div key={item.t} className="flex gap-10 group cursor-default">
                    <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10 group-hover:bg-blue-600 group-hover:border-blue-400 transition-all duration-700 group-hover:scale-110 group-hover:rotate-[360deg] shadow-[0_0_40px_rgba(0,0,0,0.5)] shrink-0">
                       <span className="text-blue-500 group-hover:text-white font-black text-3xl italic">!</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="text-white font-black uppercase text-2xl tracking-tighter mb-3 italic group-hover:text-blue-400 transition-colors">{item.t}</h5>
                      <p className="text-white/30 text-base md:text-lg font-bold leading-relaxed uppercase tracking-widest">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2 relative group reveal">
               <div className="absolute inset-0 bg-blue-600/10 blur-[200px] rounded-full animate-pulse group-hover:bg-blue-600/30 transition-all duration-1000"></div>
               <div className="relative h-[600px] w-full border border-white/5 rounded-[6rem] p-20 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-[100px] flex flex-col justify-center items-center text-center shadow-[0_0_120px_rgba(0,0,0,0.9)] border-t-white/20 border-l-white/20 overflow-hidden group-hover:scale-[1.03] transition-all duration-1000 ease-out">
                  <div className="absolute top-[-20%] left-[-20%] w-full h-full bg-blue-500/10 rounded-full blur-[120px] animate-bounce-slow"></div>
                  <div className="text-blue-500 font-black text-[12rem] md:text-[18rem] italic tracking-tighter leading-none mb-4 drop-shadow-[0_0_80px_rgba(59,130,246,0.6)] group-hover:text-white transition-colors duration-1000">84%</div>
                  <h6 className="text-white font-black uppercase tracking-[0.6em] text-sm md:text-lg italic opacity-80">Target Risk Reduction</h6>
                  <div className="mt-16 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
                  <p className="mt-16 text-white/40 text-xs md:text-base font-black uppercase tracking-[0.4em] max-w-sm leading-loose italic">The Intelligence layer between liquidity and settlement.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 02: Suite - More aggressive hover states */}
      <section id="products" className="relative py-60 z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-blue-500 font-black text-[12px] tracking-[1em] uppercase mb-10 italic opacity-50 reveal">02 // The Solution</h2>
          <h3 className="text-7xl md:text-[14rem] font-black text-white leading-[0.75] tracking-tighter uppercase mb-48 italic reveal">Proprietary <br /> Ecosystem</h3>
          
          <div className="grid lg:grid-cols-2 gap-24 text-left">
            {/* Sense 50 */}
            <div className="group relative bg-gradient-to-b from-blue-950/30 via-black to-black border border-white/10 rounded-[5rem] p-[2px] shadow-3xl transition-all duration-1000 hover:scale-[1.05] reveal">
              <div className="bg-[#020205]/95 backdrop-blur-[150px] rounded-[4.9rem] p-16 md:p-24 h-full flex flex-col border border-white/5 relative overflow-hidden group-hover:border-blue-500/50 transition-all duration-700">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full group-hover:bg-blue-600/15 transition-all duration-1000"></div>
                <div className="flex justify-between items-start mb-24 relative z-10">
                  <div className="w-28 h-28 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_60px_rgba(59,130,246,0.6)] rotate-6 group-hover:rotate-0 group-hover:scale-110 transition-all duration-1000 ease-out">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <div className="text-white/5 font-black text-[12rem] md:text-[18rem] leading-none tracking-tighter select-none uppercase -translate-y-12 group-hover:text-blue-500/10 transition-all duration-1000 italic">50</div>
                </div>
                <h4 className="text-6xl font-black text-white mb-10 uppercase italic tracking-tighter group-hover:text-blue-400 transition-all duration-700 relative z-10">Sense 50 <span className="text-blue-500 block text-[12px] tracking-[0.6em] font-black not-italic mt-6 opacity-60 uppercase">The Intelligent Bridge</span></h4>
                <p className="text-2xl md:text-3xl text-white/40 mb-20 leading-relaxed font-bold tracking-tight italic relative z-10">Consolidating global market depth into a single, high-throughput intelligent feed for institutional execution.</p>
                
                <div className="grid grid-cols-2 gap-12 mb-24 border-t border-white/10 pt-20 relative z-10">
                  {['Sub-ms Routing', 'Custom Execution', 'API-First Architecture', 'Real-time Aggregation'].map(f => (
                    <div key={f} className="border-l-4 border-blue-600 pl-8 group/feat transform hover:translate-x-4 transition-all duration-500">
                      <div className="text-white font-black text-[11px] uppercase tracking-[0.4em] group-hover/feat:text-blue-400 transition-colors mb-2 italic">{f}</div>
                      <div className="w-0 h-[1px] bg-blue-500 group-hover/feat:w-full transition-all duration-700"></div>
                    </div>
                  ))}
                </div>
                
                <div className="relative mt-auto cursor-zoom-in group/img overflow-hidden rounded-[3rem] border border-white/10 shadow-4xl" onClick={() => setActiveImage('/sense50-preview.jpg')}>
                  <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover/img:opacity-100 transition-all duration-700 z-10 backdrop-blur-md flex items-center justify-center">
                    <div className="bg-white text-black font-black px-12 py-5 rounded-full uppercase italic tracking-widest scale-90 group-hover/img:scale-100 transition-all duration-700 shadow-2xl">Audit Interface</div>
                  </div>
                  <img src="/sense50-preview.jpg" alt="Interface" className="w-full grayscale group-hover/img:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-transparent"></div>
                </div>
              </div>
            </div>

            {/* IntelliTrade */}
            <div className="group relative bg-gradient-to-b from-white/10 via-black to-black border border-white/10 rounded-[5rem] p-[2px] shadow-3xl transition-all duration-1000 hover:scale-[1.05] reveal">
              <div className="bg-[#020205]/95 backdrop-blur-[150px] rounded-[4.9rem] p-16 md:p-24 h-full flex flex-col border border-white/5 relative overflow-hidden group-hover:border-white/30 transition-all duration-700">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full group-hover:bg-white/10 transition-all duration-1000"></div>
                <div className="flex justify-between items-start mb-24 relative z-10">
                  <div className="w-28 h-28 bg-white rounded-[2.5rem] flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.2)] -rotate-6 group-hover:rotate-0 group-hover:scale-110 transition-all duration-1000 ease-out">
                    <svg className="w-16 h-16 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                  </div>
                  <div className="text-white/5 font-black text-[12rem] md:text-[18rem] leading-none tracking-tighter select-none uppercase -translate-y-12 group-hover:text-white/10 transition-all duration-1000 italic">Trade</div>
                </div>
                <h4 className="text-6xl font-black text-white mb-10 uppercase italic tracking-tighter group-hover:text-blue-400 transition-all duration-700 relative z-10">IntelliTrade <span className="text-white block text-[12px] tracking-[0.6em] font-black not-italic mt-6 opacity-60 uppercase">OTC Institutional Portal</span></h4>
                <p className="text-2xl md:text-3xl text-white/40 mb-20 leading-relaxed font-bold tracking-tight italic relative z-10">Professional grade OTC interface with dealer-controlled markup models and seamless client-broker workflows.</p>
                
                <div className="grid grid-cols-2 gap-12 mb-24 border-t border-white/10 pt-20 relative z-10">
                  {['Dealer Markup', 'White-Label UI', 'Audit Ready', 'Direct Settlement'].map(f => (
                    <div key={f} className="border-l-4 border-white/20 pl-8 group/feat transform hover:translate-x-4 transition-all duration-500">
                      <div className="text-white font-black text-[11px] uppercase tracking-[0.4em] group-hover/feat:text-blue-400 transition-colors mb-2 italic">{f}</div>
                      <div className="w-0 h-[1px] bg-white group-hover/feat:w-full transition-all duration-700"></div>
                    </div>
                  ))}
                </div>
                
                <div className="relative mt-auto cursor-zoom-in group/img overflow-hidden rounded-[3rem] border border-white/10 shadow-4xl" onClick={() => setActiveImage('/intellitrade-preview.jpg')}>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/img:opacity-100 transition-all duration-700 z-10 backdrop-blur-md flex items-center justify-center">
                    <div className="bg-white text-black font-black px-12 py-5 rounded-full uppercase italic tracking-widest scale-90 group-hover/img:scale-100 transition-all duration-700 shadow-2xl">Audit Interface</div>
                  </div>
                  <img src="/intellitrade-preview.jpg" alt="Interface" className="w-full grayscale group-hover/img:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 03: The 4 Pillars - Refined Glassmorphism */}
      <section id="philosophy" className="relative py-60 z-10 bg-white text-black rounded-[6rem] mx-4 md:mx-20 shadow-[0_-80px_150px_rgba(0,0,0,0.7)] reveal">
        <div className="max-w-7xl mx-auto px-10">
          <div className="text-center mb-48">
            <h2 className="text-blue-600 font-black text-[12px] tracking-[1em] uppercase mb-10 italic">03 // Core Philosophy</h2>
            <h3 className="text-7xl md:text-[12rem] font-black text-black leading-[0.75] tracking-tighter uppercase italic drop-shadow-sm">The 4 <br /> Pillars</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24">
            {pillars.map(p => (
              <div key={p.id} className="group border-t-[6px] border-black/5 pt-16 transition-all duration-1000 hover:border-blue-600 transform hover:-translate-y-4">
                <div className="text-blue-600 font-black text-[6rem] mb-12 italic tracking-tighter leading-none group-hover:translate-x-6 transition-transform duration-1000">{p.id}</div>
                <h5 className="text-3xl font-black uppercase mb-8 tracking-tighter leading-[1.1] italic group-hover:text-blue-600 transition-colors">{p.title}</h5>
                <p className="text-lg font-bold text-black/40 mb-10 leading-relaxed uppercase tracking-wider italic">{p.desc}</p>
                <div className="inline-block px-6 py-2.5 bg-black/5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] text-black/60 italic border border-black/5 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700">{p.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Vision Grid - Massive Overhaul */}
      <section id="vision" className="relative py-60 z-10 bg-[#020205]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col lg:flex-row gap-40 items-center">
            <div className="lg:w-[40%] text-left reveal">
              <h2 className="text-blue-500 font-black text-[12px] tracking-[0.8em] uppercase mb-12 italic opacity-50">Strategic Vision</h2>
              <h3 className="text-7xl md:text-9xl font-black mb-16 leading-[0.75] tracking-tighter uppercase italic">The Nervous <br /> System</h3>
              <p className="text-3xl md:text-5xl text-white/40 mb-24 leading-[1.1] font-bold tracking-tighter italic border-l-[16px] border-white/5 pl-16 py-6 group hover:border-blue-600 transition-all duration-1000 hover:text-white">
                "Engineering the nexus between liquidity and global markets through a single modular source of truth."
              </p>
              <a href="/Black_IntelliSense_Deck.pdf" download="Black_IntelliSense_Deck.pdf" className="group bg-blue-600 text-white px-20 py-10 rounded-full font-black text-3xl hover:bg-white hover:text-black transition-all duration-1000 flex items-center justify-between shadow-4xl uppercase italic tracking-tighter w-full max-w-lg relative overflow-hidden">
                <span className="relative z-10">DOWNLOAD DECK</span>
                <div className="bg-black/20 rounded-full p-3 group-hover:translate-y-4 transition-all duration-700 relative z-10">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7-7-7m12-8l-7 7-7-7"></path></svg>
                </div>
                <div className="absolute inset-0 bg-white translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-1000"></div>
              </a>
            </div>
            
            <div className="lg:w-[60%] grid grid-cols-2 gap-10 md:gap-16 reveal">
              <div className="space-y-10 md:space-y-16">
                {missionImages.slice(0, 2).map((img, i) => (
                  <div key={img.src} className={`relative rounded-[4rem] overflow-hidden shadow-4xl group cursor-zoom-in border border-white/5 ${i === 0 ? 'aspect-[4/6]' : 'aspect-square'} group-hover:scale-[1.02] transition-all duration-1000`} onClick={() => setActiveImage(img.src)}>
                    <img src={img.src} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-125 grayscale group-hover:grayscale-0 hover:brightness-125" alt="Tech" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-12 backdrop-blur-[4px]">
                      <h6 className="text-white font-black text-4xl italic mb-4 tracking-tighter uppercase transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 delay-100">{img.title}</h6>
                      <p className="text-blue-400 text-sm font-black uppercase tracking-[0.4em] transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 delay-200">{img.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-10 md:space-y-16 pt-32">
                {missionImages.slice(2, 4).map((img, i) => (
                  <div key={img.src} className={`relative rounded-[4rem] overflow-hidden shadow-4xl group cursor-zoom-in border border-white/5 ${i === 0 ? 'aspect-square' : 'aspect-[4/6]'} group-hover:scale-[1.02] transition-all duration-1000`} onClick={() => setActiveImage(img.src)}>
                    <img src={img.src} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-125 grayscale group-hover:grayscale-0 hover:brightness-125" alt="Tech" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-12 backdrop-blur-[4px]">
                      <h6 className="text-white font-black text-4xl italic mb-4 tracking-tighter uppercase transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 delay-100">{img.title}</h6>
                      <p className="text-blue-400 text-sm font-black uppercase tracking-[0.4em] transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 delay-200">{img.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Onboarding - Luxury Gradient Overhaul */}
      <section id="contact" className="relative py-60 z-10 px-6 md:px-24 reveal">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-blue-900 via-[#05050a] to-black rounded-[6rem] p-16 md:p-40 relative overflow-hidden shadow-[0_0_200px_rgba(59,130,246,0.2)] border border-white/10 group/form">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute -top-[20%] -right-[20%] w-full h-full bg-blue-600/10 blur-[200px] rounded-full group-hover/form:bg-blue-600/20 transition-all duration-1000"></div>
            
            <div className="relative z-10 text-center mb-32">
               <h2 className="text-7xl md:text-[14rem] font-black tracking-[-0.04em] text-white mb-12 uppercase italic leading-[0.7] drop-shadow-[0_20px_100px_rgba(0,0,0,0.9)] animate-pulse-slow">Connect <br /> The Future</h2>
               <p className="text-2xl md:text-4xl text-blue-300 font-bold uppercase tracking-[0.6em] italic opacity-60">Global Institutional Onboarding</p>
            </div>
            
            <form className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">
              <div className="space-y-4 group/input">
                <label className="text-white/20 text-[11px] font-black uppercase tracking-[0.6em] ml-10 group-hover/input:text-blue-400 transition-colors">CORPORATE ENTITY</label>
                <input type="text" placeholder="NAME OF ENTITY" className="w-full bg-white/5 border-b-4 border-white/10 rounded-3xl px-12 py-10 font-black tracking-widest text-white placeholder:text-white/5 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all uppercase text-2xl" />
              </div>
              <div className="space-y-4 group/input">
                <label className="text-white/20 text-[11px] font-black uppercase tracking-[0.6em] ml-10 group-hover/input:text-blue-400 transition-colors">OFFICIAL EMAIL</label>
                <input type="email" placeholder="INSTITUTIONAL DOMAIN" className="w-full bg-white/5 border-b-4 border-white/10 rounded-3xl px-12 py-10 font-black tracking-widest text-white placeholder:text-white/5 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all uppercase text-2xl" />
              </div>
              <div className="md:col-span-2 space-y-4 group/input">
                <label className="text-white/20 text-[11px] font-black uppercase tracking-[0.6em] ml-10 group-hover/input:text-blue-400 transition-colors">INFRASTRUCTURE REQUIREMENTS</label>
                <textarea rows={4} placeholder="HOW CAN WE ENABLE YOUR BUSINESS?" className="w-full bg-white/5 border-b-4 border-white/10 rounded-[4rem] px-12 py-12 font-black tracking-widest text-white placeholder:text-white/5 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all uppercase text-2xl"></textarea>
              </div>
              <button className="md:col-span-2 bg-white text-black py-12 rounded-full font-black text-4xl tracking-tighter hover:bg-blue-600 hover:text-white transition-all duration-1000 shadow-4xl uppercase italic mt-12 relative overflow-hidden group/btn">
                 <span className="relative z-10">INITIATE CONNECTION</span>
                 <div className="absolute inset-0 bg-blue-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-700"></div>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Luxury Footer */}
      <footer className="py-48 z-10 relative px-8 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-24">
          <div className="flex flex-col items-center gap-10">
            <div className="relative group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 group-hover:opacity-60 transition-all duration-1000"></div>
              <img src="/logo.jpg" className="w-24 h-24 object-contain relative z-10 group-hover:scale-110 transition-transform duration-1000" alt="Footer Logo" />
            </div>
            <span className="text-6xl md:text-8xl font-black italic tracking-[-0.05em] uppercase text-center leading-none text-white">BLACKINTELLI<span className="text-blue-500">SENSE</span></span>
            <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            <p className="text-white/30 text-[12px] font-black uppercase tracking-[1em] text-center italic">Infrastructure for Modern Markets</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-24 text-[12px] font-black uppercase tracking-[0.5em] text-white/30 text-center md:text-left">
            {['LinkedIn', 'Twitter', 'Documentation'].map(link => (
              <a key={link} href="#" className="hover:text-blue-500 transition-all duration-500 hover:translate-y-[-4px] italic">{link}</a>
            ))}
          </div>

          <div className="text-white/10 text-[10px] font-black uppercase tracking-[1.2em] text-center max-w-2xl leading-[2] border-t border-white/5 pt-32">
            © 2026 PT. PERDAGANGAN TEKNOLOGI INTELLISENSE. <br /> 
            ALL RIGHTS RESERVED. FOR INSTITUTIONAL COUNTERPARTIES ONLY.
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .animate-fade-in { animation: fade-in 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-bounce-slow { animation: bounce-slow 5s infinite ease-in-out; }
        .animate-pulse-slow { animation: pulse-slow 4s infinite ease-in-out; }
        html { scroll-behavior: smooth; }
        body { background-color: #020205; color-scheme: dark; cursor: crosshair; }
        ::placeholder { color: rgba(255,255,255,0.05); }
        .reveal { opacity: 0; transform: translateY(40px); transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal.active { opacity: 1; transform: translateY(0); }
      `}</style>
      
      <script dangerouslySetInnerHTML={{ __html: `
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
            }
          });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
      ` }} />
    </div>
  );
}
