import { Container } from "@/shared/components/layout/Container";
import { TextbookGridSkeleton } from "./TextbookGridSkeleton";

/** URL query 를 읽기 전(Suspense) 보여줄 정적 셸 */
export function TextbookSectionFallback() {
  return (
    <section className="pt-10 md:pt-[52px]">
      <Container>
        <div className="flex justify-end">
          <div className="h-10 w-full rounded border border-gray-300 sm:w-[250px]" />
        </div>
        <div className="mt-[37px]">
          <TextbookGridSkeleton />
        </div>
      </Container>
    </section>
  );
}
