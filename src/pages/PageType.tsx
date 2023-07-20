import { Stack, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { Radio } from "@deskpro/deskpro-ui";
import { useState } from "react";

export const PageType = () => {
  const [pageType, setPageType] = useState<string | null>(null);

  useInitialisedDeskproAppClient(
    (client) => {
      if (!pageType) return;
      console.log(pageType);
      client.setAdminSetting(pageType);
    },
    [pageType]
  );

  return (
    <Stack gap={10}>
      <Radio
        checked={pageType === "cloud"}
        onChange={() => setPageType("cloud")}
        label="Cloud"
      />
      <Radio
        checked={pageType === "premise"}
        onChange={() => setPageType("premise")}
        label="On Premise"
      />
    </Stack>
  );
};
