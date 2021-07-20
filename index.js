// @ts-check
const core = require('@actions/core')
const runner = require('./utils/runner')

try {
  runner.reportChecklistCompletion({
    githubToken: core.getInput('github-token'),
    skipTags: ['POST-MERGE:', 'N/A']
  })
} catch (error) {
  core.setFailed(error.message)
}