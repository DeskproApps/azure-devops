# Azure Devops App Setup

[![](/docs/assets/setup/third_party_access.png)](/docs/assets/setup/third_party_access.png)

To install the Azure Devops app, you must first enable "Third-party application access via OAuth" in the link below.

`https://dev.azure.com/mycompany/_settings/organizationPolicy`, where mycompany is your company name found in the Azure Devops URL e.g. this will be `mycompany` in this url.

[![](/docs/assets/setup/empty_callback.png)](/docs/assets/setup/empty_callback.png)

After this, please head on to `https://app.vsaex.visualstudio.com/app/register?mkt=en-US` and fill in the information, but leave Authorization Callback URL empty for now.

[![](/docs/assets/setup/scopes.png)](/docs/assets/setup/scopes.png)

On the Authorized scopes, please mark Work items (read), Project and teams (read) and Graph (read), in order to give permissions to the app.

Now, please navigate to the "Settings" tab of the Azure Devops app in admin.

[![](/docs/assets/setup/admin_page.png)](/docs/assets/setup/admin_page.png)

On this screen please grab the Callback URL and paste it on the Callback URL field that was left empty on the register page, and click Create Application.

On the Deskpro Settings page, enter the following details:

- **Azure App Id** - The Azure App Id found on the created application page.
- **Azure Organization Name** - this is your company name found in your Azure Devops URL, e.g. this will be `mycompany` if your Pipedrive URL is `https://dev.azure.com/mycompany/`.
- **Azure Client Secret** - The Azure Client Secret found on the created application page.

[![](/docs/assets/setup/accept_page.png)](/docs/assets/setup/accept_page.png)

On this page, just click Accept in order to accept the permissions for the app, and once you see "Authorization has been completed" the app has been successfully installed.

[![](/docs/assets/setup/complete.png)](/docs/assets/setup/complete.png)
