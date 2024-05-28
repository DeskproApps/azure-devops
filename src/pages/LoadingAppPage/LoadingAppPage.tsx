import { LoadingSpinner } from "@deskpro/app-sdk";
import { ErrorBlock, Container } from "../../components/common";
import { useLoadingApp } from "./hooks";
import type { FC } from "react";

const LoadingAppPage: FC = () => {
  const { error } = useLoadingApp();

  return (
    <Container>
      {error
        ? <ErrorBlock text={error}/>
        : <LoadingSpinner />
      }
    </Container>
  );
};

export { LoadingAppPage };
