import { currencies } from "@/constants";

export function DateToUTCDate(date: Date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  );
}

// get the formated value of currency
export function GetFormatterForCurrency(currency: string) {
  const locale = currencies.find((c) => c.value === currency)?.locale;

  // return formatted currency
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });
}
