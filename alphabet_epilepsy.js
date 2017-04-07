const alphabet = [
  {
    letter: 'А',
    text: ':aa:',
  },
  {
    letter: 'Б',
    text: ':b_rus:',
  },
  {
    letter: 'В',
    text: ':bb:',
  },
  {
    letter: 'Г',
    text: ':g_rus:',
  },
  {
    letter: 'Д',
    text: ':d_rus:',
  },
  {
    letter: 'Е',
    text: ':ee:',
  },
  {
    letter: 'Ё',
    text: ':ee:',
  },
  {
    letter: 'Ж',
    text: ':gg_rus:',
  },
  {
    letter: 'З',
    text: ':z_rus:',
  },
  {
    letter: 'И',
    text: ':i_rus:',
  },
  {
    letter: 'Й',
    text: ':ii_rus:',
  },
  {
    letter: 'К',
    text: ':kk:',
  },
  {
    letter: 'Л',
    text: ':l_rus:',
  },
  {
    letter: 'М',
    text: ':mm:',
  },
  {
    letter: 'Н',
    text: ':hh:',
  },
  {
    letter: 'О',
    text: ':oo:',
  },
  {
    letter: 'П',
    text: ':p_rus:',
  },
  {
    letter: 'Р',
    text: ':pp:',
  },
  {
    letter: 'С',
    text: ':cc:',
  },
  {
    letter: 'Т',
    text: ':tt:',
  },
  {
    letter: 'У',
    text: ':u_rus:',
  },
  {
    letter: 'Ф',
    text: ':f_rus:',
  },
  {
    letter: 'Х',
    text: ':xx:',
  },
  {
    letter: 'Ц',
    text: ':c_rus:',
  },
  {
    letter: 'Ч',
    text: ':ch_rus:',
  },
  {
    letter: 'Ш',
    text: ':sh_rus:',
  },
  {
    letter: 'Щ',
    text: ':sch_rus:',
  },
  {
    letter: 'Ъ',
    text: ':tz_rus:',
  },
  {
    letter: 'Ы',
    text: ':yi_rus:',
  },
  {
    letter: 'Ь',
    text: ':mz_rus:',
  },
  {
    letter: 'Э',
    text: ':ye_rus:',
  },
  {
    letter: 'Ю',
    text: ':yu_rus:',
  },
  {
    letter: 'Я',
    text: ':ya_rus:',
  },
  {
    letter: ' ',
    text: ':sp:',
  },
  {
    letter: '1',
    text: ':1:',
  },
  {
    letter: '2',
    text: ':2:',
  },
  {
    letter: '3',
    text: ':z_rus:',
  },
  {
    letter: '4',
    text: ':4:',
  },
  {
    letter: '5',
    text: ':5:',
  },
  {
    letter: '6',
    text: ':6:',
  },
  {
    letter: '7',
    text: ':7:',
  },
  {
    letter: '8',
    text: ':8:',
  },
  {
    letter: '9',
    text: ':9:',
  },
  {
    letter: '0',
    text: ':0:',
  },
  {
    letter: '/',
    text: ':slash:',
  },
  {
    letter: '\n',
    text: '\n',
  },
  {
    letter: '\\',
    text: ':slash_back:',
  },
  {
    letter: '-',
    text: ':minus:',
  },
  {
    letter: '.',
    text: ':dot:',
  },
  {
    letter: '@',
    text: ':dogs:',
  },
  {
    letter: '#',
    text: ':numbers:',
  },
  {
    letter: ':',
    text: ':colon:',
  },
  {
    letter: '*',
    text: ':starss:',
  },
  {
    letter: '!',
    text: ':ex_point:',
  },
  {
    letter: '=',
    text: ':equally:',
  },
  {
    letter: '"',
    text: ':quotes_two:',
  },
  {
    letter: '\'',
    text: ':quotes:',
  },
  {
    letter: '<',
    text: ':less_sign:',
  },
  {
    letter: '>',
    text: ':more_sign:',
  },
  {
    letter: '^',
    text: ':caret:',
  },
  {
    letter: '&',
    text: ':ampersand:',
  },
  {
    letter: '$',
    text: ':dollar:',
  },
  {
    letter: '%',
    text: ':procent:',
  },
  {
    letter: '|',
    text: ':line:',
  },
  {
    letter: '`',
    text: ':coma_up:',
  },
  {
    letter: '_',
    text: ':underscore:',
  },
  {
    letter: '~',
    text: ':tilda:',
  },
  {
    letter: '"',
    text: ':quotes_two:',
  },
  {
    letter: '№',
    text: ':numbers:',
  },
  {
    letter: '{',
    text: ':brace_left:',
  },
  {
    letter: '}',
    text: ':brace_right:',
  },
  {
    letter: '[',
    text: ':parenthesis_left:',
  },
  {
    letter: ']',
    text: ':parenthesis_right:',
  },
  {
    letter: ',',
    text: ':coma:',
  },
  {
    letter: '+',
    text: ':plus:',
  },
  {
    letter: '?',
    text: ':questions:',
  },
  {
    letter: 'A',
    text: ':aa:',
  },
  {
    letter: 'B',
    text: ':bb:',
  },
  {
    letter: 'C',
    text: ':cc:',
  },
  {
    letter: 'D',
    text: ':dd:',
  },
  {
    letter: 'E',
    text: ':ee:',
  },
  {
    letter: 'F',
    text: ':ff:',
  },
  {
    letter: 'G',
    text: ':gg:',
  },
  {
    letter: 'H',
    text: ':hh:',
  },
  {
    letter: 'I',
    text: ':ii:',
  },
  {
    letter: 'J',
    text: ':jj:',
  },
  {
    letter: 'K',
    text: ':kk:',
  },
  {
    letter: 'L',
    text: ':ll:',
  },
  {
    letter: 'M',
    text: ':mm:',
  },
  {
    letter: 'N',
    text: ':nn:',
  },
  {
    letter: 'O',
    text: ':oo:',
  },
  {
    letter: 'P',
    text: ':pp:',
  },
  {
    letter: 'Q',
    text: ':qq:',
  },
  {
    letter: 'R',
    text: ':rr:',
  },
  {
    letter: 'S',
    text: ':ss:',
  },
  {
    letter: 'T',
    text: ':tt:',
  },
  {
    letter: 'U',
    text: ':uu:',
  },
  {
    letter: 'V',
    text: ':vv:',
  },
  {
    letter: 'W',
    text: ':ww:',
  },
  {
    letter: 'X',
    text: ':xx:',
  },
  {
    letter: 'Y',
    text: ':yy:',
  },
  {
    letter: 'Z',
    text: ':zz:',
  },
];

module.exports = alphabet;


