import React, { useState } from 'react';
import { User } from '../types';
import { generateDefaultAvatar } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';

interface Props {
  onAuthComplete: (user: User) => void;
  onBack: () => void;
}

type AuthMode = 'LOGIN' | 'SIGNUP' | 'FORGOT';

const AuthScreen: React.FC<Props> = ({ onAuthComplete, onBack }) => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (mode === 'FORGOT') {
        setStatusText('Enviando e-mail...');
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });

        if (error) throw error;

        setMessage({ text: 'Se este e-mail estiver cadastrado, você receberá um link de recuperação em instantes.', type: 'success' });
        setIsLoading(false);
        setStatusText('');
        return;
      }

      if (mode === 'SIGNUP') {
        setStatusText('Criando conta...');
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            }
          }
        });

        if (error) throw error;
        if (!data.user) throw new Error("Erro ao criar usuário");

        // Profile creation
        setStatusText('Gerando perfil...');
        const generatedAvatar = await generateDefaultAvatar(name || email.split('@')[0]);

        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          name: name,
          avatar_url: generatedAvatar
        });

        if (profileError) {
          console.error("Erro ao criar perfil:", profileError);
          // Non-blocking, can continue
        }

        setMessage({ text: 'Conta criada! Verifique seu e-mail para confirmar.', type: 'success' });
        // Optionally auto-login or wait for confirmation depending on project settings
        // For now, let's assume confirm is needed or just tell them to login
      }

      if (mode === 'LOGIN') {
        setStatusText('Entrando...');
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        if (data.user) {
          // Fetch profile
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();

          const user: User = {
            id: data.user.id,
            name: profile?.name || data.user.user_metadata.full_name || email.split('@')[0],
            email: email,
            isLoggedIn: true,
            profileImage: profile?.avatar_url
          };
          onAuthComplete(user);
        }
      }

    } catch (error: any) {
      console.error(error);
      setMessage({ text: error.message || 'Ocorreu um erro. Tente novamente.', type: 'error' });
    } finally {
      setIsLoading(false);
      setStatusText('');
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center mb-8">
          <button onClick={onBack} className="flex items-center gap-2 group">
            <div className="size-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">shield_person</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">Hábito Secreto</span>
          </button>
        </div>

        <div className="bg-surface-dark border border-white/5 rounded-3xl p-8 shadow-2xl">
          {mode !== 'FORGOT' && (
            <div className="flex gap-1 bg-black/40 p-1 rounded-2xl mb-8">
              <button
                type="button"
                onClick={() => setMode('LOGIN')}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'LOGIN' ? 'bg-primary text-background-dark shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white'}`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => setMode('SIGNUP')}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'SIGNUP' ? 'bg-primary text-background-dark shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white'}`}
              >
                Cadastrar
              </button>
            </div>
          )}

          <h2 className="text-xl font-bold mb-2">
            {mode === 'LOGIN' && 'Bem-vindo de volta'}
            {mode === 'SIGNUP' && 'Comece sua jornada'}
            {mode === 'FORGOT' && 'Recuperar Acesso'}
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            {mode === 'LOGIN' && 'Insira suas credenciais para continuar.'}
            {mode === 'SIGNUP' && 'Crie sua conta e receba um avatar exclusivo gerado por IA.'}
            {mode === 'FORGOT' && 'Enviaremos um link para o seu e-mail.'}
          </p>

          {message && (
            <div className={`p-4 rounded-xl text-xs font-bold mb-6 flex gap-2 items-center ${message.type === 'success' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              <span className="material-symbols-outlined text-sm">{message.type === 'success' ? 'check_circle' : 'error'}</span>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'SIGNUP' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Nome Completo</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">person</span>
                  <input
                    required={mode === 'SIGNUP'}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    placeholder="Como quer ser chamado?"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">E-mail</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">mail</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  placeholder="exemplo@email.com"
                />
              </div>
            </div>

            {mode !== 'FORGOT' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Senha</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">lock</span>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {mode === 'LOGIN' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMode('FORGOT')}
                  className="text-xs text-primary hover:underline font-bold"
                >
                  Esqueceu a senha?
                </button>
              </div>
            )}

            <button
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all flex flex-col items-center justify-center gap-1 group overflow-hidden"
            >
              {isLoading ? (
                <>
                  <div className="size-5 border-2 border-background-dark border-t-transparent rounded-full animate-spin"></div>
                  {statusText && <span className="text-[10px] uppercase font-black tracking-widest opacity-70">{statusText}</span>}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span>
                    {mode === 'LOGIN' && 'Entrar na Conta'}
                    {mode === 'SIGNUP' && 'Criar Minha Conta'}
                    {mode === 'FORGOT' && 'Enviar Link'}
                  </span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    {mode === 'FORGOT' ? 'send' : 'login'}
                  </span>
                </div>
              )}
            </button>
          </form>

          {mode === 'FORGOT' && (
            <button
              onClick={() => setMode('LOGIN')}
              className="w-full mt-4 py-2 text-sm text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Voltar para o Login
            </button>
          )}
        </div>

        <p className="mt-8 text-center text-slate-500 text-xs px-8">
          Ao continuar, você concorda com nossos <span className="text-white hover:underline cursor-pointer">Termos de Serviço</span> e <span className="text-white hover:underline cursor-pointer">Política de Privacidade</span>.
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
