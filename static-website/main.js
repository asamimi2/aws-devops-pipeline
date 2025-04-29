const apiEndpoint = 'https://0hzixmoa24.execute-api.us-east-2.amazonaws.com/prod/upload'; // API Gateway endpoint
const staticSiteURL = 'http://devops-root-stack-frontend.s3-website.us-east-2.amazonaws.com'; // <-- Your S3 static website hosting URL

// Function to handle file upload to Lambda via API Gateway
function uploadFileToLambda(fileData, fileName) {
    fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            file_name: fileName,
            file_data: fileData
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Lambda Response:", data);
        alert("File uploaded successfully!");

        // 🎯 NEW: Dynamically display the uploaded image
        const uploadedImageUrl = `${staticSiteURL}/uploads/${fileName}`;

        const img = document.createElement('img');
        img.src = uploadedImageUrl;
        img.alt = fileName;
        img.style.maxWidth = "500px";
        img.style.marginTop = "20px";

        document.body.appendChild(img); // Or insert into a specific div if you want
    })
    .catch(error => {
        if (error.message.includes('Failed to fetch')) {
            console.error('CORS error or network issue:', error);
            alert('CORS error or network issue. Please check your API Gateway configuration.');
        } else {
            console.error('Error calling Lambda via API Gateway:', error);
            alert(`Error: ${error.message}`);
        }
    });
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) {
        alert("Please choose a file to upload.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        const base64FileData = reader.result.split(',')[1];
        uploadFileToLambda(base64FileData, file.name);
    };
    reader.readAsDataURL(file);
}

document.getElementById('fileInput').addEventListener('change', handleFileUpload);

function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput.files.length === 0) {
        alert("Please select a file first.");
        return;
    }
    handleFileUpload({ target: fileInput });
}
