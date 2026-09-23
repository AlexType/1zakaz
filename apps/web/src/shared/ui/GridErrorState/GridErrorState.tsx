import { Button, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import classes from "./GridErrorState.module.css";

type Props = { title: string; message: string; onRetry?: () => void };

export function GridErrorState({ title, message, onRetry }: Props) {
  return (
    <div className={classes.root} role="alert">
      <IconAlertCircle size={32} stroke={1.7} className={classes.icon} />
      <Text fw={600}>{title}</Text>
      <Text size="sm" c="dimmed">
        {message}
      </Text>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Повторить
        </Button>
      )}
    </div>
  );
}
