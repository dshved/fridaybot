const parrotRus = (num) => {
  num = Math.abs(num);
  num %= 100;
  if (num >= 5 && num <= 20) {
    return 'попугаев';
  }
  num %= 10;
  if (num === 1) {
    return 'попугай';
  }
  if (num >= 2 && num <= 4) {
    return 'попугая';
  }
  return 'попугаев';
};


var socket = io.connect();
socket.on('parrot count', function(data) {
  $('.parrots__count').numerator({
    toValue: data,
  })
  $('.parrots__word').text(parrotRus(data));
});



$(document).ready(function() {
  $("#tabs").tabs();





  $('a.messages__button-edit').on('click', function(e) {
    e.preventDefault();

    const $this = $(this);
    const item = $this.closest('.messages__item');
    const input = item.find('input');
    const textarea = item.find('textarea');
    const check = item.find('.messages__button-check');
    $this.css('display', 'none');
    check.css('display', 'block');
    input.attr('readonly', false);
    textarea.attr('readonly', false);
  });

  $('a.messages__button-check').on('click', function(e) {
    e.preventDefault();

    const $this = $(this);
    const item = $this.closest('.messages__item');
    const input = item.find('input');
    const textarea = item.find('textarea');
    const edit = item.find('.messages__button-edit');
    $this.css('display', 'none');
    edit.css('display', 'block');
    input.attr('readonly', true);
    textarea.attr('readonly', true);

  });

  $('a.messages__button-del').on('click', function(e) {
    e.preventDefault();
    const $this = $(this);
    const item = $this.closest('.messages__item');
    item.remove();
  });





});
