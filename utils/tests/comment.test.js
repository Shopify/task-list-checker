// @ts-check

const comment = require('../comment')
const extract = require('../extract')
const tagging = require('../tagging')

describe('comment', () => {
    describe('outstandingTasks', () => {
        it('should correctly count remaining and total tasks', () => {
            /** @type extract.ChecklistItem[] */
            const tasks = [
                {text: 'first', checked: true},
                {text: 'second', checked: false},
                {text: 'third', checked: true},
                {text: 'fourth', checked: true},
                {text: 'fifth', checked: false}
            ]
            const rule = {include: _ => true}
            expect(comment.outstandingTasks(tasks, rule)).toStrictEqual({
                total: 5,
                remaining: 2,
                skipped: 0
            })
        })
        it('should exclude skipped tasks from the total and remaining counts', () => {
            /** @type extract.ChecklistItem[] */
            const tasks = [
                {text: 'first', checked: true},
                {text: 'second', checked: false},
                {text: 'third', checked: true},
                {text: 'fourth', checked: true},
                {text: 'fifth', checked: false}
            ]
            const rule = {include: item => item.text !== 'second' && item.text !== 'third'}
            expect(comment.outstandingTasks(tasks, rule)).toStrictEqual({
                total: 3,
                remaining: 1,
                skipped: 2
            })
        })
    })
})