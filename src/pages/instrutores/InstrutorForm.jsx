import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import http, { extrairMensagemErro } from "../../api/http";
import Alerta from "../../components/Alerta";
import CamposEndereco, { enderecoVazio } from "../../components/CamposEndereco";

const especialidades = ["MOTOS", "CARROS", "VANS", "CAMINHOES"];

export default function InstrutorForm() {
  const { id } = useParams();
  const modoEdicao = !!id;
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cnh, setCnh] = useState("");
  const [especialidade, setEspecialidade] = useState(especialidades[0]);
  const [endereco, setEndereco] = useState(enderecoVazio);

  const [carregando, setCarregando] = useState(modoEdicao);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function carregarInstrutor() {
    setErro("");
    try {
      const resposta = await http.get(`/instrutores/${id}`);
      const dados = resposta.data;
      setNome(dados.nome);
      setEmail(dados.email);
      setTelefone(dados.telefone);
      setCnh(dados.cnh);
      setEspecialidade(dados.especialidade);
      setEndereco(dados.endereco);
    } catch (error) {
      setErro(extrairMensagemErro(error, "Não foi possível carregar o instrutor."));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    if (modoEdicao) {
      carregarInstrutor();
    }
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSalvando(true);
    try {
      if (modoEdicao) {
        await http.put("/instrutores", {
          id: Number(id),
          nome,
          email,
          telefone,
          especialidade,
          endereco,
        });
      } else {
        await http.post("/instrutores", {
          nome,
          email,
          telefone,
          cnh,
          especialidade,
          endereco,
        });
      }
      navigate("/instrutores");
    } catch (error) {
      setErro(extrairMensagemErro(error, "Não foi possível salvar o instrutor."));
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <p>Carregando...</p>;

  return (
    <div>
      <h2>{modoEdicao ? "Editar instrutor" : "Novo instrutor"}</h2>

      <Alerta tipo="erro">{erro}</Alerta>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Nome
            <input value={nome} onChange={(e) => setNome(e.target.value)} required />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Telefone
            <input
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
            />
          </label>
          <label>
            CNH
            <input
              value={cnh}
              maxLength={11}
              onChange={(e) => setCnh(e.target.value.replace(/\D/g, ""))}
              required
              disabled={modoEdicao}
              title={modoEdicao ? "A CNH não pode ser alterada." : undefined}
            />
          </label>
          <label>
            Especialidade
            <select
              value={especialidade}
              onChange={(e) => setEspecialidade(e.target.value)}
            >
              {especialidades.map((esp) => (
                <option key={esp} value={esp}>
                  {esp}
                </option>
              ))}
            </select>
          </label>
        </div>

        <CamposEndereco endereco={endereco} onChange={setEndereco} />

        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/instrutores")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
