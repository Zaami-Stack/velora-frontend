export function formatPrice(value) {
  const num = Number(value) || 0;
  return `${num.toFixed(2)} DH`;
}

export function formatPriceRaw(value) {
  return `${Number(value) || 0}.00 DH`;
}
