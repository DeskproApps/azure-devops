import { useMemo } from "react";
import { get, find, isEmpty } from "lodash";
import { P5, RoundedLabelTag } from "@deskpro/deskpro-ui";
import { useQueryWithClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { getStateDefinitionList } from "../../../api/api";
import { QueryKey } from "../../../utils";
import type { FC } from "react";
import type { IAzureWorkItem } from "../../../types/azure";

type Props = {
  workItem: IAzureWorkItem;
};

const State: FC<Props> = ({ workItem }) => {
  const { context } = useDeskproLatestAppContext();
  const settings = useMemo(() => get(context, ["settings"]), [context]);
  const projectId = useMemo(() => get(workItem, ["fields", "System.TeamProject"]), [workItem]);
  const workItemType = useMemo(() => get(workItem, ["fields", "System.WorkItemType"]), [workItem]);
  const stateName = useMemo(() => get(workItem, ["fields", "System.State"]), [workItem]);

  const states = useQueryWithClient(
    [QueryKey.STATES, projectId, workItemType],
    (client) => getStateDefinitionList(client, settings, projectId, workItemType),
    { enabled: !isEmpty(settings) && Boolean(projectId) && Boolean(workItemType) },
  );

  const state = useMemo(() => {
    return find(get(states.data, ["value"]), { name: stateName });
  }, [stateName, states.data]);

  return (
    <>
      {isEmpty(state)
        ? <P5>-</P5>
        : (
          <RoundedLabelTag
            textColor="white"
            label={get(state, ["name"])}
            backgroundColor={`#${get(state, ["color"])}`}
          />
        )
      }
    </>
  );
};

export { State };
