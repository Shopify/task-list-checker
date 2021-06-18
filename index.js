// @ts-check

const core = require('@actions/core');
const github = require('@actions/github');

try {
  const GITHUB_SECRET = core.getInput('github-token');
  if (!GITHUB_SECRET) {
    throw "Missing GITHUB_SECRET input";
  }
  if (!['pull_request', 'pull_request_review', 'pull_request_review_comment'].includes(github.context.eventName)) {
    throw `Being invoked for non-PR event "${github.context.eventName}"`;
  }
  const prDescription = github.context.payload.pull_request.body;
  console.log(prDescription);
} catch (error) {
  core.setFailed(error.message);
}
