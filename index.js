// @ts-check

const core = require('@actions/core')
const run = require('./utils/run')
const tagging = require('./utils/tagging')

/**
 * @param {'github-token'} name 
 * @returns {string}
 */
function getRequiredInput(name) {
  const value = core.getInput(name)
  if (value === '') throw `Missing "${name}" input`
  return value
}

/**
 * @returns {string}
 */
function getReadmeURL() {
  const custom = core.getInput('readme-url')
  return custom ?? 'https://github.com/Shopify/task-list-checker#in-a-pull-request'
}

try {
  run.reportChecklistCompletion({
    githubToken: getRequiredInput('github-token'),
    readmeURL: getReadmeURL(),
    rule: tagging.rule({skip: ['POST-MERGE:', 'N/A']})
  })
} catch (error) {
  core.setFailed(error.message)
}