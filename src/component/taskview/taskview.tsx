// import "./contest.css";
// import Container from "@material-ui/core/Container";
// import { useEffect } from "react";

import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useSelector } from "react-redux";
import { selecttaskurl } from "../../app/Slice/editor";

const useStyles = makeStyles({ hide: { display: "none" } });
export const Taskview = (prop: any) => {
  const classes = useStyles();
  const url = useSelector(selecttaskurl);
  useEffect(() => {
    console.log(url);
  }, [url]);
  return (
    <iframe
      className={(prop.hide !== false && classes.hide) || ""}
      title="taskview"
      width="100%"
      height="100%"
      src={url}
      frameBorder="0"
    ></iframe>
  );
};

export const Testdata = () => {
  const [tmp, settmp] = useState(0);
  const getData = () => {
    const iframe: any = document.getElementById("iframe");
    // console.log(iframe.contentDocument);
    settmp(tmp + 1);
    iframe.contentDocument.open();
    iframe.contentDocument.write(`<h1>${tmp}</h1>`);
    iframe.contentDocument.close();
  };

  return (
    <>
      <iframe title="test" width="100%" height="90%" id="iframe"></iframe>
      <button
        onClick={() => {
          getData();
        }}
      >
        get
      </button>
    </>
  );
};