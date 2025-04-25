const apiEndpoint = 'https://<api-id>.execute-api.<region>.amazonaws.com/prod/lambda';  // Replace with your actual endpoint

// Example of invoking the Lambda function via GET request
fetch(apiEndpoint)
  .then(response => response.json())
  .then(data => {
    console.log(data);  // Handle the Lambda response here
  })
  .catch(error => {
    console.error('Error calling Lambda via API Gateway:', error);
  });