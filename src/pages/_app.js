import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import bubbleTheme from '../styles/bubbleTheme'

export default function App(props) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>CharlaBots</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={bubbleTheme}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
}