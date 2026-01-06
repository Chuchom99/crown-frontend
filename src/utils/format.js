export function formatMoney(value, currency = 'NGN') {
  const n = Number(value || 0)
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(n)
  } catch {
    return `${currency} ${n.toFixed(2)}`
  }
}
