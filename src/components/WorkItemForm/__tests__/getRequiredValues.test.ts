import { getRequiredValues } from "../utils";
import mockValues from "./requiredFieldsValues.json";

describe("WorkItemForm", () => {
  describe("utils", () => {
    describe("getRequiredValues", () => {
      test("should return values from required fields", () => {
        expect(getRequiredValues(mockValues)).toStrictEqual([
          {
            op: "add",
            from: null,
            path: "/fields/Microsoft.VSTS.Scheduling.StartDate",
            value: "2024-05-31T21:00:00.000Z",
          },
          {
            op: "add",
            from: null,
            path: "/fields/Microsoft.VSTS.Scheduling.DueDate",
            value: "2024-05-31T21:00:00.000Z",
          },
          {
            op: "add",
            from: null,
            path: "/fields/Custom.Booleanfiled",
            value: true,
          },
          {
            op: "add",
            from: null,
            path: "/fields/Custom.DecimalField",
            value: "100.500",
          },
          {
            op: "add",
            from: null,
            path: "/fields/Custom.IdentityField",
            value: "arya.stark@winterfell.gov",
          },
          {
            op: "add",
            from: null,
            path: "/fields/Custom.PicklistStringField",
            value: "Picklist Item Three",
          },
          {
            op: "add",
            from: null,
            path: "/fields/Custom.PicklistIntegerField",
            value: "1",
          },
          {
            op: "add",
            from: null,
            path: "/fields/Custom.TextSingleLineField",
            value: "Text Single Line Field Text Single Line Field Text Single Line Field",
          },
          {
            op: "add",
            from: null,
            path: "/fields/Custom.PicklistStringFieldwithuservalues",
            value: "Picklist Item Two",
          },
          {
            op: "add",
            from: null,
            path: "/fields/Custom.PicklistIntegerFieldwithuservalues",
            value: "5",
          },
          {
            op: "add",
            from: null,
            path: "/fields/Custom.TextMultipleLines",
            value: "Text Multiple Lines\n\n---\nbest regards, but not today\nArya Stark",
          },
          {
            op: "add",
            from: null,
            path: "/fields/Custom.IntegerField",
            value: "100500",
          },
        ]);
      });
    });
  });
});
