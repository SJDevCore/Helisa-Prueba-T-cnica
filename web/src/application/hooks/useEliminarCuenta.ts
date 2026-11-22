import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cuentasApi } from "../../infrastructure/api/cuentas.api";
import { cuentasKeys } from "../query-keys";

export function useEliminarCuenta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (codigo: string) => cuentasApi.eliminar(codigo),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: cuentasKeys.todas }),
  });
}
