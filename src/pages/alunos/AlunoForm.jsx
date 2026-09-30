import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import http, { extrairMensagemErro } from "../../api/http";
import Alerta from "../../components/Alerta";
import CamposEndereco, { enderecoVazio } from "../../components/CamposEndereco";

export default function AlunoForm() {
  const { id } = useParams();
  const modoEdicao = !!id;
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState(enderecoVazio);

  const [carregando, setCarregando] = useState(modoEdicao);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (modoEdicao) {
      carregarAluno();
    }
  }, [id]);

  async function carregarAluno() {
    setErro("");
    try {
      const resposta = await http.get(`/alunos/${id}`);
      const dados = resposta.data;
      setNome(dados.nome);
      setEmail(dados.email);
      setTelefone(dados.telefone);
      setCpf(dados.cpf);
      setEndereco(dados.endereco);
    } catch (error) {
      setErro(extrairMensagemErro(error, "Não foi possível carregar o aluno."));
    } finally {
      setCarregando(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSalvando(true);
    try {
      if (modoEdicao) {
        await http.put("/alunos", {
          id: Number(id),
          nome,
          email,
          telefone,
          endereco,
        });
      } else {
        await http.post("/alunos", { nome, email, telefone, cpf, endereco });
      }
      navigate("/alunos");
    } catch (error) {
      setErro(extrairMensagemErro(error, "Não foi possível salvar o aluno."));
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <p>Carregando...</p>;

  return (
    <div>
      <h2>{modoEdicao ? "Editar aluno" : "Novo aluno"}</h2>

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
            CPF
            <input
              value={cpf}
              maxLength={11}
              onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
              required
              disabled={modoEdicao}
              title={modoEdicao ? "O CPF não pode ser alterado." : undefined}
            />
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
            onClick={() => navigate("/alunos")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
