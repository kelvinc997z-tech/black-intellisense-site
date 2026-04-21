'use client';

import React, { useState } from 'react';

export default function LandingPage() {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const missionImages = [
    { src: '/mission-2.jpg', title: 'PRICE AGGREGATION', desc: 'Real-time multi-exchange price feeds.' },
    { src: '/mission-3.jpg', title: 'ORDER MANAGEMENT', desc: 'Institutional order lifecycle tracking.' },
    { src: '/mission-4.jpg', title: 'SENSE 50 ANALYTICS', desc: 'Advanced liquidity analytics engine.' },
    { src: '/intellitrade-preview.jpg', title: 'OTC PORTAL', desc: 'Secure high-volume trade execution.' },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans tracking-tight overflow-x-hidden">
      {/* Lightbox / Zoom Modal */}
      {activeImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-12 animate-in fade-in duration-300"
          onClick={() => setActiveImage(null)}
        >
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-10">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <img 
            src={activeImage} 
            className="max-w-full max-h-full object-contain rounded-xl shadow-[0_0_80px_rgba(59,130,246,0.3)] animate-in zoom-in-95 duration-500" 
            alt="Zoomed Interface" 
          />
        </div>
      )}

      {/* Global Glow Effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-md opacity-0 group-hover:opacity-40 transition-opacity"></div>
                <img src="/logo.jpg" alt="Black IntelliSense Logo" className="relative w-10 h-10 object-contain rounded-lg transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black tracking-tighter italic">BLACK INTELLI<span className="text-blue-500">SENSE</span></span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-10 text-[11px] font-black uppercase tracking-[0.3em] text-white/40">
              <a href="#products" className="hover:text-white transition-colors relative group">
                Products
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#mission" className="hover:text-white transition-colors relative group">
                Mission
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#contact" className="hover:text-white transition-colors relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#contact" className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] font-black italic">Get Started</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-[10px] font-black tracking-[0.3em] uppercase mb-10 animate-fade-in shadow-2xl backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Institutional Grade Infrastructure
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white mb-10 leading-[0.85] uppercase">
            Elevating <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 via-blue-600 to-blue-800">Market Intelligence</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-white/40 mb-14 font-medium leading-relaxed tracking-tight">
            The intelligent nexus between <span className="text-white">liquidity providers</span> and <span className="text-white">global markets</span>. Precision-engineered for scale.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <a href="#products" className="group relative px-12 py-6 bg-white text-black rounded-full font-black text-xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] active:scale-95">
              <span className="relative z-10">Explore Infrastructure</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
            <a href="#contact" className="group px-12 py-6 bg-transparent border-2 border-white/10 rounded-full font-black text-xl hover:bg-white/5 hover:border-white transition-all duration-500 flex items-center justify-center gap-3">
              Contact Sales
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="relative py-48 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-32">
            <h2 className="text-blue-500 font-black text-sm tracking-[0.5em] uppercase mb-8">Proprietary Suite</h2>
            <h3 className="text-6xl md:text-8xl font-black text-white leading-[1] tracking-tighter uppercase">Mission Critical <br />Technology</h3>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Sense 50 */}
            <div className="group relative bg-gradient-to-b from-[#0f172a] to-black border border-white/5 rounded-[3rem] p-1 shadow-2xl transition-all duration-700 hover:scale-[1.02] hover:border-blue-500/30">
              <div className="bg-black/40 backdrop-blur-3xl rounded-[2.9rem] p-10 md:p-16 h-full flex flex-col">
                <div className="flex justify-between items-start mb-16">
                  <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/40 rotate-6 group-hover:rotate-0 transition-transform duration-500">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <div className="text-white/10 font-black text-9xl leading-none tracking-tighter select-none">50</div>
                </div>
                
                <h4 className="text-4xl font-black text-white mb-6 uppercase italic">Sense 50 <span className="text-blue-500 block text-sm tracking-[0.3em] font-black not-italic mt-2">Aggregator & Bridge</span></h4>
                <p className="text-xl text-white/40 mb-12 leading-relaxed font-medium">
                  The ultra-low latency bridge. Aggregating depth from global venues into a single intelligent stream.
                </p>

                <div 
                  className="relative mt-auto cursor-zoom-in group/img"
                  onClick={() => setActiveImage('/sense50-preview.jpg')}
                >
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 group-hover/img:border-blue-500/50">
                    <img src="/sense50-preview.jpg" alt="Sense 50" className="w-full grayscale group-hover/img:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* IntelliTrade */}
            <div className="group relative bg-gradient-to-b from-[#1e1b4b] to-black border border-white/5 rounded-[3rem] p-1 shadow-2xl transition-all duration-700 hover:scale-[1.02] hover:border-blue-400/30">
              <div className="bg-black/40 backdrop-blur-3xl rounded-[2.9rem] p-10 md:p-16 h-full flex flex-col">
                <div className="flex justify-between items-start mb-16">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl shadow-white/10 -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                    <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                  </div>
                  <div className="text-white/10 font-black text-9xl leading-none tracking-tighter select-none uppercase">IT</div>
                </div>
                
                <h4 className="text-4xl font-black text-white mb-6 uppercase italic">IntelliTrade <span className="text-blue-400 block text-sm tracking-[0.3em] font-black not-italic mt-2">OTC Portal</span></h4>
                <p className="text-xl text-white/40 mb-12 leading-relaxed font-medium">
                  Secure, high-touch OTC execution. Built for large block trades with proprietary algorithms ensuring zero slippage.
                </p>

                <div 
                  className="relative mt-auto cursor-zoom-in group/img"
                  onClick={() => setActiveImage('/intellitrade-preview.jpg')}
                >
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 group-hover/img:border-blue-400/50">
                    <img src="/intellitrade-preview.jpg" alt="IntelliTrade" className="w-full grayscale group-hover/img:grayscale-0 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section with Refined Grid */}
      <section id="mission" className="relative py-48 z-10 overflow-hidden bg-white text-black rounded-[4rem] mx-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-24 items-center">
            <div className="lg:w-[45%]">
              <h2 className="text-blue-600 font-black text-sm tracking-[0.4em] uppercase mb-10">Strategic Vision</h2>
              <h3 className="text-6xl md:text-8xl font-black mb-12 leading-[0.85] tracking-tighter uppercase">Building <br /> The Nervous <br /> System</h3>
              <p className="text-2xl text-black/40 mb-16 leading-relaxed font-bold tracking-tight italic">
                "We eliminate friction between institutional liquidity and the providers who scale it."
              </p>
              
              <button className="group bg-black text-white px-12 py-6 rounded-full font-black text-xl hover:bg-blue-600 transition-all flex items-center gap-6 shadow-2xl">
                <span>Download Deck</span>
                <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7-7-7"></path></svg>
              </button>
            </div>
            
            <div className="lg:w-[55%]">
               <div className="grid grid-cols-2 gap-8 items-start">
                 <div className="space-y-8">
                   {missionImages.slice(0, 2).map((img, i) => (
                     <div 
                      key={img.src} 
                      className={`relative rounded-3xl overflow-hidden shadow-2xl group cursor-zoom-in ${i === 0 ? 'aspect-[4/5]' : 'aspect-square'}`}
                      onClick={() => setActiveImage(img.src)}
                    >
                       <img src={img.src} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 backdrop-blur-sm">
                          <h6 className="text-white font-black text-xl italic mb-2">{img.title}</h6>
                          <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{img.desc}</p>
                       </div>
                     </div>
                   ))}
                 </div>
                 <div className="space-y-8 pt-16">
                   {missionImages.slice(2, 4).map((img, i) => (
                      <div 
                        key={img.src} 
                        className={`relative rounded-3xl overflow-hidden shadow-2xl group cursor-zoom-in ${i === 0 ? 'aspect-square' : 'aspect-[4/5]'}`}
                        onClick={() => setActiveImage(img.src)}
                      >
                        <img src={img.src} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 backdrop-blur-sm">
                           <h6 className="text-white font-black text-xl italic mb-2">{img.title}</h6>
                           <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{img.desc}</p>
                        </div>
                      </div>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-48 z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-[4rem] p-12 md:p-24 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 text-center mb-20">
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-8 uppercase italic leading-none">Ready to <br /> Scale?</h2>
              <p className="text-xl md:text-2xl text-white/60 font-bold uppercase tracking-widest">Connect with our institutional desk.</p>
            </div>
            
            <form className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <input type="text" placeholder="FULL NAME" className="bg-black/20 border-2 border-white/10 rounded-3xl px-8 py-6 font-black tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:border-white transition-all uppercase" />
              <input type="email" placeholder="BUSINESS EMAIL" className="bg-black/20 border-2 border-white/10 rounded-3xl px-8 py-6 font-black tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:border-white transition-all uppercase" />
              <textarea rows={4} placeholder="TELL US ABOUT YOUR NEEDS" className="md:col-span-2 bg-black/20 border-2 border-white/10 rounded-[2rem] px-8 py-8 font-black tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:border-white transition-all uppercase"></textarea>
              <button className="md:col-span-2 bg-white text-black py-8 rounded-[2rem] font-black text-2xl tracking-tighter hover:bg-black hover:text-white transition-all duration-500">SUBMIT INQUIRY</button>
            </form>
          </div>
        </div>
      </section>

      <footer className="py-20 z-10 relative px-6 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center gap-3 mb-8">
            <img src="/logo.jpg" className="w-8 h-8 object-contain" alt="Logo" />
            <span className="text-2xl font-black italic tracking-tighter">BLACK INTELLISENSE</span>
          </div>
          <p className="text-white/10 text-[9px] font-black uppercase tracking-[1em]">
            © 2026 PT. PERDAGANGAN TEKNOLOGI INTELLISENSE. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        html {
          scroll-behavior: smooth;
        }
        body {
          background-color: black;
        }
      `}</style>
    </div>
  );
}
