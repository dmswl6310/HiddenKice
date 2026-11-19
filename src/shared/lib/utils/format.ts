const priceFormatter = new Intl.NumberFormat("ko-KR");

/** 40000 -> "40,000원" */
export function formatPrice(value: number): string {
  return `${priceFormatter.format(value)}원`;
}
