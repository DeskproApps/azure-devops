interface IWorkItemFields {
  [key: string]: {
    [key: string]: {
      name: string;
      field: string;
    }[];
  };
}

export const workItemFields: IWorkItemFields = {
  Agile: {
    Bug: [
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Severity",
        field: "Microsoft.VSTS.Common.Severity",
      },
      {
        name: "Activity",
        field: "Microsoft.VSTS.Common.Activity",
      },
      {
        name: "Original Estimate",
        field: "Microsoft.VSTS.Scheduling.OriginalEstimate",
      },
      {
        name: "Remaining",
        field: "Microsoft.VSTS.Scheduling.RemainingWork",
      },
      {
        name: "Completed",
        field: "Microsoft.VSTS.Scheduling.CompletedWork",
      },
      {
        name: "Repro Steps",
        field: "Microsoft.VSTS.TCM.ReproSteps",
      },
      {
        name: "System Info",
        field: "Microsoft.VSTS.TCM.SystemInfo",
      },
    ],
    Epic: [
      {
        name: "Risk",
        field: "Microsoft.VSTS.Common.Risk",
      },
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Effort",
        field: "Microsoft.VSTS.Scheduling.Effort",
      },
      {
        name: "Business Value",
        field: "Microsoft.VSTS.Common.BusinessValue",
      },
      {
        name: "Time Criticality",
        field: "Microsoft.VSTS.Common.TimeCriticality",
      },
      {
        name: "Start Date",
        field: "Microsoft.VSTS.Scheduling.StartDate",
      },
      {
        name: "Target Date",
        field: "Microsoft.VSTS.Scheduling.TargetDate",
      },
    ],
    Feature: [
      {
        name: "Risk",
        field: "Microsoft.VSTS.Common.Risk",
      },
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Effort",
        field: "Microsoft.VSTS.Scheduling.Effort",
      },
      {
        name: "Business Value",
        field: "Microsoft.VSTS.Common.BusinessValue",
      },
      {
        name: "Time Criticality",
        field: "Microsoft.VSTS.Common.TimeCriticality",
      },
      {
        name: "Start Date",
        field: "Microsoft.VSTS.Scheduling.StartDate",
      },
      {
        name: "Target Date",
        field: "Microsoft.VSTS.Scheduling.TargetDate",
      },
    ],
    Issue: [
      {
        name: "Stack Rank",
        field: "Microsoft.VSTS.Common.StackRank",
      },
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Due Date",
        field: "Microsoft.VSTS.Scheduling.DueDate",
      },
    ],
    Task: [
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Activity",
        field: "Microsoft.VSTS.Common.Activity",
      },
      {
        name: "Original Estimate",
        field: "Microsoft.VSTS.Scheduling.OriginalEstimate",
      },
      {
        name: "Remaining",
        field: "Microsoft.VSTS.Scheduling.RemainingWork",
      },
      {
        name: "Completed",
        field: "Microsoft.VSTS.Scheduling.CompletedWork",
      },
      {
        name: "Integrated in Build",
        field: "Microsoft.VSTS.Build.IntegrationBuild",
      },
    ],
    "Test Case": [
      {
        name: "Steps",
        field: "Microsoft.VSTS.TCM.Steps",
      },
    ],
    "User Story": [
      {
        name: "Risk",
        field: "Microsoft.VSTS.Common.Risk",
      },
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Story Points",
        field: "Microsoft.VSTS.Scheduling.StoryPoints",
      },
      {
        name: "Value area",
        field: "Microsoft.VSTS.Common.ValueArea",
      },
    ],
  },
  Basic: {
    Epic: [
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Start Date",
        field: "Microsoft.VSTS.Scheduling.StartDate",
      },
      {
        name: "Target Date",
        field: "Microsoft.VSTS.Scheduling.TargetDate",
      },
    ],
    Issue: [
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Effort",
        field: "Microsoft.VSTS.Scheduling.Effort",
      },
    ],
    Task: [
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Activity",
        field: "Microsoft.VSTS.Common.Activity",
      },
      {
        name: "Remaining Work",
        field: "Microsoft.VSTS.Scheduling.RemainingWork",
      },
    ],
  },
  Scrum: {
    Impediment: [
      {
        name: "Resolution",
        field: "Microsoft.VSTS.Common.Resolution",
      },
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
    ],
    Bug: [
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Severity",
        field: "Microsoft.VSTS.Common.Severity",
      },
      {
        name: "Activity",
        field: "Microsoft.VSTS.Common.Activity",
      },
      {
        name: "Effort",
        field: "Microsoft.VSTS.Scheduling.Effort",
      },
      {
        name: "Remaining Work",
        field: "Microsoft.VSTS.Scheduling.RemainingWork",
      },
      {
        name: "Found in Build",
        field: "Microsoft.VSTS.Build.FoundIn",
      },
      {
        name: "Integrated in Build",
        field: "Microsoft.VSTS.Build.IntegrationBuild",
      },
      {
        name: "Repro Steps",
        field: "Microsoft.VSTS.TCM.ReproSteps",
      },
      {
        name: "System Info",
        field: "Microsoft.VSTS.TCM.SystemInfo",
      },
      {
        name: "Acceptance Criteria",
        field: "Microsoft.VSTS.Common.AcceptanceCriteria",
      },
    ],
    Epic: [
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Effort",
        field: "Microsoft.VSTS.Scheduling.Effort",
      },
      {
        name: "Start Date",
        field: "Microsoft.VSTS.Scheduling.StartDate",
      },
      {
        name: "Target Date",
        field: "Microsoft.VSTS.Scheduling.TargetDate",
      },
      {
        name: "Time Criticality",
        field: "Microsoft.VSTS.Common.TimeCriticality",
      },
      {
        name: "Business Value",
        field: "Microsoft.VSTS.Common.BusinessValue",
      },
      {
        name: "Value Area",
        field: "Microsoft.VSTS.Common.ValueArea",
      },
      {
        name: "Acceptance Criteria",
        field: "Microsoft.VSTS.Common.AcceptanceCriteria",
      },
    ],
    Feature: [
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Effort",
        field: "Microsoft.VSTS.Scheduling.Effort",
      },
      {
        name: "Start Date",
        field: "Microsoft.VSTS.Scheduling.StartDate",
      },
      {
        name: "Target Date",
        field: "Microsoft.VSTS.Scheduling.TargetDate",
      },
      {
        name: "Integrated in Build",
        field: "Microsoft.VSTS.Build.IntegrationBuild",
      },
      {
        name: "Time Criticality",
        field: "Microsoft.VSTS.Common.TimeCriticality",
      },
      {
        name: "Business Value",
        field: "Microsoft.VSTS.Common.BusinessValue",
      },
      {
        name: "Value Area",
        field: "Microsoft.VSTS.Common.ValueArea",
      },
      {
        name: "Acceptance Criteria",
        field: "Microsoft.VSTS.Common.AcceptanceCriteria",
      },
    ],
    Inpediment: [
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Resolution",
        field: "Microsoft.VSTS.Common.Resolution",
      },
    ],
    "Product Backlog Item": [
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Effort",
        field: "Microsoft.VSTS.Scheduling.Effort",
      },
      {
        name: "Business Value",
        field: "Microsoft.VSTS.Common.BusinessValue",
      },
      {
        name: "Value Area",
        field: "Microsoft.VSTS.Common.ValueArea",
      },
      {
        name: "Acceptance Criteria",
        field: "Microsoft.VSTS.Common.AcceptanceCriteria",
      },
    ],
    Task: [
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Activity",
        field: "Microsoft.VSTS.Common.Activity",
      },
      {
        name: "Blocked",
        field: "Microsoft.VSTS.CMMI.Blocked",
      },
      {
        name: "Remaining Work",
        field: "Microsoft.VSTS.Scheduling.RemainingWork",
      },
    ],
    "Test Case": [
      {
        name: "Steps",
        field: "Microsoft.VSTS.TCM.Steps",
      },
    ],
  },
  CMMI: {
    Bug: [
      {
        name: "Resolved Reason",
        field: "Microsoft.VSTS.Common.ResolvedReason",
      },
      {
        name: "Size",
        field: "Microsoft.VSTS.Scheduling.Size",
      },
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Triage",
        field: "Microsoft.VSTS.Common.Triage",
      },
      {
        name: "Blocked",
        field: "Microsoft.VSTS.CMMI.Blocked",
      },
      {
        name: "Original Estimate",
        field: "Microsoft.VSTS.Scheduling.OriginalEstimate",
      },
      {
        name: "Remaining Work",
        field: "Microsoft.VSTS.Scheduling.RemainingWork",
      },
      {
        name: "Completed Work",
        field: "Microsoft.VSTS.Scheduling.CompletedWork",
      },
      {
        name: "Discipline",
        field: "Microsoft.VSTS.Common.Discipline",
      },
      {
        name: "Root Cause",
        field: "Microsoft.VSTS.CMMI.RootCause",
      },
      {
        name: "Repro Steps",
        field: "Microsoft.VSTS.TCM.ReproSteps",
      },
      {
        name: "Symptom",
        field: "Microsoft.VSTS.CMMI.Symptom",
      },
      {
        name: "System Info",
        field: "Microsoft.VSTS.TCM.SystemInfo",
      },
      {
        name: "Fix",
        field: "Microsoft.VSTS.CMMI.ProposedFix",
      },
    ],
    "Change Request": [
      {
        name: "Integrated in Build",
        field: "Microsoft.VSTS.Build.IntegrationBuild",
      },
      {
        name: "Original Estimate",
        field: "Microsoft.VSTS.Scheduling.OriginalEstimate",
      },
      {
        name: "Justification",
        field: "Microsoft.VSTS.CMMI.Justification",
      },
      {
        name: "Inpact on Architecture",
        field: "Microsoft.VSTS.CMMI.ImpactOnArchitecture",
      },
      {
        name: "Inpact on user experience",
        field: "Microsoft.VSTS.CMMI.ImpactOnUserExperience",
      },
      {
        name: "Inpact on test",
        field: "Microsoft.VSTS.CMMI.ImpactOnTest",
      },
      {
        name: "Inpact on design/development",
        field: "Microsoft.VSTS.CMMI.ImpactOnDevelopment",
      },
      {
        name: "Inpact on technical publications",
        field: "Microsoft.VSTS.CMMI.ImpactOnTechnicalPublications",
      },
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Triage",
        field: "Microsoft.VSTS.Common.Triage",
      },
      {
        name: "Blocked",
        field: "Microsoft.VSTS.CMMI.Blocked",
      },
      {
        name: "Integrated",
        field: "Integrated",
      },
    ],
    Epic: [
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Start Date",
        field: "Microsoft.VSTS.Scheduling.StartDate",
      },
      {
        name: "Target Date",
        field: "Microsoft.VSTS.Scheduling.TargetDate",
      },
      {
        name: "Triage",
        field: "Microsoft.VSTS.Common.Triage",
      },
      {
        name: "Effort",
        field: "Microsoft.VSTS.Scheduling.Effort",
      },
      {
        name: "Business Value",
        field: "Microsoft.VSTS.Common.BusinessValue",
      },
      {
        name: "Time Criticality",
        field: "Microsoft.VSTS.Common.TimeCriticality",
      },
      {
        name: "Value area",
        field: "Microsoft.VSTS.Common.ValueArea",
      },
    ],
    Feature: [
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Start Date",
        field: "Microsoft.VSTS.Scheduling.StartDate",
      },
      {
        name: "Target Date",
        field: "Microsoft.VSTS.Scheduling.TargetDate",
      },
      {
        name: "Triage",
        field: "Microsoft.VSTS.Common.Triage",
      },
      {
        name: "Effort",
        field: "Microsoft.VSTS.Scheduling.Effort",
      },
      {
        name: "Business Value",
        field: "Microsoft.VSTS.Common.BusinessValue",
      },
      {
        name: "Time Criticality",
        field: "Microsoft.VSTS.Common.TimeCriticality",
      },
      {
        name: "Value area",
        field: "Microsoft.VSTS.Common.ValueArea",
      },
    ],
    "Change request": [
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Triage",
        field: "Microsoft.VSTS.Common.Triage",
      },
      {
        name: "Escalate",
        field: "Microsoft.VSTS.CMMI.Escalate",
      },
      {
        name: "Original Estimate",
        field: "Microsoft.VSTS.Scheduling.OriginalEstimate",
      },
      {
        name: "Target Resolve Date",
        field: "Microsoft.VSTS.Scheduling.TargetDate",
      },
      {
        name: "Actual Resolve Date",
        field: "Microsoft.VSTS.CMMI.TargetResolveDate",
      },
    ],
    Requirement: [
      {
        name: "Impact Assessment",
        field: "Microsoft.VSTS.CMMI.ImpactAssessmentHtml",
      },
      {
        name: "Size",
        field: "Microsoft.VSTS.Scheduling.Size",
      },
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Triage",
        field: "Microsoft.VSTS.Common.Triage",
      },
      {
        name: "Blocked",
        field: "Microsoft.VSTS.CMMI.Blocked",
      },
      {
        name: "Committed",
        field: "Microsoft.VSTS.CMMI.Committed",
      },
    ],
    Risk: [
      {
        name: "Contingency Plan",
        field: "Microsoft.VSTS.CMMI.ContingencyPlan",
      },
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Severity",
        field: "Microsoft.VSTS.Common.Severity",
      },
      {
        name: "Blocked",
        field: "Microsoft.VSTS.CMMI.Blocked",
      },
      {
        name: "Original Estimate",
        field: "Microsoft.VSTS.Scheduling.OriginalEstimate",
      },
      {
        name: "Probability",
        field: "Microsoft.VSTS.CMMI.Probability",
      },
    ],
    Task: [
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Triage",
        field: "Microsoft.VSTS.Common.Triage",
      },
      {
        name: "Blocked",
        field: "Microsoft.VSTS.CMMI.Blocked",
      },
      {
        name: "Original Estimate",
        field: "Microsoft.VSTS.Scheduling.OriginalEstimate",
      },
      {
        name: "Remaining Work",
        field: "Microsoft.VSTS.Scheduling.RemainingWork",
      },
      {
        name: "Completed Work",
        field: "Microsoft.VSTS.Scheduling.CompletedWork",
      },
    ],
    "Test Case": [
      {
        name: "Steps",
        field: "Microsoft.VSTS.TCM.Steps",
      },
      {
        name: "Priority",
        field: "Microsoft.VSTS.Common.Priority",
      },
      {
        name: "Automation Status",
        field: "Microsoft.VSTS.TCM.AutomationStatus",
      },
    ],
  },
};
