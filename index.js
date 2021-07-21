// @ts-check

const core = require('@actions/core')
const github = require('@actions/github')
const marked = require('marked')

/**
 * @param {string} text 
 * @returns {string}
 */
function textWithoutSublists(text) {
  return text.split('\n')[0]
}

/**
 * @param {string} body 
 * @returns {{checked: boolean; ourText: string}[]}
 */
function extractChecklistItems(body) {
  const tokens = marked.lexer(body, { gfm: true })

  /** @type {{checked: boolean; ourText: string}[]} */
  let checklistItems = []
  marked.walkTokens(tokens, token => {
    if (token.type !== 'list_item') return
    if (token.checked === true || token.checked === false) {
      const ourText = textWithoutSublists(token.text)
      checklistItems = checklistItems.concat({checked: token.checked, ourText})
    }
  })
  return checklistItems
}

// This function taken from https://github.com/stilliard/github-task-list-completed/blob/master/src/check-outstanding-tasks.js
/**
 * @param {string | undefined} body 
 * @param {string[]} skipTokens 
 * @returns {{total: number; remaining: number; skipped: number}}
 */
function checkOutstandingTasks(body, skipTokens) {
  if (body === undefined) {
      return {
          total: 0,
          remaining: 0,
          skipped: 0
      }
  }

  const checklistItems = extractChecklistItems(body)
  const prunedItems = checklistItems.filter(item => skipTokens.filter(
    token => item.ourText.includes(token)
  ).length == 0)

  console.log({checklistItems, prunedItems})

  return {
    total: prunedItems.length,
    remaining: prunedItems.filter(item => item.checked === false).length,
    skipped: (checklistItems.length - prunedItems.length)
  }
}

async function run() {
  try {
    const GITHUB_TOKEN = core.getInput('github-token')
    if (!GITHUB_TOKEN) {
      throw "Missing github-token input"
    }
    if (!['pull_request'].includes(github.context.eventName)) {
      throw `Being invoked for an event that does not change the PR description "${github.context.eventName}"`
    }

    const octokit = github.getOctokit(GITHUB_TOKEN)
    const pr = github.context.payload.pull_request

    const prDescription = pr.body
    const skipTokens = ['POST-MERGE:', 'N/A']
    const outstandingTasks = checkOutstandingTasks(prDescription, skipTokens)

    console.log({prDescription, outstandingTasks})

    const skipTags = skipTokens.map(token => '"' + token + '"').join(' or ')
    await octokit.rest.repos.createCommitStatus({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      sha: pr.head.sha,
      state: (outstandingTasks.remaining > 0) ? 'pending' : 'success',
      description: (outstandingTasks.total - outstandingTasks.remaining) + '/' + outstandingTasks.total + ' tasks [x]; ' + outstandingTasks.skipped + ' skipped (tagged ' + skipTags + ')',
      context: '- [ ] checklist completion',
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()