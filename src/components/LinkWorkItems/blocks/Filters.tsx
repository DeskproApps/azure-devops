import { get, map } from "lodash";
import { Search, Select } from "@deskpro/app-sdk";
import { Label } from "../../common";
import { getOption } from "../../../utils";
import {FC, useMemo} from "react";
import type { IAzureProject } from "../../../types/azure";

type Props = {
  isLoading: boolean,
  projects: IAzureProject[],
  onChangeSearchQuery: (search: string) => void,
  onChangeProject: (projectId: IAzureProject["id"]) => void,
};

const Filters: FC<Props> = ({
  projects,
  isLoading,
  onChangeProject,
  onChangeSearchQuery,
}) => {
  const projectOptions = useMemo(() => {
    return map(projects, (p) => getOption(p.name, p.name));
  }, [projects]);

  return (
    <>
      <Search
        isFetching={isLoading}
        onChange={onChangeSearchQuery}
      />
      <Label label="Project" required>
        <Select<IAzureProject["id"]>
          initValue={get(projects, [0, "id"], "") || ""}
          options={projectOptions}
          onChange={onChangeProject as () => void}
        />
      </Label>
    </>
  );
};

export { Filters };
