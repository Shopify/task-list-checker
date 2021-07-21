// @ts-check

module.exports = {rule}

/**
 * @typedef {{text: string}} TaggableItem
 * @typedef {{skipExplanation: string; include(item: TaggableItem): boolean}} Rule
 * 
 * @param {{skip: string[]}} input
 * @returns {Rule}
 */
function rule({skip: tags}) {
    return {
        skipExplanation: skipExplanation({skipping: tags}),
        include: item => matching({tags, in: item}).length === 0
    }
}

/**
 * @param {{skipping: string[]}} input 
 * @returns {string}
 */
function skipExplanation({skipping: skipTags}) {
    const quotedTags = skipTags.map(tag => '"' + tag + '"')
    return 'tagged ' + quotedTags.join(' or ')
}

/**
 * @param {{tags: string[]; in: TaggableItem}} input 
 * @returns {string[]}
 */
function matching({tags, in: item}) {
    return tags.filter(tag => item.text.includes(tag))
}