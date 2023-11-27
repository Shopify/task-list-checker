// @ts-check

const core = require('@actions/core')
const run = require('./utils/run')
const tagging = require('./utils/tagging')

/**
 * @param {'github-token' | 'readme-url'} name 
 * @returns {string}
 */
function getInput(name) {
  const value = core.getInput(name)
  if (value === '') throw `Missing "${name}" input`
  return value
}

run.reportChecklistCompletion({
  githubToken: getInput('github-token'),
  readmeURL: getInput('readme-url'),
  rule: tagging.rule({skip: ['POST-MERGE:', 'N/A']})
}).catch(error => core.setFailed(error.message));
