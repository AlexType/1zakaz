import { Image } from "@mantine/core";
import type { CarCountry } from "../../model/catalog-car";
import { COUNTRY_LABELS } from "../../model/catalog-options";
import classes from "./CountryFlag.module.css";

const flags: Record<CarCountry, string> = {
  japan: "/flags/jp.svg",
  china: "/flags/cn.svg",
  korea: "/flags/kr.svg",
};

export function CountryFlag({ country }: { country: CarCountry }) {
  return (
    <Image
      src={flags[country]}
      alt={COUNTRY_LABELS[country]}
      w={26}
      h={20}
      fit="cover"
      className={classes.flag}
    />
  );
}
