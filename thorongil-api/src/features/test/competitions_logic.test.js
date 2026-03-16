const { test, describe } = require("node:test");
const assert = require("node:assert");
const mapper = require("../mapper");

describe("Competitions Mapper", () => {
  test("should map a competition correctly", () => {
    const input = {
      name: "Serie A",
      country: "Italy",
      type: "LEAGUE",
      metadata: { key: "value" },
    };
    const result = mapper.mapToCompetition(input);
    assert.strictEqual(result.name, "Serie A");
    assert.strictEqual(result.country, "Italy");
    assert.strictEqual(result.type, "LEAGUE");
    assert.deepStrictEqual(result.metadata, { key: "value" });
  });

  test("should provide empty metadata if missing", () => {
    const input = { name: "Serie A", country: "Italy", type: "LEAGUE" };
    const result = mapper.mapToCompetition(input);
    assert.deepStrictEqual(result.metadata, {});
  });
});
