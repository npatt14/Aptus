## Current CI Pipeline

The current CI pipeline runs on GitHub Actions and is triggered on:

- Any push to the `main` branch
- Any pull request targeting the `main` branch

### Pipeline Components

The workflow runs the following on the backend and frontend

   - Installs dependencies
   - Runs linting 
   - Executes tests 
   - Builds the backend to validate compilation


### Env Variables

The pipeline uses the following secrets/environment variables:

**Backend**:

- `SUPABASE_URL` - Connection URL for Supabase
- `SUPABASE_KEY` - API key for Supabase
- `OPENAI_API_KEY` - API key for OpenAI
- `NODE_ENV` - Set to "test" for testing environment

**Frontend**:

- `REACT_APP_API_URL` - API URL for the backend (default - localhost:3001)
- `CI` - Set to true 

