import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api, extractErrorMessage } from '../../services/api';
import {
  AvailableInstructorVehicle,
  AvailableSlot,
  Lesson,
  StudentDashboardData
} from '../../types';
import {
  CheckCircle2,
  Clock,
  Calendar,
  Car,
  User,
  Star,
  PlusCircle,
  XCircle,
  AlertTriangle,
  Award
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user, isOfflineDemo } = useAuth();
  const studentId = user?.profileId || 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1';

  const [dashboard, setDashboard] = useState<StudentDashboardData | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Wizard Modal State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (tomorrow.getDay() === 0) tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [selectedOption, setSelectedOption] = useState<AvailableInstructorVehicle | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const loadStudentData = async () => {
    setLoading(true);
    if (isOfflineDemo) {
      const tomorrow9am = new Date();
      tomorrow9am.setDate(tomorrow9am.getDate() + 1);
      tomorrow9am.setHours(9, 0, 0, 0);

      const mockLesson: Lesson = {
        id: 'lesson-demo-1',
        startTime: tomorrow9am.toISOString(),
        endTime: new Date(tomorrow9am.getTime() + 50 * 60000).toISOString(),
        status: 'SCHEDULED',
        studentId,
        studentName: user?.name || 'Caio Alexandre',
        instructorId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
        instructorName: 'Roberto Carlos (Instrutor)',
        vehicleId: 'cccccccc-cccc-cccc-cccc-ccccccccccc1',
        vehicleModel: 'HB20 Hatch 1.0',
        vehiclePlate: 'BRA2E19',
      };

      setDashboard({
        studentId,
        name: user?.name || 'Caio Alexandre',
        desiredCategory: 'B',
        medicalExamApproved: true,
        theoreticalCourseCompleted: true,
        completedPracticalLessons: 12,
        requiredPracticalLessons: 20,
        progressPercentage: 60,
        readyForPracticalExam: false,
        nextUpcomingLesson: mockLesson,
      });
      setLessons([mockLesson]);
      setLoading(false);
      return;
    }

    try {
      const [dashRes, lessonsRes] = await Promise.all([
        api.get<StudentDashboardData>(`/dashboard/student/${studentId}`),
        api.get<Lesson[]>(`/lessons?studentId=${studentId}`),
      ]);
      setDashboard(dashRes.data);
      setLessons(lessonsRes.data);
    } catch (err) {
      setFeedback({ type: 'error', message: extractErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentData();
  }, [studentId, isOfflineDemo]);

  const loadAvailableSlots = async (dateStr: string) => {
    setSelectedSlot(null);
    setSelectedOption(null);

    if (isOfflineDemo) {
      const hours = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
      const demoSlots: AvailableSlot[] = hours.map((h) => ({
        timeSlot: h,
        startTime: `${dateStr}T${h}:00`,
        isAvailable: h !== '09:00',
        availableOptions: [
          {
            instructorId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
            instructorName: 'Roberto Carlos (Instrutor)',
            instructorRating: 4.9,
            vehicleId: 'cccccccc-cccc-cccc-cccc-ccccccccccc1',
            vehicleModel: 'HB20 Hatch 1.0',
            transmission: 'Manual',
          },
          {
            instructorId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
            instructorName: 'Fernanda Lima (Instrutora)',
            instructorRating: 4.8,
            vehicleId: 'cccccccc-cccc-cccc-cccc-ccccccccccc2',
            vehicleModel: 'VW Polo Track',
            transmission: 'Manual',
          },
        ],
      }));
      setSlots(demoSlots);
      return;
    }

    try {
      const category = dashboard?.desiredCategory === 'A' ? 'A' : 'B';
      const res = await api.get<AvailableSlot[]>(
        `/lessons/available-slots?date=${dateStr}&category=${category}`
      );
      setSlots(res.data);
    } catch (err) {
      setFeedback({ type: 'error', message: extractErrorMessage(err) });
    }
  };

  useEffect(() => {
    if (isWizardOpen) {
      loadAvailableSlots(selectedDate);
    }
  }, [isWizardOpen, selectedDate]);

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !selectedOption) return;
    setBookingLoading(true);
    setFeedback(null);

    if (isOfflineDemo) {
      const newLesson: Lesson = {
        id: `demo-${Date.now()}`,
        startTime: selectedSlot.startTime,
        endTime: new Date(new Date(selectedSlot.startTime).getTime() + 50 * 60000).toISOString(),
        status: 'SCHEDULED',
        studentId,
        studentName: user?.name || 'Caio Alexandre',
        instructorId: selectedOption.instructorId,
        instructorName: selectedOption.instructorName,
        vehicleId: selectedOption.vehicleId,
        vehicleModel: selectedOption.vehicleModel,
        vehiclePlate: 'BRA2E19',
      };
      setLessons((prev) => [...prev, newLesson]);
      setIsWizardOpen(false);
      setBookingLoading(false);
      setFeedback({ type: 'success', message: 'Aula prática agendada com sucesso!' });
      return;
    }

    try {
      await api.post('/lessons', {
        studentId,
        instructorId: selectedOption.instructorId,
        vehicleId: selectedOption.vehicleId,
        startTime: selectedSlot.startTime,
      });
      setIsWizardOpen(false);
      setFeedback({ type: 'success', message: 'Aula prática agendada com sucesso!' });
      await loadStudentData();
    } catch (err) {
      setFeedback({ type: 'error', message: extractErrorMessage(err) });
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelLesson = async (lessonId: string) => {
    setFeedback(null);
    if (isOfflineDemo) {
      setLessons((prev) =>
        prev.map((l) => (l.id === lessonId ? { ...l, status: 'CANCELED_BY_STUDENT' } : l))
      );
      setFeedback({ type: 'success', message: 'Aula cancelada com sucesso.' });
      return;
    }

    try {
      await api.patch(`/lessons/${lessonId}/cancel`, {
        reason: 'Cancelado pelo aluno via portal web.',
      });
      setFeedback({ type: 'success', message: 'Aula cancelada com sucesso.' });
      await loadStudentData();
    } catch (err) {
      setFeedback({ type: 'error', message: extractErrorMessage(err) });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-36 bg-slate-200 rounded-2xl" />
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Botão de Agendar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Minha Jornada da CNH</h2>
          <p className="text-sm text-slate-600">
            Acompanhe suas etapas obrigatórias do DETRAN e agende suas próximas aulas práticas.
          </p>
        </div>
        <button
          onClick={() => setIsWizardOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Agendar Nova Aula Prática
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-xs font-bold underline ml-4">
            Fechar
          </button>
        </div>
      )}

      {/* Tracker de Progresso da CNH */}
      {dashboard && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Categoria Pretendida: {dashboard.desiredCategory}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Progresso das Aulas Práticas: {dashboard.completedPracticalLessons} de{' '}
                {dashboard.requiredPracticalLessons} aulas concluídas
              </h3>
            </div>
            <span className="text-2xl font-extrabold text-blue-600">
              {dashboard.progressPercentage}%
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${dashboard.progressPercentage}%` }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">1. Exame Médico</p>
                <p className="text-[11px] text-emerald-700">Aprovado</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">2. Curso Teórico</p>
                <p className="text-[11px] text-emerald-700">Concluído</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900">3. Prática de Direção</p>
                <p className="text-[11px] text-blue-700">
                  {dashboard.completedPracticalLessons}/{dashboard.requiredPracticalLessons} realizadas
                </p>
              </div>
            </div>

            <div
              className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                dashboard.readyForPracticalExam
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-slate-50 border-slate-200 opacity-75'
              }`}
            >
              <Award
                className={`w-5 h-5 shrink-0 ${
                  dashboard.readyForPracticalExam ? 'text-emerald-600' : 'text-slate-400'
                }`}
              />
              <div>
                <p className="text-xs font-bold text-slate-900">4. Exame Prático</p>
                <p className="text-[11px] text-slate-600">
                  {dashboard.readyForPracticalExam ? 'Liberado!' : 'Aguardando 20 aulas'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Listagem de Aulas do Aluno */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4">Minhas Aulas Práticas</h3>

        {lessons.length === 0 ? (
          <div className="text-center py-10">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">Nenhuma aula registrada no momento</p>
            <p className="text-xs text-slate-500 mt-1">
              Clique em "Agendar Nova Aula Prática" para escolher seu horário e instrutor.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson) => {
              const dateObj = new Date(lesson.startTime);
              const badge = {
                SCHEDULED: { text: 'Agendada', cls: 'bg-blue-100 text-blue-700' },
                COMPLETED: { text: 'Concluída', cls: 'bg-emerald-100 text-emerald-700' },
                CANCELED_BY_STUDENT: { text: 'Cancelada por Você', cls: 'bg-red-100 text-red-700' },
                CANCELED_BY_SCHOOL: { text: 'Cancelada pela Escola', cls: 'bg-amber-100 text-amber-800' },
                NO_SHOW: { text: 'Falta Registrada', cls: 'bg-red-100 text-red-800' },
              }[lesson.status];

              return (
                <div
                  key={lesson.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-slate-800 shrink-0">
                      <span className="text-[10px] font-bold uppercase">
                        {dateObj.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
                      </span>
                      <span className="text-base font-extrabold leading-none">
                        {dateObj.getDate()}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {dateObj.toLocaleDateString('pt-BR')} às{' '}
                          {dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badge.cls}`}>
                          {badge.text}
                        </span>
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {lesson.instructorName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Car className="w-3.5 h-3.5 text-slate-400" />
                          {lesson.vehicleModel} ({lesson.vehiclePlate})
                        </span>
                      </div>

                      {lesson.instructorNotes && (
                        <p className="mt-2 text-xs bg-slate-50 p-2 rounded-lg border border-slate-200 text-slate-700">
                          <strong>Feedback do Instrutor:</strong> {lesson.instructorNotes} (Nota:{' '}
                          {lesson.performanceScore}/5)
                        </p>
                      )}
                    </div>
                  </div>

                  {lesson.status === 'SCHEDULED' && (
                    <button
                      onClick={() => handleCancelLesson(lesson.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold self-start sm:self-center"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancelar Aula
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Wizard de Agendamento em 3 Passos */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Wizard de Agendamento Inteligente
                </span>
                <h3 className="text-lg font-bold text-slate-900">Agendar Aula Prática (50 min)</h3>
              </div>
              <button
                onClick={() => setIsWizardOpen(false)}
                className="text-sm font-semibold text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-6">
              {/* Passo 1: Data */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Passo 1: Escolha a Data da Aula (Segunda a Sábado)
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-64 px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              {/* Passo 2: Horário */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Passo 2: Escolha um Horário Disponível
                </label>
                {slots.length === 0 ? (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    Domingos não possuem expediente ou não há horários disponíveis nesta data.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {slots.map((slot) => {
                      const isSelected = selectedSlot?.timeSlot === slot.timeSlot;
                      return (
                        <button
                          key={slot.timeSlot}
                          disabled={!slot.isAvailable}
                          onClick={() => {
                            setSelectedSlot(slot);
                            setSelectedOption(slot.availableOptions[0] || null);
                          }}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                            !slot.isAvailable
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400'
                          }`}
                        >
                          {slot.timeSlot}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Passo 3: Instrutor e Veículo */}
              {selectedSlot && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Passo 3: Escolha o Instrutor e Veículo Disponíveis às {selectedSlot.timeSlot}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedSlot.availableOptions.map((opt) => {
                      const active = selectedOption?.instructorId === opt.instructorId;
                      return (
                        <button
                          key={opt.instructorId}
                          type="button"
                          onClick={() => setSelectedOption(opt)}
                          className={`p-3.5 rounded-xl border text-left transition-all ${
                            active
                              ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">
                              {opt.instructorName}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {opt.instructorRating}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">
                            Veículo: <strong>{opt.vehicleModel}</strong> ({opt.transmission})
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsWizardOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!selectedSlot || !selectedOption || bookingLoading}
                onClick={handleConfirmBooking}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-blue-600/20"
              >
                {bookingLoading ? 'Confirmando...' : 'Confirmar Agendamento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
