import { Stack, TwoButtonGroup } from "@deskpro/app-sdk";
import { useState } from "react";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";

import { CreateItem } from "../Components/Items/CreateItem";
import { FindItem } from "../Components/Items/FindItem";

export const FindOrCreateItems = () => {
  const [page, setPage] = useState<0 | 1>(0);

  return (
    <Stack vertical>
      <Stack style={{ alignSelf: "center" }}>
        <TwoButtonGroup
          selected={
            {
              0: "one",
              1: "two",
            }[page] as "one" | "two"
          }
          oneIcon={faMagnifyingGlass}
          twoIcon={faPlus}
          oneLabel="Find Item⠀⠀"
          twoLabel="Create Item⠀⠀"
          oneOnClick={() => setPage(0)}
          twoOnClick={() => setPage(1)}
        ></TwoButtonGroup>
      </Stack>

      {
        {
          0: <FindItem />,
          1: <CreateItem />,
        }[page]
      }
    </Stack>
  );
};
