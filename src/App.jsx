import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import RotaProtegida from "./components/RotaProtegida";
import RotaComPerfil from "./components/RotaComPerfil";
import Layout from "./components/Layout";
import Login from "./pages/Login";

import InstrutoresList from "./pages/instrutores/InstrutoresList";
import InstrutorForm from "./pages/instrutores/InstrutorForm";

import AlunosList from "./pages/alunos/AlunosList";
import AlunoForm from "./pages/alunos/AlunoForm";

import InstrucoesList from "./pages/instrucoes/InstrucoesList";
import AgendarInstrucaoForm from "./pages/instrucoes/AgendarInstrucaoForm";

import UsuariosList from "./pages/usuarios/UsuariosList";
import UsuarioForm from "./pages/usuarios/UsuarioForm";

function Inicio() {
  const { perfil, carregandoPerfil } = useAuth();

  if (carregandoPerfil) return <p>Carregando...</p>;

  const destino = perfil === "ALUNO" || perfil === "INSTRUTOR" ? "/instrucoes" : "/instrutores";
  return <Navigate to={destino} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <RotaProtegida>
              <Layout />
            </RotaProtegida>
          }
        >
          <Route path="/" element={<Inicio />} />

          <Route
            path="/instrutores"
            element={
              <RotaComPerfil perfisPermitidos={["ADMIN", "USER", "ALUNO"]}>
                <InstrutoresList />
              </RotaComPerfil>
            }
          />
          <Route
            path="/instrutores/novo"
            element={
              <RotaComPerfil perfisPermitidos={["ADMIN"]}>
                <InstrutorForm />
              </RotaComPerfil>
            }
          />
          <Route
            path="/instrutores/:id/editar"
            element={
              <RotaComPerfil perfisPermitidos={["ADMIN"]}>
                <InstrutorForm />
              </RotaComPerfil>
            }
          />

          <Route
            path="/alunos"
            element={
              <RotaComPerfil perfisPermitidos={["ADMIN", "USER"]}>
                <AlunosList />
              </RotaComPerfil>
            }
          />
          <Route
            path="/alunos/novo"
            element={
              <RotaComPerfil perfisPermitidos={["ADMIN"]}>
                <AlunoForm />
              </RotaComPerfil>
            }
          />
          <Route
            path="/alunos/:id/editar"
            element={
              <RotaComPerfil perfisPermitidos={["ADMIN"]}>
                <AlunoForm />
              </RotaComPerfil>
            }
          />

          <Route path="/instrucoes" element={<InstrucoesList />} />
          <Route
            path="/instrucoes/novo"
            element={
              <RotaComPerfil perfisPermitidos={["ADMIN", "USER", "ALUNO"]}>
                <AgendarInstrucaoForm />
              </RotaComPerfil>
            }
          />

          <Route
            path="/usuarios"
            element={
              <RotaComPerfil perfisPermitidos={["ADMIN"]}>
                <UsuariosList />
              </RotaComPerfil>
            }
          />
          <Route
            path="/usuarios/novo"
            element={
              <RotaComPerfil perfisPermitidos={["ADMIN"]}>
                <UsuarioForm />
              </RotaComPerfil>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
