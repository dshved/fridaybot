import Link from 'next/link';
import Head from 'next/head';
import styled from 'styled-components';
import { Menu, Segment, Container, Button } from 'semantic-ui-react';

export default ({
  children,
  title = 'This is the default title',
  active = 'home',
}) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link
        rel="stylesheet"
        href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
      />
    </Head>

    <Segment inverted vertical>
      <Container>
        <Menu inverted pointing secondary size="large" activeIndex={0}>
          <Menu.Item as="a" href="/" active>
            Главная
          </Menu.Item>
          <Menu.Item as="a" href="/messages">
            Ответы
          </Menu.Item>
          <Menu.Item as="a" href="/stickers">
            Стикеры
          </Menu.Item>
          <Menu.Item as="a" href="/settings">
            Настройки
          </Menu.Item>
          <Menu.Item position="right">
            <Button as="a" inverted>
              Выйти
            </Button>
          </Menu.Item>
        </Menu>
      </Container>
    </Segment>
    {children}
  </div>
);
