import styles from "./ui.module.css";

interface Props {
  mensaje: string;
  onReintentar?: () => void;
}

export function ErrorMensaje({ mensaje, onReintentar }: Props) {
  return (
    <div className={styles.error} role="alert">
      <span>{mensaje}</span>
      {onReintentar && (
        <button type="button" className={styles.boton} onClick={onReintentar}>
          Reintentar
        </button>
      )}
    </div>
  );
}
