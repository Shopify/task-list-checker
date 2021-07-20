import marked from 'marked'
import {Rule} from './inclusion-rule'

export interface OutstandingTasks {
    total: number
    remaining: number
    skipped: number
}
// This function taken from https://github.com/stilliard/github-task-list-completed/blob/master/src/check-outstanding-tasks.js
export function outstandingTasks(body: string, rule: Rule): OutstandingTasks {
    const tasks = checklistItems(body)
    const criticalTasks = tasks.filter(rule.include)

    console.log({tasks, criticalTasks})
  
    return {
      total: criticalTasks.length,
      remaining: criticalTasks.filter(isUnchecked).length,
      skipped: (tasks.length - criticalTasks.length)
    }
}

function isCheckable(item: {checked?: boolean}): boolean {
    return item.checked !== undefined
}

function isUnchecked(item: {checked?: boolean}): boolean {
    return item.checked === false
}

function checklistItems(body: string): Array<{text: string; checked: boolean}> {
    const tokens = marked.lexer(body, { gfm: true })
    const listItems = tokens.reduce((acc, token) => {
      if (token.type !== 'list') {
        return acc
      }
      return [...acc, ...token.items]
    }, [])
    
    return listItems.filter(isCheckable)
}