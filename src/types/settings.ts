export interface Settings {
  app_id?: string;
  client_secret?: string;
  global_access_token?: AuthTokens;
  organization?: string;
  type?: string;
}
export type AuthTokens = {
  access_token: string;
  refresh_token: string;
  redirect_uri: string;
};
