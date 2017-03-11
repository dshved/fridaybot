<template>
  <div class="tabs">
    <div class="tabs__header">
        <span :class="{'active': tabFridaybot}" @click="fridaybot">Fridaybot</span>
        <span :class="{'active': tabCommands}" @click="commands">Команды</span>
        <span :class="{'active': tabSettings}" @click="settings">Настройки</span>
    </div>
    <div class="tabs__content">
        <div v-if="tabFridaybot">
            <div class="tabs__content-header">Fridaybot может овечать на сообщения, которые отправляют пользователи</div>
            <Responsed></Responsed>

        </div>
        <div v-if="tabCommands">
            <div class="tabs__content-header">Здесь перечислен список команд, доступных для выполнения</div>
        </div>
        <div v-if="tabSettings">
            <div class="tabs__content-header">Здесь можно изменить настройки бота</div>
        </div>
    </div>
  </div>
</template>

<script >
import Responsed from './botmessages.vue'
export default {
  name: 'tabs',
  data () {
    return {
      tabFridaybot: true,
      tabCommands: false,
      tabSettings: false,
    }
  },
  components: {
    Responsed
  },
  methods: {
  fridaybot() {
    this.tabFridaybot = true
    this.tabCommands = false
    this.tabSettings = false
  },
  commands() {
    this.tabFridaybot = false
    this.tabCommands = true
    this.tabSettings = false
  },
  settings() {
    this.tabFridaybot = false
    this.tabCommands = false
    this.tabSettings = true
  }
  },
  props: ['fff'],
  updated: function(){
    // console.log('component updated');
  }
}

</script>

<style scoped>
.tabs {
  max-width: 768px;
  margin: 0 auto;
}
.tabs__header {
  text-align: left;
}
.tabs__header span {
  padding: 10px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  color: #007AB8;
}
.tabs__header span.active {
  border: 1px solid #ccc;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background: white;
  border-bottom: 1px solid white;
  color: #555459;
  cursor: default;

}

.tabs__content {
  margin-top: 10px;
  background: white;
  padding: 20px;
  border: 1px solid #ccc;
  -webkit-transition: opacity .6s linear;
  border-top-right-radius: 4px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
.tabs__content-header {
  padding-bottom: 3px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 15px;
}

</style>
