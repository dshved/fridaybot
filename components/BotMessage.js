import React, { Component } from 'react';
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  TextArea,
  Form,
  Visibility,
  Input,
} from 'semantic-ui-react';

export default class BotMessages extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const messages = this.props.messages;
    return (
      <Container style={{ marginTop: 30 }}>
        {messages.map(item => {
          return (
            <Grid.Column
              key={item._id}
              style={{ maxWidth: 600, margin: '0 auto' }}
            >
              <Form
                success={this.state.success}
                size="large"
                onSubmit={this.handleSubmit}
              >
                <div>
                  <Form.Input
                    label="Сообщение"
                    key={item._id}
                    value={item.user_message}
                  />
                </div>
                <label
                  style={{
                    display: 'block',
                    margin: '1rem 0 .28571429rem 0',
                    color: 'rgba(0,0,0,.87)',
                    fontSize: '.92857143em',
                    fontWeight: 700,
                    textTransform: 'none',
                  }}
                >
                  Ответ пользователя
                </label>
                <TextArea
                  style={{
                    marginBottom: '1em',
                    minHeight: 200,
                    maxWidth: 'calc(100% - 50px)',
                  }}
                  // autoHeight
                  value={item.bot_message}
                  onChange={this.handleChange}
                />
                <Button.Group style={{ marginLeft: 10 }} icon vertical>
                  <Button>
                    <Icon name="edit" />
                  </Button>
                  <Button>
                    <Icon name="delete" />
                  </Button>
                </Button.Group>
              </Form>
            </Grid.Column>
          );
        })}
      </Container>
    );
  }
}
