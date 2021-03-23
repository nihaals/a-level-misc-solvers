import { Box, Button, useColorMode } from "@chakra-ui/react";
import React, { useState } from "react";
import { BinaryInput } from "../components/BinaryInput";

const Home = (): JSX.Element => {
  const [binaryValue, setBinaryValue] = useState<string>("");
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box p={2}>
      <Button onClick={() => toggleColorMode()}>Switch to {colorMode === "light" ? "dark" : "light"} mode</Button>
      <Box mt={2}>
        <BinaryInput value={binaryValue} onChange={setBinaryValue} />
      </Box>
    </Box>
  );
};

export default Home;
