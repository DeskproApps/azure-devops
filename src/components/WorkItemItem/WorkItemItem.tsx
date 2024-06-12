import { useMemo, useCallback } from "react";
import { get } from "lodash";
import { Link, Title, Member, Property, TwoProperties } from "@deskpro/app-sdk";
import { useExternalLinks } from "../../hooks";
import { State, AzureIcon, DeskproTickets } from "../common";
import type { FC, MouseEventHandler } from "react";
import type { IAzureWorkItem } from "../../types/azure";

type Props = {
  workItem: IAzureWorkItem;
  onClickTitle?: () => void;
};

const WorkItemItem: FC<Props> = ({ workItem, onClickTitle }) => {
  const { getItemWorkLink } = useExternalLinks();
  const assignedTo = useMemo(() => workItem.fields["System.AssignedTo"], [workItem]);

  const onClick:  MouseEventHandler<HTMLAnchorElement> = useCallback((e) => {
    e.preventDefault();
    onClickTitle && onClickTitle();
  }, [onClickTitle]);

  return (
    <>
      <Title
        title={!onClickTitle
          ? workItem.fields["System.Title"]
          : (<Link href="#" onClick={onClick}>{workItem.fields["System.Title"]}</Link>)
        }
        icon={<AzureIcon/>}
        link={getItemWorkLink(workItem) || "#"}
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
      {assignedTo && (
        <Property
          label="Assignee"
          text={<Member name={assignedTo.displayName} />}
        />
      )}
    </>
  );
};

export { WorkItemItem };
