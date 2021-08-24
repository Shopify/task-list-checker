// @ts-check
const marked = require('marked')

module.exports = {checklistItems}

/**
 * @typedef {{checked: boolean; text: string}} ChecklistItem
 * 
 * @param {string} body 
 * @returns {ChecklistItem[]}
 */
function checklistItems(body) {
    if (body === undefined || body === null) return []

    const githubFlavoredMarkdown = true
    const tokens = marked.lexer(body, {gfm: githubFlavoredMarkdown})

    return unrollSkippingHTMLComments(tokens).flatMap(token => checkableItem(token))
}

/**
 * @param {marked.TokensList} tokens
 * @returns {marked.Token[]}
 */
function unrollSkippingHTMLComments(tokens) {
    let inHTMLComment = false
    /** @type {marked.Token[]} */
    let unrolled = []
    marked.walkTokens(tokens, token => {
        const htmlComment = detectHTMLComment(token)
        if (htmlComment.start) inHTMLComment = true
        if (inHTMLComment) {
            if (htmlComment.end) inHTMLComment = false
        } else {
            unrolled = unrolled.concat(token)
        }
    })
    return unrolled
}

/**
 * @param {marked.Token} token 
 * @returns {{start: boolean; end: boolean}}
 */
function detectHTMLComment(token) {
    const startIndex = token.raw.lastIndexOf('<!--')
    const endIndex = token.raw.indexOf('-->', startIndex)
    return {
        start: (token.type === 'html' || token.type === 'text') && startIndex >= 0,
        end: endIndex >= 0,
    }
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