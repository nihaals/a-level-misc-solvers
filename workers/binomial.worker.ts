import { jStat } from "jstat";

export const getCriticalValue = (sampleSize: number, testValue: number, probability: number): number => {
  if ([sampleSize, testValue, probability].includes(NaN)) return NaN;
  for (let i = 1; i <= sampleSize; i++) {
    const current: number = jStat.binomial.cdf(i, sampleSize, testValue);
    if (current > probability) return i - 0.5;
    if (current === probability) return i;
  }
  return NaN;
};

self.addEventListener("message", (event) => {
  self.postMessage(getCriticalValue(...(event.data as Parameters<typeof getCriticalValue>)));
});
