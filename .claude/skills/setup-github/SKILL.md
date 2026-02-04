---
name: setup-github
description: Switch GitHub Account and Update Git & GitHub Configuration.
disable-model-invocation: true
---

This skill performs the following tasks:
1. Reset Global Git Configuration.
2. Prompt for Name, Email & Username & Repository (GitHub).
3. Configure Local Git Settings
4. Set Remote URL
5. Switch GitHub Authentication

When invoked:
1. Ask the user for their Name, Email, GitHub Username, and Repository name
2. Run: `./scripts/setup.sh "<name>" "<email>" "<username>" "<repository>"`