import React from 'react';
import Head from 'next/head';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cyan-500 rounded-sm flex items-center justify-center font-bold text-slate-950">BI</div>
              <span className="text-xl font-bold tracking-tight text-white">BLACK INTELLISENSE</span>
            </div>
            <div className="hidden md:flex space-x-8 text-sm font-medium">
              <a href="#problem" className="hover:text-cyan-400 transition-colors">The Problem</a>
              <a href="#products" className="hover:text-cyan-400 transition-colors">Products</a>
              <a href="#philosophy" className="hover:text-cyan-400 transition-colors">Philosophy</a>
              <a href="mailto:support@blackintellisense.com" className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md transition-all">Schedule Demo</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/30 blur-[128px] rounded-full"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 blur-[128px] rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter text-white mb-6">
            Infrastructure for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Modern Markets</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-10">
            Building the Intelligence Between Liquidity and Markets. A single intelligent layer for global financial institutions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg shadow-cyan-900/20 transition-all">
              Explore Infrastructure
            </button>
            <button className="bg-slate-900 hover:bg-slate-800 border border-slate-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all">
              Read Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-semibold tracking-widest text-cyan-500 uppercase mb-3">The Challenge</h2>
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">Fragmentation Kills Efficiency</h3>
              <p className="text-lg text-slate-400 mb-8">
                Liquidity sources are scattered across multiple venues, execution systems operate in silos, and settlement workflows remain manual and error-prone.
              </p>
              <ul className="space-y-4">
                {[
                  'Disconnected Systems',
                  'Manual & Error-Prone Workflows',
                  'Liquidity Fragmentation',
                  'Operational Risk'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-slate-800 rounded-2xl border border-slate-700 p-8 flex flex-col justify-end">
                <span className="text-4xl font-bold text-white mb-2">Manual</span>
                <span className="text-slate-500 uppercase text-xs tracking-widest">Settlement</span>
              </div>
              <div className="aspect-square bg-cyan-950/20 rounded-2xl border border-cyan-500/30 p-8 flex flex-col justify-end translate-y-8">
                <span className="text-4xl font-bold text-cyan-400 mb-2">Automated</span>
                <span className="text-slate-500 uppercase text-xs tracking-widest">Black IntelliSense</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold tracking-widest text-cyan-500 uppercase mb-3">Our Suite</h2>
            <h3 className="text-4xl font-bold text-white">Modular Architecture</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Sense 50 */}
            <div className="group bg-slate-900 border border-slate-800 rounded-3xl p-10 hover:border-cyan-500/50 transition-all">
              <div className="w-14 h-14 bg-cyan-600 rounded-xl mb-8 flex items-center justify-center text-white text-2xl font-bold italic">S50</div>
              <h4 className="text-2xl font-bold text-white mb-4">Sense 50 (Bridge Engine)</h4>
              <p className="text-slate-400 mb-8">
                A high-performance price aggregation and execution engine for institutional environments.
              </p>
              <ul className="space-y-3 mb-8">
                {['Real-time aggregation', 'Sub-millisecond latency', 'Full dealer control', 'Multi-asset support'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="text-cyan-400 font-semibold group-hover:gap-2 flex items-center gap-1 transition-all">
                Learn more <span>→</span>
              </button>
            </div>

            {/* IntelliTrade */}
            <div className="group bg-slate-900 border border-slate-800 rounded-3xl p-10 hover:border-blue-500/50 transition-all">
              <div className="w-14 h-14 bg-blue-600 rounded-xl mb-8 flex items-center justify-center text-white text-2xl font-bold italic">IT</div>
              <h4 className="text-2xl font-bold text-white mb-4">IntelliTrade (OTC Platform)</h4>
              <p className="text-slate-400 mb-8">
                Professional OTC trading interface tailored for institutional clients and OTC Desks.
              </p>
              <ul className="space-y-3 mb-8">
                {['Institutional-grade UX', 'Dealer markup control', 'Client Portal', 'Secure Trade Confirmation'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="text-blue-400 font-semibold group-hover:gap-2 flex items-center gap-1 transition-all">
                Learn more <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="text-4xl font-bold text-cyan-500 mb-4">01</div>
              <h5 className="text-xl font-bold text-white mb-3">Infrastructure First</h5>
              <p className="text-slate-400">We are not a broker. We do not compete with our clients. We only provide the technology.</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-500 mb-4">02</div>
              <h5 className="text-xl font-bold text-white mb-3">Accuracy Over Speed</h5>
              <p className="text-slate-400">While latency matters, accuracy in execution and settlement is our top priority for modern markets.</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-500 mb-4">03</div>
              <h5 className="text-xl font-bold text-white mb-3">Scalability</h5>
              <p className="text-slate-400">Built to handle institutional volume and multi-asset classes as your business grows globally.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center gap-2 mb-8">
            <div className="w-6 h-6 bg-cyan-500 rounded-sm flex items-center justify-center font-bold text-slate-950 text-xs">BI</div>
            <span className="text-lg font-bold tracking-tight text-white uppercase">Black IntelliSense</span>
          </div>
          <p className="text-slate-500 text-sm mb-8">
            © 2026 Black IntelliSense. All rights reserved. <br />
            Infrastructure for Modern Markets.
          </p>
          <div className="flex justify-center gap-6 text-slate-400">
            <a href="#" className="hover:text-white">LinkedIn</a>
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="mailto:support@blackintellisense.com" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
