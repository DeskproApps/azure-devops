import { format } from "../format";

describe("utils", () => {
  describe("date", () => {
    describe("format", () => {
      test("should return formatted date", () => {
        expect(format("2021-09-07T15:50:00Z")).toBe("07 Sept 2021");
      });

      test("should return formatted date with time", () => {
        expect(format("2021-09-07T15:50:00Z", { time: true }))
          .toBe("07 Sept 2021, 15:50");
      });

      test("should return formatted time", () => {
        expect(format("2021-09-07T15:50:00Z", { date: false, time: true }))
          .toBe("15:50");
      });

      test("should return undefined if it's not a date", () => {
        expect(format("20210907T155000Z")).toBeUndefined();
      });

      test.each([undefined, null, "", 0, true, false, {}])("wrong value: %p", (payload) => {
        expect(format(payload as never)).toBeUndefined();
      });
    });
  });
});
