import { Box, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { AlternativeHypothesisInequality, H0, Hypotheses } from "./Hypotheses";
import { HypothesisTestInput, useNumberAsStringState } from "./HypothesisTestInput";
import { InlineInput } from "./InlineInput";

interface OneTailedProps {
  bound: "lower" | "upper";
  probability: number;
  sampleValue: number;
}

const OneTailed: React.FC<OneTailedProps> = ({ bound, probability, sampleValue }) => {
  const criticalValue = useNumberAsStringState(
    "19.5",
    (value) => !Number.isInteger(value) && !value.toString().endsWith(".5")
  );
  const criticalRegion =
    bound === "lower" ? Math.floor(criticalValue.valueNumber) : Math.ceil(criticalValue.valueNumber);
  const inCriticalRegion = bound === "lower" ? sampleValue <= criticalRegion : sampleValue >= criticalRegion;
  return (
    <>
      <Box>
        <Text display="inline-block">
          P(X{"≤"}x)={bound === "upper" ? 1 - probability : probability}, x=
        </Text>
        <InlineInput
          value={criticalValue.value}
          onChange={criticalValue.setValue}
          isInvalid={criticalValue.isInvalid}
        />
      </Box>
      <Text>
        CR: X{bound === "lower" ? "≤" : "≥"}
        {criticalRegion}
      </Text>
      <Text>
        {sampleValue}
        {inCriticalRegion ? "∈" : "∉"}
        CR
      </Text>
      <Text>
        There is {inCriticalRegion ? "sufficient" : "insufficient"} evidence to reject {H0}, {"<context>"}
      </Text>
    </>
  );
};

type TwoTailedProps = Omit<OneTailedProps, "bound"> & {
  sampleSize: number;
};

const TwoTailed: React.FC<TwoTailedProps> = ({ sampleSize, probability, sampleValue }) => {
  let multiplied = sampleSize * probability;
  if (multiplied === sampleSize) multiplied = NaN;
  const bound = multiplied > sampleValue ? "lower" : "upper";
  return (
    <>
      <Text>
        {sampleSize} ⋅ {probability} = {multiplied}
      </Text>
      <Text>
        {multiplied}
        {bound === "lower" ? ">" : "<"}
        {sampleValue} ⟹ {bound} bound
      </Text>
      <OneTailed bound={bound} probability={probability} sampleValue={sampleValue} />
    </>
  );
};

export const BinomialDistribution: React.FC<Record<string, never>> = () => {
  const testValueName = "p";

  const testValue = useNumberAsStringState("0.35", (value) => value < 0 || value > 1);
  const [hypothesisInequality, setHypothesisInequality] = useState<AlternativeHypothesisInequality>(">");
  const significanceLevel = useNumberAsStringState("0.05", (value) => value <= 0 || value >= 1);
  const sampleSize = useNumberAsStringState("40", (value) => !Number.isInteger(value));
  const sampleValue = useNumberAsStringState("19", (value) => !Number.isInteger(value));

  const actualSignificanceLevel =
    hypothesisInequality === "!=" ? significanceLevel.valueNumber / 2 : significanceLevel.valueNumber;

  return (
    <>
      <Stack direction="column" mb={5}>
        <HypothesisTestInput
          name="Test value"
          value={testValue.value}
          onChange={testValue.setValue}
          isInvalid={testValue.isInvalid}
          processedValue={`${testValueName}=${testValue.valueNumber * 100}%`}
        />
        <HypothesisTestInput
          name="Significance level"
          value={significanceLevel.value}
          onChange={significanceLevel.setValue}
          isInvalid={significanceLevel.isInvalid}
          processedValue={`α=${significanceLevel.valueNumber * 100}%`}
        />
        <HypothesisTestInput
          name="Sample size"
          value={sampleSize.value}
          onChange={sampleSize.setValue}
          isInvalid={sampleSize.isInvalid}
        />
        <HypothesisTestInput
          name="Sample value"
          value={sampleValue.value}
          onChange={sampleValue.setValue}
          isInvalid={sampleValue.isInvalid}
        />
      </Stack>
      <Box mb={5}>
        <Hypotheses
          testValueName={testValueName}
          value={testValue.value}
          onValueChange={testValue.setValue}
          valueIsInvalid={testValue.isInvalid}
          inequality={hypothesisInequality}
          onInequalityChange={setHypothesisInequality}
          actualSignificanceLevel={actualSignificanceLevel}
        ></Hypotheses>
      </Box>
      <Text>
        X~B({sampleSize.valueNumber}, {testValue.valueNumber})
      </Text>
      {hypothesisInequality === "!=" ? (
        <TwoTailed
          sampleSize={sampleSize.valueNumber}
          probability={testValue.valueNumber}
          sampleValue={sampleValue.valueNumber}
        />
      ) : (
        <OneTailed
          bound={hypothesisInequality === "<" ? "lower" : "upper"}
          probability={testValue.valueNumber}
          sampleValue={sampleValue.valueNumber}
        />
      )}
    </>
  );
};
