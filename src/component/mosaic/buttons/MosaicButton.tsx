import React from "react";
import { IconButton } from "@mui/material";
export function createDefaultToolbarButtonCustomHisui(
  title: string,
  onClick: (event: React.MouseEvent<any>) => any,
  icon: JSX.Element
): React.ReactElement<any> {
  return (
    <IconButton size="small" aria-label={title} onClick={onClick}>
      {icon}
    </IconButton>
  );
}

export interface MosaicButtonProps {
  onClick?: () => void;
}
