import Link from "next/link";
import Container from "./_components/container";

export default function NotFound() {
  return (
    <Container>
      <div className="font-gowun py-10">
        <div className="text-2xl mb-11">존재하지 않는 페이지 입니다.</div>
        <Link href={"/"} className="text-xl border-b-[1px] border-neutral-600">
          홈으로 돌아가기
        </Link>
      </div>
    </Container>
  );
}
