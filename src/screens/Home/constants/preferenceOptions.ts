import type {PreferenceKey, PreferenceOption} from '../types';

export const preferenceLabels: Record<PreferenceKey, string> = {
  feed: '먹이',
  play: '놀이',
  music: '음악',
  hobby: '휴식',
};

export const preferenceOptions: Record<PreferenceKey, PreferenceOption[]> = {
  feed: [
    {label: '매운 닭발'},
    {label: '달달한 초코 머핀'},
    {label: '따뜻한 우동'},
    {label: '바삭한 감자튀김'},
    {label: '고소한 크림 파스타'},
    {label: '고기 반찬'},
  ],
  play: [
    {label: '노래 부르기'},
    {label: '같이 수다 떨기'},
    {label: '넷플릭스 보기'},
    {label: '보드게임 하기'},
    {label: '산책하기'},
    {label: '레고 조립하기'},
  ],
  music: [
    {label: '잔잔한 어쿠스틱'},
    {label: '신나는 케이팝'},
    {label: '감성 발라드'},
    {label: '로파이 플레이리스트'},
    {label: '재즈'},
    {label: '락 밴드 음악'},
  ],
  hobby: [
    {label: '침대에서 뒹굴기'},
    {label: '영화 보기'},
    {label: '그림 그리기'},
    {label: '반신욕 하기'},
    {label: '일기 쓰기'},
    {label: '조용히 낮잠 자기'},
  ],
};

export const pickRandomOptions = (
  action: PreferenceKey,
  count = 3,
): PreferenceOption[] => {
  const shuffled = [...preferenceOptions[action]];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled.slice(0, count);
};
