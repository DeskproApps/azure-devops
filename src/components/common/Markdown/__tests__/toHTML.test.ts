import { toHTML } from "../utils";

describe("Markdown", () => {
  describe("toHTML", () => {
    test("should return string as a HTML", () => {
      expect(toHTML("this is paragraph")).toBe("<p>this is paragraph</p>");
    });
  });
});
