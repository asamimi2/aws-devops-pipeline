const apiEndpoint = 'https://<api-id>.execute-api.<region>.amazonaws.com/prod/upload'; // Placeholder API endpoint

// Function to handle file upload to Lambda
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
            // You can now use the API endpoint if necessary
        }
    })
    .catch(error => {
        console.error('Error calling Lambda via API Gateway:', error);
    });
}

// Function to handle file input and upload
function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert("Please choose a file to upload.");
        return;
    }
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64FileData = reader.result.split(',')[1]; // Get base64-encoded data
        uploadFileToLambda(base64FileData, file.name);
    };
    reader.readAsDataURL(file);
}

// Attach event listener to the file input element
document.getElementById('fileInput').addEventListener('change', handleFileUpload);
