'use client';

import React, { useState, useEffect } from 'react';
import Web3SignIn from '@/components/Web3SignIn';

export default function LandingPage() {
  const [lang, setLang] = useState<'EN' | 'ID'>('EN');
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = {
    EN: {
      nav: [
        { name: 'Problem', href: '#problem' },
        { name: 'Suite', href: '#suite' },
        { name: 'Philosophy', href: '#philosophy' },
        { name: 'IntelliTrade', href: '/intellitrade' }
      ],
      hero: {
        badge: 'A Single Intelligent Layer for Global Markets',
        title1: 'Modern',
        title2: 'Infrastructure',
        desc: 'Pioneering the intelligent nexus between liquidity discovery and execution. Engineering the future of institutional finance.',
        btn1: 'Enter Suite',
        btn2: 'Demo Request'
      },
      challenge: {
        ch: 'Chapter 01 // The Problem',
        title: 'Institutional Fragmentation',
        quote: '"Liquidity sources are scattered, systems operate in silos, and settlement workflows remain manual and error-prone."',
        items: [
          { t: 'Disconnected Venues', d: 'Global liquidity lacks a unified intelligent layer for real-time discovery.' },
          { t: 'Fragmented Execution', d: 'Legacy silos preventing comprehensive end-to-end trade visibility.' },
          { t: 'Operational Fragility', d: 'Manual settlement dependencies creating critical failure points.' }
        ],
        risk: 'Target Risk Reduction',
        riskDesc: 'By Unifying discovery, execution, and settlement.'
      },
      products: {
        ch: 'Chapter 02 // The Solution',
        title: 'Proprietary Ecosystem',
        s50: {
          tag: 'The Intelligent Bridge',
          desc: 'Consolidating global market depth into a single, high-throughput intelligent feed for institutional execution.',
          feats: ['Sub-ms Routing', 'Custom Execution', 'API-First Architecture', 'Real-time Aggregation']
        },
        it: {
          tag: 'OTC Institutional Portal',
          desc: 'Professional grade OTC interface with dealer-controlled markup models and seamless client-broker workflows.',
          feats: ['Dealer Markup', 'White-Label UI', 'Audit Ready', 'Direct Settlement']
        },
        roadmap: 'Currently Active: Crypto Assets (Spot) • Roadmap: FX, Derivatives & Structured Products'
      },
      philosophy: {
        ch: '03 // Core Philosophy',
        title: 'The 4 Pillars',
        items: [
          { id: '01', title: 'Infrastructure First', desc: 'We enable your business, we don’t compete with it. No conflicts of interest.', sub: 'Non-Brokerage Model' },
          { id: '02', title: 'Automation / Control', desc: 'Automate the routine, elevate the human. Preservation of dealer judgment.', sub: 'Human-in-the-Loop' },
          { id: '03', title: 'Accuracy Over Speed', desc: 'Fast is good, right is essential. Precision execution in all market conditions.', sub: 'Reliability First' },
          { id: '04', title: 'Modular Scalability', desc: 'Grow your business, not your burden. Modular design for zero complexity.', sub: 'No Rip-and-Replace' }
        ]
      },
      vision: {
        ch: 'Strategic Vision // Scaling Global',
        title: 'The Nervous System',
        quote: '"Engineering the nexus between liquidity and global markets through a single modular source of truth."',
        btn: 'DOWNLOAD DECK'
      },
      contact: {
        title: 'Connect The Future',
        sub: 'Global Institutional Onboarding',
        labels: ['CORPORATE ENTITY', 'OFFICIAL EMAIL', 'INFRASTRUCTURE REQUIREMENTS'],
        placeholders: ['NAME OF ENTITY', 'INSTITUTIONAL DOMAIN', 'HOW CAN WE ENABLE YOUR BUSINESS?'],
        btn: 'INITIATE CONNECTION'
      },
      footer: 'Infrastructure for Modern Markets',
      legal: 'PT. PERDAGANGAN TEKNOLOGI INTELLISENSE. ALL RIGHTS RESERVED. FOR INSTITUTIONAL COUNTERPARTIES ONLY.'
    },
    ID: {
      nav: [
        { name: 'Masalah', href: '#problem' },
        { name: 'Produk', href: '#suite' },
        { name: 'Filosofi', href: '#philosophy' },
        { name: 'IntelliTrade', href: '/intellitrade' }
      ],
      hero: {
        badge: 'Satu Lapisan Cerdas untuk Pasar Global',
        title1: 'Infrastruktur',
        title2: 'Modern',
        desc: 'Mempelopori hubungan cerdas antara penemuan likuiditas dan eksekusi. Merancang masa depan keuangan institusional.',
        btn1: 'Masuk Suite',
        btn2: 'Minta Demo'
      },
      challenge: {
        ch: 'Bab 01 // Masalah Utama',
        title: 'Fragmentasi Institusional',
        quote: '"Sumber likuiditas tersebar, sistem beroperasi secara terisolasi, dan alur kerja penyelesaian tetap manual serta rentan kesalahan."',
        items: [
          { t: 'Venue Terputus', d: 'Likuiditas global kekurangan lapisan cerdas terpadu untuk penemuan real-time.' },
          { t: 'Eksekusi Terfragmentasi', d: 'Silo sistem lama mencegah visibilitas perdagangan ujung-ke-ujung yang komprehensif.' },
          { t: 'Kerapuhan Operasional', d: 'Ketergantungan penyelesaian manual menciptakan titik kegagalan kritis.' }
        ],
        risk: 'Target Pengurangan Risiko',
        riskDesc: 'Dengan menyatukan penemuan, eksekusi, dan penyelesaian.'
      },
      products: {
        ch: 'Bab 02 // Solusi Kami',
        title: 'Ekosistem Mandiri',
        s50: {
          tag: 'Jembatan Cerdas',
          desc: 'Mengonsolidasikan kedalaman pasar global ke dalam satu umpan cerdas berkapasitas tinggi untuk eksekusi institusi.',
          feats: ['Routing Sub-ms', 'Eksekusi Kustom', 'Arsitektur API-First', 'Agregasi Real-time']
        },
        it: {
          tag: 'Portal OTC Institusi',
          desc: 'Antarmuka OTC kelas profesional dengan model markup yang dikontrol dealer dan alur kerja klien-broker yang mulus.',
          feats: ['Kontrol Markup', 'UI Label Putih', 'Siap Audit', 'Penyelesaian Langsung']
        },
        roadmap: 'Aktif Saat Ini: Aset Kripto (Spot) • Roadmap: FX, Derivatif & Produk Terstruktur'
      },
      philosophy: {
        ch: '03 // Filosofi Inti',
        title: '4 Pilar Utama',
        items: [
          { id: '01', title: 'Utamakan Infrastruktur', desc: 'Kami mendukung bisnis Anda, bukan bersaing dengannya. Tanpa konflik kepentingan.', sub: 'Model Non-Broker' },
          { id: '02', title: 'Otomasi / Kontrol', desc: 'Otomatiskan rutinitas, angkat peran manusia. Mempertahankan penilaian dealer.', sub: 'Human-in-the-Loop' },
          { id: '03', title: 'Akurasi di Atas Kecepatan', desc: 'Cepat itu baik, tepat itu krusial. Eksekusi presisi dalam semua kondisi pasar.', sub: 'Utamakan Reliabilitas' },
          { id: '04', title: 'Skalabilitas Modular', desc: 'Kembangkan bisnis Anda, bukan beban Anda. Desain modular untuk nol kompleksitas.', sub: 'Tanpa Ganti-Total' }
        ]
      },
      vision: {
        ch: 'Visi Strategis // Skala Global',
        title: 'Sistem Saraf',
        quote: '"Merancang hubungan antara likuiditas dan pasar global melalui satu sumber kebenaran modular."',
        btn: 'UNDUH DECK'
      },
      contact: {
        title: 'Hubungkan Masa Depan',
        sub: 'Pendaftaran Institusi Global',
        labels: ['ENTITAS KORPORASI', 'EMAIL RESMI', 'KEBUTUHAN INFRASTRUKTUR'],
        placeholders: ['NAMA ENTITAS', 'DOMAIN INSTITUSI', 'BAGAIMANA KAMI DAPAT MENDUKUNG BISNIS ANDA?'],
        btn: 'MULAI KONEKSI'
      },
      footer: 'Infrastruktur untuk Pasar Modern',
      legal: 'PT. PERDAGANGAN TEKNOLOGI INTELLISENSE. SELURUH HAK CIPTA DILINDUNGI. HANYA UNTUK REKANAN INSTITUSI.'
    }
  };

  const curr = t[lang];

  useEffect(() => {
    const canvas = document.getElementById('network-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    const particleCount = 60;
    const connectionDistance = 150;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; initParticles(); };
    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, size: Math.random() * 1.5 + 0.5 });
      }
    };
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = 'rgba(59, 130, 246, 0.4)'; ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]; const dx = p.x - p2.x; const dy = p.y - p2.y; const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) { ctx.beginPath(); ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - dist / connectionDistance)})`; ctx.lineWidth = 0.5; ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke(); }
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
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-all scale-100 hover:scale-110 z-10"><svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path></svg></button>
          <img src={activeImage} className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-[0_0_100px_rgba(59,130,246,0.2)] animate-in zoom-in-95 duration-500 border border-white/10" alt="Interface" />
        </div>
      )}

      {/* Network Background */}
      <div className="fixed inset-0 z-0 bg-black pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(29,78,216,0.2),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
        <canvas id="network-canvas" className="absolute inset-0 opacity-40"></canvas>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 border-b ${scrolled ? 'bg-black/60 backdrop-blur-3xl border-white/5 py-4' : 'bg-transparent border-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src="/logo.jpg" alt="Logo" className="w-11 h-11 object-contain rounded-xl transition-all duration-700 group-hover:scale-110" />
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black tracking-tighter italic uppercase text-white">BLACKINTELLI<span className="text-blue-500">SENSE</span></span>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-12">
               <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
                 <button onClick={() => setLang('EN')} className={`px-4 py-1.5 rounded-full text-[9px] font-black transition-all ${lang === 'EN' ? 'bg-white text-black shadow-xl' : 'text-white/40 hover:text-white'}`}>EN</button>
                 <button onClick={() => setLang('ID')} className={`px-4 py-1.5 rounded-full text-[9px] font-black transition-all ${lang === 'ID' ? 'bg-white text-black shadow-xl' : 'text-white/40 hover:text-white'}`}>ID</button>
               </div>
               
               <div className="flex items-center space-x-8">
                {curr.nav.map((item, i) => (
                  <a 
                    key={i} 
                    href={item.href} 
                    className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:text-blue-500 ${item.name === 'IntelliTrade' ? 'text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full bg-blue-500/5' : 'text-white/40'}`}
                  >
                    {item.name}
                  </a>
                ))}
               </div>

              <Web3SignIn />
              <a href="#contact" className="bg-white text-black px-10 py-3 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-2xl font-black italic tracking-widest text-[11px]">CONNECT</a>
            </div>

            <button className="lg:hidden text-white/50" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-64 pb-32 px-6 z-10 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="inline-block px-6 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.5em] text-blue-400 mb-12 animate-fade-in">{curr.hero.badge}</div>
          <h1 className="text-[12vw] md:text-[9vw] font-black uppercase italic leading-[0.85] tracking-tighter mb-12 animate-fade-in [animation-delay:200ms]">
            {curr.hero.title1}<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-400 to-indigo-500">{curr.hero.title2}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/40 font-bold leading-relaxed uppercase tracking-wider mb-20 animate-fade-in [animation-delay:400ms]">{curr.hero.desc}</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-fade-in [animation-delay:600ms]">
            <a href="#suite" className="w-full md:w-auto bg-blue-600 text-white px-16 py-8 rounded-full font-black text-xl tracking-tighter hover:bg-blue-700 transition-all shadow-[0_0_50px_rgba(37,99,235,0.3)] uppercase italic">{curr.hero.btn1}</a>
            <a href="#contact" className="w-full md:w-auto border-2 border-white/10 hover:border-white/20 text-white px-16 py-8 rounded-full font-black text-xl tracking-tighter transition-all uppercase italic">{curr.hero.btn2}</a>
          </div>
        </div>
      </header>

      {/* Problem Section */}
      <section id="problem" className="relative py-48 z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            <div>
              <div className="text-blue-500 font-black text-xs uppercase tracking-[0.8em] mb-12">{curr.challenge.ch}</div>
              <h2 className="text-7xl md:text-9xl font-black uppercase italic leading-[0.8] tracking-tighter mb-16">{curr.challenge.title}</h2>
              <div className="border-l-8 border-blue-600 pl-12 py-4 mb-16">
                <p className="text-2xl md:text-4xl font-black italic tracking-tight text-white/80 leading-tight">{curr.challenge.quote}</p>
              </div>
            </div>
            <div className="space-y-12">
              {curr.challenge.items.map((item, i) => (
                <div key={i} className="group p-10 bg-white/5 border border-white/5 rounded-[3rem] hover:bg-white/[0.08] transition-all duration-700">
                  <h4 className="text-2xl font-black uppercase italic tracking-tighter mb-4 text-blue-500">{item.t}</h4>
                  <p className="text-white/40 font-bold uppercase tracking-wider leading-relaxed">{item.d}</p>
                </div>
              ))}
              <div className="mt-20 p-12 bg-blue-600 rounded-[3rem] shadow-2xl">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-200 mb-4">{curr.challenge.risk}</div>
                <p className="text-3xl font-black italic uppercase tracking-tighter text-white">{curr.challenge.riskDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="suite" className="relative py-48 z-10 px-6 bg-white rounded-[5rem] text-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <div className="text-blue-600 font-black text-xs uppercase tracking-[0.8em] mb-12">{curr.products.ch}</div>
            <h2 className="text-7xl md:text-9xl font-black uppercase italic leading-[0.8] tracking-tighter">{curr.products.title}</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* S50 */}
            <div className="group relative overflow-hidden bg-black rounded-[4rem] p-16 text-white transition-all duration-700 hover:scale-[1.02]">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full"></div>
              <div className="relative z-10">
                <div className="bg-blue-600 inline-block px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-12">{curr.products.s50.tag}</div>
                <h3 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-10 leading-none">S50-MARKET<br /><span className="text-blue-500">AGGREGATOR</span></h3>
                <p className="text-xl text-white/40 font-bold uppercase tracking-widest leading-relaxed mb-16">{curr.products.s50.desc}</p>
                <div className="grid grid-cols-2 gap-6 mb-16">
                  {curr.products.s50.feats.map(f => (
                    <div key={f} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-blue-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>{f}
                    </div>
                  ))}
                </div>
                <button className="bg-white text-black px-12 py-6 rounded-full font-black uppercase italic tracking-tighter hover:bg-blue-600 hover:text-white transition-all" onClick={() => setActiveImage('/s50.jpg')}>EXPLORE ARCHITECTURE</button>
              </div>
            </div>

            {/* IT */}
            <div className="group relative overflow-hidden bg-blue-600 rounded-[4rem] p-16 text-white transition-all duration-700 hover:scale-[1.02]">
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full"></div>
              <div className="relative z-10">
                <div className="bg-black/20 inline-block px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-12">{curr.products.it.tag}</div>
                <h3 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-10 leading-none">INTELLI<br /><span className="text-black">TRADE</span></h3>
                <p className="text-xl text-white/80 font-bold uppercase tracking-widest leading-relaxed mb-16">{curr.products.it.desc}</p>
                <div className="grid grid-cols-2 gap-6 mb-16">
                  {curr.products.it.feats.map(f => (
                    <div key={f} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-white">
                      <div className="w-2 h-2 bg-white rounded-full"></div>{f}
                    </div>
                  ))}
                </div>
                <button className="bg-black text-white px-12 py-6 rounded-full font-black uppercase italic tracking-tighter hover:bg-white hover:text-black transition-all" onClick={() => setActiveImage('/otc.jpg')}>LAUNCH PORTAL</button>
              </div>
            </div>
          </div>

          <div className="mt-24 p-10 bg-black/5 rounded-[3rem] text-center">
            <p className="text-sm font-black uppercase tracking-[0.6em] text-black/40 italic">{curr.products.roadmap}</p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="relative py-48 z-10 px-6 bg-white text-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <div className="text-blue-600 font-black text-xs uppercase tracking-[0.8em] mb-12">{curr.philosophy.ch}</div>
            <h2 className="text-7xl md:text-9xl font-black uppercase italic leading-[0.8] tracking-tighter">{curr.philosophy.title}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {curr.philosophy.items.map(p => (
              <div key={p.id} className="group border-t-4 border-black/10 pt-12 transition-all hover:border-blue-600">
                <div className="text-blue-600 font-black text-[4rem] mb-10 italic tracking-tighter leading-none">{p.id}</div>
                <h5 className="text-2xl font-black uppercase mb-6 italic tracking-tighter leading-none">{p.title}</h5>
                <p className="text-sm font-bold text-black/40 mb-10 leading-relaxed uppercase tracking-wider">{p.desc}</p>
                <div className="inline-block px-4 py-1.5 bg-black/5 rounded-full text-[10px] font-black uppercase tracking-widest text-black/60 italic">{p.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Section */}
      <section id="contact" className="relative py-48 z-10 px-4 md:px-12 text-center">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-blue-800 via-blue-950 to-black rounded-[5rem] p-12 md:p-32 relative overflow-hidden shadow-2xl border border-white/10">
            <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-white mb-10 uppercase italic leading-[0.8]">{curr.contact.title}</h2>
            <p className="text-xl md:text-3xl text-blue-300 font-bold uppercase tracking-[0.4em] italic mb-20">{curr.contact.sub}</p>
            <form className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 text-left max-w-4xl mx-auto">
              {curr.contact.labels.slice(0,2).map((l, i) => (
                <div key={i} className="space-y-2">
                  <label className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] ml-6">{l}</label>
                  <input type="text" placeholder={curr.contact.placeholders[i]} className="w-full bg-black/40 border-2 border-white/5 rounded-full px-10 py-7 font-black tracking-widest text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500 transition-all uppercase" />
                </div>
              ))}
              <div className="md:col-span-2 space-y-2">
                <label className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] ml-6">{curr.contact.labels[2]}</label>
                <textarea rows={4} placeholder={curr.contact.placeholders[2]} className="w-full bg-black/40 border-2 border-white/5 rounded-[3rem] px-10 py-10 font-black tracking-widest text-white placeholder:text-white/10 focus:outline-none focus:border-blue-500 transition-all uppercase"></textarea>
              </div>
              <button className="md:col-span-2 bg-white text-black py-10 rounded-full font-black text-3xl tracking-tighter hover:bg-blue-600 hover:text-white transition-all duration-700 uppercase italic">{curr.contact.btn}</button>
            </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 z-10 relative px-6 bg-black border-t border-white/5 text-center">
          <div className="flex flex-col items-center gap-6 mb-12">
            <img src="/logo.jpg" className="w-16 h-16 object-contain" alt="Logo" />
            <span className="text-4xl font-black italic tracking-tighter uppercase text-white">BLACKINTELLI<span className="text-blue-500">SENSE</span></span>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.8em]">{curr.footer}</p>
          </div>
          <p className="text-white/10 text-[9px] font-black uppercase tracking-[1em] max-w-2xl mx-auto leading-loose border-t border-white/5 pt-16">{curr.legal}</p>
      </footer>

      <style jsx global>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        html { scroll-behavior: smooth; }
        body { background-color: #020205; color-scheme: dark; }
      `}</style>
    </div>
  );
}
