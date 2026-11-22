import { z } from "zod";
import {
  esClase,
  esLongitudValida,
  esNumerico,
  textoLongitudes,
} from "../cuenta.rules";
import type { CampoCuenta } from "../cuenta.types";

export const crearCuentaSchema = z
  .object({
    codigo: z
      .string()
      .trim()
      .min(1, "El código es obligatorio")
      .refine(esNumerico, "El código debe contener solo dígitos")
      .refine(
        esLongitudValida,
        `El código debe tener ${textoLongitudes()} dígitos`,
      ),
    nombre: z
      .string()
      .trim()
      .min(1, "El nombre es obligatorio")
      .max(100, "El nombre no puede superar 100 caracteres"),
    naturaleza: z.enum(["DEBITO", "CREDITO"]).optional(),
  })
  .refine((d) => !esClase(d.codigo) || d.naturaleza !== undefined, {
    path: ["naturaleza"],
    message: "Una clase debe tener naturaleza",
  });

export type CrearCuentaForm = z.infer<typeof crearCuentaSchema>;

export type ErroresFormulario = Partial<Record<CampoCuenta, string>>;

/**
 * Valida y devuelve, o los datos limpios, o un error por campo
 * (el primero de cada uno), listo para pintar junto al input.
 */
export function validarCrearCuenta(
  valores: unknown,
):
  | { ok: true; datos: CrearCuentaForm }
  | { ok: false; errores: ErroresFormulario } {
  const resultado = crearCuentaSchema.safeParse(valores);
  if (resultado.success) return { ok: true, datos: resultado.data };

  const errores: ErroresFormulario = {};
  for (const issue of resultado.error.issues) {
    const campo = issue.path[0] as CampoCuenta | undefined;
    if (campo && !errores[campo]) errores[campo] = issue.message;
  }
  return { ok: false, errores };
}
