import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { LoginResponse, UserSummary } from '../types';

interface AuthContextType {
  user: UserSummary | null;
  token: string | null;
  isOfflineDemo: boolean;
  login: (emailOrCpf: string, password: string) => Promise<UserSummary>;
  logout: () => void;
  markPasswordChanged: () => void;
  enableOfflineDemoProfile: (role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN') => UserSummary;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSummary | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isOfflineDemo, setIsOfflineDemo] = useState<boolean>(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('@AutoEscola:user');
    const savedToken = localStorage.getItem('@AutoEscola:token');
    const savedDemo = localStorage.getItem('@AutoEscola:offlineDemo');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      setIsOfflineDemo(savedDemo === 'true');
    }
  }, []);

  const login = async (emailOrCpf: string, password: string): Promise<UserSummary> => {
    const response = await api.post<LoginResponse>('/auth/login', {
      emailOrCpf,
      password,
    });

    const { accessToken, user: loggedUser } = response.data;
    localStorage.setItem('@AutoEscola:token', accessToken);
    localStorage.setItem('@AutoEscola:user', JSON.stringify(loggedUser));
    localStorage.setItem('@AutoEscola:offlineDemo', 'false');

    setToken(accessToken);
    setUser(loggedUser);
    setIsOfflineDemo(false);
    return loggedUser;
  };

  const enableOfflineDemoProfile = (role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'): UserSummary => {
    const mockProfiles: Record<'STUDENT' | 'INSTRUCTOR' | 'ADMIN', UserSummary> = {
      STUDENT: {
        id: '33333333-3333-3333-3333-333333333331',
        profileId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
        name: 'Caio Alexandre',
        email: 'aluno@autoescola.com',
        role: 'STUDENT',
        mustChangePassword: false,
      },
      INSTRUCTOR: {
        id: '22222222-2222-2222-2222-222222222221',
        profileId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
        name: 'Roberto Carlos (Instrutor)',
        email: 'roberto@autoescola.com',
        role: 'INSTRUCTOR',
        mustChangePassword: false,
      },
      ADMIN: {
        id: '11111111-1111-1111-1111-111111111111',
        profileId: null,
        name: 'Admin Secretaria',
        email: 'admin@autoescola.com',
        role: 'ADMIN',
        mustChangePassword: false,
      },
    };

    const chosen = mockProfiles[role];
    localStorage.setItem('@AutoEscola:token', 'demo-offline-jwt-token');
    localStorage.setItem('@AutoEscola:user', JSON.stringify(chosen));
    localStorage.setItem('@AutoEscola:offlineDemo', 'true');

    setToken('demo-offline-jwt-token');
    setUser(chosen);
    setIsOfflineDemo(true);
    return chosen;
  };

  const logout = () => {
    localStorage.removeItem('@AutoEscola:token');
    localStorage.removeItem('@AutoEscola:user');
    localStorage.removeItem('@AutoEscola:offlineDemo');
    setToken(null);
    setUser(null);
    setIsOfflineDemo(false);
  };

  const markPasswordChanged = () => {
    if (!user) return;
    const updated = { ...user, mustChangePassword: false };
    setUser(updated);
    localStorage.setItem('@AutoEscola:user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isOfflineDemo,
        login,
        logout,
        markPasswordChanged,
        enableOfflineDemoProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
