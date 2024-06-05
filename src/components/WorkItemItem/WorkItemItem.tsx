import { useCallback } from "react";
import { Link, Title, Property } from "@deskpro/app-sdk";
import { useExternalLinks } from "../../hooks";
import { DeskproTickets } from "../common";
import { AzureIcon } from "../AzureIcon";
import { ItemPersistentData } from "../Items/ItemPersistentData";
import type { FC, MouseEventHandler } from "react";
import type { IAzureWorkItem } from "../../types/azure";

type Props = {
  workItem: IAzureWorkItem;
  onClickTitle?: () => void;
};

const WorkItemItem: FC<Props> = ({ workItem, onClickTitle }) => {
  const { getItemWorkLink } = useExternalLinks();

  const onClick:  MouseEventHandler<HTMLAnchorElement> = useCallback((e) => {
    e.preventDefault();
    onClickTitle && onClickTitle();
  }, [onClickTitle]);

  return (
    <>
      <Title
        title={!onClickTitle
          ? workItem.fields["System.Title"]
          : (
            <Link href="#" onClick={onClick}>
              {workItem.fields["System.Title"]}
            </Link>
          )
        }
        icon={<AzureIcon/>}
        link={getItemWorkLink(workItem) || "#"}
      />
      <ItemPersistentData item={workItem} />
      <Property
        label="Deskpro Tickets"
        text={<DeskproTickets entityId={workItem.id}/>}
      />
    </>
  );
};

export { WorkItemItem };
