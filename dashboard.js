document.addEventListener('DOMContentLoaded', function() {
    // --- SOCIAL PROOF LOGIC ---
    const socialProofEl = document.getElementById('socialProofNotification');
    
    // Data for Social Proof Notifications
    function generateSocialProofData(count = 50) {
        const plusAmount = "₦7,500";
        const starterAmount = "₦14,500";
        const plusPlan = "FORTUNEX STARTER";
        const starterPlan = "FORTUNEX PLUS"; 
        
        const regionalData = {
            igbo: {
                names: ["Chukwudi", "Blessing", "Nneka", "Ify", "Fidelis", "Precious", "Emeka", "Uche", "Chiamaka", "Obi", "Chinedu", "Samuel"],
                cities: ["Enugu", "Onitsha", "Owerri", "Awka", "Aba", "Port Harcourt"]
            },
            yoruba: {
                names: ["Tunde", "Ade", "Gbenga", "Femi", "Kemi", "Segun", "Wale", "Bisi", "Olu", "Ayoola", "Michael", "Samuel", "Bright", "Samson", "Sodiq", "Quadri", "Jumoke", "Blessing"],
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
            const regionKey = allRegions[Math.floor(Math.random() * allRegions.length)];
            const region = regionalData[regionKey];
            
            const randomName = region.names[Math.floor(Math.random() * region.names.length)];
            const randomCity = region.cities[Math.floor(Math.random() * region.cities.length)];
            const randomTime = sampleMinutesAgo[Math.floor(Math.random() * sampleMinutesAgo.length)];
            
            const isStarter = Math.random() < 5;
            
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

    let socialProofMessages = generateSocialProofData(50);
    let activeTimeout;

    function showNextNotification() {
        if (!socialProofEl) return; // Exit if element doesn't exist

        if (socialProofMessages.length === 0) {
            socialProofMessages = generateSocialProofData(50); // Regenerate if all messages shown
        }

        const randomIndex = Math.floor(Math.random() * socialProofMessages.length);
        const data = socialProofMessages.splice(randomIndex, 1)[0]; // Get and remove message

        const html = `<span class="social-name">${data.user}</span> from ${data.city} just subscribed to <br> <span class="social-plan">${data.plan}</span> - ${data.amount} <span class="social-time">• ${data.time}</span>`;
        
        socialProofEl.innerHTML = html;
        
        // Hide previous, then show new
        socialProofEl.classList.remove('show');
        socialProofEl.classList.add('hide');
        
        clearTimeout(activeTimeout); // Clear any existing timeouts

        setTimeout(() => {
            socialProofEl.classList.remove('hide');
            socialProofEl.classList.add('show');
        }, 1000); // Small delay to allow 'hide' transition to start

        // Keep the notification alive for a random duration between 5 and 10 seconds
        const nextInterval = 5000 + Math.random() * 5000; 
        activeTimeout = setTimeout(showNextNotification, nextInterval);
    }
    
    // Start the notification loop if the element exists
    if (socialProofEl) {
        showNextNotification();
    }


    /* ==================== MOCK DATA & STATUS MANAGEMENT ==================== */
    const USER_DATA = {
        fullName: "Jane Doe",
        email: "jane.doe@example.com",
        package: "Basic Pack", // Default package for display
        price: "₦7,500",      // Default price for display
        phone: "08012345678",
        regDate: new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
    };

    const DEFAULT_PACKAGE_DISPLAY = {
        package: "Inactive",
        price: "Inactive"
    }

    // Initialize user data and account status
    let userData = JSON.parse(localStorage.getItem('fortuneXUser')) || USER_DATA;
    let isAccountActive = localStorage.getItem('accountActive') === 'true';

    function updateDashboardUI() {
        const packageDataDisplay = isAccountActive ? userData : DEFAULT_PACKAGE_DISPLAY;
        
        // Sidebar User Info
        document.getElementById('sidebarUserName').textContent = userData.fullName;
        document.getElementById('sidebarUserEmail').textContent = userData.email;
        
        // Account Status Section
        const statusBadge = document.getElementById('statusBadge');
        const statusText = document.getElementById('statusText');
        const activateAccountBtn = document.getElementById('activateAccountBtn');
        const activationSection = document.getElementById('activationSection');
        const paymentStatusDetail = document.getElementById('paymentStatusDetail');
        
        if (isAccountActive) {
            statusBadge.textContent = 'Active';
            statusBadge.classList.replace('status-inactive', 'status-active');
            statusText.textContent = 'active';
            if (activateAccountBtn) activateAccountBtn.style.display = 'none'; // Hide activation button
            if (activationSection) activationSection.style.display = 'none'; // Hide activation section
            if (paymentStatusDetail) paymentStatusDetail.textContent = 'Completed';
        } else {
            statusBadge.textContent = 'Inactive';
            statusBadge.classList.replace('status-active', 'status-inactive');
            statusText.textContent = 'inactive';
            if (activateAccountBtn) activateAccountBtn.style.display = 'flex'; // Show activation button
            if (activationSection) activationSection.style.display = 'block'; // Show activation section
            if (paymentStatusDetail) paymentStatusDetail.textContent = 'Pending';
        }

        // Account Activation Details Panel
        document.getElementById('packageDetail').textContent = packageDataDisplay.package;
        document.getElementById('priceDetail').textContent = packageDataDisplay.price;
        document.getElementById('regDateDetail').textContent = userData.regDate;
        
        // Feature Cards (Disabled if inactive)
        const featureCards = [
            { id: 'featureEarnings', value: isAccountActive ? '₦5,000.00' : '₦0.00' },
            { id: 'featureCourses', value: isAccountActive ? '3/10' : '0' },
            { id: 'featureAssets', value: isAccountActive ? '1' : '0' },
            { id: 'featureNetwork', value: isAccountActive ? '12' : '0' },
        ];

        featureCards.forEach(item => {
            const card = document.getElementById(item.id);
            const valueEl = card ? card.querySelector('.feature-value') : null;
            if (card && valueEl) {
                if (isAccountActive) {
                    card.classList.remove('disabled');
                    valueEl.textContent = item.value;
                } else {
                    card.classList.add('disabled');
                    valueEl.textContent = item.value; // Keeps 0/0 values shown but visually dimmed
                }
            }
        });
    }

    updateDashboardUI(); // Initialize UI based on local storage status


    /* ==================== PAYMENT CONFIG & MODAL SETUP ==================== */
    const PAYMENT_CONFIG = {
        bankName: "Guaranty Trust Bank",
        accountName: "Chukwuemeka Innocent Ehirim",
        accountNumber: "1017359939",
        whatsappNumber: "237672462798", 
        telegramUsername: "Mik00188"
    };

    // Store selected plan details for the modals
    let currentSelectedPlan = {
        name: userData.package || "Basic Pack",
        price: userData.price || "₦7,500"
    };

    // Modal Elements
    const activationPromptModal = document.getElementById('activationPromptModal');
    const promptModalClose = document.getElementById('promptModalClose');
    const promptModalPlan = document.getElementById('promptModalPlan');
    const promptModalPrice = document.getElementById('promptModalPrice');
    const proceedToPaymentBtn = document.getElementById('proceedToPaymentBtn');

    const paymentModal = document.getElementById('paymentModal');
    const modalClose = document.getElementById('modalClose');
    const paymentTimer = document.getElementById('paymentTimer');
    const modalBankName = document.getElementById('modalBankName');
    const modalAccName = document.getElementById('modalAccName');
    const modalAccNumber = document.getElementById('modalAccNumber');
    const modalWhatsappBtn = document.getElementById('modalWhatsappBtn');
    const modalTelegramBtn = document.getElementById('modalTelegramBtn');


    // Fill payment details into the payment modal
    if (modalBankName) modalBankName.textContent = PAYMENT_CONFIG.bankName;
    if (modalAccName) modalAccName.textContent = PAYMENT_CONFIG.accountName;
    if (modalAccNumber) modalAccNumber.textContent = PAYMENT_CONFIG.accountNumber;

    // --- Dynamic Modal Button Logic ---
    const activateAccountBtn = document.getElementById('activateAccountBtn'); // Top "Click here to activate"
    const claimRewardBtn = document.getElementById('claimRewardBtn');     // Bottom "Claim instant reward"

    // Set up click listeners for both buttons to open the activation prompt modal
    if (activateAccountBtn) {
        activateAccountBtn.addEventListener('click', () => {
            if (!isAccountActive) { // Only show if inactive
                currentSelectedPlan = { name: userData.package, price: userData.price }; // Use user's current package
                if (promptModalPlan) promptModalPlan.textContent = currentSelectedPlan.name;
                if (promptModalPrice) promptModalPrice.textContent = currentSelectedPlan.price;
                
                activationPromptModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent body scroll
            }
        });
    }

    if (claimRewardBtn) {
        claimRewardBtn.addEventListener('click', () => {
            if (!isAccountActive) { // Only show if inactive
                currentSelectedPlan = { name: userData.package, price: userData.price }; // Use user's current package
                if (promptModalPlan) promptModalPlan.textContent = currentSelectedPlan.name;
                if (promptModalPrice) promptModalPrice.textContent = currentSelectedPlan.price;

                activationPromptModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent body scroll
            }
        });
    }

    // --- Close Activation Prompt Modal ---
    if (promptModalClose) {
        promptModalClose.addEventListener('click', () => {
            activationPromptModal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restore body scroll
        });
    }
    if (activationPromptModal) {
        activationPromptModal.addEventListener('click', (e) => {
            if (e.target === activationPromptModal) {
                activationPromptModal.classList.remove('active');
                document.body.style.overflow = 'auto'; // Restore body scroll
            }
        });
    }

    // --- Proceed to Payment from Prompt Modal ---
    if (proceedToPaymentBtn) {
        proceedToPaymentBtn.addEventListener('click', (e) => {
            e.preventDefault();
            activationPromptModal.classList.remove('active');
            paymentModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Ensure payment modal also prevents scroll
            startTimer();
            // Update WhatsApp/Telegram links with selected plan info
            if (modalWhatsappBtn) modalWhatsappBtn.href = `https://wa.me/${PAYMENT_CONFIG.whatsappNumber}?text=Hello, I need assistance with my FortuneX activation. My plan is ${currentSelectedPlan.name}, amount: ${currentSelectedPlan.price}.`;
            if (modalTelegramBtn) modalTelegramBtn.href = `https://t.me/${PAYMENT_CONFIG.telegramUsername}?text=Hello, I need assistance with my FortuneX activation. My plan is ${currentSelectedPlan.name}, amount: ${currentSelectedPlan.price}.`;
        });
    }

    /* ==================== PAYMENT MODAL TIMER ==================== */
    let timerInterval;
    let timeRemaining = 600; // 10 minutes

    function startTimer() {
        clearInterval(timerInterval);
        timeRemaining = 600;
        updateTimerDisplay();

        timerInterval = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay();

            if (paymentTimer) {
                if (timeRemaining <= 120) paymentTimer.classList.add('warning');
                if (timeRemaining <= 0) {
                    clearInterval(timerInterval);
                    paymentTimer.textContent = "Time's up!";
                    paymentTimer.classList.add('warning');
                    // Automatically close modal after showing timeout message
                    setTimeout(() => {
                        paymentModal.classList.remove('active');
                        document.body.style.overflow = 'auto'; // Restore body scroll
                    }, 3000);
                }
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        if (paymentTimer) {
            const m = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
            const s = (timeRemaining % 60).toString().padStart(2, '0');
            paymentTimer.textContent = `${m}:${s}`;
        }
    }

    // --- Close Payment Modal ---
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            paymentModal.classList.remove('active');
            clearInterval(timerInterval);
            document.body.style.overflow = 'auto'; // Restore body scroll
        });
    }
    if (paymentModal) {
        paymentModal.addEventListener('click', (e) => {
            if (e.target === paymentModal) {
                paymentModal.classList.remove('active');
                clearInterval(timerInterval);
                document.body.style.overflow = 'auto'; // Restore body scroll
            }
        });
    }

    /* ==================== COPY ACCOUNT NUMBER ==================== */
    function setupCopyToClipboard(buttonId, valueElementId) {
        const btn = document.getElementById(buttonId);
        if (!btn) return;
        btn.addEventListener('click', () => {
            const text = document.getElementById(valueElementId).textContent;
            navigator.clipboard.writeText(text).then(() => {
                btn.classList.add('copied');
                const icon = btn.querySelector('i');
                icon.classList.replace('fa-copy', 'fa-check');
                const copyNotification = document.getElementById('copy-notification');
                if(copyNotification) {
                    copyNotification.classList.add('show');
                }
                setTimeout(() => {
                    btn.classList.remove('copied');
                    icon.classList.replace('fa-check', 'fa-copy');
                    if(copyNotification) {
                        copyNotification.classList.remove('show');
                    }
                }, 2000);
            }).catch(err => {
                console.error('Could not copy text: ', err);
                // Optionally show an error notification
            });
        });
    }
    setupCopyToClipboard('modalCopyAccNumber', 'modalAccNumber');

    /* ==================== SIDEBAR TOGGLE ==================== */
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        // Close sidebar on link click (for mobile)
        document.querySelectorAll('.sidebar-menu a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    if (icon) { // Check if icon exists
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                }
            });
        });
    }
    
    // Initial check for mobile to ensure sidebar is hidden by default if media query applies
    function checkSidebarState() {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        }
    }
    window.addEventListener('resize', checkSidebarState);
    checkSidebarState(); // Run on load
});