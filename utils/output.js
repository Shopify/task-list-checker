// @ts-check
const comment = require('./comment')
const tagging = require('./tagging')

module.exports = {completion}

/**
 * @typedef {'pending' | 'success'} State
 * 
 * @param {{body?: string}} pr 
 * @param {tagging.Rule} rule 
 * @returns {{state: State; description: string; context: string}}
 */
function completion(pr, rule) {
    const outstandingTasks = comment.outstandingTasks(pr.body, rule)
    console.log({outstandingTasks})

    return {
        state: state(outstandingTasks),
        description: description(outstandingTasks, rule),
        context: '- [ ] checklist completion',
    }
}

/**
 * @param {comment.OutstandingTasks} outstandingTasks 
 * @returns {State}
 */
function state({remaining}) {
    return (remaining > 0) ? 'pending' : 'success'
}

/**
 * @param {comment.OutstandingTasks} outstandingTasks
 * @param {tagging.Rule} rule
 * @return {string}
 */
function description({total, remaining, skipped}, rule) {
    const completed = (total - remaining)
    const completionMessage = completed + '/' + total + ' tasks [x]'
    const skipMessage = skipped + ' skipped (' + rule.skipExplanation + ')'

    return completionMessage + '; ' + skipMessage
}