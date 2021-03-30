import { Input, InputGroup, InputLeftAddon, InputRightAddon } from "@chakra-ui/react";
import React, { useState } from "react";

interface HypothesisTestInputProps {
  name: string;
  value: string;
  onChange(value: string): void;
  isInvalid: boolean;
  processedValue?: string;
}

export const HypothesisTestInput: React.FC<HypothesisTestInputProps> = ({
  name,
  value,
  onChange,
  isInvalid,
  processedValue,
}) => {
  return (
    <InputGroup>
      <InputLeftAddon>{name}</InputLeftAddon>
      <Input value={value} onChange={(event) => onChange(event.target.value)} isInvalid={isInvalid} width={75} />
      {processedValue && <InputRightAddon>{processedValue}</InputRightAddon>}
    </InputGroup>
  );
};

interface useNumberAsStringStateReturn {
  value: string;
  setValue(value: string): void;
  valueNumber: number;
  isInvalid: boolean;
}

export const useNumberAsStringState = (
  initialState: string,
  isInvalid?: (value: number) => boolean
): useNumberAsStringStateReturn => {
  const [state, setState] = useState<string>(initialState);
  const stateNumber = state === "" ? NaN : Number(state);
  let stateIsInvalid = isNaN(stateNumber);
  if (!stateIsInvalid && isInvalid) {
    stateIsInvalid = isInvalid(stateNumber);
  }
  return {
    value: state,
    setValue: setState,
    valueNumber: stateIsInvalid ? NaN : stateNumber,
    isInvalid: stateIsInvalid,
  };
};
