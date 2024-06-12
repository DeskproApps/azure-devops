import { Container, Navigation } from "../common";
import { WorkItemForm } from "../WorkItemForm";
import type { FC } from "react";
import type { Props as FormProps } from "../WorkItemForm";

type Props = FormProps & {
  onNavigateToLink: () => void;
};

const CreateWorkItem: FC<Props> = ({ onNavigateToLink, ...props }) => {
  return (
    <Container>
      <Navigation onNavigateToLink={onNavigateToLink}/>
      <WorkItemForm {...props}/>
    </Container>
  );
};

export { CreateWorkItem };
