import { DateTimePicker, type DateTimePickerProps } from "@mantine/dates";

type DateTimeInputProps = Omit<
  DateTimePickerProps,
  "value" | "defaultValue" | "onChange"
> & {
  value: string | null;
  onChange: (value: string | null) => void;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toPickerValue(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function toIsoValue(value: string | null) {
  if (!value) return null;
  const date = new Date(value.includes("T") ? value : value.replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function DateTimeInput({
  value,
  onChange,
  ...props
}: DateTimeInputProps) {
  return (
    <DateTimePicker
      placeholder="Выберите дату и время"
      valueFormat="DD.MM.YYYY, HH:mm"
      popoverProps={{ withinPortal: true }}
      timePickerProps={{ withDropdown: true }}
      clearable
      value={toPickerValue(value)}
      onChange={(nextValue) => onChange(toIsoValue(nextValue))}
      {...props}
    />
  );
}
