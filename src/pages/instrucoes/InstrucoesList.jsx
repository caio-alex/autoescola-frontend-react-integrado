import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http, { extrairMensagemErro } from "../../api/http";
import { useAuth } from "../../context/AuthContext";
import Paginacao from "../../components/Paginacao";
import Alerta from "../../components/Alerta";

function formatarDataExibicao(isoString) {
  if (!isoString) return "";
  const data = new Date(isoString);
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function InstrucoesList() {
  const { perfil } = useAuth();
  const podeAgendar = perfil !== "INSTRUTOR";

  const [pagina, setPagina] = useState(0);
  const [dados, setDados] = useState({ content: [], totalPages: 0 });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregar();
  }, [pagina]);

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const resposta = await http.get("/instrucoes", {
        params: { page: pagina, size: 10 },
      });
      setDados(resposta.data);
    } catch (error) {
      setErro(extrairMensagemErro(error, "Não foi possível carregar as instruções."));
    } finally {
      setCarregando(false);
    }
  }

  async function cancelar(id) {
    if (!window.confirm("Cancelar esta instrução?")) return;
    setErro("");
    try {
      await http.delete(`/instrucoes/${id}`);
      carregar();
    } catch (error) {
      setErro(
        extrairMensagemErro(
          error,
          "Não foi possível cancelar. Cancelamentos exigem no mínimo 30 min de antecedência."
        )
      );
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Instruções</h2>
        {podeAgendar && (
          <Link className="btn btn-primary" to="/instrucoes/novo">
            + Agendar instrução
          </Link>
        )}
      </div>

      <Alerta tipo="erro">{erro}</Alerta>

      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <>
          <table className="tabela">
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Aluno</th>
                <th>Instrutor</th>
                <th>Especialidade</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dados.content.length === 0 && (
                <tr>
                  <td colSpan={5}>Nenhuma instrução agendada.</td>
                </tr>
              )}
              {dados.content.map((instrucao) => (
                <tr key={instrucao.id}>
                  <td>{formatarDataExibicao(instrucao.dataHora)}</td>
                  <td>{instrucao.nomeAluno}</td>
                  <td>{instrucao.nomeInstrutor}</td>
                  <td>{instrucao.especialidade}</td>
                  <td className="acoes">
                    <button
                      className="btn-link btn-danger"
                      onClick={() => cancelar(instrucao.id)}
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Paginacao
            pagina={pagina}
            totalPaginas={dados.totalPages}
            onMudarPagina={setPagina}
          />
        </>
      )}
    </div>
  );
}
