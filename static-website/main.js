const apiEndpoint = 'https://mla9mq6t15.execute-api.us-east-2.amazonaws.com/prod/upload'; // Your API endpoint
const staticSiteURL = 'http://devops-root-stack-frontend.s3-website.us-east-2.amazonaws.com'; // Your static site URL

// Handle file upload and display
function handleFileUpload() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert("Please choose a file to upload.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        const base64FileData = reader.result.split(',')[1]; // Extract base64 data
        uploadFileToLambda(base64FileData, file.name);
    };
    reader.readAsDataURL(file);
}

// Upload to Lambda
function uploadFileToLambda(fileData, fileName) {
    fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_name: fileName, file_data: fileData })
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log("Lambda Response:", data);
        displayUploadedFile(fileName); // Only after upload successful
        alert("File uploaded successfully!");
    })
    .catch(error => {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    });
}

// Display uploaded image
function displayUploadedFile(fileName) {
    const uploadedFileUrl = `${staticSiteURL}/uploads/${fileName}`;

    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = ''; // Clear previous previews

    const img = document.createElement('img');
    img.src = uploadedFileUrl;
    img.alt = fileName;
    img.style.maxWidth = '500px';
    img.style.marginTop = '20px';
    img.style.display = 'block';
    img.style.marginLeft = 'auto';
    img.style.marginRight = 'auto';

    previewContainer.appendChild(img);
}

// Upload button click handler
function uploadFile() {
    handleFileUpload();
}

// Only one event: Upload button
document.getElementById('uploadButton').addEventListener('click', uploadFile);
