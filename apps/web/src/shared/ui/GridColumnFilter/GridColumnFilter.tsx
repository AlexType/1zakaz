import { Select, TextInput } from "@mantine/core";

type SelectFilterProps = {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
};

type TextFilterProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function GridSelectFilter({
  label,
  value,
  options,
  onChange,
}: SelectFilterProps) {
  return (
    <Select
      label={label}
      placeholder="Выберите значение"
      data={options}
      value={value}
      onChange={(next) => onChange(next ?? "all")}
      allowDeselect={false}
      searchable={options.length > 8}
      comboboxProps={{ withinPortal: false }}
      w={220}
    />
  );
}

export function GridTextFilter({ label, value, onChange }: TextFilterProps) {
  return (
    <TextInput
      label={label}
      placeholder="Начните вводить"
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
      w={220}
    />
  );
}
