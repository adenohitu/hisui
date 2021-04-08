// import "./contest.css";
// import Container from "@material-ui/core/Container";
// import { useEffect } from "react";

import { useState } from "react";

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
