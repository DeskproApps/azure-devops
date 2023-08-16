export interface Settings {
  organization_collection?: string;
  account_name_pat_token?: string;
  type?: string;
  global_settings?: string;
  instance_url?: string;
  app_id?: string;
  client_secret?: string;
}

export type AuthTokens = {
  access_token?: string;
  refresh_token?: string;
  redirect_uri?: string;
  account_name?: string;
};
