import { useState } from "react";
import { Button, Stack } from "@deskpro/deskpro-ui";
import { useDeskproAppClient, useDeskproAppEvents } from "@deskpro/app-sdk";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Container } from "../components/common";
import { postComment } from "../api/api";
import { useDeskpro, useSetTitle, useRegisterElements } from "../hooks";
import { RequiredInput } from "../components/RequiredInput";

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

  useSetTitle("Add Comment");

  useRegisterElements(({ registerElement }) => {
    registerElement("azureHomeButton", { type: "home_button" });
  });

  useDeskproAppEvents({
    onElementEvent(id) {
      switch (id) {
        case "azureHomeButton":
          navigate(`/home`);
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
    <Container>
      <Stack vertical gap={12} style={{ width: "100%" }}>
        <RequiredInput
          title="Add Comment"
          register={register("comment", { required: true })}
          error={!!errors.comment}
        />
        <Stack style={{ justifyContent: "space-between", width: "100%" }} gap={5}>
          <Button
            type="submit"
            text={isSubmitting ? "Creating..." : "Create"}
            onClick={submit}
          />
          <Button
            text="Cancel"
            onClick={() => navigate(-1)}
            intent="secondary"
          />
        </Stack>
      </Stack>
    </Container>
  );
};
