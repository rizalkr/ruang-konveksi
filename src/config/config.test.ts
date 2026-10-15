import { describe, expect, it } from "vitest";
import { prospectTemplateConfig } from "./_template";
import { demoGenerikConfig } from "./demo-generik";
import { getAllBusinessSlugs, getBusinessConfig } from "./index";

describe("Business configurations and sample data integrity", () => {
  it("marks demo-generik alamat explicitly as sample/placeholder data", () => {
    expect(demoGenerikConfig.alamat).toContain("[Contoh]");
    expect(demoGenerikConfig.alamat.toLowerCase()).toContain("contoh");
    // Ensure no fictitious specific street numbers or misleading factual location
    expect(demoGenerikConfig.alamat).not.toContain("Jl. Contoh Industri Tekstil No. 00");
  });

  it("removes petaUrl from demo-generik to avoid misleading map links", () => {
    expect(demoGenerikConfig.petaUrl).toBeUndefined();
  });

  it("marks prospect template alamat as sample placeholder and clears petaUrl", () => {
    expect(prospectTemplateConfig.alamat).toContain("[Contoh]");
    expect(prospectTemplateConfig.petaUrl).toBeUndefined();
  });

  it("retrieves demo-generik successfully from getBusinessConfig", () => {
    const config = getBusinessConfig("demo-generik");
    expect(config).toBeDefined();
    expect(config?.nama).toBe("Rumah Konveksi");
  });

  it("returns undefined for unknown slugs", () => {
    const config = getBusinessConfig("unknown-slug-xyz");
    expect(config).toBeUndefined();
  });

  it("lists all available business slugs correctly", () => {
    const slugs = getAllBusinessSlugs();
    expect(slugs).toContain("demo-generik");
  });
});

