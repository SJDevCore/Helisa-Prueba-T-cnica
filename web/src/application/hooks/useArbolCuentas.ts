import { useQuery } from "@tanstack/react-query";
import { cuentasApi } from "../../infrastructure/api/cuentas.api";
import { cuentasKeys } from "../query-keys";

export function useArbolCuentas() {
  return useQuery({
    queryKey: cuentasKeys.arbol(),
    queryFn: cuentasApi.obtenerArbol,
  });
}
