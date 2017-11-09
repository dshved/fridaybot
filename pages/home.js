import React, { Component } from 'react';
import axios from 'axios';
import Layout from '../components/layout';

const getBotSettings = async () => {
  const result = await axios.get(
    `${window.location.origin}/api/getBotSettings`,
  );
  return result.data;
};

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      config: {},
    };
  }
  async componentWillMount() {
    const { data } = await getBotSettings();
    this.setState({ config: data });
  }
  render() {
    const config = this.state.config;
    console.log(config);
    return (
      <Layout>
        <p>Задайте настроки для вашего бота</p>
        <div className="settings">
          <div className="settings__item">
            <div className="settings__item-col">
              <label htmlFor="bot_name">Имя бота</label>
            </div>
            <div className="settings__item-col">
              <input
                disabled="disabled"
                type="text"
                name="bot_name"
                id="bot_name"
                value={config.name}
                className="input settings__input"
              />
            </div>
          </div>
          <div className="settings__item">
            <div className="settings__item-col">
              <label htmlFor="bot_name">Канал</label>
            </div>
            <div className="settings__item-col">
              <input
                disabled="disabled"
                type="text"
                name="bot_name"
                id="bot_name"
                value={config.channel_name}
                className="input settings__input"
              />
            </div>
          </div>
          <div className="settings__item">
            <div className="settings__item-col">
              <label htmlFor="bot_name">Изображение</label>
            </div>
            <div className="settings__item-col">
              <input
                disabled="disabled"
                type="text"
                name="bot_name"
                id="bot_name"
                value="value"
                className="input settings__input"
              />
            </div>
          </div>
          <div className="settings__item">
            <div className="settings__item-col">
              <label htmlFor="join_active">Привественное сообщение</label>
              <input
                id="join_active"
                type="checkbox"
                checked="checked"
                className="input settings__checkbox"
              />
            </div>
            <div className="settings__item-col">
              <textarea
                name="user_join"
                id="user_join"
                className="textarea settings__textarea"
              />
            </div>
          </div>
          <div className="settings__item">
            <div className="settings__item-col">
              <label htmlFor="leave_active">Прощальное сообщение</label>
              <input
                id="leave_active"
                type="checkbox"
                checked="checked"
                className="input settings__checkbox"
              />
            </div>
            <div className="settings__item-col">
              <textarea
                name="user_leave"
                id="user_leave"
                className="textarea settings__textarea"
              />
            </div>
          </div>
          <div className="settings__save">
            <div className="settings__message" />
            <button data-bot-id="data-bot-id" className="button button_primary">
              Сохранить
            </button>
          </div>
        </div>
      </Layout>
    );
  }
}
