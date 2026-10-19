import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api, extractErrorMessage } from '../../services/api';
import { Lesson } from '../../types';
import { CalendarCheck, CheckCircle, Car, User, Star } from 'lucide-react';

export const InstructorDashboard: React.FC = () => {
  const { user, isOfflineDemo } = useAuth();
  const instructorId = user?.profileId || 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1';

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [score, setScore] = useState<number>(5);
  const [notes, setNotes] = useState<string>('Ótimo controle de embreagem e baliza.');
  const [feedback, setFeedback] = useState<string | null>(null);

  const loadInstructorLessons = async () => {
    if (isOfflineDemo) {
      const tomorrow9am = new Date();
      tomorrow9am.setDate(tomorrow9am.getDate() + 1);
      tomorrow9am.setHours(9, 0, 0, 0);

      setLessons([
        {
          id: 'inst-demo-1',
          startTime: tomorrow9am.toISOString(),
          endTime: new Date(tomorrow9am.getTime() + 50 * 60000).toISOString(),
          status: 'SCHEDULED',
          studentId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
          studentName: 'Caio Alexandre',
          instructorId,
          instructorName: user?.name || 'Roberto Carlos',
          vehicleId: 'cccccccc-cccc-cccc-cccc-ccccccccccc1',
          vehicleModel: 'HB20 Hatch 1.0',
          vehiclePlate: 'BRA2E19',
        },
      ]);
      return;
    }

    try {
      const res = await api.get<Lesson[]>(`/lessons?instructorId=${instructorId}`);
      setLessons(res.data);
    } catch (err) {
      setFeedback(extractErrorMessage(err));
    }
  };

  useEffect(() => {
    loadInstructorLessons();
  }, [instructorId, isOfflineDemo]);

  const handleCompleteLesson = async () => {
    if (!selectedLesson) return;

    if (isOfflineDemo) {
      setLessons((prev) =>
        prev.map((l) =>
          l.id === selectedLesson.id
            ? { ...l, status: 'COMPLETED', performanceScore: score, instructorNotes: notes }
            : l
        )
      );
      setSelectedLesson(null);
      setFeedback('Aula concluída e ficha prática do aluno atualizada!');
      return;
    }

    try {
      await api.patch(`/lessons/${selectedLesson.id}/complete`, {
        performanceScore: score,
        instructorNotes: notes,
      });
      setSelectedLesson(null);
      setFeedback('Aula concluída e ficha prática do aluno atualizada!');
      await loadInstructorLessons();
    } catch (err) {
      setFeedback(extractErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Agenda Diária do Instrutor</h2>
        <p className="text-sm text-slate-600">
          Realize o check-out das aulas práticas e registre a evolução pedagógica de cada aluno.
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-sm flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-xs font-bold underline">
            Fechar
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <CalendarCheck className="w-5 h-5 text-amber-600" />
          <h3>Aulas Designadas</h3>
        </div>

        {lessons.map((lesson) => {
          const dt = new Date(lesson.startTime);
          return (
            <div
              key={lesson.id}
              className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">
                    {dt.toLocaleDateString('pt-BR')} às{' '}
                    {dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      lesson.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {lesson.status}
                  </span>
                </div>

                <div className="mt-1.5 flex flex-wrap gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Aluno: <strong>{lesson.studentName}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-slate-400" />
                    {lesson.vehicleModel} ({lesson.vehiclePlate})
                  </span>
                </div>
              </div>

              {lesson.status === 'SCHEDULED' && (
                <button
                  onClick={() => setSelectedLesson(lesson)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Concluir e Avaliar Aula
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal de Avaliação da Aula */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Check-out de Aula — {selectedLesson.studentName}
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                Nota de Desempenho (1 a 5 Estrelas)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setScore(n)}
                    className={`flex-1 py-2 rounded-xl border font-bold text-xs flex items-center justify-center gap-1 ${
                      score >= n
                        ? 'bg-amber-50 border-amber-400 text-amber-700'
                        : 'border-slate-200 text-slate-400'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Observações Pedagógicas (Baliza, Embreagem, Trânsito)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedLesson(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleCompleteLesson}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                Confirmar Conclusão (+1 Aula)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
