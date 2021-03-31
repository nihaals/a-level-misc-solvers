import { Box, Button, Stack, useColorMode } from "@chakra-ui/react";
import Head from "next/head";
import { useState } from "react";
import { BinomialDistribution } from "../components/BinomialDistribution";
import { Distribution, DistributionSelector } from "../components/DistributionSelector";
import { NormalDistribution } from "../components/NormalDistribution";
import { Correlation } from "../components/Correlation";

export default function HypothesisTesting(): JSX.Element {
  const [distribution, setDistribution] = useState<Distribution>("binomial");
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Head>
        <title>Hypothesis testing solver</title>
        <meta property="og:title" content="Hypothesis testing solver" key="title" />
        <meta name="description" content="A hypothesis testing solver which includes working out" key="description" />
      </Head>
      <Box p={2}>
        <Button onClick={() => toggleColorMode()}>Switch to {colorMode === "light" ? "dark" : "light"} mode</Button>
        <Stack direction="column" spacing={2} mt={1}>
          <DistributionSelector onChange={setDistribution} value={distribution}></DistributionSelector>
          <Box borderWidth="1px" borderRadius="md" p={3}>
            {distribution === "binomial" ? (
              <BinomialDistribution />
            ) : distribution === "normal" ? (
              <NormalDistribution />
            ) : (
              <Correlation />
            )}
          </Box>
        </Stack>
      </Box>
    </>
  );
}
