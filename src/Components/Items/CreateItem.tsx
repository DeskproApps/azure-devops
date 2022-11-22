import { H1, Stack, useDeskproAppTheme, Button } from "@deskpro/app-sdk";
import { useForm } from "react-hook-form";
import { LabelButton, LabelButtonFileInput } from "@deskpro/deskpro-ui";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { Dropdown } from "../Dropdown";
import { RequiredInput } from "../RequiredInput";

export const CreateItem = () => {
  const { theme } = useDeskproAppTheme();

  const {
    register,
    formState: { errors },
  } = useForm();
  return (
    <form style={{ width: "100%" }}>
      <Stack vertical style={{ width: "100%" }} gap={12}>
        <Dropdown
          title="Project"
          data={[]}
          value={""}
          required
          onChange={() => {}}
          error={false}
          keyName="id"
          valueName="name"
        />
        <Dropdown
          title="Work item"
          data={[]}
          value={""}
          required
          onChange={() => {}}
          error={false}
          keyName="id"
          valueName="name"
        />
        <RequiredInput
          title="Title"
          required
          error={Boolean(errors?.title)}
          register={register("title", { required: true })}
        ></RequiredInput>
        <Dropdown
          title="Assignee"
          data={[]}
          value={""}
          onChange={() => {}}
          error={false}
          keyName="id"
          valueName="name"
        />
        <Dropdown
          title="State"
          data={[]}
          value={""}
          onChange={() => {}}
          error={false}
          keyName="id"
          valueName="name"
        />
        <Dropdown
          title="Area"
          data={[]}
          value={""}
          onChange={() => {}}
          error={false}
          keyName="id"
          valueName="name"
        />
        <Dropdown
          title="Reason"
          data={[]}
          value={""}
          onChange={() => {}}
          error={false}
          keyName="id"
          valueName="name"
        />
        <Dropdown
          title="Interation"
          data={[]}
          value={""}
          onChange={() => {}}
          error={false}
          keyName="id"
          valueName="name"
        />
        <RequiredInput
          error={Boolean(errors?.repro_steps)}
          title="Repro Steps"
          register={register("repro_steps")}
        ></RequiredInput>
        <RequiredInput
          error={Boolean(errors?.system_info)}
          title="System Info"
          register={register("system_info")}
        ></RequiredInput>
        <RequiredInput
          error={Boolean(errors?.story_points)}
          title="Story Points"
          register={register("story_points")}
        ></RequiredInput>
        <Dropdown
          title="Priority"
          data={[]}
          value={""}
          onChange={() => {}}
          error={false}
          keyName="id"
          valueName="name"
        />
        <Dropdown
          title="Severity"
          data={[]}
          value={""}
          onChange={() => {}}
          error={false}
          keyName="id"
          valueName="name"
        />
        <Dropdown
          title="Activity"
          data={[]}
          value={""}
          onChange={() => {}}
          error={false}
          keyName="id"
          valueName="name"
        />
        <Dropdown
          title="Original Estimate"
          data={[]}
          value={""}
          onChange={() => {}}
          error={false}
          keyName="id"
          valueName="name"
        />
        <Dropdown
          title="Remaining"
          data={[]}
          value={""}
          onChange={() => {}}
          error={false}
          keyName="id"
          valueName="name"
        />
        <Dropdown
          title="Completed"
          data={[]}
          value={""}
          onChange={() => {}}
          error={false}
          keyName="id"
          valueName="name"
        />
        <Stack vertical>
          <div style={{ color: theme.colors.grey80 }}>
            <H1>Attachments</H1>
          </div>
          <LabelButton
            style={{ padding: "0px" }}
            icon={faPlus}
            text="Add"
            minimal
          >
            <LabelButtonFileInput
              accept="image/jpeg, image/jpg, image/pjp, image/pjpeg"
              onChange={(e) => e}
            />
          </LabelButton>
        </Stack>
        <Stack style={{ justifyContent: "space-between" }}>
          <Button text="Create"></Button>
          <Button text="Cancel" intent="secondary"></Button>
        </Stack>
      </Stack>
    </form>
  );
};
