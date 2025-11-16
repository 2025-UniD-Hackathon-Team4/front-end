export const DRINK_CATEGORIES = [
  { id: 'coffee', name: '커피' },
  { id: 'tea', name: '차' },
  { id: 'energy', name: '에너지 드링크' },
  { id: 'soda', name: '탄산' },
  { id: 'other', name: '기타' },
];

export const DRINK_OPTIONS = {
  coffee: {
    starbucks: [
    {
      id: 's_americano',
      name: '아메리카노',
      image: require('../../assets/coffee/starbucks/americano.jpg'),
    },
    {
      id: 's_coldbrew',
      name: '콜드브루',
      image: require('../../assets/coffee/starbucks/coldbrew.jpg'),
    },
    {
      id: 's_latte',
      name: '카페라떼',
      image: require('../../assets/coffee/starbucks/latte.jpg'),
    },
    {
      id: 's_milktea',
      name: '밀크티',
      image: require('../../assets/coffee/starbucks/milktea.jpg'),
    },
    {
      id: 's_caramel',
      name: '카라멜마끼아또',
      image: require('../../assets/coffee/starbucks/caramel.jpg'),
    },
    {
      id: 's_espresso',
      name: '에스프레소',
      image: require('../../assets/coffee/starbucks/espresso.jpg'),
    },
    {
      id: 's_dolche',
      name: '돌체라떼',
      image: require('../../assets/coffee/starbucks/dolche.jpg'),
    },
      {
      id: 's_jamong',
      name: '자몽허니블랙티',
      image: require('../../assets/coffee/starbucks/jamong.jpg'),
    },
    ],

    twosome: [
  {
      id: 't_vanilla',
      name: '바닐라라떼',
      image: require('../../assets/coffee/twosome/vanilla.png'),
    },
    {
      id: 't_americano',
      name: '아메리카노',
      image: require('../../assets/coffee/twosome/americano.jpg'),
    },
    {
      id: 't_caramel',
      name: '카라멜마끼아또',
      image: require('../../assets/coffee/twosome/caramel.jpg'),
    },
    {
      id: 't_latte',
      name: '카페라떼',
      image: require('../../assets/coffee/twosome/latte.jpg'),
    },
    {
      id: 't_mocha',
      name: '카페모카',
      image: require('../../assets/coffee/twosome/mocha.jpg'),
    },
    {
      id: 't_cappuccino',
      name: '카페치노',
      image: require('../../assets/coffee/twosome/cappuccino.png'),
    },
    ],

    mega: [
    {
      id: 'm_americano',
      name: '아메리카노',
      image: require('../../assets/coffee/mega/americano.jpg'),
    },
    {
      id: 'm_honey',
      name: '꿀아메리카노',
      image: require('../../assets/coffee/mega/honey_americano.jpg'),
    },
    {
      id: 'm_vanilla',
      name: '바닐라라떼',
      image: require('../../assets/coffee/mega/vanilla.jpg'),
    },
    {
      id: 'm_caramel',
      name: '카라멜마끼아또',
      image: require('../../assets/coffee/mega/caramel.jpg'),
    },
    {
      id: 'm_latte',
      name: '카페라떼',
      image: require('../../assets/coffee/mega/latte.jpg'),
    },
    {
      id: 'm_mocha',
      name: '카페모카',
      image: require('../../assets/coffee/mega/mocha.jpg'),
    },
    
    ],

    compose: [
    {
      id: 'c_dalgona',
      name: '달고나라떼',
      image: require('../../assets/coffee/compose/dalgona.jpg'),
    },
    {
      id: 'c_vanilla',
      name: '바닐라라떼',
      image: require('../../assets/coffee/compose/vanilla.jpg'),
    },
    {
      id: 'c_americano',
      name: '아메리카노',
      image: require('../../assets/coffee/compose/americano.jpg'),
    },
    {
      id: 'c_einspanner',
      name: '아인슈페너',
      image: require('../../assets/coffee/compose/einspanner.jpg'),
    },
    {
      id: 'c_latte',
      name: '카페라떼',
      image: require('../../assets/coffee/compose/latte.jpg'),
    },
    {
      id: 'c_mocha',
      name: '카페모카',
      image: require('../../assets/coffee/compose/mocha.jpg'),
    },
    {
      id: 'c_hazzle',
      name: '헤이즐넛라떼',
      image: require('../../assets/coffee/compose/hazzle.jpg'),
    },
    {
      id: 'c_blacksugar',
      name: '흑당카페라떼',
      image: require('../../assets/coffee/compose/blacksugar.jpg'),
    },
    ],
  },

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
  { id: 1, label: 'Short'},
  { id: 2, label: 'Tall' },
  { id: 3, label: 'Grande' },
  { id: 4, label: 'Venti' },
];

const TWOSOME_COFFEE_SIZES = [
  { id: 1, label: 'Regular'},
  { id: 2, label: 'Large' },
];

const MEGA_COFFEE_SIZES = [
  { id: 1, label: 'Regular'},
  { id: 2, label: 'Large' },
];

const COMPOSE_COFFEE_SIZES = [
  { id: 1, label: 'Regular'},
  { id: 2, label: 'Large' },
];

export const COFFEE_SIZES = {
  starbucks: STARBUCKS_COFFEE_SIZES,
  twosome: TWOSOME_COFFEE_SIZES,
  mega: MEGA_COFFEE_SIZES,
  compose: COMPOSE_COFFEE_SIZES,
};