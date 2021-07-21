// @ts-check
const marked = require('marked')

/**
 * @typedef {{checked: boolean; text: string}} ChecklistItem
 * 
 * @param {string} body 
 * @returns {ChecklistItem[]}
 */
export function checklistItems(body) {
    const githubFlavoredMarkdown = true
    const tokens = marked.lexer(body, {gfm: githubFlavoredMarkdown})

    /** @type {ChecklistItem[]} */
    let items = []
    marked.walkTokens(tokens, token => {
        items = items.concat(checkableItem(token))
    })
    return items
}

/**
 * @param {marked.Token} token 
 * @returns {ChecklistItem[]}
 */
function checkableItem(token) {
    if (token.type !== 'list_item' || token.checked === undefined) return []
    return [{
        checked: token.checked, 
        text: textWithoutSublists(token.text)
    }]
}

/**
 * @param {string} text 
 * @returns {string}
 */
function textWithoutSublists(text) {
    return text.split('\n')[0]
}