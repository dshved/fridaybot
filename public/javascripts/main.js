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

  $('#login').submit(function(e) {
    e.preventDefault();
    const username = $('#username').val();
    const password = $('#password').val();
    if (username == '' || password == '') {
      $('input[type="text"],input[type="password"]').css('border', '1px solid #ea8282');
      $('input[type="text"],input[type="password"]').css('box-shadow', '0 0 3px #ea8282');
    } else {
      $.post('/login', { name: username, password: password },
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
    const itemId = $this.data('item-id');
    const item = $this.closest('.messages__item');
    const input = item.find('input');
    const textarea = item.find('textarea');
    const edit = item.find('.messages__button-edit');
    $this.css('display', 'none');
    edit.css('display', 'block');
    input.attr('disabled', true);
    textarea.attr('disabled', true);

    const message = {
      id: itemId,
      params: {
        user_message: input.val().toUpperCase(),
        bot_message: textarea.val(),
      },
    };

    $.ajax({
      type: 'POST',
      url: '/api/editBotMessage',
      data: JSON.stringify(message),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function(data) {
        const user = item.find('span.edited-name');
        user.text(data.user);
      },
      failure: function(errMsg) {
        console.log(errMsg);
      },
    });
  });

  $('a.messages__button-del').on('click', function(e) {
    e.preventDefault();
    const $this = $(this);
    const item = $this.closest('.messages__item');
    const itemId = $this.data('item-id');

    const confirmRemove = confirm("Вы точно хотите удалить?");
    if (confirmRemove) {
      const message = {
        id: itemId,
      };

      $.ajax({
        type: 'POST',
        url: '/api/removeBotMessage',
        data: JSON.stringify(message),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
          item.remove();
        },
        failure: function(errMsg) {
          console.log(errMsg);
        },
      });
    }
  });

  $('.messages__add').on('click', function(e) {
    e.preventDefault();
    const $this = $(this);
    const modalDialog = $('.modal');
    $('body').css('overflow', 'hidden');
    modalDialog.css({
      display: 'block',
    });
  });

  $('.modal').on('click', function(e) {
    if (e.target === this) {
      $(this).css('display', 'none');

      $(this).find('input').val('');
      $(this).find('textarea').val('');
      $('body').css('overflow', '');
    }
  });

  $('a.modal__close').on('click', function(e) {
    e.preventDefault();
    if (e.target) {
      const modal = $('.modal');

      modal.css('display', 'none');
      modal.find('input').val('');
      modal.find('textarea').val('');
      $('body').css('overflow', '');
    }
  });

  const addNewMessage = function (data) {
    const template = `
      <div class="messages__item">
        <div class="messages__item-input">
          <input class="input messages__input" disabled="" value="${data.user_message}">
          <div class="last_edited">
            <span>Last edited by</span>
            <span class="edited-name">${data.last_edited}</span>
          </div>
        </div>
        <textarea class="textarea messages__textarea" disabled="">${data.bot_message}</textarea>
        <div class="messages__buttons">
          <a class="messages__button-edit" href="#" data-item-id="${data._id}">
            <i class="fa fa-pencil"></i>
          </a>
          <a class="messages__button-check" href="#" data-item-id="${data._id}">
            <i class="fa fa-check"></i>
          </a>
          <a class="messages__button-del" href="#" data-item-id="${data._id}">
            <i class="fa fa-trash"></i>
          </a>
        </div>
      </div>`;
      console.log(template)
      $('.messages__list').append(template);
  };

  $('#save_message').submit(function(e) {
    e.preventDefault();
    const userMessage = $('#user_message');
    const botMessage = $('#bot_message');

    if (userMessage.val() === '' || botMessage.val() === '') {
      $('#user_message, #bot_message').css('border', '1px solid #ea8282');
      $('#user_message, #bot_message').css('box-shadow', '0 0 3px #ea8282');
    } else {
      const message = {
        user_message: userMessage.val().toUpperCase(),
        bot_message: botMessage.val(),
      };

      $.ajax({
        type: 'POST',
        url: '/api/addBotMessage',
        data: JSON.stringify(message),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(data) {
          // console.log(data);
          addNewMessage(data.data);
          $('.modal').css('display', 'none');
          userMessage.val('');
          botMessage.val('');
        },
        failure: function(errMsg) {
          console.log(errMsg);
        },
      });
    }
  });


});
