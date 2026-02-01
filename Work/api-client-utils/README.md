# API Client Utils

## Usage
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
