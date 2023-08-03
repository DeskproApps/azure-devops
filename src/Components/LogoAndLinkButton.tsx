import { Stack } from "@deskpro/app-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

import { AzureIcon } from "./AzureIcon";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Settings } from "../types";

export const LogoAndLinkButton = ({
  settings,
  projectId,
  itemId,
}: {
  settings: Settings;
  projectId: string;
  itemId: string | number;
}) => {
  return (
    <Stack
      style={{
        backgroundColor: "#F3F5F7",
        borderRadius: "10px",
        padding: "2px 5px 2px 5px",
        marginLeft: "10px",
        cursor: "pointer",
      }}
      onClick={() =>
        window.open(
          settings.type === "cloud"
            ? `https://dev.azure.com/${settings.organization_collection}/${projectId}/_workitems/edit/${itemId}/`
            : `${settings.instance_url}/${settings.organization_collection}/${projectId}/_workitems/edit/${itemId}/`
        )
      }
    >
      <AzureIcon />
      <FontAwesomeIcon
        icon={faArrowUpRightFromSquare as IconProp}
        style={{
          marginLeft: "10px",
          alignSelf: "center",
          width: "10px",
        }}
      ></FontAwesomeIcon>
    </Stack>
  );
};
