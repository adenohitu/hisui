import * as React from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";

export const DashboaedSpeedDial: React.FC<{ windowReset: () => void }> = (
  props
) => {
  const actions = [
    {
      icon: <DynamicFeedIcon />,
      name: "Windowの状態を初期化",
      click: () => {
        props.windowReset();
      },
    },
    // {
    //   icon: <RefreshIcon />,
    //   name: "情報の更新",
    //   click: () => {},
    // },
  ];
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{ position: "absolute", bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
    >
      {actions.map((action) => (
        <SpeedDialAction
          onClick={() => {
            action.click();
            handleClose();
          }}
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
        />
      ))}
    </SpeedDial>
  );
};
