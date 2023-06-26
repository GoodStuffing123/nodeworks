import React from "react";
import { Icon } from "@iconify/react";

import styled from "styled-components";

const InfoPopupStyles = styled.div`
  left: 0;
  top: 0;

  padding: 10px;

  background-color: ${({ theme }) => theme.palette.primary};
  border-radius: 10px;
`;

const InfoPopup = ({
  position,
  close,
  children,
}: {
  position: [x: number, y: number];
  close: () => void;
  children: any;
}) => {
  return (
    <InfoPopupStyles
      style={{ transform: `translate(${position[0]}px, ${position[1]}px)` }}
    >
      <Icon icon="teenyicons:x-small-solid" height="25px" onClick={close} />

      <div>{children}</div>
    </InfoPopupStyles>
  );
};

export default InfoPopup;
