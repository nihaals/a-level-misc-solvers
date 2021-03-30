import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import React from "react";

export type Distribution = "binomial" | "normal";

interface DistributionSelectorProps {
  onChange(distributions: Distribution): void;
  value: Distribution;
}

export const DistributionSelector: React.FC<DistributionSelectorProps> = ({ onChange, value }) => {
  return (
    <RadioGroup onChange={onChange} value={value}>
      <Stack direction="row">
        <Radio value="binomial">Binomial</Radio>
        <Radio value="normal">Normal</Radio>
        <Radio value="correlation" isDisabled={true}>
          Pearson correlation coefficient
        </Radio>
      </Stack>
    </RadioGroup>
  );
};
