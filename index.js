// @ts-check

const core = require('@actions/core')
const run = require('./utils/run')
const tagging = require('./utils/tagging')

/**
 * @param {'github-token'} name 
 * @returns {string}
 */
function input(name) {
  const value = core.getInput(name)
  if (value === '') throw `Missing "${name}" input`
  return value
}

try {
  run.reportChecklistCompletion({
    githubToken: input('github-token'),
    rule: tagging.rule({skip: ['POST-MERGE:', 'N/A']})
  })
} catch (error) {
  core.setFailed(error.message)
}