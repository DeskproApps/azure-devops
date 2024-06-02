import { getDefaultValues } from "../utils";
import mockValues from "./defaultFieldsValues.json";

describe("WorkItemForm", () => {
  describe("utils", () => {
    describe("getDefaultValues", () => {
      test("should return values from default fields", () => {
        expect(getDefaultValues(mockValues)).toStrictEqual([
          {
            op: "add",
            from: null,
            path: "/fields/System.Title",
            value: "Some new title",
          },
          {
            op: "add",
            from: null,
            path: "/fields/System.Description",
            value: "Description Description Description Description Description Description Description Description\n\n---\nBest regards.",
          },
          {
            op: "add",
            from: null,
            path: "/fields/System.AssignedTo",
            value: "arya.stark@winterfell.gov",
          },
          {
            op: "add",
            from: null,
            path: "/fields/System.State",
            value: "6ed45131-6c30-4e82-a2d1-4920d944780c",
          },
          {
            op: "add",
            from: null,
            path: "/fields/System.AreaPath",
            value: "Basic Project",
          },
          {
            op: "add",
            from: null,
            path: "/fields/System.IterationPath",
            value: "Basic Project\\Spring 2",
          },
        ]);
      });
    });
  });
});
