import { Box, Skeleton, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { AlternativeHypothesisInequality, H0, Hypotheses } from "./Hypotheses";
import { HypothesisTestInput, useNumberAsStringState } from "./HypothesisTestInput";
import { InlineInput } from "./InlineInput";
import { getCriticalValue } from "../workers/binomial.worker";

interface OneTailedProps {
  bound: "lower" | "upper";
  actualSignificanceLevel: number;
  sampleValue: number;
  sampleSize: number;
  testValue: number;
}

const OneTailed: React.FC<OneTailedProps> = ({
  bound,
  actualSignificanceLevel,
  sampleValue,
  sampleSize,
  testValue,
}) => {
  const [criticalValue, setCriticalValue] = useState<number | null>(null);
  const workerRef = useRef<Worker>();
  useEffect(() => {
    workerRef.current = new Worker(new URL("../workers/binomial.worker", import.meta.url));
    workerRef.current.onmessage = (event) => {
      setCriticalValue(event.data as ReturnType<typeof getCriticalValue>);
    };
    const getCriticalValueArguments: Parameters<typeof getCriticalValue> = [
      sampleSize,
      testValue,
      bound === "lower" ? actualSignificanceLevel : 1 - actualSignificanceLevel,
    ];
    workerRef.current.postMessage(getCriticalValueArguments);

    return () => {
      workerRef.current?.terminate();
      setCriticalValue(null);
    };
  }, [sampleSize, testValue, bound, actualSignificanceLevel]);

  if (criticalValue === null) {
    return (
      <Stack>
        <Skeleton height="1em" />
        <Skeleton height="1em" />
        <Skeleton height="1em" />
      </Stack>
    );
  }

  const criticalRegion = bound === "lower" ? Math.floor(criticalValue) : Math.ceil(criticalValue) + 1;
  const inCriticalRegion = bound === "lower" ? sampleValue <= criticalRegion : sampleValue >= criticalRegion;
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

type TwoTailedProps = Omit<OneTailedProps, "bound">;

const TwoTailed: React.FC<TwoTailedProps> = ({ actualSignificanceLevel, sampleValue, sampleSize, testValue }) => {
  let multiplied = sampleSize * testValue;
  if (multiplied === sampleSize) multiplied = NaN;
  const bound = multiplied > sampleValue ? "lower" : "upper";
  return (
    <>
      <Text>
        {sampleSize} ⋅ {testValue} = {multiplied}
      </Text>
      <Text>
        {multiplied}
        {bound === "lower" ? ">" : "<"}
        {sampleValue} ⟹ {bound} bound
      </Text>
      <OneTailed
        bound={bound}
        actualSignificanceLevel={actualSignificanceLevel}
        sampleValue={sampleValue}
        sampleSize={sampleSize}
        testValue={testValue}
      />
    </>
  );
};

export const BinomialDistribution: React.FC<Record<string, never>> = () => {
  const testValueName = "p";

  const testValue = useNumberAsStringState("0.35", (value) => value < 0 || value > 1);
  const [hypothesisInequality, setHypothesisInequality] = useState<AlternativeHypothesisInequality>(">");
  const significanceLevel = useNumberAsStringState("0.05", (value) => value <= 0 || value >= 1);
  const sampleSize = useNumberAsStringState("40", (value) => !Number.isInteger(value) || value <= 0);
  const sampleValue = useNumberAsStringState(
    "19",
    (value) =>
      !Number.isInteger(value) ||
      value <= 0 ||
      value > sampleSize.valueNumber ||
      value === sampleSize.valueNumber * testValue.valueNumber
  );

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
      <Box mb={3}>
        <Text display="inline-block">X~B(</Text>
        <InlineInput value={sampleSize.value} onChange={sampleSize.setValue} isInvalid={sampleSize.isInvalid} />
        <Text display="inline-block">, </Text>
        <InlineInput value={testValue.value} onChange={testValue.setValue} isInvalid={testValue.isInvalid} />
        <Text display="inline-block">)</Text>
      </Box>
      {hypothesisInequality === "!=" ? (
        <TwoTailed
          actualSignificanceLevel={actualSignificanceLevel}
          sampleValue={sampleValue.valueNumber}
          sampleSize={sampleSize.valueNumber}
          testValue={testValue.valueNumber}
        />
      ) : (
        <OneTailed
          bound={hypothesisInequality === "<" ? "lower" : "upper"}
          actualSignificanceLevel={actualSignificanceLevel}
          sampleValue={sampleValue.valueNumber}
          sampleSize={sampleSize.valueNumber}
          testValue={testValue.valueNumber}
        />
      )}
    </>
  );
};
