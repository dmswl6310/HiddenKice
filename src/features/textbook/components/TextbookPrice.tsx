import { formatPrice } from "@/shared/lib/utils/format";
import { getDiscountRate } from "../model/price";

type TextbookPriceProps = {
  price: number;
  salePrice: number;
};

export function TextbookPrice({ price, salePrice }: TextbookPriceProps) {
  const discountRate = getDiscountRate(price, salePrice);

  if (discountRate === 0) {
    return <p className="mt-2 text-base font-bold text-gray-900">{formatPrice(salePrice)}</p>;
  }

  return (
    <div className="mt-2">
      <p className="text-[13px] text-gray-400 line-through">
        <span className="sr-only">정가 </span>
        {formatPrice(price)}
      </p>
      <p className="mt-0.5 flex items-center gap-1.5 text-base">
        <span className="font-semibold text-accent">
          <span className="sr-only">할인율 </span>
          {discountRate}%
        </span>
        <span className="font-bold text-gray-900">
          <span className="sr-only">판매가 </span>
          {formatPrice(salePrice)}
        </span>
      </p>
    </div>
  );
}
