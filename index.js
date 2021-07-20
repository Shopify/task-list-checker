// @ts-check

const core = require('@actions/core');
const github = require('@actions/github');
const marked = require('marked');

// This function taken from https://github.com/stilliard/github-task-list-completed/blob/master/src/check-outstanding-tasks.js
function checkOutstandingTasks(body, skipTokens) {
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
  const prunedItems = listItems.filter(item => skipTokens.filter(
    token => item.text.includes(token)
  ).length == 0)

  // return counts of task list items and how many are left to be completed
  return {
    total: prunedItems.filter(item => item.checked !== undefined).length,
    remaining: prunedItems.filter(item => item.checked === false).length,
    skipped: (listItems.length - prunedItems.length)
  };
};

async function run() {
  try {
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
    const skipTokens = ['POST-MERGE:', 'N/A']
    const outstandingTasks = checkOutstandingTasks(prDescription, skipTokens);

    console.log({prDescription, outstandingTasks})

    const skipTags = skipTokens.map(token => '"' + token + '"').join(' or ')
    await octokit.rest.repos.createCommitStatus({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      sha: pr.head.sha,
      state: (outstandingTasks.remaining > 0) ? 'pending' : 'success',
      description: (outstandingTasks.total - outstandingTasks.remaining) + '/' + outstandingTasks.total + ' checklist items completed. ' + outstandingTasks.skipped + ' skipped (tagged ' + skipTags + ').',
      context: 'task-list-checker',
    })
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()