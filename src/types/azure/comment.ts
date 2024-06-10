import type { IAzureWorkItem } from "./workItem";

export interface IAzureComment {
  totalCount: number;
  count: number;
  comments: Comment[];
  nextPage: string;
  continuationToken: string;
}

export interface Comment {
  format: "html";
  id: number;
  mentions: [];
  createdBy:EdBy;
  createdDate: string;
  modifiedBy: EdBy;
  modifiedDate: string;
  renderedText: string;
  text: string;
  url: string;
  version: number;
  workItemId: IAzureWorkItem["id"];
}

export interface EdBy {
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
