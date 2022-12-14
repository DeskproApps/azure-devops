export interface IAzureComment {
  totalCount: number;
  count: number;
  comments: Comment[];
  nextPage: string;
  continuationToken: string;
}

export interface Comment {
  workItemId: number;
  commentId: number;
  version: number;
  text: string;
  createdBy: EdBy;
  createdDate: string;
  modifiedBy: EdBy;
  modifiedDate: string;
  isDeleted: boolean;
  url: string;
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
