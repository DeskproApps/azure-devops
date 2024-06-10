/** Date */
export const LOCALE = "en-GB";

/** Deskpro */
export const ENTITY = "linkedAzureItems";

export const DEFAULT_ERROR = "There was an error!";

export const AUTH_ERROR = "Go back to the admin settings form for the app and re-auth from there";

export const AZURE_URL = "https://dev.azure.com";

/** Azure DevOps */
export const DEFAULT_FIELDS = {
  project: "System.TeamProject",
  workItemType: "System.WorkItemType",
  title: "System.Title",
  description: "System.Description",
  assignee: "System.AssignedTo",
  state: "System.State",
  area: "System.AreaPath",
  iteration: "System.IterationPath",
};

export const EXCLUDE_FIELDS = [
  "System.AreaId",
  "System.IterationId",
];
