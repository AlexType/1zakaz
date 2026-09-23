import { notifications } from "@mantine/notifications";

export function showActionSuccess(message: string) {
  notifications.show({ message, color: "green" });
}

export function showActionError(message: string) {
  notifications.show({ message, color: "red", autoClose: 7000 });
}
