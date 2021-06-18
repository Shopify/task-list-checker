// @ts-check

const core = require('@actions/core');
const github = require('@actions/github');

try {
  const GITHUB_SECRET = process.env['GITHUB_SECRET']
  if (!GITHUB_SECRET) {
    throw "Missing GITHUB_SECRET env var"
  }
  // TODO: Only check for PRs
  const prDescription = github.context.payload.pull_request.body
  console.log(prDescription)
} catch (error) {
  core.setFailed(error.message);
}
