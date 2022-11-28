import { FC } from "react";
import styled from "styled-components";
import { Stack, H2 } from "@deskpro/app-sdk";

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
  height: 2em;
  background-color: ${({ theme }) => theme.colors.grey20};
  margin: 0 6px;
`;

const TwoColumn: FC<Props> = ({
  leftLabel,
  leftText,
  rightLabel,
  rightText,
}) => (
  <Stack>
    <Stack vertical>
      <GreyTitle>{leftLabel}</GreyTitle>
      <H2>{leftText}</H2>
    </Stack>
    <Stack
      style={{
        alignItems: "center",
        alignSelf: "center",
        position: "absolute",
        marginLeft: "100px",
      }}
    >
      <Divider />
      <Stack vertical>
        <GreyTitle>{rightLabel}</GreyTitle>
        <H2>{rightText}</H2>
      </Stack>
    </Stack>
  </Stack>
);

export { TwoColumn };
