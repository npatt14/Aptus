# GitHub Workflows for AI Healthcare Shift Scheduler

This directory contains GitHub Action workflow placeholders that can be enhanced to create a CI/CD pipeline.

## Available Workflow Placeholders

### 1. Continuous Integration (CI)

**File:** `workflows/ci.yml`

A minimal placeholder for setting up tests:

- Currently configured to run on `main` and `develop` branches and pull requests
- Contains commented examples where you can add your test commands
- Ready to be customized with your specific testing needs

### 2. Continuous Deployment (CD)

**File:** `workflows/cd.yml`

A minimal placeholder for setting up deployment:

- Currently configured to run when code is pushed to the `main` branch
- Contains commented examples for build and deployment steps
- Ready to be customized with your specific deployment commands

### 3. Pull Request Checks

**File:** `workflows/pr-checks.yml`

A minimal placeholder for pull request validation:

- Currently configured to run on pull requests to `main` and `develop` branches
- Contains commented examples for PR validation steps
- Ready to be customized with your specific validation requirements

## Getting Started

To implement these workflows:

1. Edit each workflow file to add your actual commands
2. Commit and push the changes to your repository

## Examples of Implementation

### For CI (ci.yml):

```yaml
# Add steps like:
- name: Install dependencies
  run: npm ci

- name: Run tests
  run: npm test
```

### For CD (cd.yml):

```yaml
# Add steps like:
- name: Build application
  run: npm run build

- name: Deploy to server
  run: |
    # Your deployment commands here
```

### For PR Checks (pr-checks.yml):

```yaml
# Add steps like:
- name: Check commit messages
  uses: some-action/check-commits@v1
```

## Required Secrets

When implementing deployment, you may need to add secrets to your repository:

- `DEPLOY_KEY`: SSH key for deployment
- `SUPABASE_URL`: Your Supabase URL
- `SUPABASE_KEY`: Your Supabase API key
- `OPENAI_API_KEY`: Your OpenAI API key
