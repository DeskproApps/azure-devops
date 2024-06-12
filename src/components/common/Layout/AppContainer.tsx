import styled from "styled-components";

type Props = {
  isAdmin: boolean;
};

const AppContainer = styled.div<Props>`
  margin-bottom: ${({ isAdmin }) => isAdmin ? 0 : "3rem"};
`;

export { AppContainer };
