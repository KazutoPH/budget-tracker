export const navList = [
  {
    name: "Dashboard",
    link: "/",
  },
  {
    name: "Transactions",
    link: "/transactions",
  },
  {
    name: "Manage",
    link: "/manage",
  },
];

export const currencies = [
  { value: "PHP", label: "₱ Peso", locale: "en-PH" },
  { value: "USD", label: "$ Dollar", locale: "en-US" },
  { value: "EUR", label: "€ Euro", locale: "de-DE" },
  { value: "JPY", label: "¥ Yen", locale: "ja-JP" },
  { value: "GBP", label: "£ Pound", locale: "en-GB" },
];

export type Currency = (typeof currencies)[0];
