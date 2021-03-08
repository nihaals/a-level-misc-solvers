import { Box, Input, InputGroup, InputLeftAddon, InputRightAddon, Select, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import gaussian from "gaussian";

type H1Inequality = "<" | "!=" | ">";

type TailInequality = "<" | ">";

interface SingleTailedProps {
  sampleMean: number;
  actualSignificanceLevel: number;
  distribution: gaussian.Gaussian;
  inequality: TailInequality;
}

export const SingleTailed: React.FC<SingleTailedProps> = ({
  sampleMean,
  distribution,
  actualSignificanceLevel,
  inequality,
}) => {
  const probability = inequality === ">" ? 1 - distribution.cdf(sampleMean) : distribution.cdf(sampleMean);

  if (inequality === ">") {
    return (
      <>
        <Text>
          P(X̅ {inequality} {sampleMean}) = {probability} {probability < actualSignificanceLevel ? "<" : "≥"}{" "}
          {actualSignificanceLevel}
        </Text>
        <Text>
          There is {probability < actualSignificanceLevel ? "sufficient" : "insufficient"} evidence to reject H₀,{" "}
          {"<context>"}
        </Text>
      </>
    );
  } else {
    return (
      <>
        <Text>
          P(X̅ {inequality} {sampleMean}) = {probability} {1 - probability < actualSignificanceLevel ? "<" : "≥"}{" "}
          {1 - actualSignificanceLevel} = 1 - {actualSignificanceLevel}
        </Text>
        <Text>
          There is {1 - probability < actualSignificanceLevel ? "sufficient" : "insufficient"} evidence to reject H₀,{" "}
          {"<context>"}
        </Text>
      </>
    );
  }
};

interface TwoTailedProps {
  sampleMean: number;
  meanDistribution: number;
  actualSignificanceLevel: number;
  distribution: gaussian.Gaussian;
}

export const TwoTailed: React.FC<TwoTailedProps> = ({
  sampleMean,
  meanDistribution,
  actualSignificanceLevel,
  distribution,
}) => {
  return (
    <>
      <Text>
        {sampleMean} {sampleMean > meanDistribution ? ">" : "<"} {meanDistribution} ⟹{" "}
        {sampleMean > meanDistribution ? "Upper" : "Lower"} tail
      </Text>
      <SingleTailed
        sampleMean={sampleMean}
        actualSignificanceLevel={actualSignificanceLevel}
        distribution={distribution}
        inequality={sampleMean > meanDistribution ? ">" : "<"}
      />
    </>
  );
};

export const NormalDistribution: React.FC<Record<string, never>> = () => {
  const [meanDistribution, setMeanDistribution] = useState<number>(10.6);
  const [standardDeviationDistribution, setStandardDeviationDistribution] = useState<number>(Math.sqrt(0.8));
  const [sampleSize, setSampleSize] = useState<number>(50);
  const [sampleMean, setSampleMean] = useState<number>(10.79);
  const [inequality, setInequality] = useState<H1Inequality>("!=");
  const [significanceLevel, setSignificanceLevel] = useState<number>(0.1);

  const distribution = gaussian(meanDistribution, Math.pow(standardDeviationDistribution, 2) / sampleSize);

  let actualSignificanceLevel = significanceLevel;
  if (inequality === "!=") {
    actualSignificanceLevel = significanceLevel / 2;
  }

  return (
    <>
      <Stack direction="column" mb={5}>
        <InputGroup>
          <InputLeftAddon>Significance level</InputLeftAddon>
          <Input
            defaultValue="0.1"
            onChange={(event) => setSignificanceLevel(parseFloat(event.target.value))}
            isInvalid={isNaN(significanceLevel)}
            width={75}
          />
          <InputRightAddon>{significanceLevel * 100}%</InputRightAddon>
        </InputGroup>
        <InputGroup>
          <InputLeftAddon>Sample size</InputLeftAddon>
          <Input
            defaultValue="50"
            onChange={(event) => setSampleSize(parseInt(event.target.value))}
            isInvalid={isNaN(sampleSize)}
            width={100}
          />
          <InputRightAddon>{sampleSize}</InputRightAddon>
        </InputGroup>
        <InputGroup>
          <InputLeftAddon>Sample mean</InputLeftAddon>
          <Input
            defaultValue="10.79"
            onChange={(event) => setSampleMean(parseFloat(event.target.value))}
            isInvalid={isNaN(sampleMean)}
            width={100}
          />
          <InputRightAddon>{sampleMean}</InputRightAddon>
        </InputGroup>
      </Stack>
      <Box>
        <Text display="inline">H₀: μ =</Text>
        <Input
          defaultValue="10.6"
          onChange={(event) => setMeanDistribution(parseFloat(event.target.value))}
          isInvalid={isNaN(meanDistribution)}
          width={100}
          variant="flushed"
          ml={1}
        />
      </Box>
      <Box mb={5}>
        <Text display="inline">H₁: μ</Text>
        <Select
          onChange={(event) => {
            const value = event.target.value;
            if (value === "<" || value === "!=" || value === ">") {
              setInequality(value);
            }
          }}
          value={inequality}
          width={20}
          display="inline-block"
          mx={1}
          variant="flushed"
        >
          <option>{"<"}</option>
          <option value="!=">{"≠"}</option>
          <option>{">"}</option>
        </Select>
        <Text display="inline">
          {meanDistribution} ⟹ SL: {actualSignificanceLevel * 100}%
        </Text>
      </Box>
      <Stack direction="row" mb={5}>
        <Text mt="7px">If H₀,</Text>
        <Box>
          <Text display="inline-block">X ~ N({meanDistribution},</Text>
          <Input
            defaultValue="0.89442719"
            onChange={(event) => setStandardDeviationDistribution(parseFloat(event.target.value))}
            isInvalid={isNaN(standardDeviationDistribution)}
            width={100}
            variant="flushed"
            mx={1}
          />
          <Text display="inline-block">²) and</Text>
          <Text>
            X̅ ~ N({meanDistribution}, ({Math.pow(standardDeviationDistribution, 2)}/√{sampleSize})²)
          </Text>
        </Box>
      </Stack>
      {inequality === "!=" ? (
        <TwoTailed
          sampleMean={sampleMean}
          meanDistribution={meanDistribution}
          actualSignificanceLevel={actualSignificanceLevel}
          distribution={distribution}
        />
      ) : (
        <SingleTailed
          sampleMean={sampleMean}
          actualSignificanceLevel={actualSignificanceLevel}
          distribution={distribution}
          inequality={inequality}
        />
      )}
    </>
  );
};
