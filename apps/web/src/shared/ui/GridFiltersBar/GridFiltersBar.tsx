import type { ReactNode } from "react";
import classes from "./GridFiltersBar.module.css";

type GridFiltersBarProps = {
  children: ReactNode;
};

export function GridFiltersBar({ children }: GridFiltersBarProps) {
  return <div className={classes.root}>{children}</div>;
}
