import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { extrairMensagemErro } from "../api/http";
import Alerta from "../components/Alerta";

export default function Login() {
  const { entrar } = useAuth();
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      const perfil = await entrar(login, senha);
      const destinoPadrao = perfil === "ALUNO" || perfil === "INSTRUTOR"
        ? "/instrucoes"
        : "/instrutores";
      navigate(destinoPadrao);
    } catch (error) {
      const status = error.response?.status;
      if (status === 400 || status === 401 || status === 403) {
        setErro("Login ou senha inválidos.");
      } else {
        setErro(extrairMensagemErro(error, "Não foi possível fazer login."));
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Auto Escola</h1>
        <p className="subtitle">Entre com seu usuário e senha</p>

        <Alerta tipo="erro">{erro}</Alerta>

        <label>
          Login
          <input
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            autoFocus
            required
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </label>

        <button className="btn btn-primary" type="submit" disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
