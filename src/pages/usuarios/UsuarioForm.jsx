import { useState } from "react";
import { useNavigate } from "react-router-dom";
import http, { extrairMensagemErro } from "../../api/http";
import Alerta from "../../components/Alerta";

const perfis = ["USER", "ADMIN"];

export default function UsuarioForm() {
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("USER");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSalvando(true);
    try {
      await http.post("/usuarios", { login, senha, perfil });
      navigate("/usuarios");
    } catch (error) {
      setErro(
        extrairMensagemErro(
          error,
          "Não foi possível cadastrar o usuário. Verifique se o login já está em uso."
        )
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div>
      <h2>Novo usuário</h2>

      <Alerta tipo="erro">{erro}</Alerta>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Login
            <input value={login} onChange={(e) => setLogin(e.target.value)} required />
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
          <label>
            Perfil
            <select value={perfil} onChange={(e) => setPerfil(e.target.value)}>
              {perfis.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/usuarios")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
