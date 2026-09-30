import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http, { extrairMensagemErro } from "../../api/http";
import Paginacao from "../../components/Paginacao";
import Alerta from "../../components/Alerta";

export default function AlunosList() {
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
      const resposta = await http.get("/alunos", {
        params: { page: pagina, size: 10 },
      });
      setDados(resposta.data);
    } catch (error) {
      setErro(extrairMensagemErro(error, "Não foi possível carregar os alunos."));
    } finally {
      setCarregando(false);
    }
  }

  async function excluir(id) {
    if (!window.confirm("Excluir este aluno?")) return;
    try {
      await http.delete(`/alunos/${id}`);
      carregar();
    } catch (error) {
      setErro(extrairMensagemErro(error, "Não foi possível excluir o aluno."));
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Alunos</h2>
        <Link className="btn btn-primary" to="/alunos/novo">
          + Novo aluno
        </Link>
      </div>

      <Alerta tipo="erro">{erro}</Alerta>

      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <>
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dados.content.length === 0 && (
                <tr>
                  <td colSpan={4}>Nenhum aluno cadastrado.</td>
                </tr>
              )}
              {dados.content.map((aluno) => (
                <tr key={aluno.id}>
                  <td>{aluno.nome}</td>
                  <td>{aluno.email}</td>
                  <td>{aluno.telefone}</td>
                  <td className="acoes">
                    <Link to={`/alunos/${aluno.id}/editar`}>Editar</Link>
                    <button
                      className="btn-link btn-danger"
                      onClick={() => excluir(aluno.id)}
                    >
                      Excluir
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
