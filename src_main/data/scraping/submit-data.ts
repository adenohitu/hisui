import { submissionData } from "./submissions";

export interface submitStatus {
  submissionData: submissionData;
  status: string;
  labelColor: "success" | "warning" | "default" | string;
  Interval?: number;
}
export async function scraping_submitData(
  data: {
    Html: string;
    Interval?: number | undefined;
  },
  submissionData: submissionData
): Promise<submitStatus> {
  const status = data.Html.slice(0, data.Html.search("</span>")).slice(
    data.Html.search(">") + 1
  );
  const labelColor: string = data.Html.slice(
    data.Html.search("label-") + 6,
    data.Html.search("' data-toggle")
  );
  return {
    submissionData: submissionData,
    status,
    labelColor,
    Interval: data.Interval,
  };
}
