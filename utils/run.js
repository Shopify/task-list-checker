// @ts-check
const github = require('@actions/github')
const output = require('./output')
const tagging = require('./tagging')

module.exports = {reportChecklistCompletion}

/**
 * @param {{githubToken: string; readmeURL: string; rule: tagging.Rule}} input 
 */
async function reportChecklistCompletion({githubToken, readmeURL: target_url, rule}) {
    const validEvents = ['pull_request']
    const {eventName} = github.context

    if (!validEvents.includes(eventName)) {
        throw `Invoked for an event that doesn't change the PR description "${eventName}"`
    }

    const octokit = github.getOctokit(githubToken)
    const pr = github.context.payload.pull_request

    const {owner, repo, sha} = {...github.context.repo, sha: pr.head.sha}
    await octokit.rest.repos.createCommitStatus({
        owner, repo, sha, target_url, ...output.completion(pr, rule)
    })
}