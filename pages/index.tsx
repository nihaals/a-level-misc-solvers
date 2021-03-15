import { Box, Button, Link, ListItem, UnorderedList, useColorMode } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";

const Home = (): JSX.Element => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box p={2}>
      <Button onClick={() => toggleColorMode()}>Switch to {colorMode === "light" ? "dark" : "light"} mode</Button>
      <Box mt={2} ml={1}>
        <UnorderedList>
          <ListItem>
            <NextLink href="/hypothesis-testing">
              <Link color="teal.500">Hypothesis testing</Link>
            </NextLink>
          </ListItem>
        </UnorderedList>
      </Box>
    </Box>
  );
};

export default Home;
