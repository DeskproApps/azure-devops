import {
  H1,
  H2,
  HorizontalDivider,
  LoadingSpinner,
  Stack,
  useDeskproAppClient,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import parse from "html-react-parser";
import { Avatar } from "@deskpro/deskpro-ui";
import { useLocation, useNavigate } from "react-router-dom";
import { getCommentsByItemId, getWorkItemById } from "../api/api";

import { ItemPersistentData } from "../Components/Items/ItemPersistentData";
// import { TwoColumn } from "../Components/TwoColumn";
import { useDeskpro } from "../hooks/deskproContext";
import { GreyTitle } from "../styles";
import { useQueryWithClient } from "../utils/query";
import { /*defaultInitialDataObj,*/ timeSince } from "../utils/utils";

export const ItemDetails = () => {
  const { client } = useDeskproAppClient();
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
              `azure/items/${projectId}/${itemId}`,
              (((
                await client.getState(`azure/items/${projectId}/${itemId}`)
              )[0]?.data as number) ?? 1) - 1
            );
            navigate("/redirect");
          })();
          break;
        case "azureHomeButton":
          navigate("/redirect");
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
      enabled: !!deskproData && !!itemId,
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

  const itemData = item.data;

  return !itemData ? (
    <Stack justify="center" style={{ width: "100%" }}>
      <LoadingSpinner />
    </Stack>
  ) : (
    <Stack vertical style={{ margin: "5px" }} gap={5}>
      <H1>{itemData?.fields["System.Title"]}</H1>
      {itemData?.fields["System.Description"] && (
        <Stack vertical gap={2}>
          <GreyTitle>Description</GreyTitle>
          <H2>{parse(itemData?.fields["System.Description"])}</H2>
        </Stack>
      )}
      {/* {item.type === "Bug" && (
        <Stack vertical gap={5}>
          <Stack vertical>
            <GreyTitle>Repro Steps</GreyTitle>
            <H2>{item.repro_steps.replaceAll("/n", <br />)}</H2>
          </Stack>
          <Stack vertical>
            <GreyTitle>System Info</GreyTitle>
            <H2>{item.system_info}</H2>
          </Stack>
        </Stack>
      )} */}
      <Stack style={{ marginTop: "12px" }}>
        <ItemPersistentData item={itemData}></ItemPersistentData>
      </Stack>
      <HorizontalDivider />
      {/* {item.methodology === "Agile" && (
        <Stack vertical>
          {item.type === "Bug" && (
            <Stack vertical style={{ width: "100%" }} gap={5}>
              <Stack vertical gap={12}>
                <H1>Planning</H1>
                <TwoColumn
                  leftLabel="Resolved Reason"
                  leftText="-"
                  rightLabel="Story Points"
                  rightText={item.story_points}
                />
                <TwoColumn
                  leftLabel="Priority"
                  leftText={item.priority}
                  rightLabel="Severity"
                  rightText={item.severity}
                />
                <TwoColumn
                  leftLabel="Activity"
                  leftText={item.activity}
                  rightLabel=""
                  rightText=""
                />
              </Stack>
              <HorizontalDivider />
            </Stack>
          )}
          {item.type === "Issue" && (
            <Stack vertical gap={12} style={{ width: "100%" }}>
              <H1>Planning</H1>
              <TwoColumn
                leftLabel="Stack Rank"
                leftText={item.stack_rank}
                rightLabel="Priority"
                rightText={item.priority}
              />
              <TwoColumn
                leftLabel="Due Date"
                leftText={item.due_date}
                rightLabel=""
                rightText=""
              />
              <HorizontalDivider />
            </Stack>
          )}
          {item.type === "Task" && (
            <Stack vertical gap={12}>
              <H1>Planning</H1>
              <TwoColumn
                leftLabel="Priority"
                leftText={item.priority}
                rightLabel="Activity"
                rightText={item.activity}
              />
            </Stack>
          )}
          {["Epic", "Feature"].includes(item.type) && (
            <Stack vertical gap={5} style={{ width: "100%" }}>
              <Stack vertical gap={12}>
                <H1>Planning</H1>
                <TwoColumn
                  leftLabel="Risk"
                  leftText={item.risk}
                  rightLabel="Priority"
                  rightText={item.priority}
                />
                <TwoColumn
                  leftLabel="Effort"
                  leftText={item.effort}
                  rightLabel="Business Value"
                  rightText={item.business_value}
                />
                <TwoColumn
                  leftLabel="Time Criticality"
                  leftText={item.time_criticality}
                  rightLabel="Start Date"
                  rightText={item.start_date}
                />
                <TwoColumn
                  leftLabel="Target Date"
                  leftText={item.target_date}
                  rightLabel=""
                  rightText=""
                />
              </Stack>
              <HorizontalDivider />
            </Stack>
          )}
          {item.type === "User Story" && (
            <Stack vertical gap={5} style={{ width: "100%" }}>
              <Stack vertical gap={12}>
                <H1>Planning</H1>
                <TwoColumn
                  leftLabel="Risk"
                  leftText={item.risk}
                  rightLabel="Priority"
                  rightText={item.priority}
                />
                <TwoColumn
                  leftLabel="Effort"
                  leftText={item.effort}
                  rightLabel="Business Value"
                  rightText={item.business_value}
                />
              </Stack>
              <HorizontalDivider />
            </Stack>
          )}
          {["Epic", "Feature", "User Story"].includes(item.type) && (
            <Stack vertical style={{ width: "100%" }} gap={5}>
              <Stack vertical gap={5}>
                <H1>Classification</H1>
                <Stack vertical gap={2}>
                  <GreyTitle>Value area</GreyTitle>
                  <H2>{item.value_area}</H2>
                </Stack>
              </Stack>
              <HorizontalDivider />
            </Stack>
          )}
          {["Task", "Bug"].includes(item.type) && (
            <Stack vertical gap={12} style={{ width: "100%" }}>
              <H1>Effort (Hours)</H1>
              <TwoColumn
                leftLabel="Original Estimate"
                leftText={item.original_estimate}
                rightLabel="Remaining"
                rightText={item.remaining}
              />
              <TwoColumn
                leftLabel="Completed"
                leftText={item.completed}
                rightLabel=""
                rightText=""
              />
              <HorizontalDivider />
            </Stack>
          )}
          {item.type === "Test Case" && (
            <Stack vertical gap={12} style={{ width: "100%" }}>
              {item.steps?.map((step: any) => {
                return (
                  <Stack vertical gap={5}>
                    <Stack vertical gap={2}>
                      <GreyTitle>Step</GreyTitle>
                      <H2>{step.step}</H2>
                    </Stack>
                    <Stack vertical gap={2}>
                      <GreyTitle>Action</GreyTitle>
                      <H2>{step.action}</H2>
                    </Stack>
                    <Stack vertical gap={2}>
                      <GreyTitle>Expected Result</GreyTitle>
                      <H2>{step.expected_result}</H2>
                    </Stack>
                  </Stack>
                );
              })}
              <HorizontalDivider />
            </Stack>
          )}
        </Stack>
      )}
      {item.methodology === "Basic Process" && (
        <Stack>
          {item.type === "Epic" && (
            <Stack vertical gap={5} style={{ width: "100%" }}>
              <Stack vertical gap={12}>
                <H1>Planning</H1>
                <TwoColumn
                  leftLabel="Priority"
                  leftText={item.priority}
                  rightLabel="Start Date"
                  rightText={item.start_date}
                />
                <TwoColumn
                  leftLabel="Target Date"
                  leftText={item.target_date}
                  rightLabel=""
                  rightText=""
                />
              </Stack>
              <HorizontalDivider />
            </Stack>
          )}
          {item.type === "Issue" && (
            <Stack vertical gap={5} style={{ width: "100%" }}>
              <Stack vertical gap={12}>
                <H1>Planning</H1>
                <TwoColumn
                  leftLabel="Priority"
                  leftText={item.priority}
                  rightLabel="Effort"
                  rightText={item.effort}
                />
              </Stack>
              <HorizontalDivider />
            </Stack>
          )}
          {item.type === "Task" && (
            <Stack vertical gap={5} style={{ width: "100%" }}>
              <Stack vertical gap={12}>
                <H1>Planning</H1>
                <TwoColumn
                  leftLabel="Priority"
                  leftText={item.priority}
                  rightLabel="Activity"
                  rightText={item.activity}
                />
                <TwoColumn
                  leftLabel="Remaining Work"
                  leftText={item.remaining_word}
                  rightLabel=""
                  rightText=""
                />
              </Stack>
              <HorizontalDivider />
            </Stack>
          )}
        </Stack>
      )}
      {item.methodology === "Scrum" && (
        <Stack>
          {item.type === "Bug" && (
            <Stack vertical gap={5} style={{ width: "100%" }}>
              <Stack vertical gap={12}>
                <H1>Details</H1>
                <TwoColumn
                  leftLabel="Priority"
                  leftText={item.priority}
                  rightLabel="Severity"
                  rightText={item.severity}
                />
                <TwoColumn
                  leftLabel="Effort"
                  leftText={item.effort}
                  rightLabel="Remaining Work"
                  rightText={item.remaining_work}
                />
                <TwoColumn
                  leftLabel="Activity"
                  leftText={item.activity}
                  rightLabel=""
                  rightText=""
                />
              </Stack>
              <HorizontalDivider />
              <Stack vertical gap={12}>
                <H1>Build</H1>
                <TwoColumn
                  leftLabel="Found in Build"
                  leftText={item.found_in_build}
                  rightLabel="Integrated in Build"
                  rightText={item.integrated_in_build}
                />
              </Stack>
              <HorizontalDivider />
            </Stack>
          )}
          {["Epic", "Feature"].includes(item.type) && (
            <Stack vertical gap={5} style={{ width: "100%" }}>
              <Stack vertical gap={12}>
                <H1>Status</H1>
                <TwoColumn
                  leftLabel="Start Date"
                  leftText={item.start_date}
                  rightLabel="Integrated in Build"
                  rightText={item.integrated_in_build}
                />
              </Stack>
              <Stack vertical gap={12}>
                <H1>Details</H1>
                <TwoColumn
                  leftLabel="Priority"
                  leftText={item.priority}
                  rightLabel="Effort"
                  rightText={item.effort}
                />
                <TwoColumn
                  leftLabel="Business Value"
                  leftText={item.business_value}
                  rightLabel="Time Criticality"
                  rightText={item.time_criticality}
                />
                <TwoColumn
                  leftLabel="Value Area"
                  leftText={item.value_area}
                  rightLabel=""
                  rightText=""
                />
              </Stack>
              <HorizontalDivider />
            </Stack>
          )}
          {item.type === "Task" && (
            <Stack vertical gap={5} style={{ width: "100%" }}>
              <Stack vertical gap={12}>
                <H1>Planning</H1>
                <TwoColumn
                  leftLabel="Priority"
                  leftText={item.priority}
                  rightLabel="Activity"
                  rightText={item.activity}
                />
                <TwoColumn
                  leftLabel="Remaining Work"
                  leftText={item.remaining_word}
                  rightLabel=""
                  rightText=""
                />
              </Stack>
              <HorizontalDivider />
            </Stack>
          )}
        </Stack>
      )} */}
      {/* <Stack vertical gap={5}>
        <H1>Tickets ({item.tickets?.length})</H1>
        {item.tickets?.map((ticket: any) => (
          <Stack vertical gap={2}>
            <Stack gap={5} align={"center"}>
              <h2 style={{ fontSize: "10px", color: theme.colors.grey80 }}>
                {ticket.id}
              </h2>
              <H2>{`${ticket.title.substr(0, 30).trim()}...`}</H2>
            </Stack>
            <Stack gap={5} align={"center"}>
              <Avatar size={18} imageUrl={ticket.assignees.avatar} />
              <h2 style={{ fontSize: "10px", color: "black" }}>
                {ticket.assignees.name}
              </h2>
              <h2 style={{ fontSize: "10px", color: theme.colors.grey80 }}>
                {`<${ticket.assignees.email}>`}
              </h2>
              <GreyTitle>22 mins</GreyTitle>
            </Stack>
          </Stack>
        ))}
      </Stack>
      <HorizontalDivider /> */}
      {commentsReq.data?.comments && (
        <Stack vertical>
          <H1>Comments ({commentsReq.data.comments.length})</H1>
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
                      <H2>{parse(comment.text)}</H2>
                    </div>
                  </Stack>
                  <HorizontalDivider />
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
