import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RotaComPerfil({ perfisPermitidos, children }) {
  const { perfil, carregandoPerfil } = useAuth();

  if (carregandoPerfil) {
    return <p>Carregando...</p>;
  }

  if (perfil && !perfisPermitidos.includes(perfil)) {
    return <Navigate to="/instrucoes" replace />;
  }

  return children;
}
