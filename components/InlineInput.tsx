import { Input } from "@chakra-ui/react";
import React from "react";

interface InlineInputProps {
  value: string;
  onChange(value: string): void;
  isInvalid: boolean;
}

export const InlineInput: React.FC<InlineInputProps> = ({ value, onChange, isInvalid }) => {
  return (
    <Input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      isInvalid={isInvalid}
      width={100}
      variant="flushed"
      ml={1}
    />
  );
};
