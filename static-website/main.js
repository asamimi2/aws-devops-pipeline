// Use the actual API endpoint from API Gateway
const apiEndpoint = 'https://o3t1vw9cj9.execute-api.us-east-2.amazonaws.com/prod/upload';  // API Gateway endpoint

// Function to handle file upload to Lambda via API Gateway
function uploadFileToLambda(fileData, fileName) {
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

// Function to handle the file selection and encoding as base64
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

// Upload button click handler (to trigger the file upload)
function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert("Please select a file first.");
        return;
    }
    handleFileUpload({ target: fileInput });
}
