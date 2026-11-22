import { useState } from "react";
import { useArbolCuentas } from "../../../application/hooks/useArbolCuentas";
import { useEliminarCuenta } from "../../../application/hooks/useEliminarCuenta";
import type { NodoCuenta as Nodo } from "../../../domain/cuenta.types";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { ErrorMensaje } from "../ui/ErrorMensaje";
import { Spinner } from "../ui/Spinner";
import ui from "../ui/ui.module.css";
import styles from "./Arbol.module.css";
import { NodoCuenta } from "./NodoCuenta";

interface Props {
  colapsados: ReadonlySet<string>;
  resaltado: string | null;
  onToggle: (codigo: string) => void;
  onExpandirTodo: () => void;
  onColapsarTodo: (codigos: string[]) => void;
  onCrearHija: (nodo: Nodo) => void;
}

function codigosConHijas(nodos: Nodo[]): string[] {
  return nodos.flatMap((n) =>
    n.hijos.length > 0 ? [n.codigo, ...codigosConHijas(n.hijos)] : [],
  );
}

export function ArbolCuentas({
  colapsados,
  resaltado,
  onToggle,
  onExpandirTodo,
  onColapsarTodo,
  onCrearHija,
}: Props) {
  const arbol = useArbolCuentas();
  const eliminar = useEliminarCuenta();
  const [aEliminar, setAEliminar] = useState<Nodo | null>(null);

  const pedirEliminar = (nodo: Nodo) => {
    eliminar.reset(); // limpia el error de un intento anterior
    setAEliminar(nodo);
  };

  const cancelarEliminar = () => {
    setAEliminar(null);
    eliminar.reset();
  };

  const confirmarEliminar = () => {
    if (!aEliminar) return;
    eliminar.mutate(aEliminar.codigo, { onSuccess: () => setAEliminar(null) });
  };

  if (arbol.isPending) return <Spinner texto="Cargando catálogo…" />;

  if (arbol.isError) {
    return (
      <ErrorMensaje
        mensaje={`No se pudo cargar el catálogo. ${arbol.error.message}`}
        onReintentar={() => arbol.refetch()}
      />
    );
  }

  const nodos = arbol.data;

  return (
    <section className={styles.contenedor} aria-label="Árbol de cuentas">
      <div className={styles.barra}>
        <button type="button" className={ui.boton} onClick={onExpandirTodo}>
          Expandir todo
        </button>
        <button
          type="button"
          className={ui.boton}
          onClick={() => onColapsarTodo(codigosConHijas(nodos))}
        >
          Colapsar todo
        </button>
        <span className={styles.barraEspacio} />
        {arbol.isFetching && <Spinner texto="Actualizando…" />}
      </div>

      {nodos.length === 0 ? (
        <p className={styles.vacio}>
          El catálogo está vacío. Crea una clase (código de 1 dígito) para
          empezar.
        </p>
      ) : (
        <ul
          role="tree"
          aria-label="Catálogo de cuentas"
          className={styles.arbol}
        >
          {nodos.map((nodo) => (
            <NodoCuenta
              key={nodo.codigo}
              nodo={nodo}
              colapsados={colapsados}
              resaltado={resaltado}
              onToggle={onToggle}
              onCrearHija={onCrearHija}
              onEliminar={pedirEliminar}
            />
          ))}
        </ul>
      )}

      <ConfirmDialog
        abierto={aEliminar !== null}
        titulo="Eliminar cuenta"
        textoConfirmar="Eliminar"
        textoCargando="Eliminando…"
        cargando={eliminar.isPending}
        error={eliminar.error?.message ?? null}
        onConfirmar={confirmarEliminar}
        onCancelar={cancelarEliminar}
      >
        {aEliminar && (
          <p>
            ¿Eliminar la cuenta{" "}
            <strong>
              {aEliminar.codigo} · {aEliminar.nombre}
            </strong>
            ? Esta acción no se puede deshacer.
          </p>
        )}
      </ConfirmDialog>
    </section>
  );
}
