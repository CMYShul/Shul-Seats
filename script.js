document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('seat-form');
    const totalPriceElement = document.getElementById('total-price');
    const seatInputs = form.querySelectorAll('input[type="number"][data-price]');
    const clearButton = document.getElementById('clear-button');
    const b64Element = document.getElementById('b64');

    // Decode Zelle email
    if (b64Element) {
        const b64 = b64Element.getAttribute('data-b64') || '';
        try {
            b64Element.textContent = atob(b64);
        } catch (err) {
            console.error('Base64 decode failed', err);
        }
    }

    function calculateTotal() {
        let total = 0;
        seatInputs.forEach(input => {
            const qty = parseInt(input.value) || 0;
            total += qty * parseFloat(input.dataset.price);

            // Toggle selected class on the row
            const row = input.closest('.seat-row');
            if (row) {
                row.classList.toggle('selected', qty > 0);
            }
        });
        totalPriceElement.textContent = total.toFixed(2);
    }

    if (clearButton) {
        clearButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all form fields?')) {
                form.reset();
                calculateTotal();
            }
        });
    }

    form.addEventListener('input', calculateTotal);

    // Enhance seat selection interactivity
    seatInputs.forEach(input => {
        const row = input.closest('.seat-row');
        if (row) {
            row.addEventListener('click', (e) => {
                // If the user didn't click the input itself, focus it
                if (e.target !== input) {
                    input.focus();
                }
            });
        }

        // Auto-select text on focus for easier editing
        input.addEventListener('focus', function() {
            setTimeout(() => this.select(), 0);
        });
    });

    // Form submission with loading state
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const totalAmount = parseFloat(totalPriceElement.textContent);
        if (totalAmount <= 0) {
            alert('Please select at least one seat.');
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Recording...';

        const formData = {
            Timestamp: new Date().toISOString(),
            FirstName: document.getElementById('firstName').value,
            LastName: document.getElementById('lastName').value,
            Email: document.getElementById('email').value,
            Phone: document.getElementById('phone').value,
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
            const response = await fetch('/api/log-to-sheets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                // Use data.message only, avoid leaking data.detail
                const msg = data.message || 'Failed to log to sheet.';
                console.error('API error:', response.status, data);
                throw new Error(msg);
            }

            console.log('Successfully logged to Google Sheet.');

            // Web3Forms email backup
            fetch('/api/web3forms-key')
                .then((r) => r.json())
                .then(({ access_key }) => {
                    if (!access_key) return;
                    return fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify({
                            access_key,
                            subject: 'New Shul Seat Request',
                            email: formData.Email,
                            from_name: [formData.FirstName, formData.LastName].filter(Boolean).join(' ') || 'Shul Seats',
                            ...formData,
                        }),
                    });
                })
                .then((r) => r && !r.ok && r.json().then((d) => console.warn('Web3Forms:', d.message || d)))
                .catch((e) => console.warn('Web3Forms:', e?.message || e));

            const options = {
                link: 'CMYSeats', 
                campaign: 10491,            
                amount: totalAmount,
                disableAmount: false,
                firstName: formData.FirstName,
                lastName: formData.LastName,
                email: formData.Email,
                phone: formData.Phone,
                message: formData.Comments
            };

            DonorFuseClient.ShowPopup(options, function(success) {
                // Re-enable button after popup interaction
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                if (success) console.log('Donation completed successfully!');
                else console.log('Donation was cancelled or failed.');
            });

        } catch (error) {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            console.error('Submission Error:', error);
            const detail = error?.message || 'There was an error submitting your request. Please try again.';
            alert(detail);
        }
    });

    calculateTotal();
});
