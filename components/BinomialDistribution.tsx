import { Box, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { AlternativeHypothesisInequality, H0, Hypotheses } from "./Hypotheses";
import { HypothesisTestInput, useNumberAsStringState } from "./HypothesisTestInput";

/**
 * Finds the value of P(X<=value) for which X~B(sampleSize, probability).
 *
 * Returns NaN if invalid input is given or value is not an expected value.
 */
const binomialCumulativeDistribution = (sampleSize: number, probability: number, value: number): number => {
  if (probability >= 1 || probability <= 0 || value > sampleSize || value < 0 || !Number.isInteger(value)) {
    return NaN;
  }
  if (value === sampleSize) return 1;
  if (value === 0) return 0;

  return NaN;
};

/**
 * Gets the value of x for which X~B(sampleSize, probability), P(X<=x) = valueProbability
 *
 * If x is in-between two consecutive integers, the mean of the integers is returned.
 * For example, if x is in-between 19 and 20, 19.5 is returned.
 *
 * Returns NaN if invalid input is given.
 */
const getCriticalRegion = (sampleSize: number, probability: number, valueProbability: number): number => {
  if (probability >= 1 || probability <= 0 || valueProbability >= 1 || valueProbability <= 0) {
    return NaN;
  }

  return binomialCumulativeDistribution(sampleSize, probability, NaN);
};

interface OneTailedProps {
  bound: "lower" | "upper";
  sampleSize: number;
  probability: number;
  sampleValue: number;
}

const OneTailed: React.FC<OneTailedProps> = ({ bound, sampleSize, probability, sampleValue }) => {
  let criticalRegion = getCriticalRegion(sampleSize, probability, bound === "upper" ? 1 - probability : probability);
  if (bound === "lower") criticalRegion = Math.floor(criticalRegion);
  else criticalRegion = Math.ceil(criticalRegion);
  const inCriticalRegion = bound === "lower" ? sampleSize >= criticalRegion : sampleSize <= criticalRegion;
  return (
    <>
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

const TwoTailed: React.FC<Omit<OneTailedProps, "bound">> = ({ sampleSize, probability, sampleValue }) => {
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
      <OneTailed bound={bound} sampleSize={sampleSize} probability={probability} sampleValue={sampleValue} />
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
          processedValue={`${significanceLevel.valueNumber * 100}%`}
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
          sampleSize={sampleSize.valueNumber}
          probability={testValue.valueNumber}
          sampleValue={sampleValue.valueNumber}
        />
      )}
    </>
  );
};
