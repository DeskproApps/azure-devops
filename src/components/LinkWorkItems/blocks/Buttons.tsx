import { size } from "lodash";
import { Stack } from "@deskpro/deskpro-ui";
import { Button } from "../../common";
import type { FC } from "react";
import type { IAzureWorkItem } from "../../../types/azure";

export type Props = {
  isSubmitting: boolean;
  onCancel: () => void;
  selectedWorkItems: IAzureWorkItem[];
  onLinkContact: () => void;
};

const Buttons: FC<Props> = ({ isSubmitting, selectedWorkItems, onLinkContact, onCancel }) => (
  <Stack justify="space-between">
    <Button
      type="button"
      text="Link Work Items"
      disabled={!size(selectedWorkItems) || isSubmitting}
      loading={isSubmitting}
      onClick={onLinkContact}
    />
    <Button
      type="button"
      text="Cancel"
      intent="secondary"
      onClick={onCancel}
    />
  </Stack>
);

export { Buttons };
