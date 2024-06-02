import { normalizeFormValues } from "../utils";
import mockValues from "./requiredFieldsValues.json";

describe("WorkItemForm", () => {
  describe("utils", () => {
    describe("normalizeFormValues", () => {
      test("should normalize values", () => {
        expect(normalizeFormValues(mockValues)).toStrictEqual({
          "Microsoft.VSTS.Scheduling.StartDate": "2024-05-31T21:00:00.000Z",
          "Microsoft.VSTS.Scheduling.DueDate": "2024-05-31T21:00:00.000Z",
          "Custom.Booleanfiled": true,
          "Custom.DecimalField": "100.500",
          "Custom.IdentityField": "bnd.dXBuOldpbmRvd3MgTGl2ZSBJRFxhcnlhLnN0YXJrQHdpbnRlcmZlbGwuZ292",
          "Custom.PicklistStringField": "Picklist Item Three",
          "Custom.PicklistIntegerField": "1",
          "Custom.TextSingleLineField": "Text Single Line Field Text Single Line Field Text Single Line Field",
          "Custom.PicklistStringFieldwithuservalues": "Picklist Item Two",
          "Custom.PicklistIntegerFieldwithuservalues": "5",
          "Custom.TextMultipleLines": "Text Multiple Lines\n\n---\nbest regards, but not today\nArya Stark",
          "Custom.IntegerField": "100500",
        });
      });

      test.each([undefined, null, "", 0, true, false, {}])("wrong value: %p", (payload) => {
        expect(normalizeFormValues(payload as never)).toStrictEqual({});
      });
    });
  });
});
