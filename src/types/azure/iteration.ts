export interface IAzureIteration {
  id: string;
  name: string;
  attributes: Attributes;
  url: string;
}

export interface Attributes {
  startDate: Date;
  finishDate: Date;
}
