document.addEventListener('DOMContentLoaded', function() {
    // --- Social Proof Logic ---
    const socialProofEl = document.getElementById('socialProofNotification');
    
    // --- NEW: Dynamic Data Generation with Regional Logic ---
    function generateSocialProofData(count = 50) {
        const plusAmount = "₦7,500";
        const starterAmount = "₦14,500";
        const plusPlan = "FORTUNEX STARTER";
        const starterPlan = "FORTUNEX PLUS"; 
        
        // Data Pools segmented by region for better authenticity
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
            }
        };

        const allRegions = Object.keys(regionalData);
        const sampleMinutesAgo = [
            "1 min ago", "2 mins ago", "3 mins ago", "5 mins ago", "8 mins ago", "10 mins ago", "15 mins ago", "just now"
        ];

        let messages = [];
        
        for (let i = 0; i < count; i++) {
            // 1. Select a random region
            const regionKey = allRegions[Math.floor(Math.random() * allRegions.length)];
            const region = regionalData[regionKey];
            
            // 2. Select elements only from that region's pool
            const randomName = region.names[Math.floor(Math.random() * region.names.length)];
            const randomCity = region.cities[Math.floor(Math.random() * region.cities.length)];
            const randomTime = sampleMinutesAgo[Math.floor(Math.random() * sampleMinutesAgo.length)];
            
            // Randomly choose between Starter (7,500) and Plus (14,500)
            const isStarter = Math.random() < 0.5;
            
            const data = {
                user: randomName,
                city: randomCity,
                plan: isStarter ? starterPlan : plusPlan,
                amount: isStarter ? starterAmount : plusAmount,
                time: randomTime
            };
            messages.push(data);
        }
        return messages;
    }

    const socialProofMessages = generateSocialProofData(50);
    // --- END Dynamic Data Generation ---


    let activeTimeout;

    function showNextNotification() {
        if (socialProofEl.classList.contains('show')) {
            socialProofEl.classList.remove('show');
            socialProofEl.classList.add('hide');
            clearTimeout(activeTimeout);
            setTimeout(() => {
                displayNewNotification();
            }, 500); 
            return;
        }
        displayNewNotification();
    }

    function displayNewNotification() {
        if (socialProofMessages.length === 0) return; 

        const randomIndex = Math.floor(Math.random() * socialProofMessages.length);
        const data = socialProofMessages[randomIndex];
        
        const html = `<span class="social-name">${data.user}</span> from ${data.city} just subscribed to <br> <span class="social-plan">${data.plan}</span> - ${data.amount} <span class="social-time">• ${data.time}</span>`;
        
        socialProofEl.innerHTML = html;
        
        setTimeout(() => {
            socialProofEl.classList.remove('hide');
            socialProofEl.classList.add('show');
        }, 50); 

        // Keep the notification alive for a random duration between 5 and 10 seconds
        const nextInterval = 5000 + Math.random() * 5000; 
        activeTimeout = setTimeout(showNextNotification, nextInterval);
    }
    
    // Start the notification loop
    showNextNotification();


    // --- Modal Functionality (No Change Here) ---
    const modal = document.getElementById('warningModal');
    const openBtn = document.getElementById('openModalButton');
    const closeBtnX = document.getElementById('closeModalX'); 
    const confirmRedirectBtn = document.getElementById('confirmAndRedirectBtn'); 

    // Function to close modal and reset body scroll
    const closeModalHandler = function() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // 1. Show modal immediately on load
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; 

    // 2. Close modal when the 'X' is clicked (Dismisses warning, stays on page)
    closeBtnX.addEventListener('click', closeModalHandler);

    // 3. Close modal if user clicks outside the content area (Dismisses warning, stays on page)
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalHandler();
        }
    });

    // 4. Close modal via ESC key (Dismisses warning, stays on page)
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape" && modal.classList.contains('active')) {
            closeModalHandler();
        }
    });
    
    // 5. Handle Confirmation: Button inside the modal NOW REDIRECTS to the success page
    confirmRedirectBtn.addEventListener('click', function() {
        window.location.href = redirectUrl;
    });
    
    // 6. Re-open modal if user clicks the main CTA button 
    openBtn.addEventListener('click', function(e) {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    });
});
