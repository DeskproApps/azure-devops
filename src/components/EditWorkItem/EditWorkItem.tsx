import { Container } from "../common";
import { WorkItemForm } from "../WorkItemForm";
import type { FC } from "react";
import type { Props as FormProps } from "../WorkItemForm";

type Props = FormProps & {
  //..
};

const EditWorkItem: FC<Props> = (props) => {
  return (
    <Container>
      <WorkItemForm isEditMode {...props} />
    </Container>
  );
};

export { EditWorkItem };
