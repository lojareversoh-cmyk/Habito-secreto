
import React from 'react';

interface Props {
  onRestart: () => void;
}

const RevealScreen: React.FC<Props> = ({ onRestart }) => {
  return (
    <div className="bg-background-dark font-display text-white min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#13ec5b20_0%,transparent_70%)] pointer-events-none"></div>
      
      <header className="sticky top-0 z-50 w-full border-b border-[#28392e] bg-background-dark/80 backdrop-blur-md">
        <div className="px-6 md:px-10 py-3 flex items-center justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <div className="size-8 text-primary">
              <span className="material-symbols-outlined text-3xl">lock_open_right</span>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-tight hidden sm:block">Desafio do Hábito Secreto</h2>
          </div>
          <button onClick={onRestart} className="text-gray-300 hover:text-primary text-sm font-medium transition-colors">Voltar ao Início</button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full relative z-10 px-4 py-12">
        <div className="flex flex-col items-center text-center gap-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">celebration</span>
            Desafio Concluído
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">
            Parabéns, Guerreiro!
          </h1>
          <p className="text-[#9db9a6] text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
            Você e seu parceiro mantiveram a chama acesa por 30 dias. <br className="hidden md:block"/>A identidade secreta foi desbloqueada.
          </p>
        </div>

        <div className="w-full max-w-4xl mb-12 relative">
          <div className="relative bg-surface-dark border border-[#28392e] rounded-2xl p-8 md:p-12 flex flex-col items-center gap-6 shadow-[0_0_60px_-10px_rgba(19,236,91,0.3)] overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-primary blur-2xl opacity-40 rounded-full animate-pulse"></div>
              <div className="relative w-40 h-40 rounded-full p-1 bg-gradient-to-br from-primary to-transparent">
                <div className="w-full h-full rounded-full bg-surface-dark p-1">
                  <div className="w-full h-full rounded-full bg-center bg-cover bg-no-repeat" style={{backgroundImage: `url('https://picsum.photos/seed/alex/400/400')`}}></div>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-background-dark p-2 rounded-full border-4 border-surface-dark flex items-center justify-center">
                <span className="material-symbols-outlined font-bold">check</span>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-2">
              <h3 className="text-3xl font-bold text-white tracking-tight">Alexandre Silva</h3>
              <p className="text-primary font-medium tracking-wide flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">visibility</span>
                Identidade Revelada
              </p>
              <p className="text-gray-400 text-sm max-w-md mt-2 italic">
                "Foi incrível manter o foco com você! Nunca imaginei que chegaríamos tão longe sem falhar um dia sequer. Vamos continuar?"
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 w-full max-w-md mt-4">
              <button className="flex-1 min-w-[160px] h-12 bg-primary hover:bg-primary/90 text-background-dark text-base font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(19,236,91,0.4)]">
                Enviar Mensagem
              </button>
              <button className="flex-1 min-w-[160px] h-12 bg-[#28392e] hover:bg-[#344a3c] text-white text-base font-bold rounded-xl transition-all">
                Ver Jornada
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-10">
          <div className="bg-surface-dark/50 border border-[#28392e] rounded-xl p-6 flex flex-col gap-3">
            <p className="text-xs font-bold text-gray-400 uppercase">Check-ins Totais</p>
            <p className="text-4xl font-black text-white">60</p>
            <div className="w-full bg-gray-700 h-1 rounded-full"><div className="bg-primary h-1 rounded-full w-full"></div></div>
          </div>
          <div className="bg-surface-dark/50 border border-[#28392e] rounded-xl p-6 flex flex-col gap-3">
            <p className="text-xs font-bold text-gray-400 uppercase">Sequência</p>
            <p className="text-4xl font-black text-white">30 Dias</p>
            <div className="w-full bg-gray-700 h-1 rounded-full"><div className="bg-primary h-1 rounded-full w-full"></div></div>
          </div>
          <div className="bg-surface-dark/50 border border-[#28392e] rounded-xl p-6 flex flex-col gap-3">
            <p className="text-xs font-bold text-gray-400 uppercase">Taxa de Sucesso</p>
            <p className="text-4xl font-black text-white">100%</p>
            <div className="w-full bg-gray-700 h-1 rounded-full"><div className="bg-primary h-1 rounded-full w-full"></div></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RevealScreen;
