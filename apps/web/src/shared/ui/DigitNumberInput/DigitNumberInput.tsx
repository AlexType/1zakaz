import { NumberInput, type NumberInputProps } from "@mantine/core";

type DigitNumberInputProps = Omit<
  NumberInputProps,
  "value" | "defaultValue" | "onChange"
> & {
  defaultValue: string;
  onChange: (raw: string) => void;
};

export function DigitNumberInput({
  defaultValue,
  onChange,
  ...props
}: DigitNumberInputProps) {
  return (
    <NumberInput
      {...props}
      defaultValue={defaultValue}
      onValueChange={({ value: raw }) => onChange(raw)}
      thousandSeparator=" "
      allowNegative={false}
      allowDecimal={false}
      hideControls
      inputMode="numeric"
    />
  );
}
