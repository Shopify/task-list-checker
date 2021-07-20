import {Rule} from './inclusion-rule'
import {OutstandingTasks} from './task-checker'

interface Status {
    state: 'pending' | 'success'
    description: string
    context: string
}
export function status({remaining, total, skipped}: OutstandingTasks, rule: Rule): Status {
    return {
        state: (remaining > 0) ? 'pending' : 'success',
        description: (total - remaining) + '/' + total + ' tasks [x]; ' + skipped + ' skipped (' + rule.skipExplanation + ')',
        context: '- [ ] checklist completion'
    }
}