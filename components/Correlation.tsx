import { Box, Select, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { AlternativeHypothesisInequality, H0, H1 } from "./Hypotheses";
import { HypothesisTestInput, useNumberAsStringState } from "./HypothesisTestInput";
import { jStat } from "jstat";

const getCriticalValue = (sampleSize: number, significanceLevel: number): number => {
  const t = Math.pow(jStat.studentt.inv(significanceLevel, sampleSize - 2), 2);
  return Math.sqrt(t / (t + sampleSize - 2));
};

export const Correlation: React.FC<Record<string, never>> = () => {
  const testValueName = "ρ";

  const [hypothesisInequality, setHypothesisInequality] = useState<AlternativeHypothesisInequality>("!=");
  const significanceLevel = useNumberAsStringState("0.05", (value) => value <= 0 || value >= 1);
  const sampleSize = useNumberAsStringState("50", (value) => !Number.isInteger(value) || value <= 0);
  const samplePMCC = useNumberAsStringState("0.3608", (value) => value <= -1 || value >= 1);

  const actualSignificanceLevel =
    hypothesisInequality === "!=" ? significanceLevel.valueNumber / 2 : significanceLevel.valueNumber;

  let criticalValue = getCriticalValue(sampleSize.valueNumber, actualSignificanceLevel);
  if (criticalValue === samplePMCC.valueNumber) criticalValue = NaN;
  const rejectH0 =
    hypothesisInequality === "!="
      ? Math.abs(samplePMCC.valueNumber) > criticalValue
      : hypothesisInequality === "<"
      ? samplePMCC.valueNumber < -1 * criticalValue
      : samplePMCC.valueNumber > criticalValue;

  return (
    <>
      <Stack direction="column" mb={5}>
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
          name="Correlation coefficient"
          value={samplePMCC.value}
          onChange={samplePMCC.setValue}
          isInvalid={samplePMCC.isInvalid}
          processedValue={`r=${samplePMCC.valueNumber}`}
        />
      </Stack>
      {/* Hypotheses */}
      <Box mb={5}>
        <Box>
          <Text display="inline">
            {H0}: {testValueName} = 0
          </Text>
        </Box>
        <Box>
          <Text display="inline">
            {H1}: {testValueName}
          </Text>
          <Select
            value={hypothesisInequality}
            onChange={(event) => {
              const value = event.target.value;
              if (value === "<" || value === "!=" || value === ">") {
                setHypothesisInequality(value);
              }
            }}
            width={20}
            display="inline-block"
            mx={1}
            variant="flushed"
          >
            <option>{"<"}</option>
            <option value="!=">{"≠"}</option>
            <option>{">"}</option>
          </Select>
          <Text display="inline">0 ⟹ SL: {actualSignificanceLevel * 100}%</Text>
        </Box>
      </Box>
      <Text>
        Critical value for {hypothesisInequality === "!=" ? "two" : "one"}-tailed test at{" "}
        {significanceLevel.valueNumber * 100}% level is {criticalValue}
      </Text>
      <Text>
        {hypothesisInequality === "!=" ? Math.abs(samplePMCC.valueNumber) : samplePMCC.valueNumber}{" "}
        {hypothesisInequality === "<" ? (rejectH0 ? "<" : ">") : rejectH0 ? ">" : "<"}{" "}
        {hypothesisInequality === "<" ? -criticalValue : criticalValue}
      </Text>
      <Text>
        {rejectH0 ? "Sufficient" : "Insufficient"} evidence to reject {H0} - this suggests there{" "}
        {rejectH0 ? "is" : "is not"} a{" "}
        {hypothesisInequality === "<"
          ? "negative correlation"
          : hypothesisInequality === ">"
          ? "positive correlation"
          : "correlation"}{" "}
        {"<context>"}
      </Text>
    </>
  );
};
