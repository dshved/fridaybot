import Layout from '../components/layout';
// import styledComponent from 'styled-components';
// const styled = styledComponent;

// export default () => (
//   <Layout title="keks">
//     <div>kek</div>
//   </Layout>
// );

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
  Menu,
  Segment,
  Visibility,
} from 'semantic-ui-react';

export default class HomepageLayout extends Component {
  state = {};

  render() {
    return (
      <Layout>
        <div>
          <Segment
            inverted
            textAlign="center"
            style={{ minHeight: 'calc(100vh - 82px)', padding: '1em 0em' }}
            vertical
          >
            {/* <Container>
              <Menu inverted pointing secondary size='large'>
                <Menu.Item as='a' active>Главная</Menu.Item>
                <Menu.Item as='a'>Стикеры</Menu.Item>
                <Menu.Item as='a'>Настройки</Menu.Item>
                <Menu.Item position='right'>
                  <Button as='a' inverted>Выйти</Button>
                </Menu.Item>
              </Menu>
            </Container> */}

            <Container text>
              <Header
                as="h1"
                content="Hello"
                inverted
                style={{
                  fontSize: '4em',
                  fontWeight: 'normal',
                  marginBottom: 0,
                  marginTop: '3em',
                }}
              />
              <Header
                as="h2"
                content="What do you want?"
                inverted
                style={{ fontSize: '1.7em', fontWeight: 'normal' }}
              />
              <Button as="a" href="/loginform" primary size="huge">
                Войти
              </Button>
            </Container>
          </Segment>
        </div>
      </Layout>
    );
  }
}
