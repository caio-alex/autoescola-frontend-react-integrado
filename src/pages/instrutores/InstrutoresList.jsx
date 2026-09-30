import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http, { extrairMensagemErro } from "../../api/http";
import { useAuth } from "../../context/AuthContext";
import Paginacao from "../../components/Paginacao";
import Alerta from "../../components/Alerta";

export default function InstrutoresList() {
  const { perfil } = useAuth();
  const podeGerenciar = perfil === "ADMIN";

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
      const resposta = await http.get("/instrutores", {
        params: { page: pagina, size: 10 },
      });
      setDados(resposta.data);
    } catch (error) {
      setErro(extrairMensagemErro(error, "Não foi possível carregar os instrutores."));
    } finally {
      setCarregando(false);
    }
  }

  async function excluir(id) {
    if (!window.confirm("Excluir este instrutor?")) return;
    try {
      await http.delete(`/instrutores/${id}`);
      carregar();
    } catch (error) {
      setErro(extrairMensagemErro(error, "Não foi possível excluir o instrutor."));
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Instrutores</h2>
        {podeGerenciar && (
          <Link className="btn btn-primary" to="/instrutores/novo">
            + Novo instrutor
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
                <th>Nome</th>
                <th>Email</th>
                <th>Especialidade</th>
                {podeGerenciar && <th></th>}
              </tr>
            </thead>
            <tbody>
              {dados.content.length === 0 && (
                <tr>
                  <td colSpan={podeGerenciar ? 4 : 3}>Nenhum instrutor cadastrado.</td>
                </tr>
              )}
              {dados.content.map((instrutor) => (
                <tr key={instrutor.id}>
                  <td>{instrutor.nome}</td>
                  <td>{instrutor.email}</td>
                  <td>{instrutor.especialidade}</td>
                  {podeGerenciar && (
                    <td className="acoes">
                      <Link to={`/instrutores/${instrutor.id}/editar`}>Editar</Link>
                      <button
                        className="btn-link btn-danger"
                        onClick={() => excluir(instrutor.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  )}
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
