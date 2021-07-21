// @ts-check
const github = require('@actions/github')
const output = require('./output')
const tagging = require('./tagging')

/**
 * @param {{githubToken: string; rule: tagging.Rule}} input 
 */
export async function reportChecklistCompletion({githubToken, rule}) {
    const validEvents = ['pull_request']
    const {eventName} = github.context

    if (!validEvents.includes(eventName)) {
        throw `Invoked for an event that doesn't change the PR description "${eventName}"`
    }

    const octokit = github.getOctokit(githubToken)
    const pr = github.context.payload.pull_request

    const {owner, repo, sha} = {...github.context.repo, sha: pr.head.sha}
    await octokit.rest.repos.createCommitStatus({
        owner, repo, sha, ...output.completion(pr, rule)
    })
}