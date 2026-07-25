import {
  mergeSmartSearchSettings,
  type SmartSearchSettings,
} from "../../site-plugins/smart-search/smartSearchUtils";

export function mergePluginSettings(
  stored?: Partial<SmartSearchSettings> | null
): SmartSearchSettings {
  return mergeSmartSearchSettings(stored);
}
