export function labelOf(
  options: readonly { readonly value: string; readonly label: string }[],
  value: string | null | undefined,
): string {
  if (!value) {
    return '—';
  }
  return options.find((o) => o.value === value)?.label ?? value;
}