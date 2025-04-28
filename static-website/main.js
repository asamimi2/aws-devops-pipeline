// Use the actual API endpoint from API Gateway
const apiEndpoint = 'https://4zf5vbdorc.execute-api.us-east-2.amazonaws.com/prod/upload'; // API Gateway endpoint

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
    .then(response => {
        // Check if the response status is OK (200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Lambda Response:", data); // Handle the Lambda response here
        if (data.api_endpoint) {
            console.log("API Endpoint:", data.api_endpoint);
        }
        alert("File uploaded successfully!");
    })
    .catch(error => {
        // Handle CORS errors or other fetch-related issues
        if (error.message.includes('Failed to fetch')) {
            console.error('CORS error or network issue:', error);
            alert('CORS error or network issue. Please check your API Gateway configuration.');
        } else {
            console.error('Error calling Lambda via API Gateway:', error);
            alert(`Error: ${error.message}`);
        }
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
