// Replace this with the actual API Gateway URL
const apiEndpoint = 'https://<api-id>.execute-api.<region>.amazonaws.com/prod/upload';  // Example

// Function to handle file upload
function uploadFileToLambda(fileData, fileName) {
    fetch(apiEndpoint, {  // Use the correct API endpoint
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

// Function to handle file selection and upload
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

// Define the function for the "Upload" button
function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert("Please choose a file to upload.");
        return;
    }

    // Call the handleFileUpload() method
    handleFileUpload({ target: { files: fileInput.files } });
}
