export interface IWorkItem {
  id: string;
  state: "New" | "Closed";
  area: string;
  assignees: IAssignees[];
  iteration: string;
  reason: string;
  tickets: number;
  tags: string[];
  title: string;
}

interface IAssignees {
  id: string;
  name: string;
  avatar: string;
}
