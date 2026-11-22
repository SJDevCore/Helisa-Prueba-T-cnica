import type {
  CrearCuentaDto,
  Cuenta,
  NodoCuenta,
} from "../../domain/cuenta.types";
import { http } from "../http/http-client";

/** Endpoints del catálogo. Los hooks de application/ son los únicos que llaman aquí. */
export const cuentasApi = {
  obtenerArbol: () => http<NodoCuenta[]>("/cuentas/arbol"),

  crear: (dto: CrearCuentaDto) =>
    http<Cuenta>("/cuentas", { method: "POST", body: JSON.stringify(dto) }),

  eliminar: (codigo: string) =>
    http<void>(`/cuentas/${encodeURIComponent(codigo)}`, { method: "DELETE" }),
};
