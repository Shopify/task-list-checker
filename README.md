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
        uses: ashfurrow/task-list-checker@main
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### In a pull request
The job will look for checkboxes **in the PR description only**. Checkboxes in comments are ignored, since scattering tasks throughout the PR makes it harder for authors/reviewers to find the remaining tasks. If a task is related to a specific comment, add the task to the PR description with a link to the relevant comment.

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

## Project Status
Here are the features we want, and their status:

- [x] Marks pull requests as pending when there are incomplete task list items.
- [x] Looks for incomplete task list items in pull request bodies.
- [x] ~Looks for incomplete tasks in the pull request review bodies.~ N/A, staying in the PR description solves a variety of problems
- [x] ~Looks for incomplete tasks in the pull request review comment bodies.~ N/A, staying in the PR description solves a variety of problems
- [x] ~Adds links to the pull request's Checks page to the incomplete items.~ N/A, all checkboxes will be easily findable in the PR description
- [ ] Updates existing [check run](https://docs.github.com/en/rest/reference/checks#runs) (if it exists) rather than creating a new one each time.
- [x] ~When this is enabled, update the pull request template to explain how to strike through / remove irrelevant checkboxes~ N/A explanation included in the status message

## License

MIT.
