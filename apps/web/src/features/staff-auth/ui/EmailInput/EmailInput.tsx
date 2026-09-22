import { TextInput, type TextInputProps } from "@mantine/core";

export function EmailInput(props: TextInputProps) {
  return (
    <TextInput
      label="Электронная почта"
      placeholder="name@example.ru"
      type="email"
      autoComplete="email"
      required
      {...props}
    />
  );
}
