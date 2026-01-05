import Container from '@/app/_components/container'
import Image from 'next/image'
import Link from 'next/link'

export default function About() {
  return (
    <main>
      <Container>
        <div className="mt-20 w-full font-gowun">
          <div className="flex flex-col md:flex-row  gap-12 mb-3">
            {/* 프로필, 개인정보 */}
            <div className="flex flex-col justify-around items-center sm:items-start">
              <div className="relative h-[200px] w-[250px] flex-none overflow-hidden rounded-lg">
                <Image
                  src="/assets/about/gihoon-profile.JPG"
                  alt="프로필 사진"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-base text-neutral-600 dark:text-neutral-500 mt-2 underline-offset-4">
                <div className="flex flex-row gap-2">
                  <Link
                    href="https://github.com/nohgh"
                    target="_blank"
                    className="underline hover:font-bold"
                  >
                    깃허브
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/nohgihoon1107/"
                    target="_blank"
                    className="underline hover:font-bold"
                  >
                    링크드인
                  </Link>
                </div>

                <div className="mt-1">kiki01111@naver.com</div>
              </div>
            </div>

            {/* 소개 */}
            <div className="cursor-default">
              {/* 이름 */}
              <div className="font-sans text-2xl mb-3 font-bold text-black dark:text-white ">
                <div>Nohgh | 노기훈</div>
              </div>
              {/* 간단한 소개 */}
              <div className="text-lg mr-8 flex flex-col gap-1">
                <p>안녕하세요. 노기훈입니다.</p>
                <p>
                  대학시절 내내 프론트엔드 엔지니어라는 꿈을 품고 지냈지만, 현재는(2025.12)
                  소프트웨어로 해결 가능한 일을 성공적으로 마칠 수 있는 소프트웨어 엔지니어를 꿈꾸고
                  있습니다.
                </p>
                <p>
                  아직 가장 잘하고 많이 한 것이 프론트엔드이지만 앞으로 긴 소프트웨어 엔지니어로서
                  나의 영역을 넓히고자 합니다.
                </p>
                <p>
                  요즘의 관심사로는 FP(functional programming), golang을 통한 CLI툴 개발, 웹 에디터
                  제작입니다.
                </p>
              </div>{' '}
              <div className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
                {`Written at '2026.01'`}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}
