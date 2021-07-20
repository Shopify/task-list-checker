import github from '@actions/github'
import * as checker from './task-checker'
import * as output from './human-readable'
import {rule} from './inclusion-rule'

interface Input {
    skipTags: string[]
    githubToken: string
}
export async function reportChecklistCompletion({skipTags, githubToken}: Input) {
    if (githubToken === '') {
        throw "Missing github-token input"
    }
    if (!['pull_request'].includes(github.context.eventName)) {
        throw `Being invoked for an event that does not change the PR description "${github.context.eventName}"`
    }

    const inclusionRule = rule({skipTags})
    const octokit = github.getOctokit(githubToken)
    const pr = github.context.payload.pull_request

    const outstandingTasks = checker.outstandingTasks(pr.body ?? '', inclusionRule)

    console.log({outstandingTasks})

    await octokit.rest.repos.createCommitStatus({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        sha: pr.head.sha,
        ...output.status(outstandingTasks, inclusionRule)
    })
}