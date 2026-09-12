import { describe, expect, it } from "vitest";
import {
  catalogAvailabilityLabel,
  connectionStatusLabel,
  parseConnectorReturnParams,
} from "@/hooks/useBusinessConnectors";

describe("business connector UI helpers", () => {
  it("maps connection statuses for display", () => {
    expect(connectionStatusLabel("active")).toBe("Connected");
    expect(connectionStatusLabel("action_required")).toBe("Action required");
    expect(connectionStatusLabel("revoked")).toBe("Disconnected");
  });

  it("does not present unavailable providers as connectable", () => {
    expect(
      catalogAvailabilityLabel({
        providerKey: "xendit",
        displayName: "Xendit",
        shortDescription: "Connect Xendit to import payment and settlement activity",
        authorizationType: "api_key",
        environments: ["sandbox"],
        available: false,
        pilotRequired: true,
      }),
    ).toBe("Pilot access");
  });

  it("parses OAuth return params without requiring callback replay", () => {
    expect(parseConnectorReturnParams("?connector=connected")).toEqual({
      kind: "success",
      message: "Source connected successfully.",
    });
    expect(parseConnectorReturnParams("?connector=error&reason=denied")).toEqual(
      {
        kind: "failure",
        message: "Connection was cancelled.",
      },
    );
    expect(parseConnectorReturnParams("")).toBeNull();
  });
});
