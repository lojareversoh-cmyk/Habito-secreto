
import React from 'react';

interface Props {
  onStart: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<Props> = ({ onStart, onLogin }) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="sticky top-0 z-50 w-full border-b border-[#28392e]/50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="px-4 md:px-10 lg:px-40 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-8 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">diversity_3</span>
            </div>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight hidden md:block">
              Hábito Secreto
            </h2>
          </div>
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-9">
              <a className="text-slate-600 dark:text-slate-200 hover:text-primary text-sm font-medium transition-colors cursor-pointer" onClick={onStart}>Como Funciona</a>
              <a className="text-slate-600 dark:text-slate-200 hover:text-primary text-sm font-medium transition-colors cursor-pointer" onClick={onStart}>Histórias</a>
              <button onClick={onLogin} className="text-slate-600 dark:text-slate-200 hover:text-primary text-sm font-medium transition-colors">Entrar</button>
            </nav>
            <button 
              onClick={onStart}
              className="bg-primary hover:bg-primary/90 text-background-dark rounded-xl h-10 px-6 text-sm font-bold transition-transform active:scale-95 shadow-lg shadow-primary/20"
            >
              Criar Conta
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center w-full">
        <section className="w-full max-w-7xl px-4 md:px-10 lg:px-40 py-12 md:py-20">
          <div className="flex flex-col-reverse gap-10 lg:flex-row lg:items-center">
            <div className="flex-1 flex flex-col gap-6 items-start text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                Construa Hábitos. <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Descubra Quem Está com Você.</span>
              </h1>
              <h2 className="text-slate-500 dark:text-slate-300 text-lg font-medium leading-relaxed max-w-xl">
                Você não está sozinho. Um parceiro secreto está rastreando o mesmo hábito. Complete 30 dias juntos para revelar suas identidades.
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
                <button 
                  onClick={onStart}
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-background-dark rounded-xl h-12 px-8 text-base font-bold shadow-[0_0_20px_rgba(19,236,91,0.3)] transition-all hover:shadow-[0_0_30px_rgba(19,236,91,0.5)]"
                >
                  <span>Aceitar o Desafio</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
                <button 
                  onClick={onLogin}
                  className="flex items-center justify-center gap-2 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white rounded-xl h-12 px-8 text-base font-bold transition-colors"
                >
                  Acessar Minha Conta
                </button>
              </div>
              <div className="flex items-center gap-3 pt-4 opacity-80">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                <p className="text-sm text-slate-500 dark:text-slate-400">Totalmente anônimo e seguro.</p>
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="relative w-full aspect-square md:aspect-video lg:aspect-square max-h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-800 to-black border border-white/10 group">
                <div className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAHaWxG012T5eMhkt_yFAiy-kp8JcjH5rHIqw1WSpUQKBFMcQpN08m--D_-smej6InLtAwYj4eAUiwoOYGVbfCL1nzb_LsBGJNCAswWx6AaPJpypF9aHacHssMzmyIBSHdSGjbCl-Azy9C0uLEAa5rmagqK4nWQCWNSlqpeZb-pkXhh-EkawQJDkqFuLEjCgaGZ6stDF9ZgcyHksLU1IxJUUWZzdPMK0ETfvwRTQdOJ69JepIl-0-lkhy7njDKG_Jqt0ovZJ5qQIBd3')`}}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent"></div>
                <div className="absolute bottom-8 left-0 right-0 px-8 flex flex-col gap-4 text-white">
                  <div className="flex justify-between items-end mb-2">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-full bg-slate-700 border-2 border-slate-500 blur-[2px] overflow-hidden"></div>
                      <div className="h-1 w-16 bg-slate-700 rounded-full animate-pulse"></div>
                      <div className="size-12 rounded-full bg-primary/20 border-2 border-primary blur-[4px] relative">
                        <div className="absolute inset-0 flex items-center justify-center text-primary font-bold text-xs">?</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-mono mb-1">STREAK</p>
                      <p className="text-3xl font-black">12<span className="text-primary">/30</span></p>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[40%] shadow-[0_0_15px_rgba(19,236,91,0.6)]"></div>
                  </div>
                  <p className="text-center text-xs text-slate-400 font-medium">Continue para desbloquear a identidade</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-slate-100 dark:bg-[#15281c] border-y border-slate-200 dark:border-[#28392e]">
          <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-40 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-center md:justify-start gap-2 text-primary mb-2">
                  <span className="material-symbols-outlined">group</span>
                </div>
                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">12.5k+</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Parceiros Conectados</p>
              </div>
              <div className="flex flex-col gap-1 border-t md:border-t-0 md:border-l border-slate-300 dark:border-white/10 pt-6 md:pt-0 md:pl-8">
                <div className="flex items-center justify-center md:justify-start gap-2 text-primary mb-2">
                  <span className="material-symbols-outlined">calendar_month</span>
                </div>
                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">350k</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Dias Rastreados</p>
              </div>
              <div className="flex flex-col gap-1 border-t md:border-t-0 md:border-l border-slate-300 dark:border-white/10 pt-6 md:pt-0 md:pl-8">
                <div className="flex items-center justify-center md:justify-start gap-2 text-primary mb-2">
                  <span className="material-symbols-outlined">lock_open</span>
                </div>
                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">8.2k</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Identidades Reveladas</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-[#28392e] bg-[#111813] py-10 px-4 md:px-10 lg:px-40 mt-auto text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">diversity_3</span>
            <span className="font-bold">Hábito Secreto</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-400">
            <a className="hover:text-primary transition-colors" href="#">Termos</a>
            <a className="hover:text-primary transition-colors" href="#">Privacidade</a>
            <a className="hover:text-primary transition-colors" href="#">Contato</a>
          </div>
          <div className="text-slate-500 text-sm">
            © 2024 Desafio do Hábito Secreto
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
