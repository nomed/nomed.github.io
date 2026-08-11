const macProfile = [
  "(version 1)",
  "(allow default)",
  "(deny network-outbound)",
  '(allow network-outbound (remote ip "localhost:*"))',
].join(" ");

export function isolationInvocation(platform, options) {
  if (!options.npmCli) {
    throw new Error("npm CLI path is required for isolated E2E");
  }

  const runnerArgs = [
    options.node,
    options.runner,
    options.repository,
    options.privateHome,
    options.npmCli,
  ];

  if (platform === "darwin") {
    return {
      command: "sandbox-exec",
      args: ["-p", macProfile, ...runnerArgs],
    };
  }

  if (platform === "linux") {
    if (!Number.isInteger(options.uid) || !Number.isInteger(options.gid)) {
      throw new Error("Linux network isolation requires the current uid and gid");
    }

    const isolate = [
      "uid=$1; gid=$2; shift 2",
      "ip link set lo up",
      'exec setpriv --reuid "$uid" --regid "$gid" --clear-groups "$@"',
    ].join("; ");

    return {
      command: "sudo",
      args: [
        "--non-interactive",
        "unshare",
        "--net",
        "--",
        "sh",
        "-eu",
        "-c",
        isolate,
        "network-isolation",
        String(options.uid),
        String(options.gid),
        ...runnerArgs,
      ],
    };
  }

  throw new Error(`Unsupported OS-level network isolation on ${platform}`);
}
