/*=============== EMAIL JS ===============*/

// Initialize EmailJS with your public key
(function () {
    // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
    emailjs.init('GCdAi9yg6rw9E4Y7-');
})();

const contactForm = document.getElementById('contact-form'),
    contactMessage = document.getElementById('contact-message-status'),
    contactButton = document.getElementById('contact-button');

const sendEmail = (e) => {
    e.preventDefault();

    // Show loading state
    contactButton.innerHTML = `
        Sending...
        <i class="uil uil-spinner button__icon rotating"></i>
    `;
    contactButton.disabled = true;

    // Replace these with your actual EmailJS service ID and template ID
    emailjs.sendForm('service_fh4nuy2', 'template_uppzz34', '#contact-form')
        .then(() => {
            // Show sent message
            contactMessage.textContent = 'Message sent successfully ✅';
            contactMessage.style.color = 'var(--first-color)';

            // Remove message after five seconds
            setTimeout(() => {
                contactMessage.textContent = '';
            }, 5000);

            // Clear the form
            contactForm.reset();
        }, (error) => {
            // Show error message
            contactMessage.textContent = 'Message not sent (service error) ❌';
            contactMessage.style.color = 'var(--accent-red)';

            console.error('EmailJS error:', error);
        })
        .finally(() => {
            // Reset button
            contactButton.innerHTML = `
                Send Message
                <i class="uil uil-message button__icon"></i>
            `;
            contactButton.disabled = false;
        });
};

contactForm.addEventListener('submit', sendEmail);
