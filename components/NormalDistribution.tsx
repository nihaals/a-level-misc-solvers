import { Box, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import gaussian from "gaussian";
import { HypothesisTestInput, useNumberAsStringState } from "./HypothesisTestInput";
import { AlternativeHypothesisInequality, H0, Hypotheses } from "./Hypotheses";
import { InlineInput } from "./InlineInput";

interface OneTailedProps {
  sampleMean: number;
  actualSignificanceLevel: number;
  distribution: gaussian.Gaussian;
  bound: "lower" | "upper";
}

export const OneTailed: React.FC<OneTailedProps> = ({ sampleMean, actualSignificanceLevel, distribution, bound }) => {
  const probability = bound === "upper" ? 1 - distribution.cdf(sampleMean) : distribution.cdf(sampleMean);

  if (bound === "upper") {
    return (
      <>
        <Text>
          P(X̅ {">"} {sampleMean}) = {probability === actualSignificanceLevel ? NaN : probability}{" "}
          {probability < actualSignificanceLevel ? "<" : ">"} {actualSignificanceLevel}
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
          P(X̅ {"<"} {sampleMean}) = {1 - probability === actualSignificanceLevel ? NaN : probability}{" "}
          {1 - probability < actualSignificanceLevel ? "<" : ">"} {1 - actualSignificanceLevel} = 1 -{" "}
          {actualSignificanceLevel}
        </Text>
        <Text>
          There is {1 - probability < actualSignificanceLevel ? "sufficient" : "insufficient"} evidence to reject H₀,{" "}
          {"<context>"}
        </Text>
      </>
    );
  }
};

type TwoTailedProps = Omit<OneTailedProps, "bound"> & {
  distributionMean: number;
};

export const TwoTailed: React.FC<TwoTailedProps> = ({
  sampleMean,
  distributionMean,
  actualSignificanceLevel,
  distribution,
}) => {
  return (
    <>
      <Text>
        {sampleMean} {sampleMean > distributionMean ? ">" : "<"} {distributionMean} ⟹{" "}
        {sampleMean > distributionMean ? "Upper" : "Lower"} tail
      </Text>
      <OneTailed
        sampleMean={sampleMean}
        actualSignificanceLevel={actualSignificanceLevel}
        distribution={distribution}
        bound={sampleMean > distributionMean ? "upper" : "lower"}
      />
    </>
  );
};

export const NormalDistribution: React.FC<Record<string, never>> = () => {
  const testValueName = "μ";

  const distributionMean = useNumberAsStringState("65");
  const [hypothesisInequality, setHypothesisInequality] = useState<AlternativeHypothesisInequality>(">");
  const distributionStandardDeviation = useNumberAsStringState("10", (value) => value <= 0);
  const sampleSize = useNumberAsStringState("8", (value) => !Number.isInteger(value) || value <= 0);
  const sampleMean = useNumberAsStringState("72", (value) => value === distributionMean.valueNumber);
  const significanceLevel = useNumberAsStringState("0.05", (value) => value <= 0 || value >= 1);

  const meanDistribution = gaussian(
    distributionMean.valueNumber,
    Math.pow(distributionStandardDeviation.valueNumber, 2) / sampleSize.valueNumber
  );

  const actualSignificanceLevel =
    hypothesisInequality === "!=" ? significanceLevel.valueNumber / 2 : significanceLevel.valueNumber;

  return (
    <>
      <Stack direction="column" mb={5}>
        <HypothesisTestInput
          name="Mean of distribution"
          value={distributionMean.value}
          onChange={distributionMean.setValue}
          isInvalid={distributionMean.isInvalid}
          processedValue={`${testValueName}=${distributionMean.valueNumber}`}
        />
        <HypothesisTestInput
          name="Standard deviation of distribution"
          value={distributionStandardDeviation.value}
          onChange={distributionStandardDeviation.setValue}
          isInvalid={distributionStandardDeviation.isInvalid}
          processedValue={`σ=${distributionStandardDeviation.valueNumber}`}
        />
        <HypothesisTestInput
          name="Sample size"
          value={sampleSize.value}
          onChange={sampleSize.setValue}
          isInvalid={sampleSize.isInvalid}
        />
        <HypothesisTestInput
          name="Sample mean"
          value={sampleMean.value}
          onChange={sampleMean.setValue}
          isInvalid={sampleMean.isInvalid}
        />
        <HypothesisTestInput
          name="Significance level"
          value={significanceLevel.value}
          onChange={significanceLevel.setValue}
          isInvalid={significanceLevel.isInvalid}
          processedValue={`α=${significanceLevel.valueNumber * 100}%`}
        />
      </Stack>
      <Box mb={5}>
        <Hypotheses
          testValueName={testValueName}
          value={distributionMean.value}
          onValueChange={distributionMean.setValue}
          valueIsInvalid={distributionMean.isInvalid}
          inequality={hypothesisInequality}
          onInequalityChange={setHypothesisInequality}
          actualSignificanceLevel={actualSignificanceLevel}
        ></Hypotheses>
      </Box>
      <Stack direction="row" mb={5}>
        <Text mt="7px">If {H0},</Text>
        <Stack direction="column">
          <Box>
            <Text display="inline-block">X ~ N(</Text>
            <InlineInput
              value={distributionMean.value}
              onChange={distributionMean.setValue}
              isInvalid={distributionMean.isInvalid}
            />
            <Text display="inline-block">,</Text>
            <InlineInput
              value={distributionStandardDeviation.value}
              onChange={distributionStandardDeviation.setValue}
              isInvalid={distributionStandardDeviation.isInvalid}
            />
            <Text display="inline-block">²) and</Text>
          </Box>
          <Text>
            X̅ ~ N({distributionMean.valueNumber}, ({distributionStandardDeviation.valueNumber}/√{sampleSize.valueNumber}
            )²)
          </Text>
        </Stack>
      </Stack>
      {hypothesisInequality === "!=" ? (
        <TwoTailed
          sampleMean={sampleMean.valueNumber}
          actualSignificanceLevel={actualSignificanceLevel}
          distribution={meanDistribution}
          distributionMean={distributionMean.valueNumber}
        />
      ) : (
        <OneTailed
          sampleMean={sampleMean.valueNumber}
          actualSignificanceLevel={actualSignificanceLevel}
          distribution={meanDistribution}
          bound={hypothesisInequality === "<" ? "lower" : "upper"}
        />
      )}
    </>
  );
};
