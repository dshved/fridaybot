<template>
  <div class="botresponsed">
    <!-- <button v-on:click="getAllPosts">Получить список</button> -->
    <div class="responsed">
      <ul id="list" class="responsed__list">
        <li v-for="item in posts" class="responsed__item">
          <input class="input responsed__input" type="text" v-bind="{ value: item.user_message }">
          <textarea class="textarea responsed__textarea" v-bind="{ value: item.bot_message }"></textarea>
        </li>
      </ul>
    </div>
    <div>

      <form class="form responsed__form" @submit.prevent="setNewResponse()">
        <div class="responsed__form-header">Добавить новый ответ</div>
        <div class="form__item">
          <input class="input responsed__input" type="text" placeholder="Что сказал пользователь" v-model="setMes.user_message">
          <textarea class="textarea responsed__textarea" placeholder="Что ответил бот" v-model="setMes.bot_message"></textarea>
        </div>
        <button class="button button_submit">Отправить</button>
      </form>
    </div>
  </div>
</template>



<script>

export default {
  name: 'botresponsed',
  data () {
    return {
      msg: 'Hello world',
      // endpoint: 'https://jsonplaceholder.typicode.com/posts',
      endpoint: 'http://localhost:8080/api/getBotMessages',
      posts: [
        {
          user_message: 'sdfsdf',
          bot_message: 'ddddd'
        }],
      setMes: {}
    }
  },
  methods: {
    getAllPosts: function() {
      this.$http.get(this.endpoint).then(function(res) {
        this.posts = res.data;
      }, function(er) {
        console.log(er);
      })
    },
    setNewResponse: function() {

      // this.$http.post('http://localhost:3000/', this.setMes)
      //   .then(res => {
      //     this.setMes = {};
      //     // console.log(res);
      //     this.getAllPosts();
      //   });
    }
  },
  created: function() {
    // this.getAllPosts();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.responsed__item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  justify-content: space-between;
}

.responsed__input {
  width: calc(50% - 10px);
}

.responsed__textarea {
  width: calc(50% - 10px);
  height: 300px;
}

.input {
  background: #FFFFFF;
  border: 1px solid #C9CCCF;
  border-radius: 3px;
  resize: none;
  padding: 10px;
}

 .textarea {
  height: 100px;
  background: #FFFFFF;
  border: 1px solid #C9CCCF;
  border-radius: 3px;
  resize: none;
  padding: 10px;
  font-family: sans-serif;
}
.responsed__form {
  display: -webkit-flex;
  display: -moz-flex;
  display: -ms-flex;
  display: -o-flex;
  display: flex;
  -webkit-flex-direction: column;
  -moz-flex-direction: column;
  -ms-flex-direction: column;
  -o-flex-direction: column;
  flex-direction: column;
  align-items: flex-start;
}
.form__item {
  width: 100%;
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  justify-content: space-between;
}
.responsed__form-header {
  width: 100%;
  padding-bottom: 3px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 15px;
}

.button {
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  letter-spacing: -0.49px;
  border: none;
  padding: 10px;
  min-width: 200px;
}

.button_submit {
  background: #1DB379;
  color: #FBFBFA;
}
.button_submit:hover {
  background: #159a67;
}
.responsed__form .button_submit {
  margin-left: auto;
}
</style>
