import { Box, Select, Text } from "@chakra-ui/react";
import React from "react";
import { InlineInput } from "./InlineInput";

export type AlternativeHypothesisInequality = "<" | "!=" | ">";

interface HypothesesProps {
  testValueName: string;
  value: string;
  onValueChange(value: string): void;
  valueIsInvalid: boolean;
  inequality: AlternativeHypothesisInequality;
  onInequalityChange(inequality: AlternativeHypothesisInequality): void;
  actualSignificanceLevel: number;
}

export const H0 = "H₀";
export const H1 = "H₁";

export const Hypotheses: React.FC<HypothesesProps> = ({
  testValueName,
  value,
  onValueChange,
  valueIsInvalid,
  inequality,
  onInequalityChange,
  actualSignificanceLevel,
}) => {
  return (
    <>
      <Box>
        <Text display="inline">
          {H0}: {testValueName} =
        </Text>
        <InlineInput value={value} onChange={onValueChange} isInvalid={valueIsInvalid} />
      </Box>
      <Box>
        <Text display="inline">
          {H1}: {testValueName}
        </Text>
        <Select
          value={inequality}
          onChange={(event) => {
            const value = event.target.value;
            if (value === "<" || value === "!=" || value === ">") {
              onInequalityChange(value);
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
        <InlineInput value={value} onChange={onValueChange} isInvalid={valueIsInvalid} />
        <Text display="inline">⟹ SL: {actualSignificanceLevel * 100}%</Text>
      </Box>
    </>
  );
};
