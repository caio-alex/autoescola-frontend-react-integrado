import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8085",
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("tokenJWT");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const temToken = !!localStorage.getItem("tokenJWT");

    // Sem token e recebeu 401/403: sessão expirada ou nunca existiu -> volta pro login.
    if ((status === 401 || status === 403) && !temToken) {
      redirecionarParaLogin();
    }

    // Com token mas ainda assim 401: token expirado/inválido -> desloga.
    if (status === 401 && temToken) {
      localStorage.removeItem("tokenJWT");
      localStorage.removeItem("loginUsuario");
      redirecionarParaLogin();
    }

    return Promise.reject(error);
  }
);

function redirecionarParaLogin() {
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

/**
 * Extrai uma mensagem de erro amigável da resposta da API.
 * A API tem alguns pontos que ainda não têm tratamento de exceção
 * (retornam 500 puro) - nesses casos caímos numa mensagem genérica.
 */
export function extrairMensagemErro(error, mensagemPadrao) {
  const status = error.response?.status;
  const data = error.response?.data;

  if (status === 403) {
    return "Você não tem permissão para realizar essa ação (é necessário perfil ADMIN).";
  }

  if (status === 404) {
    return data?.message || "Registro não encontrado.";
  }

  if (status === 400 && Array.isArray(data)) {
    return data.map((e) => `${e.field}: ${e.message}`).join(" | ");
  }

  if (data?.message) {
    return data.message;
  }

  return mensagemPadrao || "Ocorreu um erro inesperado. Tente novamente.";
}

export default http;
