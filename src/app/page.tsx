'use client';

import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans tracking-tight">
      {/* Dynamic Background Grid Effect */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1),rgba(0,0,0,1))]"></div>
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30L0 0M30 30L60 0M30 30L60 60M30 30L0 60' stroke='%233b82f6' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`, backgroundSize: '120px 120px' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <img src="/logo.jpg" alt="Black IntelliSense Logo" className="w-12 h-12 object-contain rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black tracking-tighter italic">BLACK INTELLI<span className="text-blue-500">SENSE</span></span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-10 text-[13px] font-bold uppercase tracking-[0.2em] text-white/60">
              <a href="#products" className="hover:text-blue-400 transition-colors">Products</a>
              <a href="#mission" className="hover:text-blue-400 transition-colors">Mission</a>
              <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
              <a href="#contact" className="bg-white text-black px-6 py-2.5 rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-xl shadow-white/5">Get Started</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase mb-8 animate-fade-in">
             <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Next-Gen Market Infrastructure
          </div>
          <h1 className="text-7xl lg:text-9xl font-black tracking-tighter text-white mb-8 leading-[0.9]">
            BLACK INTELLI<span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-blue-700">SENSE</span>
          </h1>
          <p className="max-w-3xl mx-auto text-xl lg:text-2xl text-white/50 mb-12 font-medium leading-relaxed">
            Building the Intelligence Between <span className="text-white">Liquidity</span> and <span className="text-white">Markets</span>.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a href="#products" className="group relative bg-white text-black px-10 py-5 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl shadow-white/10 overflow-hidden">
              <span className="relative z-10">Discover Platform</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </a>
            <a href="#contact" className="bg-transparent border-2 border-white/10 px-10 py-5 rounded-full font-black text-lg hover:bg-white/5 transition-all duration-300">
              Contact Sales
            </a>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7-7-7m14-8l-7 7-7-7"></path></svg>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="relative py-40 z-10 bg-black/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-end mb-24">
            <div>
              <h2 className="text-blue-500 font-black text-sm tracking-[0.3em] uppercase mb-6">Core Infrastructure</h2>
              <h3 className="text-5xl lg:text-6xl font-black text-white leading-[1.1]">Sophisticated tools for sophisticated markets.</h3>
            </div>
            <p className="text-xl text-white/40 leading-relaxed max-w-lg">
              We provide the mission-critical technology that powers global institutional trading desks and liquidity providers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Sense 50 */}
            <div className="group relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-12 hover:border-blue-500/50 transition-all duration-500 overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] group-hover:bg-blue-600/10 transition-all"></div>
              <div className="text-blue-500 font-black text-8xl opacity-5 absolute -top-8 -right-8 group-hover:opacity-10 transition-all">50</div>
              
              <div className="relative z-10 flex-grow">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl mb-10 flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h4 className="text-3xl font-black text-white mb-6">Sense 50 <span className="text-blue-500 block text-lg uppercase tracking-widest mt-2">Bridge Engine</span></h4>
                <p className="text-lg text-white/50 mb-10 leading-relaxed">
                  High-performance price aggregation and execution engine. The ultra-low latency bridge between Market Makers and Institutional Desks.
                </p>
                <div className="flex flex-wrap gap-3 mb-10">
                  {['Sub-ms Latency', 'Smart Routing', 'L2 Liquidity'].map(tag => (
                    <span key={tag} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-widest text-white/60">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Dashboard Preview Overlay */}
              <div className="relative mt-auto pt-6 border-t border-white/5 group-hover:border-blue-500/20 transition-colors">
                <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500">
                  <img src="/sense50-preview.jpg" alt="Sense 50 Dashboard Interface" className="w-full h-auto opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                </div>
                <div className="absolute top-10 left-4 bg-blue-600 text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span> LIVE INTERFACE
                </div>
              </div>
            </div>

            {/* IntelliTrade */}
            <div className="group relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-12 hover:border-blue-500/50 transition-all duration-500 overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] group-hover:bg-blue-600/10 transition-all"></div>
              <div className="text-blue-500 font-black text-8xl opacity-5 absolute -top-8 -right-8 group-hover:opacity-10 transition-all">IT</div>

              <div className="relative z-10 flex-grow">
                <div className="w-16 h-16 bg-white rounded-2xl mb-10 flex items-center justify-center shadow-lg shadow-white/5">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                </div>
                <h4 className="text-3xl font-black text-white mb-6">IntelliTrade <span className="text-blue-500 block text-lg uppercase tracking-widest mt-2">OTC Platform</span></h4>
                <p className="text-lg text-white/50 mb-10 leading-relaxed">
                  Professional interface for institutional environments. Seamlessly execute large block trades with proprietary zero-slippage algorithms.
                </p>
                <div className="flex flex-wrap gap-3 mb-10">
                  {['Block Execution', 'Audit Ready', 'Multi-Asset'].map(tag => (
                    <span key={tag} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-widest text-white/60">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Dashboard Preview Overlay */}
              <div className="relative mt-auto pt-6 border-t border-white/5 group-hover:border-blue-500/20 transition-colors">
                <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500">
                  <img src="/mission-1.jpg" alt="IntelliTrade OTC Platform Interface" className="w-full h-auto opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                </div>
                <div className="absolute top-10 left-4 bg-white text-black text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-black rounded-full"></span> OTC PORTAL
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="relative py-40 z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-32 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-blue-500 font-black text-sm tracking-[0.3em] uppercase mb-8">Our Mission</h2>
              <h3 className="text-6xl font-black text-white mb-10 leading-[0.9] tracking-tighter">THE NERVOUS SYSTEM OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">MODERN FINANCE</span></h3>
              <p className="text-2xl text-white/40 mb-12 leading-relaxed italic">
                "We bridge the gap between institutional liquidity providers and the brokers who need them."
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-16">
                {[
                  { title: 'Real-time Aggregation', desc: 'Syncing global venues.' },
                  { title: 'Automated Settlement', desc: 'Eliminating manual errors.' },
                  { title: 'OTC Simplification', desc: 'Large trades, zero friction.' },
                  { title: 'Liquidity Hub', desc: 'The core of your business.' }
                ].map((item) => (
                  <div key={item.title} className="group border-l-2 border-white/10 pl-6 hover:border-blue-500 transition-all">
                    <h5 className="text-lg font-black text-white mb-2">{item.title}</h5>
                    <p className="text-white/40 text-sm font-bold uppercase tracking-widest">{item.desc}</p>
                  </div>
                ))}
              </div>

              <button className="group bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-full font-black text-lg transition-all flex items-center gap-4">
                <span>Download Deck</span>
                <div className="bg-black/20 rounded-full p-2 group-hover:translate-y-1 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7-7-7m12-8l-7 7-7-7"></path></svg>
                </div>
              </button>
            </div>
            
            <div className="lg:w-1/2 relative">
               <div className="grid grid-cols-2 gap-6 scale-110">
                <div className="space-y-6">
                  <div className="aspect-[4/3] bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl group hover:scale-105 transition-transform duration-500">
                    <img src="/mission-2.jpg" alt="Price Feeds" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="aspect-square bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl group hover:scale-105 transition-transform duration-500">
                    <img src="/mission-3.jpg" alt="Order Management" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="space-y-6 pt-12">
                  <div className="aspect-square bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl group hover:scale-105 transition-transform duration-500">
                    <img src="/mission-4.jpg" alt="Sense 50 Dashboard" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="aspect-[4/3] bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl group hover:scale-105 transition-transform duration-500">
                    <img src="/mission-1.jpg" alt="IntelliTrade Portal" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
              {/* Visual Aura */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-blue-600/10 blur-[150px] -z-10 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-40 z-10 bg-white text-black rounded-[4rem] mx-4 mb-4">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-6xl lg:text-8xl font-black tracking-tighter mb-10">GET IN <span className="text-blue-600">TOUCH</span></h2>
          <p className="text-2xl text-black/50 mb-20 font-bold tracking-tight leading-none">Ready to modernize your infrastructure?</p>
          
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="md:col-span-1">
              <input type="text" placeholder="FULL NAME" className="w-full bg-black/5 border-2 border-black/5 rounded-3xl px-8 py-6 font-black tracking-widest placeholder:text-black/20 focus:outline-none focus:border-blue-600 transition-all uppercase" />
            </div>
            <div className="md:col-span-1">
              <input type="email" placeholder="BUSINESS EMAIL" className="w-full bg-black/5 border-2 border-black/5 rounded-3xl px-8 py-6 font-black tracking-widest placeholder:text-black/20 focus:outline-none focus:border-blue-600 transition-all uppercase" />
            </div>
            <div className="md:col-span-2">
              <textarea rows={4} placeholder="HOW CAN WE HELP?" className="w-full bg-black/5 border-2 border-black/5 rounded-[2rem] px-8 py-8 font-black tracking-widest placeholder:text-black/20 focus:outline-none focus:border-blue-600 transition-all uppercase"></textarea>
            </div>
            <div className="md:col-span-2">
              <button className="w-full bg-black hover:bg-blue-600 text-white py-8 rounded-[2rem] font-black text-2xl tracking-tighter transition-all duration-300">SEND MESSAGE</button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 z-10 relative px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-16">
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="Logo" className="w-8 h-8 object-contain" />
              <span className="text-xl font-black italic tracking-tighter">BLACK INTELLISENSE</span>
            </div>
            <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
              <a href="#" className="hover:text-blue-400">LinkedIn</a>
              <a href="#" className="hover:text-blue-400">X (Twitter)</a>
              <a href="#" className="hover:text-blue-400">Documentation</a>
            </div>
          </div>
          <div className="text-white/20 text-[10px] font-bold uppercase tracking-[0.5em] text-center border-t border-white/5 pt-16">
            <p>© 2026 Black IntelliSense. PT. PERDAGANGAN TEKNOLOGI INTELLISENSE. Built for the modern trader.</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
