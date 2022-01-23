import Chip from "@mui/material/Chip";

export function ChipJudgeResult(props: { result: string | undefined }) {
  function chipColor(status: string | undefined) {
    if (status === "AC") {
      return { text: "#eeeeee", back: "#4EAE49" };
    } else if (
      status?.includes("WA") ||
      status?.includes("RE") ||
      status?.includes("TLE") ||
      status?.includes("CE")
    ) {
      return { text: "#eeeeee", back: "#EB9E3E" };
    } else {
      return undefined;
    }
  }
  function renderText(text: string | undefined) {
    if (text) {
      return text;
    } else {
      return "--";
    }
  }
  return (
    <Chip
      sx={{
        color: chipColor(props.result)?.text,
        backgroundColor: chipColor(props.result)?.back,
      }}
      size="small"
      label={renderText(props.result)}
    ></Chip>
  );
}
