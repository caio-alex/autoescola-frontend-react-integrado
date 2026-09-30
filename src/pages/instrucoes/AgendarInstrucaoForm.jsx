import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import http, { extrairMensagemErro } from "../../api/http";
import { useAuth } from "../../context/AuthContext";
import Alerta from "../../components/Alerta";

const especialidades = ["MOTOS", "CARROS", "VANS", "CAMINHOES"];

// input datetime-local -> "dd/MM/yyyy - HH:mm", formato exigido pela API.
function formatarDataParaApi(datetimeLocal) {
  const [dataParte, horaParte] = datetimeLocal.split("T");
  const [ano, mes, dia] = dataParte.split("-");
  return `${dia}/${mes}/${ano} - ${horaParte}`;
}

export default function AgendarInstrucaoForm() {
  const { perfil } = useAuth();
  const ehAluno = perfil === "ALUNO";
  const navigate = useNavigate();

  const [proprioAluno, setProprioAluno] = useState(null); // só usado quando ehAluno
  const [alunos, setAlunos] = useState([]); // só usado quando !ehAluno
  const [instrutores, setInstrutores] = useState([]);

  const [idAluno, setIdAluno] = useState("");
  const [modoInstrutor, setModoInstrutor] = useState("automatico"); // "automatico" | "escolher"
  const [idInstrutor, setIdInstrutor] = useState("");
  const [especialidade, setEspecialidade] = useState(especialidades[0]);
  const [dataHora, setDataHora] = useState("");

  const [carregandoListas, setCarregandoListas] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarListas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function carregarListas() {
    setErro("");
    try {
      const chamadas = [http.get("/instrutores", { params: { page: 0, size: 100 } })];
      if (ehAluno) {
        chamadas.push(http.get("/alunos/me"));
      } else {
        chamadas.push(http.get("/alunos", { params: { page: 0, size: 100 } }));
      }

      const [respInstrutores, respAluno] = await Promise.all(chamadas);
      setInstrutores(respInstrutores.data.content);

      if (ehAluno) {
        setProprioAluno(respAluno.data);
      } else {
        setAlunos(respAluno.data.content);
      }
    } catch (error) {
      setErro(extrairMensagemErro(error, "Não foi possível carregar os dados necessários."));
    } finally {
      setCarregandoListas(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSalvando(true);
    try {
      const payload = {
        id_aluno: ehAluno ? proprioAluno.id : Number(idAluno),
        data_hora: formatarDataParaApi(dataHora),
      };

      if (modoInstrutor === "escolher") {
        payload.id_instrutor = Number(idInstrutor);
      } else {
        payload.especialidade = especialidade;
      }

      await http.post("/instrucoes", payload);
      navigate("/instrucoes");
    } catch (error) {
      setErro(extrairMensagemErro(error, "Não foi possível agendar a instrução."));
    } finally {
      setSalvando(false);
    }
  }

  if (carregandoListas) return <p>Carregando...</p>;

  if (ehAluno && !proprioAluno) {
    return <Alerta tipo="erro">{erro || "Não foi possível carregar seus dados."}</Alerta>;
  }

  const semAlunoDisponivel = !ehAluno && alunos.length === 0;

  return (
    <div>
      <h2>Agendar instrução</h2>

      <Alerta tipo="erro">{erro}</Alerta>

      {semAlunoDisponivel && (
        <Alerta tipo="erro">
          Nenhum aluno cadastrado ainda. Cadastre um aluno antes de agendar.
        </Alerta>
      )}

      <form className="form" onSubmit={handleSubmit}>
        {ehAluno ? (
          <label>
            Aluno
            <input value={proprioAluno.nome} disabled />
          </label>
        ) : (
          <label>
            Aluno
            <select
              value={idAluno}
              onChange={(e) => setIdAluno(e.target.value)}
              required
            >
              <option value="" disabled>
                Selecione um aluno
              </option>
              {alunos.map((aluno) => (
                <option key={aluno.id} value={aluno.id}>
                  {aluno.nome}
                </option>
              ))}
            </select>
          </label>
        )}

        <label>
          Data e hora
          <input
            type="datetime-local"
            value={dataHora}
            onChange={(e) => setDataHora(e.target.value)}
            required
          />
        </label>

        <fieldset className="fieldset">
          <legend>Instrutor</legend>

          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                checked={modoInstrutor === "automatico"}
                onChange={() => setModoInstrutor("automatico")}
              />
              Deixar o sistema escolher por especialidade
            </label>
            <label className="radio-label">
              <input
                type="radio"
                checked={modoInstrutor === "escolher"}
                onChange={() => setModoInstrutor("escolher")}
              />
              Escolher um instrutor específico
            </label>
          </div>

          {modoInstrutor === "automatico" ? (
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
          ) : (
            <label>
              Instrutor
              <select
                value={idInstrutor}
                onChange={(e) => setIdInstrutor(e.target.value)}
                required
              >
                <option value="" disabled>
                  Selecione um instrutor
                </option>
                {instrutores.map((instrutor) => (
                  <option key={instrutor.id} value={instrutor.id}>
                    {instrutor.nome} ({instrutor.especialidade})
                  </option>
                ))}
              </select>
            </label>
          )}
        </fieldset>

        <div className="form-actions">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={salvando || semAlunoDisponivel}
          >
            {salvando ? "Agendando..." : "Agendar"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/instrucoes")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
