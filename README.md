# task-list-checker

This is a GitHub Action to look for incomplete [task list](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-issues/about-task-lists) items in pull requests.

## Usage
### Setup
Add this to your GitHub project by creating `.github/workflows/task-list-checker.yml` with the following contents:

```yml
name: GitHub Task List Checker
on:
  pull_request:
    types: [opened, edited]
jobs:
  task-list-checker:
    runs-on: ubuntu-latest
    steps:
      - name: Check for incomplete task list items
        uses: Shopify/task-list-checker@main
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

In some cases, you may want to point PR authors toward additional documentation about checklist best practices for that repo. To do that, add a `readme-url` parameter underneath the `github-token` parameter. This will make `task-list-checker`'s "Details" link point toward your custom docs url.

The `readme-url` parameter is optional. If omitted, the "Details" link will default to pointing toward this README file.

### In a pull request
When a PR is first opened, and any time the description is edited (including automatic edits triggered by clicking on a checkbox), `task-list-checker` will count the checked and unchecked checkboxes in the description. If any tasks are unchecked, it will set the PR's status to `pending`, blocking merge.

Checkboxes in comments are ignored, since scattering tasks throughout the PR makes it harder for authors/reviewers to locate the remaining tasks. If a task is related to a specific file or comment, add the checkbox to the PR description with a link out to the relevant location.

Any checkbox containing the text **N/A** (all caps) will be skipped; use this to tag tasks that are not relevant to the current PR. Ex:
```
- [ ] ~updated storybook~ N/A, no new components
```

Any checkbox containing the text **POST-MERGE:** (all caps) will be skipped; use this to tag tasks that will be completed after the merge. Ex:
```
- [ ] POST-MERGE: ramp the feature flag
```

### Checkbox inflation
Uninflated checkboxes in code blocks or tables are ignored. Nested checkboxes, indented checkboxes, and checkboxes in `>` blockquotes are NOT ignored.

#### Uninflated checkboxes
```
- [ ] this checkbox would be ignored since markdown doesn't inflate checkboxes in code blocks
```
| table |
| --- |
| - [ ] this checkbox would also be ignored, since markdown doesn't inflate checkboxes in tables |

#### Inflated checkboxes
- [ ] inflated checkboxes count toward the total
    - [ ] even if they're nested
> - [ ] or in a block quote

## License

MIT.
