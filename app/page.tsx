import FarmCalculator from "@/components/FarmCalculator";
import { getCalculatorSource } from "@/lib/calculator-source";

export default function Page() {
  const { css, markup, scripts, overridesCss } = getCalculatorSource();
  return (
    <FarmCalculator
      css={css}
      markup={markup}
      scripts={scripts}
      overridesCss={overridesCss}
    />
  );
}
