// @ts-check

const core = require('@actions/core');
const github = require('@actions/github');
const marked = require('marked');

// This function taken from https://github.com/stilliard/github-task-list-completed/blob/master/src/check-outstanding-tasks.js
function checkOutstandingTasks(body) {
  if (body === null) {
      return {
          total: 0,
          remaining: 0
      };
  }
  
  let tokens = marked.lexer(body, { gfm: true });
  // TODO: TypeScript isn't inferring the type of this correct, figure out why
  /** @type marked.Tokens.ListItem[] */
  // @ts-ignore I don't know why this isn't behaving but whatever.
  let listItems =  tokens.filter(token => token.type === 'list_item');
  // return counts of task list items and how many are left to be completed
  return {
      total: listItems.filter(item => item.checked !== undefined).length,
      remaining: listItems.filter(item => item.checked === false).length
  };
};

async function run() {
  try {
    const startTime = (new Date).toISOString();
    const GITHUB_TOKEN = core.getInput('github-token');
    if (!GITHUB_TOKEN) {
      throw "Missing github-token input";
    }
    if (!['pull_request', 'pull_request_review', 'pull_request_review_comment'].includes(github.context.eventName)) {
      throw `Being invoked for non-PR event "${github.context.eventName}"`;
    }

    const octokit = github.getOctokit(GITHUB_TOKEN);
    const pr = github.context.payload.pull_request

    const prDescription = github.context.payload.pull_request.body;
    const outstandingTasks = checkOutstandingTasks(prDescription);

    let check = {
      name: 'task-list-checker',
      head_sha: pr.head.sha,
      started_at: startTime,
      status: 'in_progress',
      output: {
        title: (outstandingTasks.total - outstandingTasks.remaining) + ' / ' + outstandingTasks.total + ' tasks completed',
        summary: outstandingTasks.remaining + ' task' + (outstandingTasks.remaining > 1 ? 's' : '') + ' still to be completed',
        text: 'We check if any task lists need completing before you can merge this PR'
      }
    }
    
    // all finished?
    if (outstandingTasks.remaining === 0) {
      check.status = 'completed';
      check.conclusion = 'success';
      check.completed_at = (new Date).toISOString();
      check.output.summary = 'All tasks have been completed';
    };

    // send check back to GitHub
    await octokit.rest.checks.create({...github.context.repo, ...check});
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()