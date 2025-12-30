
import React, { useState, useRef } from 'react';
import { User } from '../types';

interface Props {
  user: User;
  onClose: () => void;
  onUpdate: (updatedUser: User) => void;
}

const ProfileSettings: React.FC<Props> = ({ user, onClose, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [previewImage, setPreviewImage] = useState(user.profileImage || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdate({
      ...user,
      name,
      email,
      profileImage: previewImage
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-surface-dark w-full max-w-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Configurações de Perfil</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="size-24 rounded-full bg-slate-800 border-2 border-primary/50 overflow-hidden relative">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <span className="material-symbols-outlined text-4xl">person</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="material-symbols-outlined text-white">photo_camera</span>
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Alterar Foto de Perfil</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Seu Nome</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-2xl py-3 px-4 text-white focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">E-mail</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-2xl py-3 px-4 text-white focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-3">
             <button 
              onClick={handleSave}
              className="w-full bg-primary text-background-dark font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Salvar Alterações
            </button>
            <button 
              onClick={onClose}
              className="w-full text-slate-400 font-bold py-2 text-sm hover:text-white transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
