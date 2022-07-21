export const hisuiDockerJudgeCommand: {
  [id: number]: {
    preRunCommand: string | null;
    compilerCommand: string | null;
    runCommand: string;
  };
} = {
  4003: {
    preRunCommand:
      '{dockerPath} cp "{filepath}" hisui-judge-docker:/home/cpp/a.cpp',
    compilerCommand:
      "{dockerPath} exec hisui-judge-docker g++ -std=gnu++17 -Wall -Wextra -O2 -DONLINE_JUDGE -o /home/cpp/a.out /home/cpp/a.cpp",
    runCommand: "{dockerPath} exec -i hisui-judge-docker /home/cpp/a.out",
  },
  4006: {
    preRunCommand:
      '{dockerPath} cp "{filepath}" hisui-judge-docker:/home/python/main.py',
    compilerCommand: null,
    runCommand:
      "{dockerPath} exec -i hisui-judge-docker python3 /home/python/main.py",
  },
};
