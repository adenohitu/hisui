export interface submitStatus {
  status: string;
  labelColor: "success" | "warning" | "default" | string;
  Interval?: number;
}
export async function scraping_submitData(data: {
  Html: string;
  Interval?: number | undefined;
}): Promise<submitStatus> {
  const status = data.Html.slice(0, data.Html.search("</span>")).slice(
    data.Html.search(">") + 1
  );
  const labelColor: string = data.Html.slice(
    data.Html.search("label-") + 6,
    data.Html.search("' data-toggle")
  );
  return { status, labelColor, Interval: data.Interval };
}
