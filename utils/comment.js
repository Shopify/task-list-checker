// @ts-check
const extract = require('./extract')
const tagging = require('./tagging')

// This function taken from https://github.com/stilliard/github-task-list-completed/blob/master/src/check-outstanding-tasks.js
/**
 * @typedef {{total: number; remaining: number; skipped: number}} OutstandingTasks
 * 
 * @param {string | undefined} body 
 * @param {tagging.Rule} rule 
 * @returns {OutstandingTasks}
 */
export function outstandingTasks(body, rule) {
    console.log({body})

    if (body === undefined) return {total: 0, remaining: 0, skipped: 0}
  
    const checklistItems = extract.checklistItems(body)
    const prunedItems = checklistItems.filter(rule.include)
  
    console.log({checklistItems, prunedItems})
  
    return {
      total: prunedItems.length,
      remaining: prunedItems.filter(isUnchecked).length,
      skipped: (checklistItems.length - prunedItems.length)
    }
}

/**
 * @param {extract.ChecklistItem} item 
 * @returns {boolean}
 */
function isUnchecked(item) {
    return item.checked === false
}