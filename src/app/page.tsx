import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cyan-500 rounded-sm flex items-center justify-center font-bold text-slate-950">BI</div>
              <span className="text-xl font-bold tracking-tight text-white">BLACK INTELLISENSE</span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <a href="#features" className="hover:text-cyan-400 transition-colors">Products</a>
              <a href="#mission" className="hover:text-cyan-400 transition-colors">Mission</a>
              <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
              <a href="#contact" className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md transition-all">Get Started</a>
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
            Black IntelliSense
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-10">
            Building the Intelligence Between Liquidity and Markets.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#features" className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg shadow-cyan-900/20 transition-all inline-block">
              Discover Platform
            </a>
            <a href="#contact" className="bg-slate-900 hover:bg-slate-800 border border-slate-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all inline-block">
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold tracking-widest text-cyan-500 uppercase mb-3">Our Technology</h2>
            <h3 className="text-4xl font-bold text-white mb-4">Core Infrastructure</h3>
            <p className="text-slate-400">Advanced tools designed for the next generation of financial markets.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Sense 50 */}
            <div className="group bg-slate-900 border border-slate-800 rounded-3xl p-10 hover:border-cyan-500/50 transition-all">
              <div className="w-14 h-14 bg-cyan-600/10 border border-cyan-500/20 rounded-xl mb-8 flex items-center justify-center text-cyan-400 text-2xl font-bold italic">S50</div>
              <h4 className="text-2xl font-bold text-white mb-4">Bridge Engine (Sense 50)</h4>
              <p className="text-slate-400">
                High-performance price aggregation and execution engine bridging Market Makers/LPs with Brokers/OTC desks.
              </p>
            </div>

            {/* IntelliTrade */}
            <div className="group bg-slate-900 border border-slate-800 rounded-3xl p-10 hover:border-blue-500/50 transition-all">
              <div className="w-14 h-14 bg-blue-600/10 border border-blue-500/20 rounded-xl mb-8 flex items-center justify-center text-blue-400 text-2xl font-bold italic">IT</div>
              <h4 className="text-2xl font-bold text-white mb-4">OTC Trading Platform (IntelliTrade)</h4>
              <p className="text-slate-400">
                Professional interface for institutional environments. Seamlessly execute large block trades with zero slippage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-semibold tracking-widest text-cyan-500 uppercase mb-3">Our Mission</h2>
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">Connecting the Fragmented World of Liquidity</h3>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                We exist to bridge the gap between institutional liquidity providers and the brokers who need them. By automating settlement and providing real-time aggregation, we're building the nervous system of modern finance.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-10">
                {[
                  { title: 'Real-time Aggregation', icon: '⚡' },
                  { title: 'Payment Reconciliation', icon: '📊' },
                  { title: 'OTC Simplification', icon: '💎' },
                  { title: 'Liquidity Hub', icon: '🌐' }
                ].map((item) => (
                  <div key={item.title} className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-sm font-medium text-slate-300">{item.title}</span>
                  </div>
                ))}
              </div>

              <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all">
                <span>Download our deck</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent blur-3xl -z-10"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-video bg-slate-900 rounded-xl border border-slate-800"></div>
                <div className="aspect-video bg-slate-900 rounded-xl border border-slate-800 mt-8"></div>
                <div className="aspect-video bg-slate-900 rounded-xl border border-slate-800 -mt-8"></div>
                <div className="aspect-video bg-slate-900 rounded-xl border border-slate-800"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-slate-900/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Get in Touch</h2>
          <p className="text-slate-400 mb-12">Ready to modernize your liquidity infrastructure? Send us a message.</p>
          
          <form className="space-y-6 text-left">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Name</label>
                <input type="text" placeholder="John Doe" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                <input type="email" placeholder="john@company.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Message</label>
              <textarea rows={4} placeholder="Tell us about your needs..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"></textarea>
            </div>
            <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-lg font-bold transition-all">Send Message</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-cyan-500 rounded-sm flex items-center justify-center font-bold text-slate-950 text-xs">BI</div>
            <span className="text-lg font-bold tracking-tight text-white">BLACK INTELLISENSE</span>
          </div>
          <div className="text-slate-500 text-sm text-center md:text-left">
            <p>© 2026 Black IntelliSense. All rights reserved.</p>
            <p className="mt-1">PT. PERDAGANGAN TEKNOLOGI INTELLISENSE</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
