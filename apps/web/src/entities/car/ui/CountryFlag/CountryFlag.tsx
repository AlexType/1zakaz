import { Image } from "@mantine/core";
import { getPublicAssetPath } from "@/shared/lib/get-public-asset-path";
import type { CarCountry } from "../../model/catalog-car";
import { COUNTRY_LABELS } from "../../model/catalog-options";
import classes from "./CountryFlag.module.css";

const flags: Record<CarCountry, string> = {
  japan: getPublicAssetPath("/flags/jp.svg"),
  china: getPublicAssetPath("/flags/cn.svg"),
  korea: getPublicAssetPath("/flags/kr.svg"),
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
