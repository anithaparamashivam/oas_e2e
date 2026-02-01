# Usage of ApiClient

The `ApiClient` class provides a simple interface for making HTTP requests using Axios. Below are examples of how to use the `ApiClient` for different types of requests.

## Installation

First, ensure you have the necessary dependencies installed. You can install Axios using npm:

```
npm install axios
```

## Importing the ApiClient

To use the `ApiClient`, import it into your project:

```typescript
import apiClient from '../src/apiClient';
```

## Making Requests

### GET Request

To make a GET request, use the `get` method:

```typescript
const response = await apiClient.get('/endpoint');
console.log(response.status); // HTTP status code
console.log(response.data); // Response data
```

### POST Request

To make a POST request, use the `post` method:

```typescript
const data = { key: 'value' };
const response = await apiClient.post('/endpoint', data);
console.log(response.status);
console.log(response.data);
```

### PUT Request

To update a resource, use the `put` method:

```typescript
const data = { key: 'newValue' };
const response = await apiClient.put('/endpoint/1', data);
console.log(response.status);
console.log(response.data);
```

### PATCH Request

For partial updates, use the `patch` method:

```typescript
const data = { key: 'updatedValue' };
const response = await apiClient.patch('/endpoint/1', data);
console.log(response.status);
console.log(response.data);
```

### DELETE Request

To delete a resource, use the `delete` method:

```typescript
const response = await apiClient.delete('/endpoint/1');
console.log(response.status);
console.log(response.data);
```

## Handling Responses

Each method returns a promise that resolves to an `ApiResponse<T>` object, which includes:

- `status`: The HTTP status code of the response.
- `data`: The response data.
- `headers`: The response headers.

You can handle the response as shown in the examples above.