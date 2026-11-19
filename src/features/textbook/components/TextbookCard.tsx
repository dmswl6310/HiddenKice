import { TEXTBOOK_CATEGORY_LABEL } from "../model/constants";
import type { Textbook } from "../model/types";
import { TextbookPrice } from "./TextbookPrice";
import { TextbookThumbnail } from "./TextbookThumbnail";

type TextbookCardProps = {
  textbook: Textbook;
  preloadImage?: boolean;
};

export function TextbookCard({ textbook, preloadImage }: TextbookCardProps) {
  return (
    <article className="group min-w-0">
      <div className="relative aspect-[250/318] overflow-hidden rounded border border-gray-200 bg-white">
        <TextbookThumbnail src={textbook.thumbnailUrl} alt={textbook.title} preload={preloadImage} />
      </div>
      <p className="mt-3 text-base text-gray-500">{TEXTBOOK_CATEGORY_LABEL[textbook.category]}</p>
      <h3 className="mt-1 line-clamp-2 min-h-[2lh] text-base font-semibold text-gray-900" title={textbook.title}>
        {textbook.title}
      </h3>
      <TextbookPrice price={textbook.price} salePrice={textbook.salePrice} />
    </article>
  );
}
