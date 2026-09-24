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

export function CountryFlag({
  country,
  decorative = false,
}: {
  country: CarCountry;
  decorative?: boolean;
}) {
  return (
    <Image
      src={flags[country]}
      alt={decorative ? "" : COUNTRY_LABELS[country]}
      aria-hidden={decorative || undefined}
      w={26}
      h={20}
      fit="cover"
      className={
        decorative ? `${classes.flag} ${classes.inline}` : classes.flag
      }
    />
  );
}
