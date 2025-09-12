document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('seat-form');
    const totalPriceElement = document.getElementById('total-price');

    // Select all number inputs that have a 'data-price' attribute
    const seatInputs = form.querySelectorAll('input[type="number"][data-price]');

    function calculateTotal() {
        let total = 0;
        seatInputs.forEach(input => {
            const quantity = parseInt(input.value) || 0;
            const price = parseFloat(input.dataset.price);
            total += quantity * price;
        });
        
        // Format to two decimal places
        totalPriceElement.textContent = total.toFixed(2);
    }

    // Calculate total whenever any seat quantity changes
    form.addEventListener('input', calculateTotal);

    // Make the submit handler async to wait for the sheet logging
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const totalAmount = parseFloat(totalPriceElement.textContent);
        if (totalAmount <= 0) {
            alert('Please select at least one seat before proceeding to payment.');
            return;
        }

        // 1. Collect all form data into an object
        const formData = {
            Timestamp: new Date().toISOString(),
            FirstName: document.getElementById('firstName').value,
            LastName: document.getElementById('lastName').value,
            Comments: document.getElementById('comments').value,
            RegularMen: document.getElementById('regular-men').value,
            RegularBucherim: document.getElementById('regular-bucherim').value,
            KleiKodesh: document.getElementById('klei-kodesh').value,
            KleiKodeshBucherim: document.getElementById('klei-kodesh-bucherim').value,
            Ladies: document.getElementById('ladies').value,
            Girls: document.getElementById('girls').value,
            LadiesKleiKodesh: document.getElementById('ladies-klei-kodesh').value,
            GirlsKleiKodesh: document.getElementById('girls-klei-kodesh').value,
            Total: totalAmount.toFixed(2)
        };

        try {
            // 2. Send the data to your serverless function
            const response = await fetch('/api/log-to-sheets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to log to sheet.');
            }

            console.log('Successfully logged to Google Sheet.');

            // 3. If logging is successful, proceed to payment
            const options = {
                link: 'CMYSeats', // IMPORTANT: Replace with your actual values
                campaign: 3370,             // IMPORTANT: Replace with your campaign ID
                amount: totalAmount,
                disableAmount: false,
                firstName: formData.FirstName,
                lastName: formData.LastName,
                message: formData.Comments
            };

            DonorFuseClient.ShowPopup(options, function(success) {
                if (success) {
                    console.log('Donation completed successfully!');
                } else {
                    console.log('Donation was cancelled or failed.');
                }
            });

        } catch (error) {
            console.error('Submission Error:', error);
            alert('There was an error submitting your request. Please try again.');
        }
    });

    // Initial calculation on page load
    calculateTotal();
});