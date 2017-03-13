const alphabet = [
  {
    letter: 'А',
    text: ':sp::fp::fp::fp::sp:\n:fp::sp::sp::sp::fp:\n:fp::fp::fp::fp::fp:\n:fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'Б',
    text: ':fp::fp::fp::fp::sp:\n:fp::sp::sp::sp::sp:\n:fp::fp::fp::fp::sp:\n:fp::sp::sp::sp::fp:\n:fp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'В',
    text: ':fp::fp::fp::fp::sp:\n:fp::sp::sp::sp::fp:\n:fp::fp::fp::fp::sp:\n:fp::sp::sp::sp::fp:\n:fp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'Г',
    text: ':fp::fp::fp::sp::sp:\n:fp::sp::sp::sp::sp:\n:fp::sp::sp::sp::sp:\n:fp::sp::sp::sp::sp:\n:fp::sp::sp::sp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'Д',
    text: ':sp::sp::fp::fp::fp::sp:\n:sp::fp::sp::sp::fp::sp:\n:sp::fp::sp::sp::fp::sp:\n:sp::fp::sp::sp::fp::sp:\n:fp::fp::fp::fp::fp::fp:\n:fp::sp::sp::sp::sp::fp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'Е',
    text: ':fp::fp::fp::fp:\n:fp::sp::sp::sp:\n:fp::fp::fp::sp:\n:fp::sp::sp::sp:\n:fp::fp::fp::fp:\n:sp::sp::sp::sp:\n',
  },
  {
    letter: 'Ё',
    text: ':sp::fp::fp::sp:\n:fp::fp::fp::fp:\n:fp::sp::sp::sp:\n:fp::fp::fp::sp:\n:fp::sp::sp::sp:\n:fp::fp::fp::fp:\n:sp::sp::sp::sp:\n',
  },
  {
    letter: 'Ж',
    text: ':fp::sp::sp::fp::sp::sp::fp:\n:sp::fp::sp::fp::sp::fp::sp:\n:sp::sp::fp::fp::fp::sp::sp:\n:sp::fp::sp::fp::sp::fp::sp:\n:fp::sp::sp::fp::sp::sp::fp:\n:sp::sp::sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'З',
    text: ':fp::fp::fp::fp::sp:\n:sp::sp::sp::sp::fp:\n:fp::fp::fp::fp::sp:\n:sp::sp::sp::sp::fp:\n:fp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'И',
    text: ':fp::sp::sp::sp::fp:\n:fp::sp::sp::fp::fp:\n:fp::sp::fp::sp::fp:\n:fp::fp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'Й',
    text: ':fp::sp::fp::sp::fp:\n:fp::sp::sp::fp::fp:\n:fp::sp::fp::sp::fp:\n:fp::fp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'К',
    text: ':fp::sp::sp::sp::fp:\n:fp::sp::sp::fp::sp:\n:fp::fp::fp::sp::sp:\n:fp::sp::sp::fp::sp:\n:fp::sp::sp::sp::fp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'Л',
    text: ':sp::sp::fp::sp::sp:\n:sp::fp::sp::fp::sp:\n:sp::fp::sp::fp::sp:\n:fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'М',
    text: ':fp::sp::sp::sp::fp:\n:fp::fp::sp::fp::fp:\n:fp::sp::fp::sp::fp:\n:fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'Н',
    text: ':fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:fp::fp::fp::fp::fp:\n:fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'О',
    text: ':sp::fp::fp::fp::sp:\n:fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:sp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'П',
    text: ':fp::fp::fp::fp::fp:\n:fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'Р',
    text: ':fp::fp::fp::fp::sp:\n:fp::sp::sp::sp::fp:\n:fp::fp::fp::fp::sp:\n:fp::sp::sp::sp::sp:\n:fp::sp::sp::sp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'С',
    text: ':sp::fp::fp::fp::sp:\n:fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::sp:\n:fp::sp::sp::sp::fp:\n:sp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'Т',
    text: ':fp::fp::fp::fp::fp:\n:sp::sp::fp::sp::sp:\n:sp::sp::fp::sp::sp:\n:sp::sp::fp::sp::sp:\n:sp::sp::fp::sp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'У',
    text: ':fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:sp::fp::fp::fp::fp:\n:sp::sp::sp::sp::fp:\n:sp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'Ф',
    text: ':sp::sp::sp::fp::sp::sp::sp:\n:sp::fp::fp::fp::fp::fp::sp:\n:fp::sp::sp::fp::sp::sp::fp:\n:sp::fp::fp::fp::fp::fp::sp:\n:sp::sp::sp::fp::sp::sp::sp:\n:sp::sp::sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'Х',
    text: ':fp::sp::sp::sp::fp:\n:sp::fp::sp::fp::sp:\n:sp::sp::fp::sp::sp:\n:sp::fp::sp::fp::sp:\n:fp::sp::sp::sp::fp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'Ц',
    text: ':fp::sp::sp::sp::fp::sp:\n:fp::sp::sp::sp::fp::sp:\n:fp::sp::sp::sp::fp::sp:\n:fp::sp::sp::sp::fp::sp:\n:fp::fp::fp::fp::fp::fp:\n:sp::sp::sp::sp::sp::fp:\n',
  },
  {
    letter: 'Ч',
    text: ':fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:sp::fp::fp::fp::fp:\n:sp::sp::sp::sp::fp:\n:sp::sp::sp::sp::fp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'Ш',
    text: ':fp::sp::sp::fp::sp::sp::fp:\n:fp::sp::sp::fp::sp::sp::fp:\n:fp::sp::sp::fp::sp::sp::fp:\n:fp::sp::sp::fp::sp::sp::fp:\n:fp::fp::fp::fp::fp::fp::fp:\n:sp::sp::sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'Щ',
    text: ':fp::sp::sp::fp::sp::sp::fp::sp:\n:fp::sp::sp::fp::sp::sp::fp::sp:\n:fp::sp::sp::fp::sp::sp::fp::sp:\n:fp::sp::sp::fp::sp::sp::fp::sp:\n:fp::fp::fp::fp::fp::fp::fp::fp:\n:sp::sp::sp::sp::sp::sp::sp::fp:\n',
  },
  {
    letter: 'Ъ',
    text: ':fp::fp::sp::sp::sp::sp:\n:sp::fp::sp::sp::sp::sp:\n:sp::fp::fp::fp::fp::sp:\n:sp::fp::sp::sp::sp::fp:\n:sp::fp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'Ы',
    text: ':fp::sp::sp::sp::sp::sp::fp:\n:fp::sp::sp::sp::sp::sp::fp:\n:fp::fp::fp::fp::sp::sp::fp:\n:fp::sp::sp::sp::fp::sp::fp:\n:fp::fp::fp::fp::sp::sp::fp:\n:sp::sp::sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'Ь',
    text: ':fp::sp::sp::sp::sp:\n:fp::sp::sp::sp::sp:\n:fp::fp::fp::fp::sp:\n:fp::sp::sp::sp::fp:\n:fp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'Э',
    text: ':fp::fp::fp::fp::sp:\n:sp::sp::sp::sp::fp:\n:sp::fp::fp::fp::fp:\n:sp::sp::sp::sp::fp:\n:fp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'Ю',
    text: ':fp::sp::sp::fp::fp::fp::sp:\n:fp::sp::fp::sp::sp::sp::fp:\n:fp::fp::fp::sp::sp::sp::fp:\n:fp::sp::fp::sp::sp::sp::fp:\n:fp::sp::fp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'Я',
    text: ':sp::fp::fp::fp::fp:\n:fp::sp::sp::sp::fp:\n:sp::fp::fp::fp::fp:\n:sp::fp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: ' ',
    text: ':sp::sp::sp::sp::sp:\n:sp::sp::sp::sp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: '1',
    text: ':sp::fp::fp::sp::sp:\n:sp::sp::fp::sp::sp:\n:sp::sp::fp::sp::sp:\n:sp::sp::fp::sp::sp:\n:sp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: '2',
    text: ':fp::fp::fp::fp::sp:\n:sp::sp::sp::sp::fp:\n:sp::fp::fp::fp::sp:\n:fp::sp::sp::sp::sp:\n:fp::fp::fp::fp::fp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: '3',
    text: ':fp::fp::fp::fp::sp:\n:sp::sp::sp::sp::fp:\n:fp::fp::fp::fp::sp:\n:sp::sp::sp::sp::fp:\n:fp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: '4',
    text: ':sp::sp::fp::fp::sp:\n:sp::fp::sp::fp::sp:\n:fp::sp::sp::fp::sp:\n:fp::fp::fp::fp::fp:\n:sp::sp::sp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: '5',
    text: ':fp::fp::fp::fp::fp:\n:fp::sp::sp::sp::sp:\n:fp::fp::fp::fp::sp:\n:sp::sp::sp::sp::fp:\n:fp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: '6',
    text: ':sp::fp::fp::fp::sp:\n:fp::sp::sp::sp::sp:\n:fp::fp::fp::fp::sp:\n:fp::sp::sp::sp::fp:\n:sp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: '7',
    text: ':fp::fp::fp::fp::sp:\n:sp::sp::sp::fp::sp:\n:sp::sp::fp::fp::sp:\n:sp::fp::sp::sp::sp:\n:sp::fp::sp::sp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: '8',
    text: ':sp::fp::fp::fp::sp:\n:fp::sp::sp::sp::fp:\n:sp::fp::fp::fp::sp:\n:fp::sp::sp::sp::fp:\n:sp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: '9',
    text: ':sp::fp::fp::fp::sp:\n:fp::sp::sp::sp::fp:\n:sp::fp::fp::fp::fp:\n:sp::sp::sp::sp::fp:\n:sp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: '0',
    text: ':sp::fp::fp::fp::sp:\n:fp::sp::sp::sp::fp:\n:fp::sp::fp::sp::fp:\n:fp::sp::sp::sp::fp:\n:sp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: '.',
    text: ':fp::sp::sp::sp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: ',',
    text: ':sp::fp::sp::sp::sp:\n:fp::sp::sp::sp::sp:\n',
  },
  {
    letter: '?',
    text: ':fp::fp::fp::sp:\n:sp::sp::sp::fp:\n:sp::fp::fp::sp:\n:sp::fp::sp::sp:\n:sp::sp::sp::sp:\n:sp::fp::sp::sp:\n:sp::sp::sp::sp:\n',
  },
  {
    letter: 'A',
    text: ':sp::fp::fp::fp::sp:\n:fp::sp::sp::sp::fp:\n:fp::fp::fp::fp::fp:\n:fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'B',
    text: ':fp::fp::fp::fp::sp:\n:fp::sp::sp::sp::fp:\n:fp::fp::fp::fp::sp:\n:fp::sp::sp::sp::fp:\n:fp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'C',
    text: ':sp::fp::fp::fp::sp:\n:fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::sp:\n:fp::sp::sp::sp::fp:\n:sp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'D',
    text: ':fp::fp::fp::fp::sp:\n:fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:fp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'E',
    text: ':fp::fp::fp::fp:\n:fp::sp::sp::sp:\n:fp::fp::fp::sp:\n:fp::sp::sp::sp:\n:fp::fp::fp::fp:\n:sp::sp::sp::sp:\n',
  },
  {
    letter: 'F',
    text: ':fp::fp::fp::fp:\n:fp::sp::sp::sp:\n:fp::fp::fp::sp:\n:fp::sp::sp::sp:\n:fp::sp::sp::sp:\n:sp::sp::sp::sp:\n',
  },
  {
    letter: 'G',
    text: ':sp::fp::fp::fp::fp:\n:fp::sp::sp::sp::sp:\n:fp::sp::sp::fp::fp:\n:fp::sp::sp::sp::fp:\n:sp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'H',
    text: ':fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:fp::fp::fp::fp::fp:\n:fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'I',
    text: ':sp::fp::fp::fp::sp:\n:sp::sp::fp::sp::sp:\n:sp::sp::fp::sp::sp:\n:sp::sp::fp::sp::sp:\n:sp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'J',
    text: ':sp::sp::sp::sp::fp:\n:sp::sp::sp::sp::fp:\n:sp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:sp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'K',
    text: ':fp::sp::sp::sp::fp:\n:fp::sp::sp::fp::sp:\n:fp::fp::fp::sp::sp:\n:fp::sp::sp::fp::sp:\n:fp::sp::sp::sp::fp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'L',
    text: ':fp::sp::sp::sp::sp:\n:fp::sp::sp::sp::sp:\n:fp::sp::sp::sp::sp:\n:fp::sp::sp::sp::sp:\n:fp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'M',
    text: ':fp::sp::sp::sp::fp:\n:fp::fp::sp::fp::fp:\n:fp::sp::fp::sp::fp:\n:fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'N',
    text: ':fp::sp::sp::sp::fp:\n:fp::fp::sp::sp::fp:\n:fp::sp::fp::sp::fp:\n:fp::sp::sp::fp::fp:\n:fp::sp::sp::sp::fp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'O',
    text: ':sp::fp::fp::fp::sp:\n:fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:sp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'P',
    text: ':fp::fp::fp::fp::sp:\n:fp::sp::sp::sp::fp:\n:fp::fp::fp::fp::sp:\n:fp::sp::sp::sp::sp:\n:fp::sp::sp::sp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'Q',
    text: ':sp::fp::fp::fp::sp:\n:fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:fp::sp::fp::sp::fp:\n:sp::fp::fp::fp::sp:\n:sp::sp::fp::sp::sp:\n:sp::sp::sp::fp::sp:\n',
  },
  {
    letter: 'R',
    text: ':fp::fp::fp::fp::sp:\n:fp::sp::sp::sp::fp:\n:fp::fp::fp::fp::sp:\n:fp::sp::sp::fp::sp:\n:fp::sp::sp::sp::fp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'S',
    text: ':sp::fp::fp::fp::fp:\n:fp::sp::sp::sp::sp:\n:sp::fp::fp::fp::sp:\n:sp::sp::sp::sp::fp:\n:fp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'T',
    text: ':fp::fp::fp::fp::fp:\n:sp::sp::fp::sp::sp:\n:sp::sp::fp::sp::sp:\n:sp::sp::fp::sp::sp:\n:sp::sp::fp::sp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'U',
    text: ':fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:sp::fp::fp::fp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'V',
    text: ':fp::sp::sp::sp::fp:\n:fp::sp::sp::sp::fp:\n:sp::fp::sp::fp::sp:\n:sp::fp::sp::fp::sp:\n:sp::sp::fp::sp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'W',
    text: ':fp::sp::sp::fp::sp::sp::fp:\n:fp::sp::sp::fp::sp::sp::fp:\n:fp::sp::sp::fp::sp::sp::fp:\n:fp::sp::fp::sp::fp::sp::fp:\n:sp::fp::sp::sp::sp::fp::sp:\n:sp::sp::sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'X',
    text: ':fp::sp::sp::sp::fp:\n:sp::fp::sp::fp::sp:\n:sp::sp::fp::sp::sp:\n:sp::fp::sp::fp::sp:\n:fp::sp::sp::sp::fp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'Y',
    text: ':fp::sp::sp::sp::fp:\n:sp::fp::sp::fp::sp:\n:sp::sp::fp::sp::sp:\n:sp::sp::fp::sp::sp:\n:sp::sp::fp::sp::sp:\n:sp::sp::sp::sp::sp:\n',
  },
  {
    letter: 'Z',
    text: ':fp::fp::fp::fp::fp:\n:sp::sp::sp::fp::sp:\n:sp::sp::fp::sp::sp:\n:sp::fp::sp::sp::sp:\n:fp::fp::fp::fp::fp:\n:sp::sp::sp::sp::sp:\n',
  },
];

module.exports = alphabet;
