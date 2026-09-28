import { ar } from "./ar";
import { en } from "./en";
import { es } from "./es";
import { he } from "./he";
import { ptBR } from "./ptBR";
import type { SaasMarketCopy } from "./types";

export const saasMarketCopy: Record<string, SaasMarketCopy> = {
  en,
  he,
  es,
  "pt-BR": ptBR,
  ar,
};
