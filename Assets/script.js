document.getElementById('apiForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent page refresh

    // Get the API URL from the input
    const apiUrl = document.getElementById('apiUrl').value;

    // Show loading text while waiting for the response
    const apiTableBody = document.getElementById('tableBody');
    const apiTableHead = document.getElementById('tableHead');
    apiTableBody.innerHTML = '<tr><td colspan="100%">Fetching data...</td></tr>'; // Loading text

    try {
        // Fetch data using async/await
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json(); // Convert response to JSON
        console.log('API Response:', data); // Check the data received from the API

        // Ensure data is an array, if not, make an array from a single object
        const resultData = Array.isArray(data) ? data : [data];
        console.log('Result Data (Array):', resultData); // Check the shape of data after converting to an array

        if (resultData.length > 0) {
            apiTableBody.innerHTML = ''; // Clear loading text

            // Get keys from the first object to create table headers
            const headers = Object.keys(resultData[0]);
            console.log('Table Headers:', headers); // Check headers to be displayed
            apiTableHead.innerHTML = headers.map(header => `<th>${header}</th>`).join('');

            // Display each object as a table row
            resultData.forEach(item => {
                const row = `<tr>${headers.map(header => {
                    // Check if the field is 'address' or 'company' and format accordingly
                    if (header === 'address' && typeof item[header] === 'object') {
                        const address = item[header];
                        return `<td>${address.street || ''}, ${address.city || ''}, ${address.state || ''}, ${address.zipcode || ''}</td>`;
                    }
                    if (header === 'company' && typeof item[header] === 'object') {
                        const company = item[header];
                        return `<td>${company.name || ''} (${company.catchPhrase || ''})</td>`;
                    }
                    return `<td>${item[header]}</td>`;
                }).join('')}</tr>`;
                console.log('Row:', row); // Check each row to be displayed
                apiTableBody.innerHTML += row;
            });
        } else {
            apiTableBody.innerHTML = '<tr><td colspan="100%">No data available</td></tr>';
        }
    } catch (error) {
        // Handle errors during fetch
        apiTableBody.innerHTML = `<tr><td colspan="100%">Fetch failed: ${error.message}</td></tr>`;
    }
});