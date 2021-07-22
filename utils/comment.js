// @ts-check
const extract = require('./extract')
const tagging = require('./tagging')

module.exports = {outstandingTasks}

// This function taken from https://github.com/stilliard/github-task-list-completed/blob/master/src/check-outstanding-tasks.js
/**
 * @typedef {{total: number; remaining: number; skipped: number}} OutstandingTasks
 * 
 * @param {extract.ChecklistItem[]} checklistItems 
 * @param {{include(item: tagging.TaggableItem): boolean}} rule 
 * @returns {OutstandingTasks}
 */
function outstandingTasks(checklistItems, rule) {
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