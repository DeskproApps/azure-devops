import {
  H1,
  H2,
  LoadingSpinner,
  Stack,
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproAppTheme,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import parse from "html-react-parser";
import { Avatar } from "@deskpro/deskpro-ui";
import { useLocation, useNavigate } from "react-router-dom";
import x2js from "x2js";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  getCommentsByItemId,
  getProcessById,
  getProjectByName,
  getProjectPropertiesById,
  getWorkItemById,
  getWorkItemTypes,
} from "../api/api";
import { ItemPersistentData } from "../Components/Items/ItemPersistentData";
import { useDeskpro } from "../hooks/deskproContext";
import { GreyTitle } from "../styles";
import { useQueryWithClient } from "../utils/query";
import { timeSince } from "../utils/utils";
import { workItemFieldsItemDetails } from "../utils/workItemFieldsItemDetails";
import { IAzureProject } from "../types/azure/project";
import { IAzureWorkItem, IAzureWorkItemFields } from "../types/azure/workItem";

import { HorizontalDivider } from "../Components/HorizontalDivider";
import { MultipleFields } from "../Components/MultipleFields";
import { workItemFields } from "../utils/workItemFields";
import { BiggerH1 } from "../styles";

import { IconProp } from "@fortawesome/fontawesome-svg-core";

import { LogoAndLinkButton } from "../Components/LogoAndLinkButton";
import { Settings } from "../types";

const POSSIBLE_BOTTOM_FIELDS = [
  "Planning",
  "Schedule",
  "Effort",
  "Build",
  "Implementation",
  "Classification",
  "Details",
  "Status",
];

