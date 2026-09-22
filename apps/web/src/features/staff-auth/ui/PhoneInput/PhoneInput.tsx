import { TextInput, type TextInputProps } from "@mantine/core";

export function PhoneInput(props: TextInputProps) {
  return (
    <TextInput
      label="Номер телефона"
      placeholder="+7 999 123-45-67"
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      required
      {...props}
    />
  );
}
