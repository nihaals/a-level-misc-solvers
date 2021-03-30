import { ChakraProvider, CSSReset, extendTheme } from "@chakra-ui/react";
import { AppProps } from "next/dist/next-server/lib/router/router";

const theme = extendTheme({
  components: {
    Link: {
      baseStyle: {
        color: "teal.500",
      },
    },
  },
});

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
