import styled from "styled-components";
import { Label1 } from "@deskpro/deskpro-ui";
import type { DeskproAppTheme } from "@deskpro/app-sdk";

const FieldHint = styled(Label1)<DeskproAppTheme>`
  color: ${({ theme }) => theme.colors.grey80};
`;

export { FieldHint };
