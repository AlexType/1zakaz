import type {
  CalculationLine,
  CalculationRequest,
  CalculationResult,
} from "../../model/calculation";
import type {
  DemoRuleSet,
  RuleParameterId,
} from "../../model/calculation-rules";
import type { ExchangeRate, Expense } from "../../model/pricing-demo";
import { getEffectiveRate } from "../compare-pricing-drafts";

function getParameter(rules: DemoRuleSet, id: RuleParameterId) {
  const value = rules.parameters.find((item) => item.id === id)?.value;
  if (typeof value !== "number") throw new Error(`Не задан параметр ${id}`);
  return value;
}

function getVehicleAgeYears(request: CalculationRequest) {
  const now = new Date();
  return Math.max(
    0,
    (now.getFullYear() * 12 +
      now.getMonth() -
      (request.manufactureYear * 12 + request.manufactureMonth - 1)) /
      12,
  );
}

function calculateIndividualDuty(
  request: CalculationRequest,
  vehicleRub: number,
  euroRate: number,
  rules: DemoRuleSet,
) {
  const age = getVehicleAgeYears(request);
  const volume = request.engineVolumeCm3;

  if (request.powertrainType === "electric" || volume === null) {
    return Math.round(vehicleRub * 0.15);
  }

  if (age < 3) {
    const vehicleEuro = vehicleRub / euroRate;
    const band = rules.newVehicleDutyBands.find(
      (item) => item.maxValueEuro === null || vehicleEuro <= item.maxValueEuro,
    );
    if (
      !band ||
      typeof band.percent !== "number" ||
      typeof band.minimumEuroPerCm3 !== "number"
    ) {
      throw new Error("Не заполнена таблица пошлин для новых автомобилей");
    }
    return Math.round(
      Math.max(
        vehicleRub * (band.percent / 100),
        volume * band.minimumEuroPerCm3 * euroRate,
      ),
    );
  }

  const band = rules.usedVehicleDutyBands.find(
    (item) => item.maxVolumeCm3 === null || volume <= item.maxVolumeCm3,
  );
  if (!band)
    throw new Error("Не заполнена таблица пошлин для подержанных автомобилей");
  const rate = age <= 5 ? band.threeToFiveEuroPerCm3 : band.overFiveEuroPerCm3;
  if (typeof rate !== "number") throw new Error("Не заполнена ставка пошлины");
  return Math.round(volume * rate * euroRate);
}

function calculateRecyclingFee(
  request: CalculationRequest,
  rules: DemoRuleSet,
) {
  const age = getVehicleAgeYears(request);
  const preferentialRule = rules.recyclingRules.find((item) =>
    item.powertrains.includes(request.powertrainType),
  );
  const preferentialAllowed =
    request.importerType === "individual" &&
    request.usagePurpose === "personal" &&
    request.preferentialRecyclingEligible &&
    preferentialRule &&
    typeof preferentialRule.maxPowerHp === "number" &&
    request.systemPowerHp <= preferentialRule.maxPowerHp;

  if (preferentialAllowed) {
    const value =
      age > 3
        ? preferentialRule.overThreeYearsRub
        : preferentialRule.newVehicleRub;
    if (typeof value !== "number")
      throw new Error("Не заполнен льготный утильсбор");
    return value;
  }
  return getParameter(rules, "commercial-recycling-rub");
}

function createLine(
  line: Omit<CalculationLine, "status"> & {
    status?: CalculationLine["status"];
  },
): CalculationLine {
  return { status: "estimate", ...line };
}

