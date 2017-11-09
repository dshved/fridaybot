import Link from 'next/link';
import Head from 'next/head';
import styled from 'styled-components';

export default ({ children, title = 'This is the default title' }) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <nav>
        <Link prefetch href="/">
          <a>Login</a>
        </Link>{' '}
        |
        <Link prefetch href="/stickers">
          <a>Stickers</a>
        </Link>{' '}
        |
        <Link prefetch href="/settings">
          <a>Settings</a>
        </Link>
      </nav>
    </header>

    {children}

    <footer>{'I`m here to stay'}</footer>
  </div>
);
