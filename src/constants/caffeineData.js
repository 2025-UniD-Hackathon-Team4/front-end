export const DRINK_CATEGORIES = [
  { id: 'coffee', name: '커피' },
  { id: 'tea', name: '차' },
  { id: 'energy', name: '에너지 드링크' },
  { id: 'soda', name: '탄산' },
  { id: 'other', name: '기타' },
];

export const DRINK_OPTIONS = {
  coffee: [
    {
      id: 'americano',
      name: '아메리카노',
      image: require('../../assets/coffee/americano.png'),
    },
    {
      id: 'coldbrew',
      name: '콜드브루',
      image: require('../../assets/coffee/coldbrew.png'),
    },
    {
      id: 'latte',
      name: '카페라떼',
      image: require('../../assets/coffee/latte.png'),
    },
    {
      id: 'espresso',
      name: '에스프레소',
      image: require('../../assets/coffee/espresso.png'),
    },
  ],
  tea: [
    { id: 'greenTea', name: '녹차' },
    { id: 'blackTea', name: '홍차' },
    { id: 'earlGrey', name: '우롱차' },
    { id: 'whiteTea', name: '백차' },
  ],
  energy: [
    { id: 'monster', name: '몬스터 에너지' },
    { id: 'hotSix', name: '핫식스' },
    { id: 'redBull', name: '레드불' },
    { id: 'bacchus', name: '박카스' },
  ],
  soda: [
    { id: 'coke', name: '코카콜라' },
    { id: 'pepsi', name: '펩시' },
    { id: 'drPepper', name: '닥터페퍼' },
  ],
  other: [],
};

export const COFFEE_BRANDS = [
  {
    id: 'starbucks',
    source: require('../../assets/coffee/brand1-starbucks.png'),
  },
  {
    id: 'twosome',
    source: require('../../assets/coffee/brand2-twosome.png'),
  },
  {
    id: 'mega',
    source: require('../../assets/coffee/brand3-mega.png'),
  },
  {
    id: 'compose',
    source: require('../../assets/coffee/brand4-compose.png'),
  },
];

const STARBUCKS_COFFEE_SIZES = [
  { id: 1, label: 'short'},
  { id: 2, label: 'tall' },
  { id: 3, label: 'grande' },
  { id: 4, label: 'venti' },
];

const TWOSOME_COFFEE_SIZES = [
  { id: 1, label: 'regular'},
  { id: 2, label: 'large' },
];

const MEGA_COFFEE_SIZES = [
  { id: 1, label: 'regular'},
  { id: 2, label: 'large' },
];

const COMPOSE_COFFEE_SIZES = [
  { id: 1, label: 'regular'},
  { id: 2, label: 'large' },
];

export const COFFEE_SIZES = {
  starbucks: STARBUCKS_COFFEE_SIZES,
  twosome: TWOSOME_COFFEE_SIZES,
  mega: MEGA_COFFEE_SIZES,
  compose: COMPOSE_COFFEE_SIZES,
};