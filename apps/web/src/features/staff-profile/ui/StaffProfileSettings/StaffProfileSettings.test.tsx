import { MantineProvider } from "@mantine/core";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import {
  demoProfile,
  demoProfileActions,
} from "../../lib/stories/profile-examples";
import { StaffProfileSettings } from "./StaffProfileSettings";

afterEach(cleanup);

it("показывает профиль для просмотра и сохраняет отдельные части имени", async () => {
  const savePersonalDetails = vi.fn().mockResolvedValue(undefined);
  render(
    <MantineProvider>
      <StaffProfileSettings
        initialProfile={demoProfile}
        actions={{ ...demoProfileActions, savePersonalDetails }}
      />
    </MantineProvider>,
  );

  expect(screen.getByText("Петрова Анна Сергеевна")).toBeInTheDocument();
  expect(
    screen.queryByRole("textbox", { name: "Фамилия" }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("textbox", { name: "Номер телефона" }),
  ).not.toBeInTheDocument();

  fireEvent.click(screen.getAllByRole("button", { name: "Изменить" })[0]);
  fireEvent.change(screen.getByRole("textbox", { name: "Фамилия" }), {
    target: { value: "Иванова" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: "Отчество" }), {
    target: { value: "" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Сохранить" }));

  await waitFor(() =>
    expect(savePersonalDetails).toHaveBeenCalledWith({
      lastName: "Иванова",
      firstName: "Анна",
      patronymic: "",
    }),
  );
  expect(await screen.findByText("Иванова Анна")).toBeInTheDocument();
  expect(
    screen.queryByRole("textbox", { name: "Фамилия" }),
  ).not.toBeInTheDocument();
});

it("редактирует номер только после явного перехода и сохраняет нормализованное значение", async () => {
  const updatePhone = vi.fn().mockResolvedValue(undefined);
  render(
    <MantineProvider>
      <StaffProfileSettings
        initialProfile={demoProfile}
        actions={{ ...demoProfileActions, updatePhone }}
      />
    </MantineProvider>,
  );

  fireEvent.click(screen.getAllByRole("button", { name: "Изменить" })[1]);
  const input = screen.getByRole("textbox", { name: "Номер телефона" });
  fireEvent.change(input, { target: { value: "+7 (999) 123-45-68" } });
  fireEvent.click(screen.getByRole("button", { name: "Сохранить" }));

  await waitFor(() => expect(updatePhone).toHaveBeenCalledWith("+79991234568"));
  expect(await screen.findByText("+7 (999) 123-45-68")).toBeInTheDocument();
  expect(
    screen.queryByRole("textbox", { name: "Номер телефона" }),
  ).not.toBeInTheDocument();
});

it("вставляет номер с 8 без потери первой цифры и возвращает фокус в поле", async () => {
  render(
    <MantineProvider>
      <StaffProfileSettings
        initialProfile={demoProfile}
        actions={demoProfileActions}
      />
    </MantineProvider>,
  );

  fireEvent.click(screen.getAllByRole("button", { name: "Изменить" })[1]);
  fireEvent.paste(screen.getByRole("textbox", { name: "Номер телефона" }), {
    clipboardData: { getData: () => "8 912 345 67 89" },
  });

  const input = screen.getByRole("textbox", { name: "Номер телефона" });
  await waitFor(() => expect(input).toHaveValue("+7 (912) 345-67-89"));
  expect(document.activeElement).toBe(input);
});
