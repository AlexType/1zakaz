import { Avatar, Group, Text, Tooltip } from "@mantine/core";
import {
  formatPersonShortName,
  getPersonInitials,
} from "@/shared/lib/format-person-short-name";

type Props = {
  name: string | null;
  avatarUrl?: string | null;
  emptyLabel?: string;
};

export function GridPersonCell({
  name,
  avatarUrl,
  emptyLabel = "Не назначен",
}: Props) {
  if (!name)
    return (
      <Text size="sm" c="dimmed">
        {emptyLabel}
      </Text>
    );
  return (
    <Tooltip label={name} withArrow>
      <Group gap="xs" wrap="nowrap">
        <Avatar src={avatarUrl} size={28} radius="xl" color="red">
          {getPersonInitials(name)}
        </Avatar>
        <Text size="sm" textWrap="nowrap">
          {formatPersonShortName(name)}
        </Text>
      </Group>
    </Tooltip>
  );
}
