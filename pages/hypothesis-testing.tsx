import {
  Box,
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { BinomialDistribution } from "../components/BinomialDistribution";
import { NormalDistribution } from "../components/NormalDistribution";
import { Correlation } from "../components/Correlation";
import { useEffect, useState } from "react";

const tests = ["binomial", "normal", "correlation"];

export default function HypothesisTesting(): JSX.Element {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("white", "gray.800");
  const router = useRouter();
  const [tabIndex, setTabIndex] = useState(0);
  useEffect(() => {
    if (typeof router.query.test === "string") {
      const index = tests.indexOf(router.query.test);
      if (index !== -1) setTabIndex(index);
    }
  }, [router.query.test]);

  return (
    <>
      <Head>
        <title>Hypothesis testing solver</title>
        <meta property="og:title" content="Hypothesis testing solver" key="title" />
        <meta name="description" content="A hypothesis testing solver which includes working out" key="description" />
      </Head>
      <Box p={2}>
        <Button onClick={() => toggleColorMode()}>Switch to {colorMode === "light" ? "dark" : "light"} mode</Button>
        <Tabs
          isLazy
          index={tabIndex}
          onChange={(index) => {
            setTabIndex(index);
            router.push("/hypothesis-testing", { query: index === 0 ? {} : { test: tests[index] } });
          }}
        >
          <TabList mt={2} position="sticky" top={0} backgroundColor={bg} zIndex={1}>
            <Tab>Binomial</Tab>
            <Tab>Normal</Tab>
            <Tab>Correlation</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <BinomialDistribution />
            </TabPanel>
            <TabPanel>
              <NormalDistribution />
            </TabPanel>
            <TabPanel>
              <Correlation />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
}
