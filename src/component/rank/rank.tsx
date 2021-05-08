import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
// import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
// import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import RefreshIcon from "@material-ui/icons/Refresh";
import dayjs from "dayjs";
// import { sendGetmyrank } from "../../app/ipc/standing";
// import { runLoad } from "./get";
// import { store } from "../../app/store";
import {
  // requestStandingAsync,
  sendGetmyrank,
  selectMyrank,
  selectUpdateTime,
  // setRank,
  // loadEnd,
} from "../../app/Slice/standings";
import { useSelector, useDispatch } from "react-redux";
// import store from "../../app/store";
const useStyles = makeStyles({
  root: {
    height: "100%",
    width: "100%",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  toolbarButtons: {
    marginLeft: "auto",
  },
});

export default function Ranktable() {
  const classes = useStyles();
  const Myrank = useSelector(selectMyrank);
  const UpdateTime = useSelector(selectUpdateTime);
  const dispatch = useDispatch();

  //初回だけ実行
  useEffect(() => {
    //ipc送信関数
    dispatch(sendGetmyrank());
  }, [dispatch]);
  const updateStanding = async () => {
    dispatch(sendGetmyrank());
  };
  // dashboardapiからの更新イベントを受け取る
  useEffect(() => {
    const updateStanding_event = async () => {
      dispatch(sendGetmyrank());
    };
    window.api.updateDashboard(updateStanding_event);
  }, [dispatch]);
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h6">現在順位</Typography>
        <Typography variant="h5" align="center">
          {Myrank}位
        </Typography>
        <Typography variant="body1" align="right">
          {dayjs(UpdateTime).format("HH:MM:ss")}
          <IconButton onClick={updateStanding} size="small">
            <RefreshIcon />
          </IconButton>
        </Typography>
      </CardContent>
    </Card>
  );
}
