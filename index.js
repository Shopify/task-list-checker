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
  
  const tokens = marked.lexer(body, { gfm: true });
  /** @type marked.Tokens.ListItem[] */
  const listItems = tokens.reduce((acc, token) => {
    if (token.type !== 'list') {
      return acc
    }
    return [...acc, ...token.items]
  }, [])

  console.log({listItems})

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

    const prDescription = pr.body;
    const outstandingTasks = checkOutstandingTasks(prDescription);

    // let check = {
    //   name: 'check-for-incomplete-tasks',
    //   head_sha: pr.head.sha,
    //   started_at: startTime,
    //   conclusion: 'failure',
    //   output: {
    //     title: (outstandingTasks.total - outstandingTasks.remaining) + ' / ' + outstandingTasks.total + ' tasks completed',
    //     summary: outstandingTasks.remaining + ' task' + (outstandingTasks.remaining > 1 ? 's' : '') + ' still to be completed',
    //     text: 'We check if any task lists need completing before you can merge this PR'
    //   }
    // }
    
    // // all finished?
    // if (outstandingTasks.remaining === 0) {
    //   check.conclusion = 'success';
    //   check.completed_at = (new Date).toISOString();
    //   check.output.summary = 'All tasks have been completed';
    // };

    console.log({prDescription, outstandingTasks})

    // TODO: experimenting with creating a commit status directly
    // TODO: add target_url?
    await octokit.rest.repos.createCommitStatus({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      sha: pr.head.sha,
      state: (outstandingTasks.remaining > 0) ? 'pending' : 'success',
      description: (outstandingTasks.total - outstandingTasks.remaining) + '/' + outstandingTasks.total + ' [x] completed',
      context: 'task-list-checker',
    })
    // send check back to GitHub
    // await octokit.rest.checks.create({...github.context.repo, ...check});

    // if (outstandingTasks.remaining > 0) {
    //   core.setFailed(`Testing core.setFailed output: ${check.output.summary}`)
    // }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()