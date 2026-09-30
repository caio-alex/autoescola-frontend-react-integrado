export default function Paginacao({ pagina, totalPaginas, onMudarPagina }) {
  if (totalPaginas <= 1) return null;

  return (
    <div className="paginacao">
      <button
        className="btn btn-secondary"
        disabled={pagina === 0}
        onClick={() => onMudarPagina(pagina - 1)}
      >
        Anterior
      </button>
      <span>
        Página {pagina + 1} de {totalPaginas}
      </span>
      <button
        className="btn btn-secondary"
        disabled={pagina + 1 >= totalPaginas}
        onClick={() => onMudarPagina(pagina + 1)}
      >
        Próxima
      </button>
    </div>
  );
}
