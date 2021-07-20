export interface Rule {
    skipExplanation: string
    include(task: {text: string}): boolean
}
export function rule({skipTags}: {skipTags: string[]}): Rule {
    const skipHint = skipTags.map(token => '"' + token + '"').join(' or ')
    return {
        skipExplanation: 'tagged ' + skipHint,
        include(task: {text: string}): boolean {
            return skipTags.filter(tag => task.text.includes(tag)).length === 0
        }
    }
}