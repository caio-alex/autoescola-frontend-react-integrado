export default function Alerta({ tipo = "erro", children }) {
  if (!children) return null;
  return <div className={`alerta alerta-${tipo}`}>{children}</div>;
}
