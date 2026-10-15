import type { BusinessConfig } from "./types";
import { demoGenerikConfig } from "./demo-generik";

const businessConfigs: BusinessConfig[] = [demoGenerikConfig];

// Validate slug uniqueness at index load time
const registeredSlugs = new Set<string>();
for (const config of businessConfigs) {
  if (registeredSlugs.has(config.slug)) {
    throw new Error(`Duplicate business slug detected: "${config.slug}"`);
  }
  registeredSlugs.add(config.slug);
}

const configMap = new Map<string, BusinessConfig>(
  businessConfigs.map((config) => [config.slug, config]),
);

export function getBusinessConfig(slug: string): BusinessConfig | undefined {
  return configMap.get(slug);
}

export function getAllBusinessSlugs(): string[] {
  return businessConfigs.map((config) => config.slug);
}

export * from "./types";

