import React, { useState, forwardRef, useCallback, useEffect } from "react";
import classnames from "classnames";
import { makeStyles } from "@mui/styles";
import { useSnackbar, SnackbarContent } from "notistack";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { submitStatus } from "../../../src_main/data/scraping/submit-data";
import { ipcRendererManager } from "../../ipc";
import dayjs from "dayjs";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up("sm")]: {
      minWidth: "344px !important",
    },
  },
  actionRoot: {
    padding: "8px 8px 8px 16px",
    justifyContent: "space-between",
  },
  icons: {
    marginLeft: "auto",
  },
  expand: {
    padding: "8px 8px",
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  collapse: {
    padding: 16,
  },
  checkIcon: {
    fontSize: 20,
    color: "#b3b3b3",
    paddingRight: 4,
  },
  button: {
    padding: 0,
    textTransform: "none",
  },
}));

export const SnackMessage = forwardRef<
  HTMLDivElement,
  {
    id: string | number;
    message: string | React.ReactNode;
    submitStatus: submitStatus;
  }
>((props, ref) => {
  const classes = useStyles();
  const { closeSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<submitStatus>(
    props.submitStatus
  );

  const handleExpandClick = useCallback(() => {
    setExpanded((oldExpanded) => !oldExpanded);
  }, []);

  const handleDismiss = useCallback(() => {
    closeSnackbar(props.id);
  }, [props.id, closeSnackbar]);
  useEffect(() => {
    return ipcRendererManager.on("SEND_SUBMIT_STATUS", (e, submitStatus) => {
      setSubmitStatus(submitStatus);
    });
  }, []);
  return (
    <SnackbarContent ref={ref} className={classes.root}>
      <Card
        sx={{
          backgroundColor:
            (submitStatus.labelColor === "default" && "#646464") ||
            (submitStatus.labelColor === "success" && "#4EAE49") ||
            "#EB9E3E",
          width: "100%",
        }}
      >
        <CardActions classes={{ root: classes.actionRoot }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "bold", color: "white" }}
          >
            {submitStatus.submissionData.taskname_render}
            <br />
            Status:
            {submitStatus.status}
          </Typography>
          <div className={classes.icons}>
            <IconButton
              aria-label="Show more"
              className={classnames(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
            >
              <ExpandMoreIcon />
            </IconButton>
            <IconButton className={classes.expand} onClick={handleDismiss}>
              <CloseIcon />
            </IconButton>
          </div>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Paper className={classes.collapse}>
            <Typography gutterBottom>詳細</Typography>
            {dayjs(submitStatus.submissionData.created).format(
              "YY/MM/DD HH:mm:ss"
            )}
            <br />
            {submitStatus.status}:{submitStatus.submissionData.language}
          </Paper>
        </Collapse>
      </Card>
    </SnackbarContent>
  );
});
