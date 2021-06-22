# task-list-checker

This is a GitHub Action to look for incomplete [task list](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-issues/about-task-lists) items in pull requests.

## Project Status

Here are the features we want, and their status:

- [x] Marks pull requests as pending when there are incomplete task list items.
- [x] Looks for incomplete task list items in pull request bodies.
- [ ] Looks for incomplete tasks in the pull request review bodies.
- [ ] Looks for incomplete tasks in the pull request review comment bodies.
- [ ] Adds links to the pull request's Checks page to the incomplete items.
- [ ] Updates existing [check run](https://docs.github.com/en/rest/reference/checks#runs) (if it exists) rather than creating a new one each time.

## Usage

Add this to your GitHub project by creating `.github/workflows/task-list-checker.yml` with the following contents:

```yml
name: GitHub Task List Checker
on:
  pull_request:
    types: [opened, edited]
  pull_request_review:
    types: [submitted, edited, dismissed]
  pull_request_review_comment:
    types: [created, edited, deleted]
jobs:
  task-list-checker:
    runs-on: ubuntu-latest
    steps:
      - name: Check for incomplete task list items
        uses: ashfurrow/task-list-checker@main
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## License

MIT.
