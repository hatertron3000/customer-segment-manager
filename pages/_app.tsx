import { Box, GlobalStyles, H1 } from '@bigcommerce/big-design';
import { theme as defaultTheme } from '@bigcommerce/big-design-theme';
import type { AppProps } from 'next/app';
import Head from 'next/head'
import { ThemeProvider } from 'styled-components';
import Header from '../components/header';
import SessionProvider from '../context/session';

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <ThemeProvider theme={defaultTheme}>
            <Head>
                {
                    process.env.NODE_ENV === 'development' 
                    ? <script src="http://localhost:8097"></script>
                    : null
                 }
            </Head>
            <GlobalStyles />
            <Box
                marginHorizontal={{ mobile: 'none', tablet: 'xxxLarge' }}
                marginVertical={{ mobile: 'none', tablet: "xxLarge" }}
            >
                <H1>Customer Segment Manager</H1>
                <Header />
                <SessionProvider>
                    <Component {...pageProps} />
                </SessionProvider>
            </Box>
        </ThemeProvider>
    );
};

export default MyApp;
