import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import React from "react";

export type Distribution = "normal";

interface DistributionSelectorProps {
  onChange(distributions: Distribution): void;
  value: Distribution;
}

export const DistributionSelector: React.FC<DistributionSelectorProps> = ({ onChange, value }) => {
  return (
    <RadioGroup onChange={onChange} value={value}>
      <Stack direction="row">
        <Radio value="binomial" isDisabled={true}>
          Binomial
        </Radio>
        <Radio value="normal">Normal</Radio>
      </Stack>
    </RadioGroup>
  );
};
