document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('seat-form');
    const totalPriceElement = document.getElementById('total-price');
    const seatInputs = form.querySelectorAll('input[type="number"][data-price]');
    
    const clearButton = document.getElementById('clear-button');

    function calculateTotal() {
        let total = 0;
        seatInputs.forEach(input => {
            total += (parseInt(input.value) || 0) * parseFloat(input.dataset.price);
        });
        totalPriceElement.textContent = total.toFixed(2);
    }

    clearButton.addEventListener('click', () => {
  
        form.reset();
        
        calculateTotal();
    });

    form.addEventListener('input', calculateTotal);
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const totalAmount = parseFloat(totalPriceElement.textContent);
        if (totalAmount <= 0) {
            alert('Please select at least one seat.');
            return;
        }

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
            if (!response.ok) throw new Error('Failed to log to sheet.');

            console.log('Successfully logged to Google Sheet.');

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
                if (success) console.log('Donation completed successfully!');
                else console.log('Donation was cancelled or failed.');
            });

        } catch (error) {
            console.error('Submission Error:', error);
            alert('There was an error submitting your request. Please try again.');
        }
    });

    calculateTotal();
});

document.addEventListener('DOMContentLoaded', function () {
  const el = document.getElementById('b64');
  if (!el) return;

  const b64 = el.getAttribute('data-b64') || '';
  try {
    const decoded = atob(b64);
    el.textContent = decoded;
  } catch (err) {
    console.error('Base64 decode failed', err);
  }
});
