import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http, { extrairMensagemErro } from "../../api/http";
import Paginacao from "../../components/Paginacao";
import Alerta from "../../components/Alerta";

export default function UsuariosList() {
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
      const resposta = await http.get("/usuarios", {
        params: { page: pagina, size: 10 },
      });
      setDados(resposta.data);
    } catch (error) {
      setErro(extrairMensagemErro(error, "Não foi possível carregar os usuários."));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Usuários</h2>
        <Link className="btn btn-primary" to="/usuarios/novo">
          + Novo usuário
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
                <th>Login</th>
                <th>Perfil</th>
              </tr>
            </thead>
            <tbody>
              {dados.content.length === 0 && (
                <tr>
                  <td colSpan={2}>Nenhum usuário cadastrado.</td>
                </tr>
              )}
              {dados.content.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.login}</td>
                  <td>{usuario.perfil}</td>
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
