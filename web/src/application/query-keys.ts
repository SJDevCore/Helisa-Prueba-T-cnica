/**
 * Fábrica de query keys. Invalidar `cuentasKeys.todas` refresca todo lo que
 * cuelgue de ['cuentas'] (hoy solo el árbol; mañana, búsquedas o detalles).
 */
export const cuentasKeys = {
  todas: ["cuentas"] as const,
  arbol: () => [...cuentasKeys.todas, "arbol"] as const,
};
