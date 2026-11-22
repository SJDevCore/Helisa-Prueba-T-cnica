import { ETIQUETA_NIVEL, longitudHija } from "../../../domain/cuenta.rules";
import type { NodoCuenta as Nodo } from "../../../domain/cuenta.types";
import styles from "./Arbol.module.css";

interface Props {
  nodo: Nodo;
  colapsados: ReadonlySet<string>;
  resaltado: string | null;
  onToggle: (codigo: string) => void;
  onCrearHija: (nodo: Nodo) => void;
  onEliminar: (nodo: Nodo) => void;
}

/** Un nodo del árbol. Se renderiza a sí mismo para sus hijas (recursivo). */
export function NodoCuenta(props: Props) {
  const { nodo, colapsados, resaltado, onToggle, onCrearHija, onEliminar } =
    props;
  const tieneHijas = nodo.hijos.length > 0;
  const expandido = tieneHijas && !colapsados.has(nodo.codigo);
  const admiteHijas = longitudHija(nodo.codigo) !== null;

  const clasesFila = [
    styles.fila,
    nodo.nivel === "CLASE" ? styles.clase : "",
    resaltado === nodo.codigo ? styles.resaltado : "",
  ].join(" ");

  return (
    <li role="treeitem" aria-expanded={tieneHijas ? expandido : undefined}>
      <div className={clasesFila}>
        {tieneHijas ? (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => onToggle(nodo.codigo)}
            aria-label={`${expandido ? "Colapsar" : "Expandir"} ${nodo.codigo} ${nodo.nombre}`}
          >
            {expandido ? "▼" : "▶"}
          </button>
        ) : (
          <span className={styles.toggleVacio} aria-hidden="true" />
        )}

        <span className={styles.codigo}>{nodo.codigo}</span>
        <span className={styles.nombre}>{nodo.nombre}</span>
        <span className={styles.badge}>{ETIQUETA_NIVEL[nodo.nivel]}</span>
        <span
          className={`${styles.badge} ${nodo.naturaleza === "DEBITO" ? styles.debito : styles.credito}`}
        >
          {nodo.naturaleza === "DEBITO" ? "Débito" : "Crédito"}
        </span>
        {nodo.admiteMovimientos && (
          <span
            className={styles.movimientos}
            title="Cuenta sin hijas: admite movimientos"
          >
            ● Movimientos
          </span>
        )}

        <div className={styles.acciones}>
          {admiteHijas && (
            <button
              type="button"
              className={styles.accion}
              onClick={() => onCrearHija(nodo)}
              aria-label={`Crear hija de ${nodo.codigo}`}
            >
              + Hija
            </button>
          )}
          <button
            type="button"
            className={`${styles.accion} ${styles.accionPeligro}`}
            onClick={() => onEliminar(nodo)}
            aria-label={`Eliminar ${nodo.codigo}`}
          >
            Eliminar
          </button>
        </div>
      </div>

      {expandido && (
        <ul role="group" className={styles.grupo}>
          {nodo.hijos.map((hija) => (
            <NodoCuenta key={hija.codigo} {...props} nodo={hija} />
          ))}
        </ul>
      )}
    </li>
  );
}
