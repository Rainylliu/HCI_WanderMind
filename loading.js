document.addEventListener('DOMContentLoaded', function() {
    // Check if there's a prompt in localStorage
    const promptText = localStorage.getItem('travelPrompt');
    if (!promptText) {
        // If there's no prompt, redirect back to the form
        window.location.href = './ai-travel-guide.html';
        return;
    }

// Switch images with a longer display time and smooth transition
setInterval(() => {
    // Set fade-out effect with a shorter duration
    animatedCircle.style.transition = 'opacity 0.5s';
    animatedCircle.style.opacity = 0;

    setTimeout(() => {
        // Switch to the next image
        index = (index + 1) % images.length;
        animatedCircle.src = images[index];
        
        // Fade-in effect
        animatedCircle.style.opacity = 1;
    }, 100);  // Wait for the fade-out to complete before switching the image
}, 1000); 

// Change loading text after 2 seconds
setTimeout(() => {
    loadingText.textContent = "Evaluating your preferences......";
}, 2000);

 // Function to fetch response
 async function fetchResponse() {
    try {
        // Simulating API call with a delay
        // Replace this with your actual API call
        const response1 = await new Promise(resolve => {
            setTimeout(() => {
                resolve("This is a sample response for your travel preferences.");
            }, 5000); // 5 second delay to simulate API call
        });

        // Store the response and redirect
        // localStorage.setItem('travelResponse', response);
        window.location.href = './results.html';
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching the response. Please try again.');
        window.location.href = './ai-travel-guide.html';
    }
}

// Start fetching the response
fetchResponse();
});