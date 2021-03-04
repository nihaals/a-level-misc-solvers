import { Box, Button, Heading, Text, useColorMode } from "@chakra-ui/react";
import Head from "next/head";

export default function Home(): JSX.Element {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Head>
        <title>Hypothesis testing solver</title>
        <meta property="og:title" content="Hypothesis testing solver" key="title" />
        <meta name="description" content="A hypothesis testing solver which includes working out" key="description" />
      </Head>
      <Box p={2}>
        <Heading as="h1">Hello, World!</Heading>
        <Text>Currently in {colorMode} mode</Text>
        <Button onClick={() => toggleColorMode()}>Switch to {colorMode === "light" ? "dark" : "light"} mode</Button>
      </Box>
    </>
  );
}
