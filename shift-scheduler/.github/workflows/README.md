# CI/CD Pipeline for Healthcare Shift Scheduler

This document explains the Continuous Integration (CI) pipeline for the Healthcare Shift Scheduler application and how to expand it in the future.

## Current CI Pipeline

The current CI pipeline runs on GitHub Actions and is triggered on:

- Any push to the `main` branch
- Any pull request targeting the `main` branch

### Pipeline Components

The workflow consists of two parallel jobs:

1. **Backend Checks**:

   - Installs dependencies
   - Runs linting to ensure code quality
   - Executes tests to verify functionality
   - Builds the backend to validate compilation

2. **Frontend Checks**:
   - Installs dependencies
   - Runs linting
   - Executes tests
   - Builds the frontend to validate the build process

### Environment Variables

The pipeline uses the following secrets/environment variables:

**Backend**:

- `SUPABASE_URL` - Connection URL for Supabase
- `SUPABASE_KEY` - API key for Supabase
- `OPENAI_API_KEY` - API key for OpenAI
- `NODE_ENV` - Set to "test" for testing environment

**Frontend**:

- `REACT_APP_API_URL` - API URL for the backend (defaults to localhost:3001)
- `CI` - Set to true for proper test execution in CI environments

## Setting Up GitHub Secrets

To make the CI pipeline work correctly, you need to add the following secrets in your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following repository secrets:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `OPENAI_API_KEY`
   - `REACT_APP_API_URL` (optional, for non-local environments)

## Expanding the Pipeline

Here are ways to expand this pipeline in the future:

### Add Code Coverage Reporting

```yaml
- name: Generate coverage report
  run: cd backend && npm run test:coverage

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    directory: ./backend/coverage/
```

### Add Security Scanning

```yaml
- name: Security audit
  run: cd backend && npm audit --audit-level=high
```

### Add Deployment (when ready)

Create a new file `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    needs: [backend, frontend]
    runs-on: ubuntu-latest
    steps:
      # Add deployment steps here
```

### Add Pull Request Labeling

```yaml
- name: Label PRs
  uses: actions/labeler@v4
  with:
    repo-token: "${{ secrets.GITHUB_TOKEN }}"
```

### Add Status Checks for PRs

In your GitHub repository settings, enable branch protection rules:

1. Go to Settings > Branches
2. Add a rule for the `main` branch
3. Require status checks to pass before merging
4. Select the CI checks as required

## Troubleshooting

If you encounter issues with the CI pipeline:

1. Check the GitHub Actions logs for specific errors
2. Verify that all secrets are properly set
3. Ensure tests are running correctly locally before pushing
4. Check for environment-specific code that might behave differently in CI

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
