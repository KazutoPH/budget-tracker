import { currencies } from "@/constants";
import { z } from "zod";

export const UpdateUserCurrencySchema = z.object({
  currency: z.custom((value) => {
    // if currency exist
    const found = currencies.some((c) => c.value === value);

    if (!found) {
      throw new Error(`invalid currency: ${value}`);
    }

    return value;
  }),
});
