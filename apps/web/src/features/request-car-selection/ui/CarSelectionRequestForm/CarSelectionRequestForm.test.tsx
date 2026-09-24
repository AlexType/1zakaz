import { MantineProvider } from "@mantine/core";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CarSelectionRequestForm } from "./CarSelectionRequestForm";

afterEach(cleanup);

function renderForm(onSubmit = vi.fn()) {
  render(
    <MantineProvider>
      <CarSelectionRequestForm
        initialValues={{
          selectionMode: "specific",
          country: "japan",
          condition: "used",
          contactMethod: "telegram",
          personalDataConsent: true,
        }}
        onSubmit={onSubmit}
      />
    </MantineProvider>,
  );
  return onSubmit;
}

async function completeVehicleStep() {
  const vehicleInput = await screen.findByLabelText(/Марка и модель/);
  fireEvent.change(vehicleInput, {
    target: { value: "Toyota RAV4" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Продолжить" }));
}

it("сохраняет значения при переходе назад", async () => {
  renderForm();
  await completeVehicleStep();

  fireEvent.change(screen.getByLabelText(/Максимальный бюджет под ключ/), {
    target: { value: "3000000" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Назад" }));

  expect(screen.getByLabelText(/Марка и модель/)).toHaveValue("Toyota RAV4");
  fireEvent.click(screen.getByRole("button", { name: "Продолжить" }));
  expect(screen.getByLabelText(/Максимальный бюджет под ключ/)).toHaveValue(
    "3 000 000 ₽",
  );
});

it("отправляет моковую заявку и показывает резюме", async () => {
  const onSubmit = renderForm();
  await completeVehicleStep();

  fireEvent.change(screen.getByLabelText(/Максимальный бюджет под ключ/), {
    target: { value: "3000000" },
  });
  fireEvent.change(screen.getByLabelText(/Город получения/), {
    target: { value: "Хабаровск" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Продолжить" }));

  fireEvent.change(screen.getByLabelText(/Как к вам обращаться\?/), {
    target: { value: "Анна" },
  });
  fireEvent.change(screen.getByLabelText(/Телефон/), {
    target: { value: "8 999 123-45-67" },
  });
  fireEvent.click(
    screen.getByRole("button", { name: "Получить варианты и расчёт" }),
  );

  await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({
      vehicleQuery: "Toyota RAV4",
      budgetRub: "3000000",
      deliveryCity: "Хабаровск",
      phone: "+79991234567",
    }),
    { kind: "default" },
  );
  expect(await screen.findByText("Заявка принята")).toBeVisible();
  expect(screen.getByText("Toyota RAV4")).toBeVisible();
});
