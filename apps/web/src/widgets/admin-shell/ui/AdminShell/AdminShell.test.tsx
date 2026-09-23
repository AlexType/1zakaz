import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { IconCar } from "@tabler/icons-react";
import { expect, it, vi } from "vitest";
import { AdminShell } from "./AdminShell";

it("shows only permitted sections and delegates navigation", async () => {
  const navigate = vi.fn();
  render(
    <MantineProvider>
      <AdminShell
        section="cars"
        personName="Анна Петрова"
        roleLabel="Менеджер"
        canManageStaff={false}
        searchItems={[
          {
            id: "car-corolla",
            label: "Toyota Corolla Cross, 2022",
            description: "Автомобиль · опубликован",
            group: "Автомобили",
            section: "cars",
            icon: IconCar,
          },
        ]}
        onNavigate={navigate}
        onLogout={vi.fn()}
      >
        <div>Каталог</div>
      </AdminShell>
    </MantineProvider>,
  );
  const navigation = screen.getByRole("navigation", { name: "Разделы панели" });
  expect(
    within(navigation).queryByRole("button", { name: "Сотрудники" }),
  ).not.toBeInTheDocument();
  expect(
    within(navigation).queryByRole("button", { name: "Сайт" }),
  ).not.toBeInTheDocument();
  expect(
    within(navigation).queryByRole("button", { name: "Справочники" }),
  ).not.toBeInTheDocument();
  fireEvent.click(within(navigation).getByRole("button", { name: "Заявки" }));
  expect(navigate).toHaveBeenCalledWith("leads");
  fireEvent.click(within(navigation).getByRole("button", { name: "Статьи" }));
  expect(navigate).toHaveBeenCalledWith("articles");
  expect(screen.queryByText("Работа")).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Открыть профиль" }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Меню пользователя: Анна Петрова" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Открыть поиск по панели" }),
  ).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: "Открыть поиск по панели" }),
  );
  const search = await screen.findByRole("textbox", {
    name: "Поиск по панели управления",
  });
  expect(search).toHaveAttribute(
    "placeholder",
    "Автомобиль, заявка, статья или сотрудник",
  );
  fireEvent.keyDown(search, { key: "Escape" });
  fireEvent.click(screen.getByRole("button", { name: "Свернуть меню" }));
  expect(
    screen.getByRole("button", { name: "Развернуть меню" }),
  ).toBeInTheDocument();
  expect(navigation.closest("[data-compact]")).toHaveAttribute(
    "data-compact",
    "true",
  );
});
