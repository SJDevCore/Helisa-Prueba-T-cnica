import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CrearCuentaDto } from "../../domain/cuenta.types";
import { cuentasApi } from "../../infrastructure/api/cuentas.api";
import { cuentasKeys } from "../query-keys";

export function useCrearCuenta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CrearCuentaDto) => cuentasApi.crear(dto),
    // Se retorna la promesa: isPending sigue en true hasta que el árbol se recarga,
    // así el usuario no ve un instante el árbol viejo.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: cuentasKeys.todas }),
  });
}
