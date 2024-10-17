document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.querySelector('.submit-btn');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function(event) {
            event.preventDefault();  // 阻止表单的默认 GET 提交
            console.log('Submit button clicked, preventing default form submission.');
            submitForm();  // 调用自定义的表单提交函数
        });
    }
});

async function submitForm() {
    const formData = {
        destination: document.querySelector('.question:nth-child(1) input[type="text"]').value,
        accommodation: {
            prefer: document.querySelector('.question:nth-child(2) input[type="text"]:nth-of-type(1)').value,
            avoid: document.querySelector('.question:nth-child(2) input[type="text"]:nth-of-type(2)').value
        },
        weather: document.querySelector('.question:nth-child(3) input[type="text"]').value,
        transportation: {
            prefer: Array.from(document.querySelectorAll('.question:nth-child(4) button:not(:nth-last-child(-n+4))')).filter(btn => btn.classList.contains('selected')).map(btn => btn.textContent),
            avoid: Array.from(document.querySelectorAll('.question:nth-child(4) button:nth-last-child(-n+4)')).filter(btn => btn.classList.contains('selected')).map(btn => btn.textContent)
        },
        duration: document.querySelector('.question:nth-child(5) button.selected')?.textContent || '',
        pace: document.querySelector('.question:nth-child(6) input[type="range"]').value,
        activities: Array.from(document.querySelectorAll('.question:nth-child(7) button.selected')).map(btn => btn.textContent),
        diet: {
            prefer: document.querySelector('.question:nth-child(8) input[type="text"]:nth-of-type(1)').value,
            avoid: document.querySelector('.question:nth-child(8) input[type="text"]:nth-of-type(2)').value
        },
        budget: document.querySelector('.question:nth-child(9) input[type="range"]').value
    };

    const promptText = generatePrompt(formData);
    console.log('Prompt Text:', promptText); 

    try {
        const response = await fetch('http://localhost:3001/proxy', {  
            method: 'POST',  
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: promptText }
                ],
                max_tokens: 1000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data); 
        localStorage.setItem('travelResponse', JSON.stringify(data));
        window.location.href = './loading.html';
        localStorage.setItem('travelPrompt', JSON.stringify(promptText));
    } catch (error) {
        console.error('Error:', error);
    }
}

function generatePrompt(formData) {
    const paceLevels = ['Very Relaxed', 'Relaxed', 'Balanced', 'Active', 'Very Active'];
    const pace = paceLevels[parseInt(formData.pace) - 1] || 'Not specified';

    return `Plan a trip to ${formData.destination || '[destination]'} with the following preferences:
- Accommodation: Prefer ${formData.accommodation.prefer || '[preferred accommodation]'}, avoid ${formData.accommodation.avoid || '[accommodation to avoid]'}
- Weather: ${formData.weather || '[preferred weather]'}
- Transportation: Prefer ${formData.transportation.prefer.join(', ') || '[preferred transportation]'}, avoid ${formData.transportation.avoid.join(', ') || '[transportation to avoid]'}
- Duration: ${formData.duration || '[trip duration]'}
- Pace: ${pace}
- Activities: ${formData.activities.join(', ') || '[preferred activities]'}
- Diet: Prefer ${formData.diet.prefer || '[preferred food]'}, avoid ${formData.diet.avoid || '[food to avoid]'}
- Budget: $${formData.budget || '[budget]'}


output format should be similar to this: 

Day1: 
    - activity 1 
        - destination
        - duration
        - cost
    - activity 2
        - destination
        - duration
        - cost
    - accommodation

Day2:
    - activity 1 
        - destination
        - duration
        - cost
    - activity 2
        - destination
        - duration
        - cost
    - accommodation

Day3:
    - activity 1 
        - destination
        - duration
        - cost
    - activity 2
        - destination
        - duration
        - cost
    - accommodation

Please provide a detailed itinerary and recommendations based on these preferences.`;
}

// 为表单中的按钮绑定事件
document.querySelectorAll('.question button').forEach(button => {
    button.addEventListener('click', function() {
        if (this.parentElement.querySelector('button.selected') && !this.parentElement.classList.contains('question:nth-child(4)')) {
            this.parentElement.querySelector('button.selected').classList.remove('selected');
        }
        this.classList.toggle('selected');
    });
});
