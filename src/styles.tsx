import styled from "styled-components";

const GreyTitle = styled.h1`
  color: ${({ theme }) => theme.colors.grey80};
  font-size: 12px;
  font-family: "Noto Sans";
`;

const BiggerH1 = styled.h1`
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.primary};
  font-weight: 500;
`;

export { GreyTitle, BiggerH1 };
