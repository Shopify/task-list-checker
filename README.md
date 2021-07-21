# task-list-checker

This is a GitHub Action to look for incomplete [task list](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-issues/about-task-lists) items in pull requests.

## Project Status

Here are the features we want, and their status:

- [x] Marks pull requests as pending when there are incomplete task list items.
- [x] Looks for incomplete task list items in pull request bodies.
- [x] ~Looks for incomplete tasks in the pull request review bodies.~ N/A, staying in the PR description solves a variety of problems
- [x] ~Looks for incomplete tasks in the pull request review comment bodies.~ N/A, staying in the PR description solves a variety of problems
- [x] ~Adds links to the pull request's Checks page to the incomplete items.~ N/A, all checkboxes will be easily findable in the PR description
- [ ] Updates existing [check run](https://docs.github.com/en/rest/reference/checks#runs) (if it exists) rather than creating a new one each time.
- [x] ~When this is enabled, update the pull request template to explain how to strike through / remove irrelevant checkboxes~ N/A explanation included in the status message

## Usage

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

## License

MIT.
