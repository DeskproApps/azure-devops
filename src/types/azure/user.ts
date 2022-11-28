export interface IAzureUser {
  subjectKind: string;
  domain: string;
  principalName: string;
  mailAddress: string;
  origin: string;
  originId: string;
  displayName: string;
  _links: Links;
  url: string;
  descriptor: string;
}

export interface Links {
  self: Avatar;
  memberships: Avatar;
  membershipState: Avatar;
  storageKey: Avatar;
  avatar: Avatar;
}

export interface Avatar {
  href: string;
}
