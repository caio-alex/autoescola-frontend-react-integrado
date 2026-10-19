import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { AppLayout } from './components/layout/AppLayout';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { InstructorDashboard } from './pages/instructor/InstructorDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

const RoleRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <AppLayout>
      {user.role === 'STUDENT' && <StudentDashboard />}
      {user.role === 'INSTRUCTOR' && <InstructorDashboard />}
      {user.role === 'ADMIN' && <AdminDashboard />}
    </AppLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <RoleRouter />
    </AuthProvider>
  );
}
