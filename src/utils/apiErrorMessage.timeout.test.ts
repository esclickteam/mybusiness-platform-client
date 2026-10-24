import { describe, expect, it } from "vitest";
import { getApiErrorMessage } from "./apiErrorMessage";

describe("getApiErrorMessage timeout", () => {
  it("maps the flattened Axios timeout to Hebrew leftover copy", () => {
    const message = getApiErrorMessage({
      isTimeout: true,
      code: "NETWORK_TIMEOUT",
      message: "Network timeout",
    });
    expect(message).not.toMatch(/AxiosError|ECONNABORTED|timeout of 20000/i);
    expect(message.length).toBeGreaterThan(10);
  });
});
