import { Input } from "@chakra-ui/react";
import React from "react";

interface BinaryInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const isValidBinary = (value: string): boolean => {
  for (let i = 0; i < value.length; i++) {
    if (value[i] != "0" && value[i] != "1") {
      return false;
    }
  }
  return true;
};

export const BinaryInput: React.FC<BinaryInputProps> = ({ value, onChange }) => {
  return (
    <Input value={value} onChange={(event) => onChange(event.target.value)} isInvalid={!isValidBinary(value)}></Input>
  );
};
