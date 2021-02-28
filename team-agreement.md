# Team Development Processes

## Team Conflict Plan

### What is the group process to resolve conflict, when it arises?

* Vote majority, with quorum of 3

* Tom has veto power - can be overruled by quorum.

### How will you raise concerns to members who are not adequately contributing?

* Address with member in question.

* Delegate tasks appropriate to strengths.

* Give concrete specific tasks.

### How and when will you escalate the conflict if your resolution attempts are unsuccessful?

* Readdress concerns with members in question.

* Defer to instructors if issues continue.

## Working Hours

  | Days | Hours |
  | --- | --- |
  | Weekdays | 6:30pm - 9:30pm PST |
  | Weekends | 9:00am - 6:30pm PST *ad hoc lunch |

## Communication Plan

* [Group Slack Channel](https://codefellows.slack.com/archives/G01PFL9E21Y "Group Slack Channel") - Install on Phone and Computer

* Ensuring everyone is heard

* Be polite, don’t talk over others

* Daily standup at start of agreed times

* Daily post mortem 15 minutes before agreed upon times.

* If not going to be in attendance post in slack.

## Work Plan

* GitHub Project

### Task Assignment

* If unassigned grab as needed.

* If assigned - check in with person assigned prior to beginning.

* If task is a blocker it can be assigned by vote.

### Task States

| State | Description |
| ---- | ---- |
| TODO | Task to complete |
| In Progress | Task currently being worked on |
| Committed | Tasks which have been pushed to a remote feature branch |
| In Review | Tasks which are currently under review for pull request |
| Done | Task with commits that have been merged into main |

### Git Flow

* <bold>Main - don’t commit directly to main!</bold>

* Dev - Primarily working off feature branches of dev.

* Feature branches `initials/description-of-feature`

### Merges

* Merges to dev should happen after approval.

* Merges to main should happen during active hours with a team quorum.

* Prior to merges to main post in the group slack.

#### Pull Requests

* PR’s to the main branch need 3 of 4 all members.

  * If we have tests they should be run and pass (stretch goal)

* PR’s to the dev branch need 2 of 4 all members.

* PR’s should include a description of the merge

* If seeking a review of a pull request and haven't gotten a response - post in slack.

#### Commits

* Messages should be less than 72 characters.

* Lower case, no periods, & use [imperative mood](https://stackoverflow.com/a/3580764/7967484 "imperative-style commit messages")

* Should have [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/#summary "Conventional Commits")

| Type | Commit Message |
| ---- | ----
| Fix | `fix: issue #0001` |
| Chore | `chore: update component of x`|
| Docs | `docs: add x details to the readme` |
| Test | `test: make tests for x feature` |
| style | `style: change css of x` |
| feat | `feat: add component in x #0002,` |
