// @ts-check
const comment = require('./comment')

module.exports = {completion}

/**
 * @typedef {'pending' | 'success'} State
 * 
 * @param {comment.OutstandingTasks} outstandingTasks 
 * @param {{skipExplanation: string}} rule 
 * @returns {{state: State; description: string; context: string}}
 */
function completion(outstandingTasks, rule) {
    console.info({outstandingTasks})

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
 * @param {{skipExplanation: string}} rule
 * @return {string}
 */
function description({total, remaining, skipped}, rule) {
    const completed = (total - remaining)
    const completionMessage = completed + '/' + total + ' tasks [x]'
    const skipMessage = skipped + ' skipped (' + rule.skipExplanation + ')'

    return completionMessage + '; ' + skipMessage
}