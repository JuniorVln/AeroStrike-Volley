/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Canvas } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import Scene from './components/Scene';
import { Loader } from '@react-three/drei';
import { Play, User, ShoppingBag, ChevronLeft, ChevronRight, CircleDashed } from 'lucide-react';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative w-full bg-[#0B0F19] text-slate-50 font-sans overflow-x-hidden">
      {/* Fixed Orange Border Frame */}
      <div className="fixed inset-0 border-[12px] md:border-[20px] border-[#FF5A00] z-50 pointer-events-none"></div>

      {/* BACKGROUND SCROLLING LAYER (Z-0) */}
      <div className="absolute top-0 left-0 w-full z-0">
        <section className="h-screen flex items-center justify-center overflow-hidden">
          <h1 className="text-[24vw] font-oswald font-bold text-[#1E293B] leading-none tracking-[-0.05em] select-none transform scale-y-110 uppercase">
            STRIKE
          </h1>
        </section>
      </div>

      {/* FIXED 3D CANVAS (Z-10) */}
      <div className="fixed top-0 left-0 w-full h-screen z-10 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene containerRef={containerRef} />
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
            <span className="text-[#FF5A00]">01</span> <span className="text-slate-600">/ 04</span>
          </div>
        </section>

        {/* Section 2: Texture */}
        <section className="min-h-screen flex flex-col justify-center items-end text-right w-full max-w-7xl mx-auto px-8 md:px-24 pointer-events-auto">
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl md:text-6xl font-oswald font-bold tracking-[-0.02em] mb-6 leading-tight uppercase">
              Aderência <br />
              <span className="text-[#FF5A00]">Micro-Texturizada.</span>
            </h2>
            <p className="text-lg md:text-xl font-sans font-normal text-slate-400 mb-8">
              Superfície com 32.000 micro-covas e controle de umidade avançado. Levantamentos perfeitos e precisos, mesmo sob suor extremo.
            </p>
          </div>
        </section>

        {/* Section 3: Aerodynamics */}
        <section className="min-h-screen flex flex-col justify-center items-start w-full max-w-7xl mx-auto px-8 md:px-24 pointer-events-auto">
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl md:text-6xl font-oswald font-bold tracking-[-0.02em] mb-6 leading-tight uppercase">
              Vôo Estável. <br />
              <span className="text-[#FF5A00]">Cortes Letais.</span>
            </h2>
            <p className="text-lg md:text-xl font-sans font-normal text-slate-400 mb-8">
              Design inovador de 8 painéis fundidos termicamente. Reduz a turbulência do ar, garantindo uma trajetória previsível e indefensável.
            </p>
          </div>
        </section>

        {/* Section 4: CTA */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center w-full max-w-2xl mx-auto px-8 pointer-events-auto">
          <h2 className="text-5xl md:text-7xl font-oswald font-bold tracking-[-0.02em] mb-6 leading-tight uppercase">
            Domine a <br />
            <span className="text-[#FF5A00]">Quadra.</span>
          </h2>
          <p className="text-lg md:text-xl font-sans font-normal text-slate-400 mb-10">
            Eleve seu jogo para o nível profissional. Adquira a AeroStrike Pro hoje com frete grátis e garantia de performance.
          </p>
          <button className="bg-[#FF5A00] text-white px-12 py-5 font-sans font-bold text-lg uppercase tracking-widest hover:bg-[#ff7326] transition-colors shadow-[0_0_30px_rgba(255,90,0,0.3)]">
            Comprar Agora - R$ 599,90
          </button>
        </section>
      </div>
      <Loader />
    </div>
  );
}
