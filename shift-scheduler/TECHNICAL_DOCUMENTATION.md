# AI Healthcare Shift Scheduler Technical Documentation

## Overview

The AI Healthcare Shift Scheduler is a web application that enables healthcare administrators to create and manage staff shifts using natural language input. The system leverages AI to interpret shift descriptions and converts them into structured data.

## Architecture

The application follows a client-server architecture:

- **Frontend**: React single-page application
- **Backend**: Node.js/Express REST API
- **Database**: Supabase (PostgreSQL)
- **AI Service**: OpenAI API integration

## Technology Stack

### Frontend

- React 18 with TypeScript
- Context API for state management
- Axios for API communication
- Tailwind CSS for styling
- Jest for testing

### Backend

- Node.js with Express
- TypeScript for type safety
- OpenAI API integration
- Supabase client

### Infrastructure

- Containerized deployment ready
- CI/CD pipeline with GitHub Actions

## Core Components

### Frontend Components

- `ShiftInput`: Handles natural language input for shift creation
- `ShiftList`: Displays processed shifts in tabular format
- `ShiftContext`: Manages application state and API communication
- `ErrorMessage`: Displays validation errors and API failures

### Backend Services

- `shiftController`: Handles API request/response logic
- `openaiService`: Processes natural language with OpenAI
- `shiftService`: Manages shift data operations
- `validationService`: Validates shift data structure

## API Endpoints

### POST /api/shifts

Creates a new shift from natural language input.

- **Request**: `{ text: string }`
- **Response**: `{ shift: Shift, evaluation: Object }`

### GET /api/shifts

Retrieves all shifts.

- **Response**: `Shift[]`

## Data Models

### Shift

```typescript
interface Shift {
  id: string;
  position: string;
  start_time: string;
  end_time: string;
  rate: string;
  status: string;
  created_at: string;
}
```

## Current Security Measures

- Environment variables for sensitive credentials
- Input validation and sanitization
- Error handling that prevents information leakage

## Automated LLM Evaluation System

This system implements a comprehensive LLM evaluation framework to verify the functionality and accuracy of AI-generated responses in production.

### Evaluation Approach

Our LLM evaluation system employs a multi-layered approach:

1. **Basic Structural Validation**: First-pass validation checking for required fields, correct data formats, logical time sequences, and valid position data.

2. **LLM-based Semantic Validation**: A separate LLM evaluation call that reviews the parsing results against the original input, providing detailed quality metrics and assessment.

3. **Automated Test Suite**: Dedicated tests that directly evaluate the LLM's performance across various input scenarios without relying on mocks.

### Evaluation Metrics

The system tracks several key metrics:

- **Position Accuracy**: Measures accuracy in identifying healthcare roles (0-100)
- **Time Accuracy**: Evaluates correctness of start/end time parsing (0-100)
- **Rate Accuracy**: Assesses accurate parsing of compensation rates (0-100)
- **Overall Quality**: Holistic measure of parse quality and completeness (0-100)

### Implementation Details

- **Dual-LLM Architecture**: Uses a separate LLM call to independently evaluate the primary LLM's output
- **Non-mocked Tests**: Real API calls test actual LLM behavior in various scenarios
- **Performance Monitoring**: Aggregates evaluation metrics to track system accuracy over time
- **Error Analysis**: Provides detailed feedback on parsing issues to guide improvements

### Example Evaluation Response

```json
{
  "basic": {
    "valid": true,
    "results": {
      "requiredFields": true,
      "dateFormats": true,
      "timeSequence": true,
      "position": true
    }
  },
  "advanced": {
    "score": 92.3,
    "feedback": "The system correctly identified the healthcare role, time requirements, and compensation rate.",
    "correct": true,
    "metrics": {
      "positionAccuracy": 95,
      "timeAccuracy": 90,
      "rateAccuracy": 98,
      "overallQuality": 86
    }
  }
}
```

## Planned Enhancements

### Near-term

- User authentication and authorization
- Role-based access control
- Input rate limiting
- Session management

### Mid-term

- Enhanced data validation
- Audit logging
- API versioning
- Conflict resolution for overlapping shifts

### Long-term

- Multi-tenant architecture
- Advanced analytics dashboard
- Mobile application
- Integration with hospital management systems
- Compliance with healthcare regulations (HIPAA)

## Performance Considerations

- Frontend optimization with React.memo and useCallback
- Backend caching for frequently accessed data
- Database query optimization
- API response compression

## Development Guidelines

- Commit message format: `<type>(<scope>): <description>`
- Branch naming: `feature/`, `bugfix/`, `hotfix/`, `release/`
- Testing required for all new features
- Code review mandatory for all PRs

## Monitoring and Maintenance

- Error logging and monitoring
- Performance metrics collection
- Regular dependency updates
- Scheduled database maintenance

---

_Documentation version: 1.0.0_
_Last updated: [current date]_
