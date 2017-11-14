import React, { Component } from 'react';
import axios from 'axios';
import Layout from '../components/layout';
import {
  Container,
  Form,
  Grid,
  Message,
  Transition,
  TextArea,
  Loader,
  Dimmer,
} from 'semantic-ui-react';
import { setTimeout } from 'timers';

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
      success: null,
      error: null,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
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
    const message = {
      id: this.state._id,
      params: {
        user_join: {
          active: this.state.joinActive,
          message: this.state.joinMessage,
        },
        user_leave: {
          active: this.state.leaveActive,
          message: this.state.leaveMessage,
        },
      },
    };
    axios
      .post(`${global.window.location.origin}/api/editBotSettings`, message)
      .then(response => {
        response.data.msg === 'success' ? this.onSuccess() : this.onError();
      })
      .catch(function(error) {
        console.log(error);
      });
    event.preventDefault();
  }
  onSuccess() {
    this.setState({ success: true });
    setTimeout(() => {
      this.setState({ success: false });
    }, 1000);
  }
  onError() {}
  renderError() {
    return <div>Ой: {this.state.error.message}</div>;
  }
  renderLoading() {
    return (
      <Dimmer active>
        <Loader>Загрузка</Loader>
      </Dimmer>
    );
  }

  renderSettings() {
    if (this.state.error) {
      return this.renderError();
    }
    const config = this.state;
    return (
      <Container>
        <Grid style={{ height: '100%', marginTop: 30 }} verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 600, margin: '0 auto' }}>
            <Form
              success={this.state.success}
              size="large"
              onSubmit={this.handleSubmit}
              className="settings"
            >
              <Transition
                visible={this.state.success}
                animation="scale"
                duration={500}
              >
                <Message success header="Настройки успешно сохранены" />
              </Transition>
              <Form.Input
                // disabled
                label="Имя бота"
                type="text"
                name="bot_name"
                id="bot_name"
                value={config.name}
                className="input settings__input"
              />
              <Form.Input
                // disabled
                label="Канал"
                type="text"
                name="bot_name"
                id="bot_name"
                value={config.channelName}
                className="input settings__input"
              />

              <Form.Input
                // disabled
                label="Изображение"
                type="text"
                name="bot_name"
                id="bot_name"
                value={config.name}
                className="input settings__input"
              />

              <Form.Checkbox
                label="Показывать привественное сообщение"
                id="joinActive"
                type="checkbox"
                checked={config.joinActive}
                className="input settings__checkbox"
                onChange={this.handleInputChange}
              />

              <TextArea
                style={{ marginBottom: '1em' }}
                autoHeight
                name="user_join"
                id="joinMessage"
                className="textarea settings__textarea"
                value={config.joinMessage}
                onChange={this.handleChange}
              />

              <Form.Checkbox
                label="Показывать прощальное сообщение"
                id="leaveActive"
                type="checkbox"
                checked={config.leaveActive}
                className="input settings__checkbox"
                onChange={this.handleInputChange}
              />
              <TextArea
                style={{ marginBottom: '1em' }}
                autoHeight
                name="user_leave"
                id="leaveMessage"
                className="textarea settings__textarea"
                value={config.leaveMessage}
                onChange={this.handleChange}
              />
              <Form.Button
                data-bot-id={config._id}
                inverted
                color="green"
                floated="right"
              >
                Сохранить
              </Form.Button>
            </Form>
          </Grid.Column>
        </Grid>
      </Container>
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
