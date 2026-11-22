import { useState } from "react";
import { codigoPadre } from "../../domain/cuenta.rules";
import type { Cuenta, NodoCuenta } from "../../domain/cuenta.types";
import { ArbolCuentas } from "../components/arbol/ArbolCuentas";
import { FormCrearCuenta } from "../components/form/FormCrearCuenta";
import styles from "./CatalogoPage.module.css";

/**
 * Compone la pantalla y guarda el estado de UI que comparten árbol y formulario:
 * qué ramas están colapsadas, qué cuenta resaltar y desde qué padre se crea.
 * El estado del servidor (las cuentas) NO vive aquí: lo maneja TanStack Query.
 */
export function CatalogoPage() {
  // Se guardan las colapsadas (no las expandidas): por defecto todo se ve abierto
  const [colapsados, setColapsados] = useState<ReadonlySet<string>>(new Set());
  const [resaltado, setResaltado] = useState<string | null>(null);
  const [padre, setPadre] = useState<NodoCuenta | null>(null);
  const [formKey, setFormKey] = useState(0);

  const toggle = (codigo: string) =>
    setColapsados((prev) => {
      const siguiente = new Set(prev);
      if (siguiente.has(codigo)) siguiente.delete(codigo);
      else siguiente.add(codigo);
      return siguiente;
    });

  // Cambiar la key remonta el formulario: se reinicia con el código del padre
  const elegirPadre = (nodo: NodoCuenta | null) => {
    setPadre(nodo);
    setFormKey((k) => k + 1);
  };

  // Al crear: abrir toda la rama hasta la nueva cuenta y resaltarla
  const alCrear = (cuenta: Cuenta) => {
    setResaltado(cuenta.codigo);
    setColapsados((prev) => {
      const siguiente = new Set(prev);
      for (let c = codigoPadre(cuenta.codigo); c; c = codigoPadre(c))
        siguiente.delete(c);
      return siguiente;
    });
  };

  return (
    <main className={styles.pagina}>
      <header className={styles.encabezado}>
        <h1>Catálogo de cuentas</h1>
        <p>Clase (1) → Grupo (2) → Cuenta (4) → Subcuenta (6 dígitos)</p>
      </header>

      <div className={styles.layout}>
        <div className={styles.panel}>
          <ArbolCuentas
            colapsados={colapsados}
            resaltado={resaltado}
            onToggle={toggle}
            onExpandirTodo={() => setColapsados(new Set())}
            onColapsarTodo={(codigos) => setColapsados(new Set(codigos))}
            onCrearHija={elegirPadre}
          />
        </div>

        <aside className={`${styles.panel} ${styles.lateral}`}>
          <FormCrearCuenta
            key={formKey}
            padre={padre}
            onQuitarPadre={() => elegirPadre(null)}
            onCreada={alCrear}
          />
        </aside>
      </div>
    </main>
  );
}
