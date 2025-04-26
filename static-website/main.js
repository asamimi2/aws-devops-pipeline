// In main.js, set the apiEndpoint dynamically (not hardcoded)
const apiEndpoint = process.env.API_ENDPOINT || 'default/api/endpoint';  // Default fallback

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
        }
    })
    .catch(error => {
        console.error('Error calling Lambda via API Gateway:', error);
    });
}
