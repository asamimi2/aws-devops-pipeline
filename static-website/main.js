// Function to handle file upload
function handleFileUpload(event) {
  const file = event.target.files[0];  // Get the selected file
  if (!file) {
      alert("Please choose a file to upload.");
      return;
  }

  // Read the file and encode it as base64
  const reader = new FileReader();
  reader.onloadend = () => {
      const base64FileData = reader.result.split(',')[1];  // Extract the base64-encoded data
      uploadFileToLambda(base64FileData, file.name);  // Call the function to upload the file to Lambda
  };
  reader.readAsDataURL(file);  // Start reading the file as base64
}

// Function to send file data to Lambda via API Gateway
function uploadFileToLambda(fileData, fileName) {
  const apiEndpoint = '<actual-api-gateway-endpoint>';  // Replace with actual API Gateway endpoint

  fetch(apiEndpoint, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          file_name: fileName,
          file_data: fileData // base64-encoded data
      })
  })
  .then(response => response.json())
  .then(data => {
      console.log(data);  // Handle the Lambda response here

      if (data.api_details && data.api_details.api_endpoint) {
          console.log("API Endpoint:", data.api_details.api_endpoint);
      }
  })
  .catch(error => {
      console.error('Error calling Lambda via API Gateway:', error);
  });
}

// Attach event listener to the file input element
document.getElementById('fileInput').addEventListener('change', handleFileUpload);
