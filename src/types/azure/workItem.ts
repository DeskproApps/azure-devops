export interface IAzureWorkItem {
  id: number;
  rev: number;
  fields: IAzureWorkItemFields;
  url: string;
}

export interface IAzureWorkItemFieldsData {
  name: string;
  referenceName: string;
  description: string;
  type: string;
  usage: string;
  readOnly: boolean;
  canSortBy: boolean;
  isQueryable: boolean;
  supportedOperations: SupportedOperation[];
  isIdentity: boolean;
  isPicklist: boolean;
  isPicklistSuggested: boolean;
  url: string;
}

export interface SupportedOperation {
  referenceName: string;
  name: string;
}

export interface IAzureWorkItemFields {
  "System.AreaPath"?: string;
  "System.TeamProject": string;
  "System.IterationPath"?: string;
  "System.WorkItemType": string;
  "System.State"?: string;
  "System.Description"?: string;
  "System.Reason"?: string;
  "System.AssignedTo"?: System;
  "System.CreatedDate": string;
  "System.CreatedBy"?: System;
  "System.ChangedDate"?: string;
  "System.ChangedBy"?: System;
  "System.CommentCount"?: number;
  "System.Title": string;
  "Microsoft.VSTS.Common.Priority"?: string;
  "Microsoft.VSTS.Common.Severity"?: string;
  "Microsoft.VSTS.Common.Activity"?: string;
  "Microsoft.VSTS.Scheduling.OriginalEstimate"?: string;
  "Microsoft.VSTS.Scheduling.RemainingWork"?: string;
  "Microsoft.VSTS.Scheduling.CompletedWork"?: string;
  "Microsoft.VSTS.TCM.ReproSteps"?: string;
  "Microsoft.VSTS.TCM.SystemInfo"?: string;
  "Microsoft.VSTS.Common.Risk"?: string;
  "Microsoft.VSTS.Scheduling.Effort"?: string;
  "Microsoft.VSTS.Common.BusinessValue"?: string;
  "Microsoft.VSTS.Common.TimeCriticality"?: string;
  "Microsoft.VSTS.Scheduling.StartDate"?: string;
  "Microsoft.VSTS.Scheduling.TargetDate"?: string;
  "Microsoft.VSTS.Common.StackRank"?: string;
  "Microsoft.VSTS.Scheduling.DueDate"?: string;
  "Microsoft.VSTS.Scheduling.StoryPoints"?: string;
  "Microsoft.VSTS.Common.ValueArea"?: string;
  "Microsoft.VSTS.Build.FoundIn"?: string;
  "Microsoft.VSTS.Build.IntegrationBuild"?: string;
  "Microsoft.VSTS.Common.AcceptanceCriteria"?: string;
  "Microsoft.VSTS.Common.Resolution"?: string;
  "Microsoft.VSTS.CMMI.Blocked"?: string;
  "Microsoft.VSTS.Common.ResolvedReason"?: string;
  "Microsoft.VSTS.Scheduling.Size"?: string;
  "Microsoft.VSTS.Common.Triage"?: string;
  "Microsoft.VSTS.Common.Discipline"?: string;
  "Microsoft.VSTS.CMMI.RootCause"?: string;
  "Microsoft.VSTS.CMMI.Symptom"?: string;
  "Microsoft.VSTS.CMMI.ProposedFix"?: string;
  "Microsoft.VSTS.CMMI.Justification"?: string;
  "Microsoft.VSTS.CMMI.ImpactOnArchitecture"?: string;
  "Microsoft.VSTS.CMMI.ImpactOnUserExperience"?: string;
  "Microsoft.VSTS.CMMI.ImpactOnTest"?: string;
  "Microsoft.VSTS.CMMI.ImpactOnDevelopment"?: string;
  "Microsoft.VSTS.CMMI.ImpactOnTechnicalPublications"?: string;
  Integrated?: string;
  "Microsoft.VSTS.CMMI.Escalate"?: string;
  "Microsoft.VSTS.CMMI.TargetResolveDate"?: string;
  "Microsoft.VSTS.CMMI.ImpactAssessmentHtml"?: string;
  Plan?: string;
  "Microsoft.VSTS.CMMI.CorrectiveActionActualResolution"?: string;
  "Microsoft.VSTS.CMMI.Committed"?: string;
  "Microsoft.VSTS.CMMI.ContingencyPlan"?: string;
  "Microsoft.VSTS.CMMI.Probability"?: string;
  "Microsoft.VSTS.Scheduling.FinishDate"?: string;
  "System.Tags"?: string;
}

export interface System {
  displayName: string;
  url: string;
  _links: Links;
  id: string;
  uniqueName: string;
  imageUrl: string;
  descriptor: string;
}

export interface Links {
  avatar: Avatar;
}

export interface Avatar {
  href: string;
}

export interface IAzureWorkItemWiql {
  queryType: string;
  asOf: string;
  columns: Column[];
  sortColumns: SortColumn[];
  workItems: WorkItem[];
}

export interface Column {
  referenceName: string;
  name: string;
  url: string;
}

export interface SortColumn {
  field: Column;
  descending: boolean;
}

export interface WorkItem {
  id: number;
  url: string;
}

export interface IAzureWorkItemType {
  id: string;
  name: string;
  description: string;
  url: string;
  inherits: null;
  class: string;
  color: string;
  icon: string;
  isDisabled: boolean;
}

export interface IAzureWorkItemTypeFields {
  defaultValue: null;
  allowedValues: string[];
  helpText: string;
  alwaysRequired: boolean;
  dependentFields: DependentField[];
  referenceName: string;
  name: string;
  url: string;
}

export interface DependentField {
  referenceName: string;
  name: string;
  url: string;
}
