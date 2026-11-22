import { useEffect, useId, useRef, type ReactNode } from "react";
import { ErrorMensaje } from "./ErrorMensaje";
import styles from "./ui.module.css";

interface Props {
  abierto: boolean;
  titulo: string;
  children: ReactNode;
  textoConfirmar?: string;
  textoCargando?: string;
  cargando?: boolean;
  error?: string | null;
  onConfirmar: () => void;
  onCancelar: () => void;
}

/** <dialog> nativo: foco atrapado, Esc y backdrop sin librerías. */
export function ConfirmDialog({
  abierto,
  titulo,
  children,
  textoConfirmar = "Confirmar",
  textoCargando = "Procesando…",
  cargando = false,
  error,
  onConfirmar,
  onCancelar,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const tituloId = useId();

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (abierto && !dialogo.open) dialogo.showModal();
    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  return (
    <dialog
      ref={ref}
      className={styles.dialogo}
      aria-labelledby={tituloId}
      onCancel={(e) => {
        e.preventDefault(); // Esc: lo decide React, no el navegador
        if (!cargando) onCancelar();
      }}
    >
      <h2 id={tituloId} className={styles.dialogoTitulo}>
        {titulo}
      </h2>
      <div className={styles.dialogoCuerpo}>
        {children}
        {error && <ErrorMensaje mensaje={error} />}
      </div>
      <div className={styles.dialogoAcciones}>
        <button
          type="button"
          className={styles.boton}
          onClick={onCancelar}
          disabled={cargando}
        >
          Cancelar
        </button>
        <button
          type="button"
          className={`${styles.boton} ${styles.peligro}`}
          onClick={onConfirmar}
          disabled={cargando}
        >
          {cargando ? textoCargando : textoConfirmar}
        </button>
      </div>
    </dialog>
  );
}
