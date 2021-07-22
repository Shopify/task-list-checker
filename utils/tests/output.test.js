// @ts-check

const output = require('../output')

describe('output', () => {
    describe('completion', () => {
        it('should display a pending message when remaining > 0', () => {
            const result = output.completion({total: 3, remaining: 2, skipped: 7}, {skipExplanation: 'some skip reason'})
            expect(result).toStrictEqual({
                state: 'pending',
                description: '1/3 tasks [x]; 7 skipped (some skip reason)',
                context: '- [ ] checklist completion'
            })
        })
        it('should display a success message when remaining === 0', () => {
            const result = output.completion({total: 3, remaining: 0, skipped: 7}, {skipExplanation: 'why they were skipped'})
            expect(result).toStrictEqual({
                state: 'success',
                description: '3/3 tasks [x]; 7 skipped (why they were skipped)',
                context: '- [ ] checklist completion'
            })
        })
        it('should display the same message format when 0 tasks are skipped, to explain how to skip tasks', () => {
            const result = output.completion({total: 3, remaining: 2, skipped: 0}, {skipExplanation: 'how to skip'})
            expect(result).toStrictEqual({
                state: 'pending',
                description: '1/3 tasks [x]; 0 skipped (how to skip)',
                context: '- [ ] checklist completion'
            })
        })
    })
})