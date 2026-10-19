import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Car,
  LogOut,
  ShieldCheck,
  GraduationCap,
  CalendarCheck,
  WifiOff,
  Wifi,
  UserCheck
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout, isOfflineDemo } = useAuth();

  if (!user) return null;

  const roleBadge = {
    STUDENT: { label: 'Portal do Aluno', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: GraduationCap },
    INSTRUCTOR: { label: 'Painel do Instrutor', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: CalendarCheck },
    ADMIN: { label: 'Gestão / Secretaria', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: ShieldCheck },
  }[user.role];

  const RoleIcon = roleBadge.icon;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight leading-none">AutoEscola 3ESA</h1>
              <span className="text-xs text-slate-400">SaaS Habilitação v2.0</span>
            </div>
          </div>

          <div className="p-4">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Ambiente Ativo
            </div>
            <div className="mt-1 flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-800/80 text-slate-100 text-sm font-medium border border-slate-700">
              <RoleIcon className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{roleBadge.label}</span>
            </div>

            <div className="mt-6 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Status de Conexão
            </div>
            <div className="mt-1 px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center gap-2 text-xs">
              {isOfflineDemo ? (
                <>
                  <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-amber-300">Modo Simulação Local</span>
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-emerald-300">Conectado à API .NET</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800 hover:bg-red-600/90 text-slate-200 hover:text-white text-xs font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair da Plataforma
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${roleBadge.color}`}>
              <UserCheck className="w-3.5 h-3.5" />
              {roleBadge.label}
            </span>
          </div>
          <div className="text-xs text-slate-500">
            Logado como <strong className="text-slate-800">{user.name}</strong> ({user.role})
          </div>
        </header>

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
