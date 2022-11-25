import { v4 as uuidv4 } from "uuid";
import { useMemo, useState } from "react";
import {
  adminGenericProxyFetch,
  useDeskproAppClient,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";

import { Settings } from "../types/settings";
import { preInstallGetCurrentUser } from "../api/preInstallApi";

export const useGlobalAuth = () => {
  const { client } = useDeskproAppClient();
  const key = useMemo(() => uuidv4(), []);

  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);
  const [poll, setPoll] = useState<(() => Promise<{ token: string }>) | null>(
    null
  );
  const [settings, setSettings] = useState<Settings | null>(null);
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

  useDeskproAppEvents(
    {
      onAdminSettingsChange: setSettings,
    },
    []
  );

  useInitialisedDeskproAppClient(
    (client) => {
      (async () => {
        const { callbackUrl, poll } = await client
          .oauth2()
          .getAdminGenericCallbackUrl(
            key,
            /\?code=(?<token>.+?)&/,
            // eslint-disable-next-line no-useless-escape
            /&state=(?<key>[a-f0-9\-]{36})/
          );

        setCallbackUrl(callbackUrl);
        setPoll(() => poll);
      })();
    },
    [key]
  );

  const signOut = () => {
    client?.setAdminSetting("");
    setUser(null);
    setAccessCode(null);
  };

  useInitialisedDeskproAppClient(
    (client) => {
      (async () => {
        if (
          settings?.global_access_token &&
          settings?.app_id &&
          settings?.client_secret
        ) {
          setUser(await preInstallGetCurrentUser(client, settings as Settings));
        }
      })();
    },
    [settings?.global_access_token, settings?.app_id, settings?.client_secret]
  );

  const signIn = async () => {
    if (!callbackUrl || !poll) return false;

    window.open(
      `https://app.vssps.visualstudio.com/oauth2/authorize?client_id=${
        settings?.app_id
      }&response_type=Assertion&state=${key}&scope=${encodeURIComponent(
        "vso.graph vso.project vso.work"
      )}&redirect_uri=${encodeURIComponent(callbackUrl)}`
    );

    const token = (await poll())?.token;

    if (!token) return false;

    setAccessCode(token);

    return true;
  };

  useInitialisedDeskproAppClient(
    (client) => {
      if (
        ![
          accessCode,
          callbackUrl,
          settings?.app_id,
          settings?.client_secret,
        ].every((e) => e)
      )
        return;
      (async () => {
        const fetch = await adminGenericProxyFetch(client);

        const params = new URLSearchParams({
          client_assertion_type:
            "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
          client_assertion: settings?.client_secret as string,
          grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
          assertion: accessCode as string,
          redirect_uri: new URL(callbackUrl as string).toString(),
        });

        const response = await fetch(
          `https://app.vssps.visualstudio.com/oauth2/token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
          }
        ).then((res) => res.json());

        const tokens = {
          access_token: response.access_token as string,
          refresh_token: response.refresh_token as string,
          redirect_uri: new URL(callbackUrl as string).toString(),
        };

        client.setAdminSetting(JSON.stringify(tokens));
      })();
    },
    [accessCode, callbackUrl, settings?.app_id, settings?.client_secret]
  );

  return {
    user,
    callbackUrl,
    poll,
    key,
    setAccessCode,
    signIn,
    signOut,
  };
};
