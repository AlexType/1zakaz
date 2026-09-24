import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { DEMO_LEADS, DEMO_LEAD_MANAGERS } from "../../lib/stories/leads-demo";
import { LeadDetailsDrawer } from "./LeadDetailsDrawer";

afterEach(cleanup);

function renderDrawer(onChange = vi.fn()) {
  render(
    <MantineProvider>
      <LeadDetailsDrawer
        lead={DEMO_LEADS[0]}
        opened
        managerOptions={DEMO_LEAD_MANAGERS}
        onClose={vi.fn()}
        onChange={onChange}
        onCreate={vi.fn()}
      />
    </MantineProvider>,
  );
  return onChange;
}

it("автоматически сохраняет изменение рабочего статуса", async () => {
  const onChange = renderDrawer();

  fireEvent.click(screen.getByRole("combobox", { name: "Статус" }));
  fireEvent.click(await screen.findByRole("option", { name: "В работе" }));

  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({ id: "L-1042", status: "in-progress" }),
  );
  expect(
    screen.queryByRole("button", { name: "Сохранить заявку" }),
  ).not.toBeInTheDocument();
});

it("добавляет заметку отдельным действием", () => {
  const onChange = renderDrawer();

  fireEvent.change(screen.getByLabelText("Новая заметка"), {
    target: { value: "Клиент попросил перезвонить вечером." },
  });
  fireEvent.click(screen.getByRole("button", { name: "Добавить заметку" }));

  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({
      notes: [
        expect.objectContaining({
          text: "Клиент попросил перезвонить вечером.",
        }),
      ],
    }),
  );
});
