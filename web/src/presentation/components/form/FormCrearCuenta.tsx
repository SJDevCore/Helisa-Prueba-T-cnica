import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { useCrearCuenta } from "../../../application/hooks/useCrearCuenta";
import {
  ETIQUETA_NIVEL,
  codigoPadre,
  esClase,
  esNumerico,
  longitudHija,
  nivelDe,
  textoLongitudes,
} from "../../../domain/cuenta.rules";
import type {
  CrearCuentaDto,
  Cuenta,
  Naturaleza,
  NodoCuenta,
} from "../../../domain/cuenta.types";
import {
  validarCrearCuenta,
  type ErroresFormulario,
} from "../../../domain/schemas/crear-cuenta.schema";
import { ErrorMensaje } from "../ui/ErrorMensaje";
import ui from "../ui/ui.module.css";
import styles from "./FormCrearCuenta.module.css";

const CAMPOS = ["codigo", "nombre", "naturaleza"] as const;
type Campo = (typeof CAMPOS)[number];

interface Valores {
  codigo: string;
  nombre: string;
  naturaleza: "" | Naturaleza;
}

interface Props {
  /** Si viene, el formulario crea una hija de este nodo con el código prellenado. */
  padre?: NodoCuenta | null;
  onQuitarPadre?: () => void;
  onCreada: (cuenta: Cuenta) => void;
}

export function FormCrearCuenta({
  padre = null,
  onQuitarPadre,
  onCreada,
}: Props) {
  const codigoInicial = padre?.codigo ?? "";
  const [valores, setValores] = useState<Valores>({
    codigo: codigoInicial,
    nombre: "",
    naturaleza: "",
  });
  const [errores, setErrores] = useState<ErroresFormulario>({});
  const [exito, setExito] = useState<string | null>(null);
  const crear = useCrearCuenta();
  const codigoRef = useRef<HTMLInputElement>(null);

  // Al prellenar, foco en el código con el cursor al final para seguir escribiendo
  useEffect(() => {
    if (!codigoInicial) return;
    const input = codigoRef.current;
    input?.focus();
    input?.setSelectionRange(codigoInicial.length, codigoInicial.length);
  }, [codigoInicial]);

  // Ayuda en vivo: qué nivel y qué padre tendría el código escrito
  const codigo = valores.codigo.trim();
  const nivel = esNumerico(codigo) ? nivelDe(codigo) : null;
  const padreCalculado = nivel ? codigoPadre(codigo) : null;
  const mostrarNaturaleza = nivel !== null && esClase(codigo);

  const cambiar =
    (campo: Campo) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const valor = e.target.value;
      setValores((v) => ({ ...v, [campo]: valor }));
      setErrores((er) => ({ ...er, [campo]: undefined })); // el error se va al corregir
      setExito(null);
    };

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    setExito(null);

    // 1) Validación en el cliente con Zod
    const resultado = validarCrearCuenta({
      codigo: valores.codigo,
      nombre: valores.nombre,
      naturaleza: valores.naturaleza || undefined,
    });
    if (!resultado.ok) {
      setErrores(resultado.errores);
      return;
    }
    setErrores({});

    const { datos } = resultado;
    const dto: CrearCuentaDto = {
      codigo: datos.codigo,
      nombre: datos.nombre,
      // Solo las clases envían naturaleza; las demás la heredan
      ...(esClase(datos.codigo) && datos.naturaleza
        ? { naturaleza: datos.naturaleza }
        : {}),
    };

    // 2) Envío; los errores de negocio de la API se pintan en el mismo campo
    crear.mutate(dto, {
      onSuccess: (cuenta) => {
        setValores({ codigo: codigoInicial, nombre: "", naturaleza: "" });
        setExito(`Cuenta ${cuenta.codigo} · ${cuenta.nombre} creada`);
        onCreada(cuenta);
      },
      onError: (error) => setErrores(error.porCampo()),
    });
  };

  const erroresGenerales = crear.error?.generales(CAMPOS) ?? [];
  const faltan = padre ? longitudHija(padre.codigo) : null;

  return (
    <form className={styles.form} onSubmit={enviar} noValidate>
      <h2 className={styles.titulo}>Nueva cuenta</h2>

      {padre && (
        <div className={styles.contexto}>
          <span>
            Hija de{" "}
            <strong>
              {padre.codigo} · {padre.nombre}
            </strong>
            {faltan && ` (código de ${faltan} dígitos)`}
          </span>
          {onQuitarPadre && (
            <button type="button" onClick={onQuitarPadre}>
              Quitar
            </button>
          )}
        </div>
      )}

      {erroresGenerales.map((mensaje) => (
        <ErrorMensaje key={mensaje} mensaje={mensaje} />
      ))}

      <Campo
        id="codigo"
        etiqueta="Código"
        error={errores.codigo}
        ayuda={
          nivel
            ? `${ETIQUETA_NIVEL[nivel]}${padreCalculado ? ` · padre ${padreCalculado}` : " · sin padre"}`
            : `Solo dígitos: ${textoLongitudes()} según el nivel`
        }
      >
        <input
          ref={codigoRef}
          id="codigo"
          inputMode="numeric"
          autoComplete="off"
          maxLength={6}
          value={valores.codigo}
          onChange={cambiar("codigo")}
          aria-invalid={!!errores.codigo}
          aria-describedby="codigo-ayuda codigo-error"
          className={`${styles.input} ${styles.inputCodigo} ${errores.codigo ? styles.invalido : ""}`}
        />
      </Campo>

      <Campo id="nombre" etiqueta="Nombre" error={errores.nombre}>
        <input
          id="nombre"
          autoComplete="off"
          maxLength={100}
          value={valores.nombre}
          onChange={cambiar("nombre")}
          aria-invalid={!!errores.nombre}
          aria-describedby="nombre-error"
          className={`${styles.input} ${errores.nombre ? styles.invalido : ""}`}
        />
      </Campo>

      {mostrarNaturaleza ? (
        <Campo id="naturaleza" etiqueta="Naturaleza" error={errores.naturaleza}>
          <select
            id="naturaleza"
            value={valores.naturaleza}
            onChange={cambiar("naturaleza")}
            aria-invalid={!!errores.naturaleza}
            aria-describedby="naturaleza-error"
            className={`${styles.input} ${errores.naturaleza ? styles.invalido : ""}`}
          >
            <option value="">Selecciona…</option>
            <option value="DEBITO">Débito</option>
            <option value="CREDITO">Crédito</option>
          </select>
        </Campo>
      ) : (
        nivel && (
          <p className={styles.ayuda}>La naturaleza se hereda de la clase.</p>
        )
      )}

      {exito && (
        <p className={styles.exito} role="status">
          {exito}
        </p>
      )}

      <div className={styles.acciones}>
        <button
          type="submit"
          className={`${ui.boton} ${ui.primario}`}
          disabled={crear.isPending}
        >
          {crear.isPending ? "Guardando…" : "Crear cuenta"}
        </button>
      </div>
    </form>
  );
}

interface CampoProps {
  id: string;
  etiqueta: string;
  error?: string;
  ayuda?: string;
  children: ReactNode;
}

function Campo({ id, etiqueta, error, ayuda, children }: CampoProps) {
  return (
    <div className={styles.campo}>
      <label htmlFor={id} className={styles.etiqueta}>
        {etiqueta}
      </label>
      {children}
      {ayuda && (
        <span id={`${id}-ayuda`} className={styles.ayuda}>
          {ayuda}
        </span>
      )}
      {error && (
        <span id={`${id}-error`} className={styles.errorCampo} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
