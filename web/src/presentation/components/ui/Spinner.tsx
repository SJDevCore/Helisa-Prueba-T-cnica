import styles from "./ui.module.css";

interface Props {
  texto?: string;
}

export function Spinner({ texto = "Cargando…" }: Props) {
  return (
    <span className={styles.spinner} role="status">
      <span className={styles.circulo} aria-hidden="true" />
      {texto}
    </span>
  );
}
