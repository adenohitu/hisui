import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import MaterialReactTable, {
  MRT_ColumnDef,
  Virtualizer,
} from "material-react-table";
import { MRT_Localization_JA } from "material-react-table/locales/ja";
import type { ColumnFiltersState } from "@tanstack/react-table";
import { SortingState } from "@tanstack/react-table";
import { submissionDataMarge, useSubmisisons } from "./submissions-hooks";
import { ipcRendererManager } from "../../ipc";
import {
  IconButton,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { ChipJudgeResult } from "../chip/judge-result";
import dayjs from "dayjs";
// import { useAppStatus } from "../editor/tool/statusbar/status-hooks";
// import { defaultContestIDState } from "../../recoil/atom";
// import { useRecoilValue } from "recoil";
import Check from "@mui/icons-material/Check";

export const SubmissionsTable: FC = () => {
  const columns = useMemo<MRT_ColumnDef<submissionDataMarge>[]>(
    //column definitions...
    () => [
      {
        accessorKey: "created",
        header: "提出日時",
        size: 60,
        muiTableBodyCellProps: {
          align: "left",
        },
        muiTableHeadCellProps: {
          align: "left",
        },
        Cell: ({ cell }) => (
          <>
            <Typography sx={{ overflow: "hidden", fontSize: "12px" }}>
              {dayjs(cell.getValue<string>()).format("YY/MM/DD")}
            </Typography>
            <Typography variant="body1">
              {dayjs(cell.getValue<string>()).format("HH:mm:ss")}
            </Typography>
          </>
        ),
      },
      {
        accessorKey: "result",
        header: "結果",
        size: 80,
        Cell: ({ cell }) => (
          <ChipJudgeResult result={cell.getValue<string>()} />
        ),
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "contestName",
        header: "コンテスト名",
        size: 80,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "taskname_render",
        header: "問題",
        muiTableBodyCellProps: {
          align: "left",
        },
        muiTableHeadCellProps: {
          align: "left",
        },
        Cell: ({ cell, row }) => (
          <>
            <Typography variant="body2">{row.original.contestName}</Typography>
            <Typography variant="body1">
              {row.original.taskname_render}
            </Typography>
          </>
        ),
      },
      {
        accessorKey: "language",
        header: "提出言語",
        size: 130,
        muiTableBodyCellProps: {
          align: "left",
        },
        muiTableHeadCellProps: {
          align: "left",
        },
      },
    ],
    []
  );

  //optionally access the underlying virtualizer instance
  const virtualizerInstanceRef = useRef<Virtualizer>(null);

  //   const [data, setData] = useState<submissionData[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const submissionhooks = useSubmisisons();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  useEffect(() => {
    console.log([columnFilters]);
  }, [columnFilters]);

  useEffect(() => {
    if (virtualizerInstanceRef.current) {
      //scroll to the top of the table when the sorting changes
      virtualizerInstanceRef.current.scrollToIndex(0);
    }
  }, [sorting]);

  return (
    <MaterialReactTable
      columns={columns}
      data={submissionhooks.rows} //10,000 rows
      enableBottomToolbar={false}
      enableGlobalFilterModes
      enablePagination={false}
      enableRowNumbers={false}
      enableColumnActions={false}
      enableColumnFilters={true}
      enableSorting={true}
      enableTopToolbar={false}
      muiTableBodyRowProps={{ hover: false }}
      enableFullScreenToggle={false}
      enableRowVirtualization
      initialState={{
        density: "compact",
        columnVisibility: { contestName: false },
      }}
      muiTableContainerProps={() => ({
        sx: {
          height: "100%",
        },
      })}
      muiTablePaperProps={{
        sx: {
          height: "100%",
        },
      }}
      onSortingChange={setSorting}
      onColumnFiltersChange={setColumnFilters}
      state={{ columnFilters, sorting }}
      virtualizerInstanceRef={virtualizerInstanceRef} //optional
      virtualizerProps={{ overscan: 15 }} //optionally customize the virtualizer
      localization={MRT_Localization_JA}
      enableRowActions
      positionActionsColumn="last"
      displayColumnDefOptions={{
        "mrt-row-actions": {
          header: "",
          size: 20,
        },
      }}
      renderRowActions={({ row }) => (
        <Tooltip title="詳細">
          <IconButton
            aria-label="delete"
            size="small"
            onClick={() => {
              const open = `https://atcoder.jp${row.original.submit_url}`;
              ipcRendererManager.invoke("OPEN_SUBMISSION_PAGE", open);
            }}
          >
            <OpenInNewIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      )}
    />
  );
};

const updateSubmissions = () => {
  ipcRendererManager.send("RUN_UPDATE_SUBMISSIONS");
};
/**
 * mosaicのtoolbarControlsに入れる
 */
export const ReloadButtonTool = () => {
  return (
    <IconButton
      size="small"
      aria-label="Refresh submissions"
      onClick={updateSubmissions}
    >
      <RefreshIcon />
    </IconButton>
  );
};
export const SubmissionFilterStatus = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [selected, setSelected] = useState(2);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  // const editorStatus = useAppStatus();
  // const defaultContestID = useRecoilValue(defaultContestIDState);
  const handleClose = (selectindex: number | null) => {
    if (selectindex !== null) {
      setSelected(selectindex);
    }
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton
        size="small"
        id="submissions-button"
        aria-controls={open ? "submissions-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <ManageSearchIcon />
      </IconButton>
      <Menu
        id="submissions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => {
          handleClose(null);
        }}
        MenuListProps={{
          "aria-labelledby": "submissions-button",
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose(0);
          }}
        >
          {selected === 0 && (
            <ListItemIcon>
              <Check />
            </ListItemIcon>
          )}
          <ListItemText>選択された問題の提出だけを表示</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose(1);
          }}
        >
          {selected === 1 && (
            <ListItemIcon>
              <Check />
            </ListItemIcon>
          )}
          <ListItemText>デフォルトコンテストの提出だけを表示</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose(2);
          }}
        >
          {selected === 2 && (
            <ListItemIcon>
              <Check />
            </ListItemIcon>
          )}
          <ListItemText>全ての提出を表示</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
