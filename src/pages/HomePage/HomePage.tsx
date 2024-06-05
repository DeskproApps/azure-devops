import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Link,
  Title,
  Property,
  LoadingSpinner,
  HorizontalDivider,
  useDeskproAppEvents,
} from "@deskpro/app-sdk";
import { useSetTitle, useSetBadgeCount, useRegisterElements, useExternalLinks } from "../../hooks";
import { useLinkedWorkItems } from "./hooks";
import { Container, DeskproTickets } from "../../components/common";
import { AzureIcon } from "../../components/AzureIcon";
import { ItemPersistentData } from "../../components/Items/ItemPersistentData";

const HomePage = () => {
  const navigate = useNavigate();
  const { getItemWorkLink } = useExternalLinks();
  const { workItems, isLoading } = useLinkedWorkItems();

  useSetTitle("Work Items");

  useSetBadgeCount(workItems);

  useRegisterElements(({ registerElement }) => {
    registerElement("azurePlusButton", { type: "plus_button" });
  });

  useDeskproAppEvents({
    onElementEvent(id) {
      switch (id) {
        case "azurePlusButton":
          navigate("/work-items/link");
          break;
        case "azureHomeButton":
          navigate("/redirect");
      }
    },
  });

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }
  return (
    <Container>
        {workItems.map((item) => (
          <>
            <Title
              title={(
                <Link
                  as={RouterLink}
                  to={`/itemdetails?itemId=${item.id}&projectId=${item.fields["System.TeamProject"]}`}
                >
                  {item.fields["System.Title"]}
                </Link>
              )}
              link={getItemWorkLink(item) || "#"}
              icon={<AzureIcon />}
            />
            <ItemPersistentData item={item} />
            <Property
              label="Deskpro Tickets"
              text={<DeskproTickets entityId={item.id}/>}
            />
            <HorizontalDivider style={{ marginBottom: 10 }} />
          </>
        ))}
    </Container>
  );
};

export { HomePage };
