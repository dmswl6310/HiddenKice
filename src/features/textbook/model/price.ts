/**
 * 정가와 판매가로 할인율(%)을 계산한다.
 * 할인율을 DB 에 따로 저장하지 않고 계산해서, 정가/판매가/할인율이 서로 어긋나는 데이터를 막는다.
 */
export function getDiscountRate(price: number, salePrice: number): number {
  if (!Number.isFinite(price) || !Number.isFinite(salePrice)) return 0;
  if (price <= 0 || salePrice >= price) return 0;
  const rate = Math.round(((price - salePrice) / price) * 100);
  return Math.min(Math.max(rate, 0), 100);
}
