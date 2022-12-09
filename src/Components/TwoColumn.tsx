import { FC } from "react";
import styled from "styled-components";
import { Stack, H2, useDeskproAppTheme } from "@deskpro/app-sdk";

import type { Props as TextBlockWithLabelProps } from "./TextBlockWithLabel";
import { GreyTitle } from "../styles";

export type Props = {
  leftLabel: TextBlockWithLabelProps["label"];
  leftText: TextBlockWithLabelProps["text"];
  rightLabel: TextBlockWithLabelProps["label"];
  rightText: TextBlockWithLabelProps["text"];
};

const Divider = styled.div`
  display: inline-block;
  width: 1px;
  height: 2.3em;
  background-color: ${({ theme }) => theme.colors.grey20};
  margin: 0 6px;
`;

const TwoColumn: FC<Props> = ({
  leftLabel,
  leftText,
  rightLabel,
  rightText,
}) => {
  const { theme } = useDeskproAppTheme();
  return (
    <Stack>
      <Stack vertical gap={4}>
        <GreyTitle theme={theme}>{leftLabel}</GreyTitle>
        <H2>{leftText}</H2>
      </Stack>
      <Stack
        style={{
          alignItems: "center",
          alignSelf: "center",
          position: "absolute",
          marginLeft: "120px",
        }}
      >
        <Divider />
        <Stack vertical gap={4}>
          <GreyTitle>{rightLabel}</GreyTitle>
          <H2>{rightText}</H2>
        </Stack>
      </Stack>
    </Stack>
  );
};

export { TwoColumn };
