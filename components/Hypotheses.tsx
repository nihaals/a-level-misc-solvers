import { Box, Input, Select, Text } from "@chakra-ui/react";
import React from "react";

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

type ValueInputProps = Pick<HypothesesProps, "value" | "onValueChange" | "valueIsInvalid">;

const ValueInput: React.FC<ValueInputProps> = ({ value, onValueChange, valueIsInvalid }) => {
  return (
    <Input
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      isInvalid={valueIsInvalid}
      width={100}
      variant="flushed"
      ml={1}
    />
  );
};

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
        <ValueInput value={value} onValueChange={onValueChange} valueIsInvalid={valueIsInvalid} />
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
        <ValueInput value={value} onValueChange={onValueChange} valueIsInvalid={valueIsInvalid} />
        <Text display="inline">⟹ SL: {actualSignificanceLevel * 100}%</Text>
      </Box>
    </>
  );
};
