# API Client Utils

## Overview
The API Client Utils project provides a simple and efficient way to make HTTP requests using Axios. It includes an `ApiClient` class that supports various HTTP methods such as GET, POST, PUT, PATCH, and DELETE. This project is designed to streamline API interactions and improve code maintainability.

## Installation
To get started with the API Client Utils, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd api-client-utils
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage
To use the `ApiClient`, import it into your project and create an instance. You can then call the desired HTTP method.

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

## Documentation
For detailed usage instructions and examples, please refer to the [usage documentation](docs/usage.md).

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.