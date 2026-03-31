function shortSha(value?: string | null) {
  return value ? value.slice(0, 7) : null;
}

export function getBuildInfo() {
  const commit =
    shortSha(process.env.COMMIT_REF) ??
    shortSha(process.env.VERCEL_GIT_COMMIT_SHA) ??
    shortSha(process.env.GITHUB_SHA) ??
    null;

  const branch =
    process.env.HEAD ??
    process.env.VERCEL_GIT_COMMIT_REF ??
    process.env.GITHUB_REF_NAME ??
    null;

  const context =
    process.env.CONTEXT ??
    process.env.VERCEL_ENV ??
    process.env.NODE_ENV ??
    "local";

  return {
    commit,
    branch,
    context
  };
}
