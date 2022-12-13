import { useState } from "react";
import {
  Button,
  Stack,
  useDeskproAppClient,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { postComment } from "../api/api";
import { useDeskpro } from "../hooks/deskproContext";
import { RequiredInput } from "../Components/RequiredInput";

export const AddComment = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const {
    register,
    formState: { errors },
    watch,
  } = useForm<{ comment: string }>();

  const navigate = useNavigate();
  const deskproData = useDeskpro();
  const { client } = useDeskproAppClient();

  const text = watch("comment");

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Add Comment");

    client.deregisterElement("azureEditButton");
    client.deregisterElement("azureMenuButton");
  });

  useDeskproAppEvents({
    onElementEvent(id) {
      switch (id) {
        case "azureHomeButton":
          navigate(`/redirect`);
          break;
      }
    },
  });

  const search = useLocation().search;
  const [itemId, projectId] = [
    new URLSearchParams(search).get("itemId"),
    new URLSearchParams(search).get("projectId"),
  ];

  const submit = async () => {
    if (isSubmitting) return;

    if (!client || !text || !deskproData?.settings || !projectId || !itemId)
      return;

    setIsSubmitting(true);

    await postComment(client, deskproData?.settings, projectId, itemId, text);

    navigate(-1);
  };

  return (
    <Stack vertical gap={12} style={{ width: "100%" }}>
      <RequiredInput
        title="Add Comment"
        register={register("comment", { required: true })}
        error={!!errors.comment}
      ></RequiredInput>
      <Stack style={{ justifyContent: "space-between", width: "100%" }} gap={5}>
        <Button
          type="submit"
          text={isSubmitting ? "Creating..." : "Create"}
          onClick={submit}
        ></Button>
        <Button
          text="Cancel"
          onClick={() => navigate(-1)}
          intent="secondary"
        ></Button>
      </Stack>
    </Stack>
  );
};
