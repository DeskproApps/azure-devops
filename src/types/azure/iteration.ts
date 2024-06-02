export interface IAzureIteration {
  id: string;
  name: string;
  path: string;
  attributes: Attributes;
  url: string;
}

export interface Attributes {
  startDate: Date;
  finishDate: Date;
  timeFrame: string;
}
