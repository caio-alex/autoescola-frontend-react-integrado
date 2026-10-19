import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { extractErrorMessage, API_BASE_URL } from '../services/api';
import {
  Car,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  CalendarCheck,
  ShieldCheck
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, enableOfflineDemoProfile } = useAuth();
  const [emailOrCpf, setEmailOrCpf] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(emailOrCpf, password);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (
    role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN',
    demoEmail: string,
    demoPass: string
  ) => {
    setEmailOrCpf(demoEmail);
    setPassword(demoPass);
    setError(null);
    setLoading(true);
    try {
      await login(demoEmail, demoPass);
    } catch {
      // Caso o back-end não esteja rodando na porta padrão no momento, entra no Modo Simulação Interativo
      enableOfflineDemoProfile(role);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Coluna Esquerda: Formulário + Demo 1-Click */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 xl:px-24">
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">AutoEscola 3ESA</h1>
              <p className="text-xs text-slate-500">Plataforma Integrada de Formação de Condutores</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Bem-vindo de volta</h2>
          <p className="mt-1 text-sm text-slate-600">
            Acesse com seu <strong>E-mail</strong> ou <strong>CPF</strong> cadastrado na secretaria.
          </p>

          {error && (
            <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Falha na autenticação</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                E-mail ou CPF
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={emailOrCpf}
                  onChange={(e) => setEmailOrCpf(e.target.value)}
                  placeholder="Ex: aluno@autoescola.com ou 12345678909"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all"
            >
              {loading ? 'Autenticando...' : 'Entrar na Plataforma'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Acesso Rápido Demo 1-Click */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Acesso Rápido de Demonstração (1-Clique)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('STUDENT', 'aluno@autoescola.com', 'Aluno@123')}
                className="flex flex-col items-start p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left group"
              >
                <GraduationCap className="w-4 h-4 text-blue-600 mb-1" />
                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700">Visão Aluno</span>
                <span className="text-[11px] text-slate-500">Caio Alexandre</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('INSTRUCTOR', 'roberto@autoescola.com', 'Instrutor@123')}
                className="flex flex-col items-start p-3 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all text-left group"
              >
                <CalendarCheck className="w-4 h-4 text-amber-600 mb-1" />
                <span className="text-xs font-bold text-slate-800 group-hover:text-amber-700">Visão Instrutor</span>
                <span className="text-[11px] text-slate-500">Roberto Carlos</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('ADMIN', 'admin@autoescola.com', 'Admin@123')}
                className="flex flex-col items-start p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left group"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">Visão Admin</span>
                <span className="text-[11px] text-slate-500">Secretaria</span>
              </button>
            </div>
            <p className="mt-3 text-[11px] text-slate-400">
              Endpoint configurado: <code className="text-slate-600">{API_BASE_URL}</code> (Se o servidor .NET estiver desligado, os botões acima abrem automaticamente o modo interativo de demonstração).
            </p>
          </div>
        </div>
      </div>

      {/* Coluna Direita: Showcase SaaS */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900 text-white relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-medium">
            Arquitetura Full-Stack Remodelada
          </span>
          <h3 className="mt-6 text-3xl font-bold leading-tight max-w-lg">
            Gestão inteligente de aulas práticas, frota e progresso da CNH sem conflitos de agenda.
          </h3>
          <p className="mt-4 text-slate-400 text-sm max-w-md leading-relaxed">
            Projetado com controle de acesso baseado em perfis (RBAC), validação automática de regras do DETRAN e Wizard de agendamento em 3 passos.
          </p>
        </div>

        <div className="relative z-10 space-y-4 my-8">
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 backdrop-blur-sm max-w-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Progresso Prático (Categoria B)</span>
              <span className="text-blue-400 font-bold">12 / 20 aulas (60%)</span>
            </div>
            <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: '60%' }} />
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Exame Médico
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Curso Teórico
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between">
          <span>AutoEscola 3ESA • C# .NET 8 + React TypeScript</span>
          <span>Design System v2.0</span>
        </div>
      </div>
    </div>
  );
};
