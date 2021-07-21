Here are the features we want, and their status:

- [x] Marks pull requests as pending when there are incomplete task list items.
- [x] Looks for incomplete task list items in pull request bodies.
- [x] ~Looks for incomplete tasks in the pull request review bodies.~ N/A, staying in the PR description solves a variety of problems
- [x] ~Looks for incomplete tasks in the pull request review comment bodies.~ N/A, staying in the PR description solves a variety of problems
- [x] ~Adds links to the pull request's Checks page to the incomplete items.~ N/A, all checkboxes will be easily findable in the PR description
- [ ] Updates existing [check run](https://docs.github.com/en/rest/reference/checks#runs) (if it exists) rather than creating a new one each time.
- [x] ~When this is enabled, update the pull request template to explain how to strike through / remove irrelevant checkboxes~ N/A explanation included in the status message