// TODO(api): удалить клиентский расчёт после появления Calculation API. Backend
// должен использовать decimal, нормативные версии, серверную дату и проверки
// брокера; Storybook сохраняет эту функцию только как интерактивный прототип.
export async function createDemoCalculation(
  request: CalculationRequest,
  rates: ExchangeRate[],
  expenses: Expense[],
  rules: DemoRuleSet,
): Promise<CalculationResult> {
  const rate = rates.find((item) => item.currency === request.currency);
  const euroRate = rates.find((item) => item.currency === "EUR");
  const countryExpenses = expenses.filter(
    (item) => item.country === request.country,
  );
  if (
    !rate ||
    !euroRate ||
    countryExpenses.some((item) => item.amountRub === "")
  ) {
    throw new Error("Не все параметры заполнены");
  }

  const vehicleRub = Math.round(request.priceAmount * getEffectiveRate(rate));
  const duty =
    request.importerType === "individual"
      ? calculateIndividualDuty(
          request,
          vehicleRub,
          getEffectiveRate(euroRate),
          rules,
        )
      : Math.round(
          (vehicleRub * getParameter(rules, "company-duty-percent")) / 100,
        );
  const excise =
    request.importerType === "company"
      ? Math.round(
          request.systemPowerHp *
            getParameter(rules, "company-excise-per-hp-rub"),
        )
      : 0;
  const vat =
    request.importerType === "company"
      ? Math.round(
          ((vehicleRub + duty + excise) * getParameter(rules, "vat-percent")) /
            100,
        )
      : 0;
  const bankFee = Math.round(
    (vehicleRub * getParameter(rules, "bank-fee-percent")) / 100,
  );
  const insurance = Math.round(
    (vehicleRub * getParameter(rules, "insurance-percent")) / 100,
  );
  const companyFee = Math.round(
    (vehicleRub * getParameter(rules, "company-fee-percent")) / 100,
  );
  const destination = rules.deliveryTariffs.find(
    (item) => item.city === request.destinationCity,
  );
  if (!destination || destination.amountRub === "")
    throw new Error("Не задан тариф доставки");

  const lines: CalculationLine[] = [
    createLine({
      id: "vehicle",
      label: "Цена автомобиля",
      category: "vehicle",
      amountRub: vehicleRub,
      status: "calculated",
      source: rate.source,
    }),
    ...countryExpenses.map((item) =>
      createLine({
        id: item.id,
        label: item.label,
        category: item.category,
        amountRub: Number(item.amountRub),
        source: "Тариф направления",
      }),
    ),
    createLine({
      id: "bank-fee",
      label: "Оплата и конвертация",
      category: "payment",
      amountRub: bankFee,
      source: "Тариф компании",
    }),
    createLine({
      id: "insurance",
      label: "Страхование перевозки",
      category: "international",
      amountRub: insurance,
      source: "Тариф компании",
    }),
    createLine({
      id: "duty",
      label: "Таможенная пошлина",
      category: "customs",
      amountRub: duty,
      source: "Демонстрационная таблица ставок",
    }),
    createLine({
      id: "customs-fee",
      label: "Таможенный сбор",
      category: "customs",
      amountRub: getParameter(rules, "customs-clearance-rub"),
      source: "Демонстрационное правило",
    }),
    createLine({
      id: "recycling",
      label: "Утилизационный сбор",
      category: "customs",
      amountRub: calculateRecyclingFee(request, rules),
      source: "Демонстрационная таблица ставок",
    }),
  ];

  if (request.importerType === "company") {
    lines.push(
      createLine({
        id: "excise",
        label: "Акциз",
        category: "customs",
        amountRub: excise,
        source: "Демонстрационное правило",
      }),
      createLine({
        id: "vat",
        label: "НДС",
        category: "customs",
        amountRub: vat,
        source: "Демонстрационное правило",
      }),
    );
  }

  lines.push(
    createLine({
      id: "broker",
      label: "Таможенный представитель",
      category: "services",
      amountRub: getParameter(rules, "broker-rub"),
      source: "Тариф компании",
    }),
    createLine({
      id: "storage",
      label: "СВХ и терминал",
      category: "services",
      amountRub: getParameter(rules, "storage-rub"),
      source: "Тариф компании",
    }),
    createLine({
      id: "sbkts",
      label: "СБКТС и лаборатория",
      category: "certification",
      amountRub: getParameter(rules, "certification-rub"),
      source: "Тариф партнёра",
    }),
    createLine({
      id: "epts",
      label: "Оформление ЭПТС",
      category: "certification",
      amountRub: getParameter(rules, "epts-rub"),
      source: "Тариф партнёра",
    }),
    createLine({
      id: "glonass",
      label: "ЭРА-ГЛОНАСС",
      category: "certification",
      amountRub: getParameter(rules, "glonass-rub"),
      source: "Тариф партнёра",
    }),
    createLine({
      id: "company",
      label: "Комиссия компании",
      category: "services",
      amountRub: companyFee,
      source: "Тариф компании",
    }),
    createLine({
      id: "destination",
      label: `Доставка: ${request.destinationCity}`,
      category: "domestic",
      amountRub: destination.amountRub,
      source: "Тариф доставки",
    }),
  );

  return {
    status: "estimate",
    calculatedAt: new Date().toISOString(),
    rulesRevision: rules.revision,
    rate: {
      currency: rate.currency,
      rubPerUnit: getEffectiveRate(rate),
      source: rate.mode === "manual" ? "Ручной курс" : rate.source,
      effectiveAt: rate.effectiveAt,
    },
    lines,
    totalRub: lines.reduce((sum, line) => sum + (line.amountRub ?? 0), 0),
    notice: "Предварительная смета по демонстрационной редакции правил.",
  };
}
