import React, { Component } from 'react';
import axios from 'axios';
import Layout from '../components/layout';

const getBotSettings = async () => {
  const result = await axios.get(
    `${global.window.location.origin}/api/getBotSettings`,
  );
  return result.data;
};

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      _id: '',
      channelId: '',
      leave: '',
      leaveActive: true,
      joinMessage: '',
      joinActive: true,
      channelName: '',
      parrotCounts: 0,
      iconUrl: '',
      iconEmoji: '',
      name: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  async componentWillMount() {
    const { data } = await getBotSettings();
    this.setState({
      _id: data._id,
      channelId: data.channel_id,
      leaveMessage: data.user_leave.message,
      leaveActive: data.user_leave.active,
      joinMessage: data.user_join.message,
      joinActive: data.user_join.active,
      channelName: data.channel_name,
      parrotCounts: data.parrot_counts,
      iconUrl: data.icon.url,
      iconEmoji: data.icon.emoji,
      name: data.name,
      loading: false,
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const id = target.id;
    this.setState({
      [id]: value,
    });
  }

  handleChange(event) {
    const id = event.target.id;
    this.setState({ [id]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  renderError() {
    return <div>Ой: {this.state.error.message}</div>;
  }
  renderLoading() {
    return <div>Загрузка....</div>;
  }

  renderSettings() {
    if (this.state.error) {
      return this.renderError();
    }
    const config = this.state;
    return (
      <form onSubmit={this.handleSubmit} className="settings">
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
              value={config.channelName}
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
              value={config.name}
              className="input settings__input"
            />
          </div>
        </div>
        <div className="settings__item">
          <div className="settings__item-col">
            <label htmlFor="join_active">Привественное сообщение</label>
            <input
              id="joinActive"
              type="checkbox"
              checked={config.joinActive}
              className="input settings__checkbox"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="settings__item-col">
            <textarea
              name="user_join"
              id="joinMessage"
              className="textarea settings__textarea"
              value={config.joinMessage}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="settings__item">
          <div className="settings__item-col">
            <label htmlFor="leave_active">Прощальное сообщение</label>
            <input
              id="leaveActive"
              type="checkbox"
              checked={config.leaveActive}
              className="input settings__checkbox"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="settings__item-col">
            <textarea
              name="user_leave"
              id="leaveMessage"
              className="textarea settings__textarea"
              value={config.leaveMessage}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="settings__save">
          <div className="settings__message" />
          <button data-bot-id={config._id} className="button button_primary">
            Сохранить
          </button>
        </div>
      </form>
    );
  }
  render() {
    return (
      <Layout>
        {this.state.loading ? this.renderLoading() : this.renderSettings()}
      </Layout>
    );
  }
}
