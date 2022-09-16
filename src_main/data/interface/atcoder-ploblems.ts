export interface SubmissionAtCoderProblems {
  readonly execution_time: number | null;
  readonly point: number;
  readonly result: string;
  readonly problem_id: string;
  readonly user_id: string;
  readonly epoch_second: number;
  readonly contest_id: string;
  readonly id: number;
  readonly language: string;
  readonly length: number;
}
// https://kenkoooo.com/atcoder/resources/merged-problems.json
export interface mergedProblemType {
  // Basic information
  readonly id: string;
  readonly contest_id: string;
  readonly problem_index: string;
  readonly name: string;
  readonly title: string;

  // Information for first AC
  readonly first_user_id: string | null;
  readonly first_contest_id: string | null;
  readonly first_submission_id: number | null;

  // Information for fastest code
  readonly fastest_user_id: string | null;
  readonly fastest_contest_id: string | null;
  readonly fastest_submission_id: number | null;
  readonly execution_time: number | null;

  // Information for shortest code
  readonly shortest_user_id: string | null;
  readonly shortest_contest_id: string | null;
  readonly shortest_submission_id: number | null;
  readonly source_code_length: number | null;

  readonly solver_count: number | null;
  readonly point?: number | null;
}
