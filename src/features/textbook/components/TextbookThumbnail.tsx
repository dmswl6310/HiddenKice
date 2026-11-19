"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageOffIcon } from "@/shared/components/icons";

type TextbookThumbnailProps = {
  src: string | null;
  alt: string;
  preload?: boolean;
};

function ThumbnailFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-50 text-gray-400">
      <ImageOffIcon className="size-8" />
      <span className="text-xs">이미지 준비 중</span>
    </div>
  );
}

export function TextbookThumbnail({ src, alt, preload = false }: TextbookThumbnailProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  // src 가 없거나 로드에 실패하면 대체 UI 를 보여준다. (src 가 바뀌면 자동으로 다시 시도)
  if (!src || failedSrc === src) return <ThumbnailFallback />;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      preload={preload}
      sizes="(min-width: 1024px) 250px, (min-width: 640px) 33vw, 50vw"
      onError={() => setFailedSrc(src)}
      className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
    />
  );
}
