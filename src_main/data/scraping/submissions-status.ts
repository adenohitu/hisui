import { submissionData } from "./submissions";

export interface submitStatus {
  submissionData: submissionData;
  status: string;
  labelColor: "success" | "warning" | "default" | string;
  Interval?: number;
}
interface resultstatus {
  Html: string;
  Score: string;
}
interface statusJson {
  Interval?: number;
  Result: { [submitID: string]: resultstatus };
}
export async function scrapingSubmissionStatusData(
  data: statusJson,
  oldsubmissionData: submissionData
): Promise<submitStatus> {
  const submitStatusData = data.Result[oldsubmissionData.submit_id];
  //   <td class='text-center'><span class='label label-success' data-toggle='tooltip' data-placement='top' title="正解">AC</span></td><td class='text-right'>71 ms</td><td class='text-right'>61580 KB</td>
  const prestatus = submitStatusData.Html.slice(
    0,
    submitStatusData.Html.search("</span>")
  );
  const status = prestatus.slice(prestatus.lastIndexOf(">") + 1);

  const labelColor: string = submitStatusData.Html.slice(
    submitStatusData.Html.search("label-") + 6,
    submitStatusData.Html.search("' data-toggle")
  );
  // time_consumptionに更新があれば取得
  let time_consumption = oldsubmissionData.time_consumption;
  if (submitStatusData.Html.indexOf("text-right") !== -1) {
    const pretimehtml = submitStatusData.Html.slice(
      submitStatusData.Html.search("</span></td>")
    );
    time_consumption = pretimehtml.slice(
      pretimehtml.indexOf("text-right'>") + 12,
      pretimehtml.lastIndexOf("</td><td")
    );
  }
  // memory_consumptionに更新があれば取得
  let memory_consumption = oldsubmissionData.memory_consumption;
  if (submitStatusData.Html.indexOf("text-right") !== -1) {
    const pretimehtml = submitStatusData.Html.slice(
      submitStatusData.Html.search("</span></td>")
    );
    memory_consumption = pretimehtml.slice(
      pretimehtml.lastIndexOf("text-right'>") + 12,
      pretimehtml.lastIndexOf("</td>")
    );
  }
  // memory_consumptionに更新があれば取得
  let result_explanation = oldsubmissionData.result_explanation;
  if (submitStatusData.Html.indexOf(`title="`) !== -1) {
    const pretimehtml = submitStatusData.Html.slice(
      submitStatusData.Html.search(`title="`) + 7
    );
    result_explanation = pretimehtml.slice(0, pretimehtml.lastIndexOf(`"`));
  }
  const newSubmissionData: submissionData = oldsubmissionData;
  newSubmissionData.waiting_judge =
    (data.Interval !== undefined && true) || false;
  newSubmissionData.score = submitStatusData.Score;
  newSubmissionData.result = status;
  newSubmissionData.result_explanation = result_explanation;
  newSubmissionData.time_consumption = time_consumption;
  newSubmissionData.memory_consumption = memory_consumption;

  //   const newSubmissionData = {
  //     waiting_judge: (data.Interval !== undefined && true) || false,
  //     created: oldsubmissionData.created,
  //     contestName: oldsubmissionData.contestName,
  //     taskScreenName: oldsubmissionData.taskScreenName,
  //     taskname_render: oldsubmissionData.taskname_render,
  //     task_url: oldsubmissionData.task_url,
  //     user: oldsubmissionData.user,
  //     language: oldsubmissionData.language,
  //     score: submitStatusData.Score,
  //     source_length: oldsubmissionData.source_length,
  //     result: status,
  //     result_explanation: result_explanation,
  //     time_consumption: time_consumption,
  //     memory_consumption: memory_consumption,
  //     submit_id: oldsubmissionData.submit_id,
  //     submit_url: oldsubmissionData.submit_url,
  //   };
  return {
    submissionData: newSubmissionData,
    status,
    labelColor,
    Interval: data.Interval,
  };
}
