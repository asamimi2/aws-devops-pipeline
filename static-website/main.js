const apiEndpoint = 'https://<api-id>.execute-api.<region>.amazonaws.com/prod/upload'; // Default or placeholder

// Function to handle file upload
function uploadFileToLambda(fileData, fileName) {
    fetch(apiEndpoint, {  // Use the dynamic API endpoint
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
            // Use the dynamic API endpoint from the Lambda response if needed
            // You can now call this endpoint for further processing if necessary
        }
    })
    .catch(error => {
        console.error('Error calling Lambda via API Gateway:', error);
    });
}

// Example function for selecting file and uploading
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        alert("Please choose a file to upload.");
        return;
    }

    // Read the file and encode it as base64
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64FileData = reader.result.split(',')[1]; // Get base64-encoded data
        uploadFileToLambda(base64FileData, file.name);
    };
    reader.readAsDataURL(file);
}

// Attach event listener to the file input element
document.getElementById('fileInput').addEventListener('change', handleFileUpload);
