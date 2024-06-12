import { useMemo } from "react";
import { get } from "lodash";
import { Title, Property, TwoProperties, Member } from "@deskpro/app-sdk";
import { State, AzureIcon, DPNormalize, DeskproTickets } from "../../common";
import { useExternalLinks } from "../../../hooks";
import type { FC } from "react";
import type { IAzureWorkItem } from "../../../types/azure";

type Props = {
  workItem: IAzureWorkItem;
};

const Details: FC<Props> = ({ workItem }) => {
  const { getItemWorkLink } = useExternalLinks();
  const assignedTo = useMemo(() => workItem.fields["System.AssignedTo"], [workItem]);

  return (
    <>
      <Title
        title={get(workItem, ["fields", "System.Title"])}
        icon={<AzureIcon/>}
        link={getItemWorkLink(workItem) || "#"}
      />
      <Property
        label="Description"
        text={<DPNormalize text={get(workItem, ["fields", "System.Description"])}/>}
      />
      <TwoProperties
        leftLabel="Type"
        leftText={get(workItem, ["fields", "System.WorkItemType"])}
        rightLabel="State"
        rightText={<State workItem={workItem}/>}
      />
      <TwoProperties
        leftLabel="Iteration"
        leftText={get(workItem, ["fields", "System.IterationPath"])}
        rightLabel="Area"
        rightText={get(workItem, ["fields", "System.AreaPath"])}
      />
      <TwoProperties
        leftLabel="Reason"
        leftText={get(workItem, ["fields", "System.Reason"])}
        rightLabel="Deskpro Tickets"
        rightText={<DeskproTickets entityId={workItem.id}/>}
      />
      <Property
        label="Assignee"
        text={!assignedTo ? null : <Member name={assignedTo.displayName} />}
      />
    </>
  );
};

export { Details };
