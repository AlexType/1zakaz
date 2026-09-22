import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <Alert color="red" icon={<IconInfoCircle size={18} />} role="alert">
      {message}
    </Alert>
  );
}
