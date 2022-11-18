import { useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { getProjectList, getWorkItems, test } from "../api/api";
import { useDeskpro } from "../hooks/deskproContext";

export const Main = () => {
  const deskpro = useDeskpro();

  useInitialisedDeskproAppClient(
    (client) => {
      if (!deskpro) return;

      (async () => {
        console.log(await test(client, deskpro.settings));
      })();
    },
    [deskpro]
  );
  return <h1>aa</h1>;
};
