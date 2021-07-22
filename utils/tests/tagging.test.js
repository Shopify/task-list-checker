// @ts-check

const tagging = require('../tagging')

describe('tagging', () => {
    describe('rule', () => {
        it('should exclude items that match any of the skip tags', () => {
            const rule = tagging.rule({skip: ['SKIP', 'IGNORE', 'N/A']})

            expect(rule.include({text: 'some text SKIP more text'})).toBe(false)
            expect(rule.include({text: 'some text IGNORE more text'})).toBe(false)
            expect(rule.include({text: 'some text N/A more text'})).toBe(false)

            expect(rule.include({text: 'some text OTHER more text'})).toBe(true)
        })
        it('should generate a human-readable explanation of the tags being skipped', () => {
            const rule = tagging.rule({skip: ['SKIP', 'IGNORE', 'N/A']})
            expect(rule.skipExplanation).toBe('tagged "SKIP" or "IGNORE" or "N/A"')
        })
    })
})