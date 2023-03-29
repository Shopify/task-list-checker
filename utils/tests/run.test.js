// @ts-check

const run = require('../run')
const tagging = require('../tagging')

jest.mock('@actions/github')
const github = require('@actions/github')

it('throws when invoked on invalid event', async () => {
  // @ts-ignore
  github.context = {
    eventName: 'INVALID_EVENT_NAME'
  }
  await expect(run.reportChecklistCompletion({
      githubToken: 'TEST-TOKEN',
      readmeURL: 'https://example.com/TEST-README',
      rule: tagging.rule({skip: ['POST-MERGE:', 'N/A']})
    })
  ).rejects.toEqual(`Invoked for an event that doesn't change the PR description "INVALID_EVENT_NAME"`)
})

it('does not run for Dependabot PRs', async () => {
  // @ts-ignore
  github.context = {
    eventName: 'pull_request',
    actor: 'dependabot[bot]',
    payload: {}
  }
  github.getOctokit = jest.fn()

  await expect(run.reportChecklistCompletion({
    githubToken: 'TEST-TOKEN',
    readmeURL: 'https://example.com/TEST-README',
    rule: tagging.rule({skip: ['POST-MERGE:', 'N/A']})
  })
  )

  expect(github.getOctokit).not.toHaveBeenCalled()
})
