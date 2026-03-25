/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Canvas } from '@react-three/fiber';
import { Suspense, useRef, useEffect } from 'react';
import Scene from './components/Scene';
import { Loader } from '@react-three/drei';
import { Play, User, ShoppingBag, ChevronLeft, ChevronRight, CircleDashed, Twitter, Youtube } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const section5Ref = useRef<HTMLElement>(null);
  const section6Ref = useRef<HTMLElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasContainerRef.current || !section6Ref.current) return;

    const ctx = gsap.context(() => {
      gsap.to(canvasContainerRef.current!, {
        yPercent: -100,
        ease: "none",
        scrollTrigger: {
          trigger: section6Ref.current!,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-[#050505] text-slate-50 font-sans overflow-x-hidden">
      {/* Fixed Orange Border Frame */}
      <div className="fixed inset-0 border-[12px] md:border-[20px] border-[#FF5A00] z-50 pointer-events-none"></div>

      {/* PREMIUM BACKGROUND (Z-0) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Radial Gradient Spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,90,0,0.06)_0%,rgba(5,5,5,0)_60%)]"></div>
        
        {/* Fine Grid Texture */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="premium-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#FFFFFF" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#premium-grid)" />
        </svg>
      </div>

      {/* BACKGROUND SCROLLING LAYER (Z-0) */}
      <div className="absolute top-0 left-0 w-full z-0">
        <section className="h-screen flex items-center justify-center overflow-hidden">
          <h1 className="text-[24vw] font-oswald font-bold text-white/10 leading-none tracking-[-0.05em] select-none transform scale-y-110 uppercase">
            STRIKE
          </h1>
        </section>
      </div>

      {/* HORIZONTAL FLIGHT LINES (Z-5) - sits between bg and 3D canvas so ball renders on top */}
      <div className="fixed inset-0 z-[5] pointer-events-none flex flex-col justify-around py-[8vh]">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-full border-b border-dashed border-slate-700/40" />
        ))}
      </div>

      {/* SECTION 4 RADAR BACKGROUND (Z-8) - scrolls with page, sits below 3D canvas */}
      <div className="absolute top-0 left-0 w-full z-[8] pointer-events-none">
        <div className="h-screen" />
        <div className="min-h-screen" />
        <div className="min-h-screen" />
        <div className="h-screen relative overflow-hidden">
          <svg
            viewBox="-720 -405 1440 810"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Crosshair dashed lines */}
            <line x1="-720" y1="0" x2="720" y2="0" stroke="#1e1e1e" strokeWidth="1" strokeDasharray="6 12" />
            <line x1="0" y1="-405" x2="0" y2="405" stroke="#1e1e1e" strokeWidth="1" strokeDasharray="6 12" />

            {/* Outer slowly rotating dashed ring */}
            <g className="radar-spin">
              <circle cx="0" cy="0" r="345" fill="none" stroke="#222" strokeWidth="1" strokeDasharray="5 14" />
              {([0, 90, 180, 270] as number[]).map(a => {
                const r = (a * Math.PI) / 180;
                return <line key={a} x1={340*Math.cos(r)} y1={340*Math.sin(r)} x2={358*Math.cos(r)} y2={358*Math.sin(r)} stroke="#FF5A00" strokeWidth="2.5" />;
              })}
              {([30,60,120,150,210,240,300,330] as number[]).map(a => {
                const r = (a * Math.PI) / 180;
                return <line key={a} x1={340*Math.cos(r)} y1={340*Math.sin(r)} x2={330*Math.cos(r)} y2={330*Math.sin(r)} stroke="#2e2e2e" strokeWidth="1" />;
              })}
            </g>

            {/* Middle counter-rotating ring */}
            <g className="radar-spin-reverse">
              <circle cx="0" cy="0" r="230" fill="none" stroke="#1e1e1e" strokeWidth="1" />
              {([0,45,90,135,180,225,270,315] as number[]).map(a => {
                const r = (a * Math.PI) / 180;
                const isCardinal = a % 90 === 0;
                return <line key={a}
                  x1={230*Math.cos(r)} y1={230*Math.sin(r)}
                  x2={(isCardinal ? 216 : 222)*Math.cos(r)} y2={(isCardinal ? 216 : 222)*Math.sin(r)}
                  stroke={isCardinal ? "#FF5A00" : "#2a2a2a"} strokeWidth={isCardinal ? "2" : "1"}
                />;
              })}
            </g>

            {/* Inner pulsing ring */}
            <circle cx="0" cy="0" r="135" fill="none" stroke="#1a1a1a" strokeWidth="1" className="radar-pulse" />
          </svg>
        </div>
      </div>

      {/* SECTION 5 PODIUM BACKGROUND (Z-8) - scrolls with page, sits below 3D canvas */}
      <div className="absolute top-0 left-0 w-full z-[8] pointer-events-none">
        {/* Spacer for sections 1-4 */}
        <div className="h-screen" />
        <div className="min-h-screen" />
        <div className="min-h-screen" />
        <div className="h-screen" />
        {/* Section 5 — podium behind ball */}
        <div className="h-screen relative">
          <div
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
            style={{ bottom: '-9vh', width: '100%' }}
          >
            {/* === TOP CYLINDER === */}
            <div style={{ width: '28vw', position: 'relative', zIndex: 3 }}>
              <div style={{
                width: '100%',
                height: '3.5vw',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse at 50% 50%, #2a2a2a 0%, #1a1a1a 60%, #111 100%)',
                position: 'relative',
                zIndex: 3,
                boxShadow: '0 0 20px rgba(255,255,255,0.15), inset 0 0 15px rgba(255,255,255,0.05)',
                border: '1.5px solid rgba(255,255,255,0.6)',
              }} />
              <div style={{
                width: '100%',
                height: '12vh',
                marginTop: '-1.75vw',
                background: 'linear-gradient(90deg, #080808 0%, #1e1e1e 15%, #2a2a2a 30%, #1a1a1a 50%, #2a2a2a 70%, #1e1e1e 85%, #080808 100%)',
                borderLeft: '1px solid rgba(255,255,255,0.06)',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0, bottom: 0,
                  left: '25%', width: '12%',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                }} />
              </div>
              <div style={{
                width: '100%',
                height: '3.5vw',
                borderRadius: '50%',
                background: '#0a0a0a',
                marginTop: '-1.75vw',
                position: 'relative',
                zIndex: 1,
              }} />
            </div>
            {/* === MIDDLE CYLINDER === */}
            <div style={{ width: '48vw', marginTop: '-2.5vw', position: 'relative', zIndex: 2 }}>
              <div style={{
                width: '100%',
                height: '4.5vw',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse at 50% 40%, #1e1e1e 0%, #141414 50%, #0c0c0c 100%)',
                position: 'relative',
                zIndex: 2,
                border: '1px solid rgba(255,255,255,0.08)',
              }} />
              <div style={{
                width: '100%',
                height: '10vh',
                marginTop: '-2.25vw',
                background: 'linear-gradient(90deg, #050505 0%, #141414 12%, #1c1c1c 28%, #151515 50%, #1c1c1c 72%, #141414 88%, #050505 100%)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0, bottom: 0,
                  left: '22%', width: '10%',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                }} />
              </div>
              <div style={{
                width: '100%',
                height: '4.5vw',
                borderRadius: '50%',
                background: '#060606',
                marginTop: '-2.25vw',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* FIXED 3D CANVAS (Z-10) */}
      <div ref={canvasContainerRef} className="fixed top-0 left-0 w-full h-screen z-10 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene containerRef={containerRef} section5Ref={section5Ref} section6Ref={section6Ref} />
          </Suspense>
        </Canvas>
      </div>

      {/* FOREGROUND SCROLLING LAYER (Z-20) */}
      <div className="relative z-20 w-full pointer-events-none">
        {/* Section 1: Hero */}
        <section className="h-screen w-full relative">
          {/* Header */}
          <header className="absolute top-0 left-0 w-full p-8 md:p-12 flex justify-between items-center pointer-events-auto">
            <div className="flex items-center gap-3">
              <CircleDashed className="w-8 h-8 md:w-10 md:h-10" />
              <div className="font-oswald font-bold text-lg md:text-xl leading-none uppercase tracking-[-0.02em]">
                Aero<br/>Strike
              </div>
            </div>
            <nav className="hidden md:flex gap-12 text-sm font-sans font-medium text-slate-300">
              <a href="#" className="text-[#FF5A00] hover:text-[#FF5A00] transition-colors">Produtos</a>
              <a href="#" className="hover:text-white transition-colors">Personalizar</a>
              <a href="#" className="hover:text-white transition-colors">Contato</a>
            </nav>
            <div className="flex gap-6">
              <User className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:text-[#FF5A00] transition-colors" />
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:text-[#FF5A00] transition-colors" />
            </div>
          </header>

          {/* Promo Video */}
          <div className="absolute left-8 md:left-12 top-1/2 -translate-y-1/2 flex items-center gap-4 pointer-events-auto cursor-pointer group">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-slate-600 flex items-center justify-center group-hover:border-[#FF5A00] transition-colors">
              <Play className="w-4 h-4 md:w-5 md:h-5 fill-current group-hover:text-[#FF5A00] transition-colors ml-1" />
            </div>
            <span className="hidden md:block text-xs font-sans font-semibold text-slate-400 uppercase tracking-widest leading-relaxed">Vídeo<br/>Promo</span>
          </div>

          {/* Price & Size */}
          <div className="absolute bottom-12 md:bottom-16 left-8 md:left-12 pointer-events-auto">
            <div className="text-3xl md:text-5xl font-sans font-bold text-[#FF5A00] mb-2 tracking-tight">R$ 599,90</div>
            <div className="text-xs font-sans font-medium text-slate-400 tracking-widest uppercase">
              Tamanho: <span className="text-white font-bold">65cm</span> • Oficial
            </div>
          </div>

          {/* Add to Cart */}
          <div className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 pointer-events-auto">
            <button className="bg-[#FF5A00] text-white px-8 py-4 md:px-16 md:py-5 font-sans font-bold tracking-widest uppercase hover:bg-[#ff7326] transition-colors shadow-[0_0_20px_rgba(255,90,0,0.3)] text-sm md:text-base">
              Adicionar ao Carrinho
            </button>
          </div>

          {/* Arrows */}
          <div className="absolute bottom-12 md:bottom-16 right-8 md:right-12 flex gap-4 pointer-events-auto">
            <button className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-slate-600 flex items-center justify-center hover:border-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-slate-600 flex items-center justify-center hover:border-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Pagination */}
          <div className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 rotate-90 origin-right text-xs tracking-widest font-mono font-bold hidden md:block">
            <span className="text-[#FF5A00]">01</span> <span className="text-slate-600">/ 06</span>
          </div>
        </section>

        {/* Section 2: Texture */}
        <section className="min-h-screen flex flex-col justify-center items-start text-left w-full max-w-7xl mx-auto px-8 md:px-24 pointer-events-auto">
          <div className="w-full md:w-1/2 flex flex-col items-start">

            {/* Top Badge */}
            <div className="border border-slate-600 rounded-full px-4 py-1 mb-8">
              <span className="text-[10px] md:text-xs font-sans font-semibold tracking-widest uppercase text-slate-300">MÉTRICAS DE PERFORMANCE</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-oswald font-bold tracking-[-0.02em] leading-[0.9] uppercase flex flex-col items-start mb-10">
              <span className="text-white">ADERÊNCIA</span>
              <span className="text-white">ABSOLUTA</span>
            </h2>

            {/* Metrics Group */}
            <div className="flex flex-col items-start w-full mb-8 gap-7">
              {/* Metric 1 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-700 flex items-center justify-center shrink-0 mt-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-3xl md:text-4xl font-sans font-bold text-white leading-none">32K</span>
                  <span className="text-[10px] md:text-xs font-sans font-semibold text-slate-400 tracking-widest uppercase mt-1 mb-2">PONTOS DE MICRO-TEXTURA</span>
                  <p className="text-sm font-sans font-normal text-slate-500 leading-relaxed max-w-xs">Superfície otimizada com 32.000 micro-covas, projetada para absorção de suor e máxima tração durante o toque.</p>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-700 flex items-center justify-center shrink-0 mt-1">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-3xl md:text-4xl font-sans font-bold text-white leading-none">100%</span>
                  <span className="text-[10px] md:text-xs font-sans font-semibold text-slate-400 tracking-widest uppercase mt-1 mb-2">MICROFIBRA PREMIUM</span>
                  <p className="text-sm font-sans font-normal text-slate-500 leading-relaxed max-w-xs">Material sintético de nível profissional que garante levantamentos milimétricos e controle excepcional de rotação.</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Section 3: Aerodynamics */}
        <section className="min-h-screen flex flex-col justify-center items-end text-right w-full max-w-7xl mx-auto px-8 md:px-24 pointer-events-auto">
          <div className="w-full md:w-1/2 flex flex-col items-end">

            {/* Top Badge */}
            <div className="border border-slate-600 rounded-full px-4 py-1 mb-8">
              <span className="text-[10px] md:text-xs font-sans font-semibold tracking-widest uppercase text-slate-300">AERODINÂMICA</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-oswald font-bold tracking-[-0.02em] leading-[0.9] uppercase flex flex-col items-end mb-10">
              <span className="text-white">TRAJETÓRIA</span>
              <span className="text-[#FF5A00]">ESTÁVEL</span>
            </h2>

            {/* Metrics Group */}
            <div className="flex flex-col items-end w-full mb-8 gap-5">
              {/* Metric 1 */}
              <div className="flex items-center justify-end gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-3xl md:text-4xl font-sans font-bold text-white leading-none">18</span>
                  <span className="text-[10px] md:text-xs font-sans font-semibold text-slate-400 tracking-widest uppercase mt-1">PAINÉIS AERODINÂMICOS</span>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-700 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="flex items-center justify-end gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-3xl md:text-4xl font-sans font-bold text-white leading-none">32.000</span>
                  <span className="text-[10px] md:text-xs font-sans font-semibold text-slate-400 tracking-widest uppercase mt-1">MICRO-COVAS</span>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-slate-700 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Footer Text */}
            <p className="text-sm md:text-base font-sans font-normal text-slate-400 text-right leading-relaxed w-full md:w-4/5">
              Distribuição de peso perfeitamente balanceada e design de painéis otimizado garantem um voo sem oscilações, permitindo saques e ataques com precisão milimétrica.
            </p>

          </div>
        </section>

        {/* Section 4: Technical Spec / Radar - text labels only (radar SVG is on z-[8] layer below ball) */}
        <section className="h-screen relative w-full overflow-hidden pointer-events-none" id="section4">

          {/* Top-left: MICRO-TEXTURA + metric */}
          <div className="absolute left-[8%] top-[28%] text-left">
            <div className="text-[11px] font-sans font-semibold text-slate-500 tracking-widest uppercase mb-2">MICRO-TEXTURA</div>
            <div className="flex items-center gap-3">
              <div className="w-px h-12 bg-white/70"></div>
              <div>
                <div className="text-4xl font-sans font-bold text-white leading-none">32K</div>
                <div className="text-[11px] font-sans font-semibold text-slate-500 tracking-widest uppercase mt-1">PONTOS DE CONTATO</div>
              </div>
            </div>
          </div>

          {/* Center-left: PRESSÃO — aligned with MICRO-TEXTURA (left-[8%]) */}
          <div className="absolute left-[8%] top-1/2 -translate-y-1/2 text-left">
            <div className="text-[9px] font-sans font-semibold text-slate-500 tracking-widest uppercase">PRESSÃO: 0.30 kPa</div>
          </div>

          {/* Center-right: ROTAÇÃO — aligned with Alta-Aderência bar (right-[8%]) */}
          <div className="absolute right-[8%] top-1/2 -translate-y-1/2 text-right">
            <div className="text-[9px] font-sans font-semibold text-slate-500 tracking-widest uppercase">ROTAÇÃO: 18 rpm</div>
          </div>

          {/* Bottom-center: PROFUNDIDADE */}
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 text-center">
            <div className="text-[9px] font-sans font-semibold text-slate-500 tracking-widest uppercase">PROFUNDIDADE DO CANAL</div>
          </div>

          {/* Bottom-right: Alta-Aderência */}
          <div className="absolute right-[8%] bottom-[30%] text-right">
            <div className="flex items-center justify-end gap-3">
              <div>
                <div className="text-3xl font-sans font-bold text-white leading-none">Alta-Aderência</div>
                <div className="flex items-center justify-end gap-2 mt-2">
                  <div className="w-px h-4 bg-slate-500"></div>
                  <div className="text-[11px] font-sans font-semibold text-slate-400 tracking-widest uppercase">SPEC. TÉCNICA</div>
                  <div className="w-px h-4 bg-slate-500"></div>
                </div>
              </div>
              <div className="w-px h-12 bg-white/70"></div>
            </div>
          </div>

        </section>
        {/* Section 5: The Champion */}
        <section
          ref={section5Ref}
          className="h-screen relative w-full overflow-hidden pointer-events-none"
        >
          {/* Title block */}
          <div className="absolute top-14 md:top-20 left-1/2 -translate-x-1/2 text-center z-10 whitespace-nowrap">
            <p className="text-[10px] font-sans font-semibold tracking-[0.5em] uppercase text-slate-500 mb-3">
              EDIÇÃO LIMITADA
            </p>
            <h2 className="text-[11vw] md:text-[8vw] font-oswald font-bold uppercase leading-none tracking-tight text-white">
              A CAMPEÃ
            </h2>
          </div>

          {/* Left stat */}
          <div className="absolute left-[8%] top-1/2 -translate-y-1/2 text-left">
            <div className="text-[10px] font-sans font-semibold text-[#FF5A00] tracking-widest uppercase mb-3">
              NÍVEL 01
            </div>
            <div className="text-2xl md:text-3xl font-sans font-bold text-white mb-3">Classe Elite</div>
            <div className="w-10 h-px bg-slate-700 mb-4" />
            <p className="text-xs font-sans text-slate-400 leading-relaxed max-w-[160px]">
              Projetada para o mais alto nível de competição.
            </p>
          </div>

          {/* Right stat */}
          <div className="absolute right-[8%] top-1/2 -translate-y-1/2 text-right">
            <div className="text-[10px] font-sans font-semibold text-[#FF5A00] tracking-widest uppercase mb-3">
              CERTIFICADA
            </div>
            <div className="text-2xl md:text-3xl font-sans font-bold text-white mb-3">Padrão Ouro</div>
            <div className="w-10 h-px bg-slate-700 mb-4 ml-auto" />
            <p className="text-xs font-sans text-slate-400 leading-relaxed max-w-[160px] ml-auto text-right">
              Atende todas as exigências oficiais de peso e tamanho.
            </p>
          </div>

        </section>
        {/* Section 6: Defy Gravity — CTA final */}
        <section
          ref={section6Ref}
          className="h-screen relative w-full overflow-hidden pointer-events-none"
        >

          {/* === MAIN TEXT === */}
          <div className="absolute top-[12%] left-1/2 -translate-x-1/2 text-center w-full flex flex-col items-center">
            {/* Badge */}
            <div className="inline-flex items-center border border-[#FF5A00]/60 rounded-full px-6 py-[7px] mb-10">
              <span className="text-[9px] font-sans font-semibold tracking-[0.5em] uppercase text-[#FF5A00]">
                PERFORMANCE DO PRÓXIMO NÍVEL
              </span>
            </div>
            {/* DESAFIE */}
            <div
              className="font-oswald font-bold uppercase leading-none tracking-[0.08em] select-none text-slate-700"
              style={{ fontSize: 'clamp(32px, 5vw, 72px)' }}
            >
              DESAFIE
            </div>
            {/* A GRAVIDADE. */}
            <div
              className="font-oswald font-bold uppercase leading-none tracking-[-0.02em] select-none mt-1"
              style={{ fontSize: 'clamp(48px, 8vw, 120px)', color: '#ffffff' }}
            >
              A GRAVIDADE<span style={{ color: '#FF5A00' }}>.</span>
            </div>
            {/* Subtitle */}
            <div className="w-12 h-px bg-slate-700 mt-8 mb-6" />
            <p className="text-xs md:text-sm font-sans text-slate-500 tracking-wide max-w-md leading-relaxed">
              Engenharia de precisão para atletas que não aceitam limites.
            </p>
          </div>

          {/* === BOTTOM BAR === */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
            {/* Divider */}
            <div className="w-full h-px bg-slate-800" />
            {/* Footer info row */}
            <div className="flex items-center justify-between px-8 md:px-16 h-[56px]">
              <div className="flex items-center gap-5 text-[10px] font-sans font-semibold tracking-widest uppercase text-slate-500">
                <span className="flex items-center gap-2">
                  <span className="w-[6px] h-[6px] rounded-full bg-[#FF5A00] shrink-0" />
                  LOJA OFICIAL
                </span>
                <span className="text-slate-700">|</span>
                <span className="flex items-center gap-2">
                  <span className="w-[6px] h-[6px] rounded-full bg-[#FF5A00] shrink-0" />
                  ENVIO MUNDIAL
                </span>
              </div>
              <div className="flex items-center gap-5 text-slate-600">
                <Twitter className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
                <CircleDashed className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
                <Youtube className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
              </div>
              <div className="text-[10px] font-sans font-semibold tracking-widest uppercase text-slate-500">
                COMPRA SEGURA
              </div>
            </div>
            {/* Divider */}
            <div className="w-full h-px bg-slate-800" />
            {/* CTA */}
            <div className="flex items-center justify-center py-12 md:py-14">
              <button className="bg-white text-black px-16 md:px-24 py-5 font-oswald font-bold text-xl md:text-2xl uppercase tracking-widest hover:bg-slate-100 transition-colors">
                VER COLEÇÃO
              </button>
            </div>
            {/* Copyright */}
            <div className="flex flex-wrap items-center justify-between px-8 md:px-16 pb-5 gap-3">
              <p className="text-[10px] font-sans text-slate-700 tracking-widest uppercase">
                © 2026 AEROSTRIKE. PROJETADA PARA A GRANDEZA.
              </p>
              <a
                href="https://volna.today"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-sans text-slate-700 tracking-widest uppercase hover:text-slate-400 transition-colors"
              >
                Desenvolvido por Volna Inteligência Criativa
              </a>
            </div>
          </div>
        </section>
      </div>
      <Loader />
    </div>
  );
}