export const ItemDetails = () => {
  const { client } = useDeskproAppClient();
  const { theme } = useDeskproAppTheme();
  const navigate = useNavigate();
  const deskproData = useDeskpro();

  const search = useLocation().search;

  const [itemId, projectId] = [
    new URLSearchParams(search).get("itemId"),
    new URLSearchParams(search).get("projectId"),
  ];

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Work Item Details");

    client.registerElement("azureHomeButton", {
      type: "home_button",
      payload: {
        type: "changePage",
        page: "/",
      },
    });

    client.deregisterElement("azurePlusButton");

    client.registerElement("azureMenuButton", {
      type: "menu",
      items: [
        {
          title: "Unlink Item",
        },
      ],
    });

    client.registerElement("azureEditButton", {
      type: "edit_button",
    });
  });

  useDeskproAppEvents({
    onElementEvent(id) {
      switch (id) {
        case "azureMenuButton":
          if (!deskproData || !client) return;

          (async () => {
            await client
              .getEntityAssociation("linkedAzureItems", deskproData.ticket.id)
              .delete((itemId as string).toString());

            await client.setState(
              `azure/items/${itemId}`,
              (((
                await client.getState(`azure/items/${itemId}`)
              )[0]?.data as number) ?? 1) - 1
            );
            navigate("/redirect");
          })();
          break;
        case "azureHomeButton":
          navigate("/redirect");
          break;
        case "azureEditButton":
          navigate(`/edititem?itemId=${itemId}&projectId=${projectId}`);
          break;
      }
    },
  });

  const item = useQueryWithClient(
    ["item", deskproData],
    (client) =>
      getWorkItemById(
        client,
        deskproData?.settings || {},
        projectId as string,
        Number(itemId) as number
      ),
    {
      enabled: !!deskproData && !!itemId && !!projectId,
    }
  );

  const project = useQueryWithClient(
    ["specificProject", deskproData, projectId],
    (client) =>
      getProjectByName(
        client,
        deskproData?.settings || {},
        projectId as string
      ),
    {
      enabled: !!deskproData && !!projectId,
    }
  );

  const projectProperties = useQueryWithClient(
    ["projectProperties", deskproData, projectId],
    (client) =>
      getProjectPropertiesById(
        client,
        deskproData?.settings || {},
        (project.data as IAzureProject).id
      ),
    {
      enabled: !!deskproData && !!project.isSuccess,
    }
  );

  const specificProcess = useQueryWithClient(
    ["specificProcess", deskproData, projectProperties],
    (client) =>
      getProcessById(
        client,
        deskproData?.settings || {},
        projectProperties?.data?.value?.find(
          (e) => e.name === "System.ProcessTemplateType"
        )?.value as string
      ),
    {
      enabled: !!deskproData && !!projectProperties.isSuccess,
    }
  );

  const commentsReq = useQueryWithClient(
    ["comments", deskproData, projectId, itemId],
    (client) =>
      getCommentsByItemId(
        client,
        deskproData?.settings || {},
        projectId as string,
        Number(itemId) as number
      ),
    {
      enabled: !!deskproData && !!itemId && !!projectId,
    }
  );

  const workItemTypeList = useQueryWithClient(
    ["workItemTypeList", deskproData, specificProcess],
    (client) =>
      getWorkItemTypes(
        client,
        deskproData?.settings || {},
        specificProcess.data?.typeId as string
      ),
    {
      enabled: !!deskproData && !!specificProcess.isSuccess,
    }
  );

  const processName = specificProcess.data?.name as string;

  const workItemTypeName = workItemTypeList?.data?.value?.find(
    (workItemType) =>
      workItemType.id?.split(".").at(-1) ===
      (item?.data as IAzureWorkItem).fields["System.WorkItemType"]
        .split(" ")
        .join("")
  )?.name as string;

  const workItemFieldDetails =
    workItemFieldsItemDetails?.[processName]?.[workItemTypeName];

  const workItemFieldNames = workItemFields[processName]?.[workItemTypeName];

  const itemData = item.data;

  return [
    item,
    project,
    projectProperties,
    specificProcess,
    commentsReq,
    workItemTypeList,
  ].some((e) => e.isLoading) || !itemData ? (
    <Stack justify="center" style={{ width: "100%" }}>
      <LoadingSpinner />
    </Stack>
  ) : (
    <Stack vertical style={{ width: "100%" }} gap={8}>
      <Stack
        justify={"space-between"}
        style={{ width: "100%", alignItems: "center" }}
      >
        <H1>{itemData?.fields["System.Title"]}</H1>
        <div style={{ marginRight: "8px" }}>
          <LogoAndLinkButton
            settings={deskproData?.settings as Settings}
            itemId={Number(itemId as string)}
            projectId={projectId as string}
          />
        </div>
      </Stack>

      {itemData?.fields["System.Description"] && (
        <Stack vertical gap={2}>
          <GreyTitle theme={theme}>Description</GreyTitle>
          <H2>{parse(itemData?.fields["System.Description"] ?? "")}</H2>
        </Stack>
      )}
      {workItemFieldDetails?.Top &&
        workItemFieldDetails.Top.map((fieldName, i) => {
          const htmlFromAzure = item.data.fields[
            workItemFieldNames?.find((e) => e.name === fieldName)
              ?.field as keyof IAzureWorkItemFields
          ] as string;
          if (fieldName === "Steps") {
            const x2jsClass = new x2js();
            const document = x2jsClass.xml2js(htmlFromAzure);

            return (
              <Stack vertical style={{ width: "100%" }} key={i}>
                <HorizontalDivider />
                <Stack vertical gap={5}>
                  <BiggerH1>Steps</BiggerH1>
                  <Stack vertical gap={5}>
                    {(
                      document as {
                        steps: {
                          step: {
                            parameterizedString: { __text: string }[];
                          }[];
                        };
                      }
                    ).steps.step.map((e, k: number) => (
                      <Stack vertical key={k}>
                        <GreyTitle>Step {++k}</GreyTitle>
                        <Stack
                          style={{
                            fontSize: "12px",
                            color: theme.colors.grey_black100,
                          }}
                        >
                          {parse(
                            e.parameterizedString[0].__text
                              .toLowerCase()
                              .replaceAll("<p>", "")
                              .replaceAll("</p>", "") ?? ""
                          )}
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </Stack>
            );
          } else {
            return (
              <Stack vertical key={i}>
                <GreyTitle>{fieldName}</GreyTitle>
                <Stack
                  vertical
                  style={{
                    fontSize: "12px",
                    color: theme.colors.grey_black100,
                  }}
                >
                  {parse(htmlFromAzure ?? "")}
                </Stack>
              </Stack>
            );
          }
        })}
      <Stack vertical style={{ width: "100%" }}>
        <ItemPersistentData item={itemData}></ItemPersistentData>
      </Stack>
      {POSSIBLE_BOTTOM_FIELDS.map((fieldName, i) => {
        return (
          workItemFieldDetails?.[fieldName] && (
            <Stack vertical style={{ width: "100%" }} key={i}>
              <HorizontalDivider />
              <MultipleFields
                fieldName={fieldName}
                item={item?.data}
                processName={processName}
                data={workItemFieldDetails?.[fieldName]}
                workItemTypeName={workItemTypeName}
              />
            </Stack>
          )
        );
      })}
      {<HorizontalDivider />}
      {commentsReq.data?.comments && (
        <Stack vertical gap={5} style={{ width: "100%" }}>
          <Stack
            gap={5}
            style={{
              verticalAlign: "baseline",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <H1>Comments ({commentsReq.data.comments.length})</H1>
            <FontAwesomeIcon
              icon={faPlus as IconProp}
              size="sm"
              style={{
                alignSelf: "center",
                cursor: "pointer",
                marginBottom: "2px",
              }}
              onClick={() =>
                navigate(`/addcomment?itemId=${itemId}&projectId=${projectId}`)
              }
            ></FontAwesomeIcon>
          </Stack>
          <Stack vertical style={{ width: "100%" }}>
            {commentsReq.data.comments.map((comment, i) => {
              return (
                <Stack
                  key={i}
                  vertical
                  gap={5}
                  style={{ width: "100%", marginTop: "10px" }}
                >
                  <Stack
                    style={{ alignItems: "flex-start", marginTop: "10px" }}
                  >
                    <Stack
                      vertical
                      gap={3}
                      style={{
                        marginLeft: "5px",
                        alignItems: "center",
                      }}
                    >
                      <Avatar
                        size={22}
                        imageUrl={comment.createdBy.imageUrl}
                      ></Avatar>
                      <H2>
                        {timeSince(new Date(comment.createdDate)).slice(0, 5)}
                      </H2>
                    </Stack>
                    <div style={{ maxWidth: "20ch", marginLeft: "10px" }}>
                      <H2>{parse(comment.text ?? "")}</H2>
                    </div>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
