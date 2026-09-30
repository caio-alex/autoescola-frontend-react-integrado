import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const todosOsLinks = [
  { to: "/instrutores", label: "Instrutores", perfis: ["ADMIN", "USER", "ALUNO"] },
  { to: "/alunos", label: "Alunos", perfis: ["ADMIN", "USER"] },
  { to: "/instrucoes", label: "Instruções", perfis: ["ADMIN", "USER", "ALUNO", "INSTRUTOR"] },
  { to: "/usuarios", label: "Usuários", perfis: ["ADMIN"] },
];

export default function Layout() {
  const { login, perfil, sair } = useAuth();
  const navigate = useNavigate();

  // Enquanto o perfil ainda não chegou (primeiro instante após login/refresh),
  // mostra tudo para não "piscar" o menu - o backend segue protegendo mesmo assim.
  const links = todosOsLinks.filter((link) => !perfil || link.perfis.includes(perfil));

  function handleSair() {
    sair();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1 className="brand">Auto Escola</h1>
        <nav>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main">
        <header className="topbar">
          <span>
            Olá, {login}
            {perfil && <span className="badge-perfil">{perfil}</span>}
          </span>
          <button className="btn btn-ghost" onClick={handleSair}>
            Sair
          </button>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
