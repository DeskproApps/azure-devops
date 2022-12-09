interface IWorkItemFieldsItemDetails {
  [key: string]: {
    [key: string]: {
      [key: string]: string[];
    };
  };
}

export const workItemFieldsItemDetails: IWorkItemFieldsItemDetails = {
  Agile: {
    Bug: {
      Top: ["Repro Steps"],
      Planning: ["Priority", "Severity", "Activity"],
      Effort: ["Original Estimate", "Remaining", "Completed"],
    },
    Epic: {
      Planning: [
        "Risk",
        "Priority",
        "Effort",
        "Time Criticality",
        "Start Date",
        "Target Date",
      ],
      Classification: ["Business Value"],
    },
    Feature: {
      Planning: [
        "Risk",
        "Priority",
        "Effort",
        "Time Criticality",
        "Start Date",
        "Target Date",
      ],
      Classification: ["Business Value"],
    },
    Issue: { Planning: ["Stack Rank", "Priority", "Due Date"] },
    Task: {
      Planning: ["Priority", "Activity"],
      Effort: ["Original Estimate", "Remaining", "Completed"],
      Implementation: ["Integrated in Build"],
    },
    "Test Case": { Top: ["Steps"] },
    "User Story": { Planning: ["Risk", "Priority", "Story Points"] },
  },
  Basic: {
    Epic: { Planning: ["Priority", "Start Date", "Target Date"] },
    Issue: { Planning: ["Priority", "Effort"] },
    Task: { Planning: ["Priority", "Activity", "Remaining Work"] },
  },
  Scrum: {
    Impediment: {
      Top: ["Resolution"],
      Details: ["Priority"],
    },
    Bug: {
      Top: ["Repro Steps", "System Info", "Acceptance Criteria"],
      Details: ["Priority", "Severity", "Activity", "Effort", "Remaining Work"],
      Build: ["Found in Build", "Integrated in Build"],
    },
    Epic: {
      Status: ["Start Date", "Target Date"],
      Details: [
        "Priority",
        "Effort",
        "Time Criticality",
        "Business Value",
        "Value Area",
      ],
    },
    Feature: {
      Status: ["Start Date", "Target Date"],
      Details: [
        "Priority",
        "Effort",
        "Time Criticality",
        "Business Value",
        "Value Area",
      ],
      Top: ["Acceptance Criteria"],
    },
    Inpediment: {
      Details: ["Priority"],
      Resolution: ["Resolution"],
    },
    "Product Backlog Item": {
      Top: ["Acceptance Criteria"],
      Details: ["Priority", "Effort", "Business Value", "Value Area"],
    },
    Task: { Details: ["Priority", "Activity", "Blocked", "Remaining Work"] },
    "Test Case": { Top: ["Steps"] },
  },
  CMMI: {
    Bug: {
      Planning: [
        "Triage",
        "Resolved Reason",
        "Size",
        "Priority",
        "Triage",
        "Blocked",
      ],
      Top: ["Repro Steps", "Symptom", "System Info", "Fix"],
      Effort: ["Original Estimate", "Remaining Work", "Completed Work"],
      Classification: ["Root Cause", "Discipline"],
    },
    "Change Request": {
      Top: [
        "Justification",
        "Inpact on Architecture",
        "Inpact on user experience",
        "Inpact on test",
        "Inpact on design/development",
        "Inpact on technical publications",
      ],
      Planning: ["Triage", "Blocked", "Priority"],
      Effort: ["Original Estimate"],
      Build: ["Integrated in Build"],
    },
    Epic: {
      Planning: [
        "Priority",
        "Start Date",
        "Target Date",
        "Triage",
        "Effort",
        "Business Value",
        "Time Criticality",
      ],
      Classification: ["Value area"],
    },
    Feature: {
      Planning: [
        "Priority",
        "Start Date",
        "Target Date",
        "Triage",
        "Effort",
        "Business Value",
        "Time Criticality",
      ],
      Classification: ["Value area"],
    },
    Review: {
      Top: ["Analysis", "Plan", "Actual Resolution"],
      Planning: ["Triage", "Priority", "Escalate"],
      Effort: ["Original Estimate"],
    },
    Requirement: {
      Top: ["Impact Assessment"],
      Planning: ["Size", "Priority", "Triage", "Blocked", "Committed"],
      Effort: ["Original Estimate"],
      Schedule: ["Start Date"],
    },
    Risk: {
      Top: ["Contingency Plan"],
      Planning: ["Priority", "Severity", "Blocked", "Original Estimate"],
      Classification: ["Probability"],
    },
    Task: {
      Planning: ["Priority", "Triage", "Blocked"],
      Effort: ["Original Estimate", "Remaining Work", "Completed Work"],
      Schedule: ["Start Date", "Finish Date"],
    },
    "Test Case": {
      Top: ["Steps"],
      Status: ["Priority", "Automation Status"],
    },
  },
};
