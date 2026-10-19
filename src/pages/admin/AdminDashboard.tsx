import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api, extractErrorMessage } from '../../services/api';
import { AdminDashboardKpi, Vehicle, VehicleStatus } from '../../types';
import {
  Users,
  Car,
  Wrench,
  Calendar,
  Award,
  UserPlus
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { isOfflineDemo } = useAuth();
  const [kpis, setKpis] = useState<AdminDashboardKpi | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [banner, setBanner] = useState<string | null>(null);

  // Novo Aluno Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('11999990000');

  const loadAdminData = async () => {
    if (isOfflineDemo) {
      setKpis({
        totalStudents: 42,
        activeInstructors: 6,
        activeVehicles: 8,
        vehiclesInMaintenance: 1,
        lessonsScheduledToday: 19,
        completedLessonsToday: 11,
        studentsReadyForExam: 7,
      });
      setVehicles([
        {
          id: 'cccccccc-cccc-cccc-cccc-ccccccccccc1',
          brand: 'Hyundai',
          model: 'HB20 Hatch 1.0',
          plate: 'BRA2E19',
          year: 2025,
          transmission: 'Manual',
          category: 'B',
          status: 'ACTIVE',
        },
        {
          id: 'cccccccc-cccc-cccc-cccc-ccccccccccc2',
          brand: 'Volkswagen',
          model: 'Polo Track',
          plate: 'SPO4A88',
          year: 2025,
          transmission: 'Manual',
          category: 'B',
          status: 'ACTIVE',
        },
        {
          id: 'cccccccc-cccc-cccc-cccc-ccccccccccc3',
          brand: 'Honda',
          model: 'CG 160 Start',
          plate: 'MOT9X11',
          year: 2024,
          transmission: 'Manual',
          category: 'A',
          status: 'ACTIVE',
        },
      ]);
      return;
    }

    try {
      const [kpiRes, vehRes] = await Promise.all([
        api.get<AdminDashboardKpi>('/dashboard/admin'),
        api.get<Vehicle[]>('/management/vehicles'),
      ]);
      setKpis(kpiRes.data);
      setVehicles(vehRes.data);
    } catch (err) {
      setBanner(extractErrorMessage(err));
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [isOfflineDemo]);

  const handleToggleVehicleStatus = async (vehicle: Vehicle) => {
    const nextStatus: VehicleStatus = vehicle.status === 'ACTIVE' ? 'MAINTENANCE' : 'ACTIVE';

    if (isOfflineDemo) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicle.id ? { ...v, status: nextStatus } : v))
      );
      setBanner(`Status do veículo ${vehicle.plate} alterado para ${nextStatus}.`);
      return;
    }

    try {
      const res = await api.patch(`/management/vehicles/${vehicle.id}/status`, {
        newStatus: nextStatus,
      });
      setBanner(res.data.message);
      await loadAdminData();
    } catch (err) {
      setBanner(extractErrorMessage(err));
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) {
      setBanner('O CPF deve conter 11 dígitos numéricos.');
      return;
    }

    if (isOfflineDemo) {
      setBanner(
        `Aluno ${name} matriculado! Senha temporária de 1º acesso gerada: ${cleanCpf.slice(0, 6)}`
      );
      setName('');
      setEmail('');
      setCpf('');
      return;
    }

    try {
      const res = await api.post('/management/students', {
        name,
        email,
        cpf: cleanCpf,
        phone,
        birthDate: '2004-09-09T00:00:00',
        desiredCategory: 'B',
        medicalExamApproved: true,
        theoreticalCourseCompleted: true,
      });
      setBanner(
        `Aluno ${res.data.name} cadastrado! Senha temporária inicial: ${res.data.temporaryPassword}`
      );
      setName('');
      setEmail('');
      setCpf('');
      await loadAdminData();
    } catch (err) {
      setBanner(extractErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Painel Operacional da Secretaria</h2>
        <p className="text-sm text-slate-600">
          Visão em tempo real da ocupação da frota, matrículas com senha temporária e KPIs do CFC.
        </p>
      </div>

      {banner && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-sm flex items-center justify-between">
          <span>{banner}</span>
          <button onClick={() => setBanner(null)} className="text-xs font-bold underline">
            Fechar
          </button>
        </div>
      )}

      {/* KPIs */}
      {kpis && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">Alunos Ativos</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{kpis.totalStudents}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">Frota Ativa / Manutenção</span>
              <Car className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">
              {kpis.activeVehicles}{' '}
              <span className="text-sm font-medium text-amber-600">
                ({kpis.vehiclesInMaintenance} oficina)
              </span>
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">Aulas Hoje</span>
              <Calendar className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{kpis.lessonsScheduledToday}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase">Aptos Prova Prática</span>
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{kpis.studentsReadyForExam}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gestão de Frota */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-blue-600" />
            Controle de Frota (Ativo vs. Manutenção)
          </h3>

          <div className="space-y-3">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {v.brand} {v.model} ({v.plate})
                  </p>
                  <p className="text-xs text-slate-500">
                    Categoria {v.category} • {v.transmission}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleVehicleStatus(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    v.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-amber-50 hover:text-amber-800'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}
                >
                  {v.status === 'ACTIVE' ? 'Ativo (Enviar p/ Oficina)' : 'Em Manutenção (Reativar)'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Onboarding de Novo Aluno */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
            <UserPlus className="w-4 h-4 text-blue-600" />
            Matricular Novo Aluno (Gera Senha de 1º Acesso)
          </h3>

          <form onSubmit={handleCreateStudent} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Lucas Oliveira"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="lucas@email.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CPF (11 dígitos)
                </label>
                <input
                  type="text"
                  required
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="98765432100"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
            >
              Cadastrar Aluno e Gerar Senha Temporária
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
