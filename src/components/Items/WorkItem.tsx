import { useMemo, useState } from "react";
import { Checkbox } from "@deskpro/deskpro-ui";
import {
  Link,
  Title,
  Property,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { Card } from "../common";
import { ItemPersistentData } from "./ItemPersistentData";
import { IAzureWorkItem } from "../../types/azure/workItem";
import { useDeskpro } from "../../hooks/deskproContext";
import { CheckedList } from "../../types/checkedList";
import { HorizontalDivider } from "../HorizontalDivider";
import { AzureIcon } from "../AzureIcon";

interface Props {
  item: IAzureWorkItem;
  checkedList: CheckedList;
  setCheckedList: (value: React.SetStateAction<CheckedList>) => void;
  i: number;
}

export const WorkItem = ({ item, setCheckedList, checkedList }: Props) => {
  const [ticketCount, setTicketCount] = useState<number | null>(null);
  const deskproData = useDeskpro();

  const link = useMemo(() => {
    return (deskproData?.settings.type === "cloud")
      ? `https://dev.azure.com/${deskproData?.settings.organization_collection}/${item.fields["System.TeamProject"]}/_workitems/edit/${item.id}/`
      : `${deskproData?.settings.instance_url}/${deskproData?.settings.organization_collection}/${item.fields["System.TeamProject"]}/_workitems/edit/${item.id}/`
  }, [deskproData?.settings, item]);

  const onChangeSelected = useMemo(() => {
    return () => setCheckedList((prevValue: CheckedList) => {

      prevValue[item.fields["System.TeamProject"]] = prevValue[item.fields["System.TeamProject"]] ?? [];

      const teamValue = prevValue[item.fields["System.TeamProject"]];

      if (teamValue?.includes(item.id)) {
        prevValue[item.fields["System.TeamProject"]].splice(teamValue.indexOf(item.id), 1);
      } else {
        teamValue.push(item.id);
      }
      return { ...prevValue };
    });
  }, [setCheckedList, item.fields, item.id]);

  useInitialisedDeskproAppClient((client) => {
    (async () => {
      setTicketCount(
        (await client.getState<number>(`azure/items/${item.id}`))[0]?.data ?? 0
      );
    })();
  });

  return (
    <>
      <Card>
        <Card.Media>
          <Checkbox
            style={{ margin: "10px" }}
            checked={checkedList[item.fields["System.TeamProject"]]?.includes(item.id) ?? false}
            onChange={onChangeSelected}
            size={14}
          />
        </Card.Media>
        <Card.Body>
          <Title
            title={(
              <Link
                href="#"
                onClick={(e) => { e.preventDefault();onChangeSelected();} }
              >
                {item.fields["System.Title"]}
              </Link>
            )}
            icon={<AzureIcon/>}
            link={link}
          />
          <ItemPersistentData item={item} />
          <Property
            label="Deskpro Tickets"
            text={ticketCount}
          />
        </Card.Body>
      </Card>
      <HorizontalDivider />
    </>
  );
};
