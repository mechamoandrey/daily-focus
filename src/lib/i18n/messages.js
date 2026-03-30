import { coreMessages } from "./messagesCore";
import { extendedMessages } from "./messagesExtended";

/** @type {Record<"pt" | "en", Record<string, string>>} */
export const messages = {
  pt: { ...coreMessages.pt, ...extendedMessages.pt },
  en: { ...coreMessages.en, ...extendedMessages.en },
};
