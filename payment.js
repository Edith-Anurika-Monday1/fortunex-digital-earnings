document.addEventListener('DOMContentLoaded', function() {
    const redirectUrl = "https://t.me/MIRTH_Hb";
    
    // --- Copy Functionality ---
    const copyWrappers = document.querySelectorAll('.account-number-wrapper');
    const notification = document.getElementById('copy-notification');
    let notificationTimer;

    copyWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', function() {
            const textToCopy = this.dataset.copyText;
            if (navigator.clipboard && textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    notification.classList.add('show');
                    clearTimeout(notificationTimer);
                    notificationTimer = setTimeout(() => {
                        notification.classList.remove('show');
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            }
        });
    });
    
    // --- Modal Functionality ---
    const modal = document.getElementById('warningModal');
    const closeBtnX = document.getElementById('closeModalX'); 
    const dismissBtn = document.getElementById('dismissModalBtn'); 

    const closeModalHandler = function() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; 

    if (closeBtnX) { 
        closeBtnX.addEventListener('click', closeModalHandler);
    }
    if (modal) { 
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModalHandler();
            }
        });
    }
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape" && modal && modal.classList.contains('active')) {
            closeModalHandler();
        }
    });
    if (dismissBtn) { 
        dismissBtn.addEventListener('click', closeModalHandler);
    }
    
    // --- Countdown Timer Logic ---
    const countdownDisplay = document.getElementById('countdown-timer');
    const timerPrompt = document.getElementById('timer-prompt');
    const accountDetailsGroup = document.getElementById('payment-account-details-group');
    const instructionText = document.getElementById('instruction-text');
    const verifyButton = document.getElementById('verify-payment-button');

    const countdownDuration = 10 * 60; // 5 minutes in seconds
    let timeRemaining = countdownDuration;
    let countdownInterval;

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    function updateCountdown() {
        if (timeRemaining <= 0) {
            clearInterval(countdownInterval);
            countdownDisplay.textContent = '00:00';
            timerPrompt.innerHTML = '<span class="timer-expired-text">Payment window expired!</span><br><span class="timer-expired-subtext">Please refresh the page to try again.</span>';
            
            // Hide account details
            if (accountDetailsGroup) {
                accountDetailsGroup.classList.add('hidden');
                setTimeout(() => {
                   accountDetailsGroup.style.display = 'none'; // Fully remove after transition
                }, 500); 
            }
            if (instructionText) {
                instructionText.classList.add('hidden');
                setTimeout(() => {
                   instructionText.style.display = 'none';
                }, 500);
            }
            if (verifyButton) {
                verifyButton.classList.add('disabled');
                verifyButton.textContent = 'Payment Expired';
                verifyButton.href = '#'; 
                verifyButton.removeEventListener('click', verifyButtonClickHandler); // Remove original click handler
                verifyButton.addEventListener('click', (e) => e.preventDefault()); // Prevent default navigation
            }
            
            return;
        }

        countdownDisplay.textContent = formatTime(timeRemaining);
        timeRemaining--;
    }

    // Start the countdown when the page loads
    updateCountdown(); 
    countdownInterval = setInterval(updateCountdown, 1000);

    // Add a click handler for the verify button if needed, which can then be removed
    function verifyButtonClickHandler(e) {
        // If you had any JS logic here for the button before redirecting, it would go here.
        // For now, it's a direct link, so just allow default behavior.
    }
    if (verifyButton) {
        verifyButton.addEventListener('click', verifyButtonClickHandler);
    }


    // --- Social Proof Logic ---
    const socialProofEl = document.getElementById('socialProofNotification');
    
    function generateSocialProofData(count = 50) {
        const amountOptions = ["₦14,500", "₦14,500"]; // Amounts from your info box
        const planName = "FortuneX PLUS"; // Consistent plan name for FortuneX
        
        const regionalData = {
            igbo: {
                names: ["Chukwudi", "Blessing", "Nneka", "Ify", "Fidelis", "Precious", "Emeka", "Uche", "Chiamaka", "Obi", "Chinedu", "Samuel"],
                cities: ["Enugu", "Onitsha", "Owerri", "Awka", "Aba", "Port Harcourt"]
            },
            yoruba: {
                names: ["Tunde", "Ade", "Gbenga", "Femi", "Kemi", "Segun", "Wale", "Bisi", "Olu", "Ayoola", "Michael", "Samuel", "Bright", "Samson", "Sodiq", "Quadri", "jumoke", "Blessing"],
                cities: ["Lagos", "Ibadan", "Abeokuta", "Akure", "Ogun", "Osogbo"]
            },
            north: {
                names: ["Musa", "Aisha", "Ibrahim", "Hassan", "Fatima", "Usman", "Abdullahi", "Hajara", "Jibril", "Yahya"],
                cities: ["Abuja", "Kano", "Kaduna", "Maiduguri", "Jos", "Zaria"]
            },
            ghana: { 
                names: ["Kwame", "Ama", "Kofi", "Akua", "Yaw", "Adwoa", "Kojo", "Yaa", "Bright", "Blessing", "Samuel"],
                cities: ["Accra", "Kumasi", "Tamale", "Takoradi", "Cape Coast", "Tema"]
            }
        };

        const allRegions = Object.keys(regionalData);
        const sampleMinutesAgo = [
            "1 min ago", "2 mins ago", "3 mins ago", "5 mins ago", "8 mins ago", "10 mins ago", "15 mins ago", "just now"
        ];

        let messages = [];
        
        for (let i = 0; i < count; i++) {
            const regionKey = allRegions[Math.floor(Math.random() * allRegions.length)];
            const region = regionalData[regionKey];
            
            const randomName = region.names[Math.floor(Math.random() * region.names.length)];
            const randomCity = region.cities[Math.floor(Math.random() * region.cities.length)];
            const randomTime = sampleMinutesAgo[Math.floor(Math.random() * sampleMinutesAgo.length)];
            const randomAmount = amountOptions[Math.floor(Math.random() * amountOptions.length)];
            
            const data = {
                user: randomName,
                city: randomCity,
                plan: planName,
                amount: randomAmount, 
                time: randomTime
            };
            messages.push(data);
        }
        return messages;
    }

    const socialProofMessages = generateSocialProofData(50);

    let activeSocialProofTimeout;

    function showNextSocialProofNotification() {
        if (socialProofEl.classList.contains('show')) {
            socialProofEl.classList.remove('show');
            socialProofEl.classList.add('hide');
            clearTimeout(activeSocialProofTimeout);
            setTimeout(() => {
                displayNewSocialProofNotification();
            }, 500); 
            return;
        }
        displayNewSocialProofNotification();
    }

    function displayNewSocialProofNotification() {
        if (socialProofMessages.length === 0) return; 

        const randomIndex = Math.floor(Math.random() * socialProofMessages.length);
        const data = socialProofMessages[randomIndex];
        
        const html = `<span class="social-name">${data.user}</span> from ${data.city} just subscribed to <span class="social-plan">${data.plan}</span> - <span class="social-amount">${data.amount}</span> <span class="social-time">• ${data.time}</span>`;
        
        socialProofEl.innerHTML = html;
        
        setTimeout(() => {
            socialProofEl.classList.remove('hide');
            socialProofEl.classList.add('show');
        }, 50); 

        const nextInterval = 5000 + Math.random() * 5000; 
        activeSocialProofTimeout = setTimeout(showNextSocialProofNotification, nextInterval);
    }
    
    // Start the social proof notification loop
    showNextSocialProofNotification();
});