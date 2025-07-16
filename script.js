document.addEventListener('DOMContentLoaded', () => {
    const numberInput = document.getElementById('numberInput');
    const createRouletteBtn = document.getElementById('createRouletteBtn');
    const rouletteWheel = document.getElementById('rouletteWheel');
    const spinRouletteBtn = document.getElementById('spinRouletteBtn');
    const resultBox = document.getElementById('resultBox');
    const winningNumberSpan = document.getElementById('winningNumber');

    let totalNumbers = 0;
    let sectorAngle = 0;
    let isSpinning = false;

    // 룰렛 생성 함수
    function createRoulette(num) {
        rouletteWheel.innerHTML = ''; // 기존 룰렛 초기화
        totalNumbers = num;
        sectorAngle = 360 / totalNumbers;

        for (let i = 1; i <= totalNumbers; i++) {
            const sector = document.createElement('div');
            sector.classList.add('roulette-sector');
            sector.style.transform = `rotate(${(i - 1) * sectorAngle}deg) skewY(${90 - sectorAngle}deg)`;

            const inner = document.createElement('div');
            inner.classList.add('roulette-sector-inner');
            inner.textContent = i;
            inner.style.transform = `skewY(${90 - sectorAngle}deg) rotate(${-sectorAngle / 2}deg)`; // 텍스트를 똑바로 보이게

            sector.appendChild(inner);
            rouletteWheel.appendChild(sector);
        }

        spinRouletteBtn.classList.remove('hidden'); // 룰렛 생성 후 돌리기 버튼 표시
        resultBox.classList.add('hidden'); // 결과 박스 숨기기
        rouletteWheel.style.transform = 'rotate(0deg)'; // 룰렛 초기 각도
    }

    // 룰렛 돌리기 함수
    function spinRoulette() {
        if (isSpinning) return; // 이미 돌고 있다면 무시
        isSpinning = true;
        resultBox.classList.add('hidden'); // 이전 결과 숨기기

        const winningIndex = Math.floor(Math.random() * totalNumbers); // 당첨될 섹터 인덱스 (0부터 시작)
        const winningNumber = winningIndex + 1; // 당첨될 실제 숫자 (1부터 시작)

        // 룰렛이 멈출 목표 각도 계산
        // (totalNumbers - 1 - winningIndex) * sectorAngle: 당첨될 섹터를 포인터 위치로 정확히 가져오기 위한 각도
        // 360 * 5: 최소 5바퀴 이상 돌도록 하여 쫀득한 느낌 부여 (조절 가능)
        // Math.random() * (sectorAngle - 10) + 5: 당첨 섹터 안에서 미세하게 불규칙한 위치에 멈추도록 하여 아슬아슬함 추가
        const stopAngle = (totalNumbers - 1 - winningIndex) * sectorAngle + 360 * 5 + (Math.random() * (sectorAngle - 10) + 5);

        rouletteWheel.style.transition = 'transform 4s cubic-bezier(0.25, 0.1, 0, 1)'; // 쫀득한 애니메이션
        rouletteWheel.style.transform = `rotate(${stopAngle}deg)`;

        // 애니메이션 종료 후 결과 표시
        rouletteWheel.addEventListener('transitionend', () => {
            if (!isSpinning) return; // 스핀이 끝나지 않은 경우 중복 방지
            isSpinning = false;
            
            winningNumberSpan.textContent = winningNumber;
            resultBox.classList.remove('hidden');

            // 룰렛의 최종 각도를 정확하게 계산하여 다음 스핀에 영향 없도록 재설정
            // 360으로 나눈 나머지를 사용하여 각도가 너무 커지는 것을 방지
            const currentRotation = stopAngle % 360;
            rouletteWheel.style.transition = 'none'; // 다음 스핀을 위해 트랜지션 잠시 비활성화
            rouletteWheel.style.transform = `rotate(${currentRotation}deg)`;
            
            // transitionend 이벤트 리스너 제거 (중복 호출 방지)
            rouletteWheel.removeEventListener('transitionend', arguments.callee);
        }, { once: true }); // 한 번만 실행되도록 설정
    }

    // 룰렛 만들기 버튼 클릭 이벤트
    createRouletteBtn.addEventListener('click', () => {
        const num = parseInt(numberInput.value);
        if (num >= 2 && num <= 50) {
            createRoulette(num);
        } else {
            alert('2에서 50 사이의 숫자를 입력해주세요.');
            numberInput.value = 10; // 기본값으로 되돌리기
        }
    });

    // 룰렛 돌리기 버튼 클릭 이벤트
    spinRouletteBtn.addEventListener('click', spinRoulette);

    // 초기 룰렛 생성 (예시)
    createRoulette(10);
});
