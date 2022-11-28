export interface Settings {
  app_id?: string;
  client_secret?: string;
  global_access_token?: string;
  organization?: string;
}
export type AuthTokens = {
  access_token: string;
  refresh_token: string;
};
