export default interface IDeskproContext {
  user: {
    emails: string[];
    firstName: string;
    id: string;
    lastName: string;
    primaryEmail: string;
    orgName: string;
    ticket: {
      id: string;
    };
    organization: string;
  };
  settings: {
    [key: string]: string;
  };
  ticket: {
    [key: string]: string;
  };
}
