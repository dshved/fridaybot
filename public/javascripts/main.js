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


const socket = io.connect();
socket.on('parrot count', function(data) {
  $('.parrots__count').numerator({
    toValue: data,
  })
  $('.parrots__word').text(parrotRus(data));
});



$(document).ready(function() {

  $("#login").submit(function(e) {
    e.preventDefault();
    const username = $("#username").val();
    const password = $("#password").val();
    if (username == '' || password == '') {
      $('input[type="text"],input[type="password"]').css("border", "1px solid #ea8282");
      $('input[type="text"],input[type="password"]').css("box-shadow", "0 0 3px #ea8282");
    } else {
      $.post("/login", { name: username, password: password },
        function(data) {
          if (data.status === 400) {
            $('.login__status').text(data.message);
          }
          if (data.status === 200) {
            document.location.href = '/home';
          }
        });
    }
  });

  $('#tabs').tabs();

  $('a.messages__button-edit').on('click', function(e) {
    e.preventDefault();

    const $this = $(this);
    const item = $this.closest('.messages__item');
    const input = item.find('input');
    const textarea = item.find('textarea');
    const check = item.find('.messages__button-check');
    $this.css('display', 'none');
    check.css('display', 'block');
    input.attr('disabled', false);
    textarea.attr('disabled', false);
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
    input.attr('disabled', true);
    textarea.attr('disabled', true);

  });

  $('a.messages__button-del').on('click', function(e) {
    e.preventDefault();
    const $this = $(this);
    const item = $this.closest('.messages__item');
    item.remove();
  });

});
