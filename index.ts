import * as core from '@actions/core'
import {reportChecklistCompletion} from './utils/runner'

try {
  reportChecklistCompletion({
    githubToken: core.getInput('github-token'),
    skipTags: ['POST-MERGE:', 'N/A']
  })
} catch (error) {
  core.setFailed(error.message)
}