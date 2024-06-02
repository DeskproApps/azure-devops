import { useMemo } from "react";
import { get, isEmpty, size } from "lodash";
import { Select, useQueryWithClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { getUsersList } from "../../../../api/api";
import { QueryKey } from "../../../../utils";
import { getUserOptions } from "../../utils";
import { FC } from "react";
import type { DynamicFieldProps } from "../../types";

const IdentityField: FC<DynamicFieldProps> = ({ control, field }) => {
  const { context } = useDeskproLatestAppContext();
  const settings = useMemo(() => get(context, ["settings"]), [context]);
  const users = useQueryWithClient(
    [QueryKey.USERS],
    (client) => getUsersList(client, settings || {}),
    { enabled: !isEmpty(settings)},
  );
  const options = useMemo(() => {
    return getUserOptions(users.data?.value);
  }, [users.data?.value])

  return (
    <Select
      closeOnSelect
      initValue={control.field.value || ""}
      id={field.referenceName}
      showInternalSearch={Boolean(size(options))}
      options={options}
      onChange={control.field.onChange}
    />
  );
};

export { IdentityField };
