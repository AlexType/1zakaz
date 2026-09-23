import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { demoCar } from "../../lib/stories/car-editor-examples";
import { CarEditor } from "./CarEditor";

it("не пересоздаёт числовое поле и сохраняет число без разделителей", async () => {
  const onSave = vi.fn();
  render(
    <MantineProvider>
      <CarEditor
        mode="edit"
        initialValues={demoCar}
        brands={[]}
        models={[]}
        managers={[]}
        onSave={onSave}
        onCancel={vi.fn()}
      />
    </MantineProvider>,
  );
  const input = screen.getByRole("textbox", { name: "Пробег, км" });
  input.focus();
  fireEvent.change(input, { target: { value: "1234" } });
  expect(screen.getByRole("textbox", { name: "Пробег, км" })).toBe(input);
  expect(document.activeElement).toBe(input);
  fireEvent.click(screen.getByRole("button", { name: "Сохранить" }));
  await waitFor(() =>
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ mileageKm: "1234" }),
      [],
    ),
  );
});
