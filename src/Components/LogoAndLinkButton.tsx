import { Stack } from "@deskpro/app-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

import { AzureIcon } from "./AzureIcon";

export const LogoAndLinkButton = ({
  itemId,
  organizationId,
  projectId,
}: {
  itemId: number;
  organizationId: string;
  projectId: string;
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
          `https://dev.azure.com/${organizationId}/${projectId}/_workitems/edit/${itemId}/`
        )
      }
    >
      <AzureIcon />
      <FontAwesomeIcon
        icon={faArrowUpRightFromSquare}
        style={{
          marginLeft: "10px",
          alignSelf: "center",
          width: "10px",
        }}
      ></FontAwesomeIcon>
    </Stack>
  );
};
