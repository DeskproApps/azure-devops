import { toMarkdown } from "../utils";

describe("Markdown", () => {
  describe("toMarkdown", () => {
    test("should return string as a Markdown", () => {
      expect(toMarkdown("<p>this is paragraph</p>")).toBe("this is paragraph");
    });
  });
});
