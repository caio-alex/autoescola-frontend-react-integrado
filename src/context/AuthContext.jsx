import { createContext, useContext, useEffect, useState } from "react";
import http from "../api/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("tokenJWT"));
  const [login, setLogin] = useState(() => localStorage.getItem("loginUsuario"));
  const [perfil, setPerfil] = useState(() => localStorage.getItem("perfilUsuario"));
  const [carregandoPerfil, setCarregandoPerfil] = useState(false);

  // Se a página for recarregada com um token salvo mas sem o perfil em cache
  // (ex.: localStorage foi limpo parcialmente), busca de novo.
  useEffect(() => {
    if (token && !perfil) {
      carregarPerfil();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function carregarPerfil() {
    setCarregandoPerfil(true);
    try {
      const resposta = await http.get("/usuarios/me");
      localStorage.setItem("perfilUsuario", resposta.data.perfil);
      setPerfil(resposta.data.perfil);
      return resposta.data.perfil;
    } finally {
      setCarregandoPerfil(false);
    }
  }

  async function entrar(loginInformado, senha) {
    const resposta = await http.post("/login", {
      login: loginInformado,
      senha,
    });
    const { tokenJWT } = resposta.data;

    localStorage.setItem("tokenJWT", tokenJWT);
    localStorage.setItem("loginUsuario", loginInformado);
    setToken(tokenJWT);
    setLogin(loginInformado);

    return carregarPerfil();
  }

  function sair() {
    localStorage.removeItem("tokenJWT");
    localStorage.removeItem("loginUsuario");
    localStorage.removeItem("perfilUsuario");
    setToken(null);
    setLogin(null);
    setPerfil(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        perfil,
        carregandoPerfil,
        autenticado: !!token,
        entrar,
        sair,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de um AuthProvider");
  }
  return context;
}
