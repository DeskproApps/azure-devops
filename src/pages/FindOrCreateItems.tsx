import { useState } from "react";
import { TwoButtonGroup } from "@deskpro/app-sdk";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Container } from "../components/common";
import { CreateItem } from "../components/Items/CreateItem";
import { FindItem } from "../components/Items/FindItem";

export const FindOrCreateItems = () => {
  const [page, setPage] = useState<0 | 1>(0);

  return (
    <>
      <Container>
        <TwoButtonGroup
          selected={
            {
              0: "one",
              1: "two",
            }[page] as "one" | "two"
          }
          oneIcon={faMagnifyingGlass}
          twoIcon={faPlus}
          oneLabel="Find Item"
          twoLabel="Create Item"
          oneOnClick={() => setPage(0)}
          twoOnClick={() => setPage(1)}
        />
      </Container>
      {
        {
          0: <FindItem />,
          1: <CreateItem />,
        }[page]
      }
    </>
  );
};
