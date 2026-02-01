# oas_e2e

## Overview
**oas_e2e service** is an end-to-end testing framework validates API compliance and ensures endpoints behave as expected.

## Features
- Easy-to-use API client based on Axios
- Supports GET, POST, PUT, PATCH, DELETE HTTP methods
- Customizable request configuration
- TypeScript support for type safety
- Extensible for various testing scenarios

## Getting Started

### Prerequisites
- Node.js (v14 or higher recommended)
- npm or yarn

### Installation
Clone the repository and install dependencies:
```sh
git clone <repository-url>
cd oas_e2e
npm install
```
## Running Tests
To run tests:
```
npm test
```

## API Client Utils

The API Client makes HTTP requests using Axios. It includes an `ApiClient` class that supports various HTTP methods such as GET, POST, PUT, PATCH, and DELETE. To use the `ApiClient`, import it into the project and create an instance and call the desired HTTP method.

### Example
```typescript
import apiClient from './src/apiClient';

// Making a GET request
async function fetchData() {
  const response = await apiClient.get('/endpoint');
  console.log(response.data);
}

// Making a POST request
async function postData() {
  const response = await apiClient.post('/endpoint', { key: 'value' });
  console.log(response.data);
}
```
