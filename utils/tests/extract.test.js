// @ts-check

const extract = require('../extract')

describe('extract', () => {
    describe('checklistItems', () => {
        it('should include checklist items only', () => {
            const body = "This is some description text.\n" +
                        "- Regular list item.\n" +
                        "- [ ] Checklist item\n" +
                        "1. Numbered list item\n" 

            const items = extract.checklistItems(body)
            expect(items).toStrictEqual([
                {text: 'Checklist item', checked: false}
            ])
        })
        it('should correctly mark items as checked or unchecked', () => {
            const body = "- [x] Checked item\n" +
                        "- [ ] Unchecked item\n" 

            const items = extract.checklistItems(body)
            expect(items).toStrictEqual([
                {text: 'Checked item', checked: true},
                {text: 'Unchecked item', checked: false}
            ])
        })
        it('should include nested items', () => {
            const body = "- [ ] Parent item\n" +
                        "    - [ ] Child item\n" +
                        "- List item\n" +
                        "    - [x] Item under list\n" +
                        "1. Numbered item\n" +
                        "    - [ ] Item under numbered list\n" 

            const items = extract.checklistItems(body)
            expect(items).toStrictEqual([
                {text: 'Parent item', checked: false},
                {text: 'Child item', checked: false},
                {text: 'Item under list', checked: true},
                {text: 'Item under numbered list', checked: false},
            ])
        })
        it('should exclude items that are inside code blocks', () => {
            const body = "- [x] Inflated checklist item\n" +
                        "\n" +
                        "```\n" +
                        "- [ ] Uninflated checklist item\n" +
                        "```\n" 
            const items = extract.checklistItems(body)
            expect(items).toStrictEqual([
                {text: 'Inflated checklist item', checked: true},
            ])
        })
        it('should exclude items inside html comments', () => {
            const body = "<!-- - [ ] Single line comment -->\n" +
                        "- [ ] Visible checklist item\n" +
                        "<!--\n" +
                        "- [ ] Commented out checklist item\n" +
                        "-->\n" +
                        "Midline block comment: <!--\n" +
                        "- [ ] Midline block comment\n" +
                        "-->"
            const items = extract.checklistItems(body)
            expect(items).toStrictEqual([
                {text: 'Visible checklist item', checked: false}
            ])
        })
        it('should ignore html comment markers if they are inside backticks', () => {
            const body = "`<!--`\n" +
                        "- [x] This item should be visible\n" +
                        "`-->`\n" +
                        "```\n" +
                        "<!--\n" +
                        "```\n" +
                        "- [ ] This item should also be visible\n"
            const items = extract.checklistItems(body)
            expect(items).toStrictEqual([
                {text: 'This item should be visible', checked: true},
                {text: 'This item should also be visible', checked: false}
            ])
        })
        it('should gracefully handle empty bodies', () => {
            expect(extract.checklistItems('')).toStrictEqual([])
            expect(extract.checklistItems(undefined)).toStrictEqual([])
            expect(extract.checklistItems(null)).toStrictEqual([])
        })
    })
})