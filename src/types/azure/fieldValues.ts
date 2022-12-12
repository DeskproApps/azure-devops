export interface IAzureFieldValues {
  field: Field;
  defaultValue: string;
  values: Value[];
  url: string;
  _links: Links;
}

export interface Links {
  self: AreaPathClassificationNodes;
  project: AreaPathClassificationNodes;
  team: AreaPathClassificationNodes;
  teamSettings: AreaPathClassificationNodes;
  areaPathClassificationNodes: AreaPathClassificationNodes;
}

export interface AreaPathClassificationNodes {
  href: string;
}

export interface Field {
  referenceName: string;
  url: string;
}

export interface Value {
  value: string;
  includeChildren: boolean;
}
