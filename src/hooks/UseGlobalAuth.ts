import {
  adminGenericProxyFetch,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { preInstallGetCurrentUserCloud } from "../api/preInstallApi";
import { Settings } from "../types/settings";

export const useGlobalAuth = (
  setData: Dispatch<SetStateAction<Settings>>,
  data: Settings
) => {
  const key = useMemo(() => uuidv4(), []);

  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);
  const [poll, setPoll] = useState<(() => Promise<{ token: string }>) | null>(
    null
  );
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
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

  useInitialisedDeskproAppClient(
    (client) => {
      (async () => {
        console.log(data);
        if (data?.global_access_token && data?.app_id && data?.client_secret) {
          setUser(
            await preInstallGetCurrentUserCloud(client, data as Settings)
          );
        }
      })();
    },
    [data?.global_access_token, data?.app_id, data?.client_secret]
  );

  const signIn = async () => {
    if (!callbackUrl || !poll) return false;

    window.open(
      `https://app.vssps.visualstudio.com/oauth2/authorize?client_id=${
        data?.app_id
      }&response_type=Assertion&state=${key}&scope=${encodeURIComponent(
        "vso.graph vso.project vso.work_write"
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
        ![accessCode, callbackUrl, data?.app_id, data?.client_secret].every(
          (e) => e
        )
      )
        return;
      (async () => {
        const fetch = await adminGenericProxyFetch(client);

        const params = new URLSearchParams({
          client_assertion_type:
            "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
          client_assertion: data?.client_secret as string,
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

        setData((prev) => ({
          ...prev,
          global_access_token: tokens,
        }));
      })();
    },
    [accessCode, callbackUrl, data?.app_id, data?.client_secret]
  );

  return {
    user,
    callbackUrl,
    poll,
    key,
    setAccessCode,
    signIn,
  };
};
