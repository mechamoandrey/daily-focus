import { coreMessages } from "./messagesCore";
import { extendedMessages } from "./messagesExtended";
export const messages = {
  pt: {
    ...coreMessages.pt,
    ...extendedMessages.pt
  },
  en: {
    ...coreMessages.en,
    ...extendedMessages.en
  }
};
