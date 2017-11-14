import React, { Component } from 'react';
import axios from 'axios';
import Layout from '../components/layout';
import BotMessage from '../components/BotMessage';
import { Dimmer, Loader } from 'semantic-ui-react';

const getBotMessages = async () => {
  const result = await axios.get(
    `${global.window.location.origin}/api/getBotMessages`,
  );
  return result.data;
};

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      _id: '',
      messages: [],
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  async componentWillMount() {
    const { data } = await getBotMessages();
    this.setState({
      messages: data,
      loading: false,
      error: '',
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
    axios.post(`${global.window.location.origin}/api/editBotSettings`, message);
    event.preventDefault();
  }

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

  renderMessages() {
    if (this.state.error) {
      return this.renderError();
    }
    const messages = this.state.messages;

    return <BotMessage messages={messages} />;
  }
  render() {
    return (
      <Layout>
        {this.state.loading ? this.renderLoading() : this.renderMessages()}
      </Layout>
    );
  }
}
