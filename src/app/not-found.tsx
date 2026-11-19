import { ComingSoon } from "@/shared/components/layout/ComingSoon";

export default function NotFound() {
  return (
    <ComingSoon
      eyebrow="404"
      title="페이지를 찾을 수 없습니다."
      description="주소가 올바른지 확인해 주세요."
    />
  );
}
