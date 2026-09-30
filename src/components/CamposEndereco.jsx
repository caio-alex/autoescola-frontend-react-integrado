export default function CamposEndereco({ endereco, onChange }) {
  function atualizar(campo, valor) {
    onChange({ ...endereco, [campo]: valor });
  }

  return (
    <fieldset className="fieldset">
      <legend>Endereço</legend>

      <div className="form-row">
        <label>
          Logradouro
          <input
            value={endereco.logradouro}
            onChange={(e) => atualizar("logradouro", e.target.value)}
            required
          />
        </label>
        <label>
          Número
          <input
            value={endereco.numero}
            onChange={(e) => atualizar("numero", e.target.value)}
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Complemento
          <input
            value={endereco.complemento}
            onChange={(e) => atualizar("complemento", e.target.value)}
          />
        </label>
        <label>
          Bairro
          <input
            value={endereco.bairro}
            onChange={(e) => atualizar("bairro", e.target.value)}
            required
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Cidade
          <input
            value={endereco.cidade}
            onChange={(e) => atualizar("cidade", e.target.value)}
            required
          />
        </label>
        <label>
          UF
          <input
            value={endereco.uf}
            maxLength={2}
            placeholder="SP"
            onChange={(e) => atualizar("uf", e.target.value.toUpperCase())}
            required
          />
        </label>
        <label>
          CEP
          <input
            value={endereco.cep}
            placeholder="Somente números"
            maxLength={8}
            onChange={(e) =>
              atualizar("cep", e.target.value.replace(/\D/g, ""))
            }
            required
          />
        </label>
      </div>
    </fieldset>
  );
}

export const enderecoVazio = {
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
  cep: "",
};
