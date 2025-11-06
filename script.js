document.addEventListener('DOMContentLoaded', () => {

    // --- UTILITY: Animated Counter Function ---
    function animateCounter(element, start, end, duration, decimalPlaces = 0) {
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const value = start + progress * (end - start);
            
            element.textContent = value.toFixed(decimalPlaces).replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
            
            if (progress < 1) { window.requestAnimationFrame(step); }
        };
        window.requestAnimationFrame(step);
    }

    // --- 1. Navigation & UI Enhancements ---
    const nav = document.querySelector('nav');
    const burger = document.querySelector('.burger-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Sticky Header Effect
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile Menu Toggle
    burger.addEventListener('click', () => { nav.classList.toggle('active'); });
    navLinks.forEach(link => {
        link.addEventListener('click', () => { nav.classList.remove('active'); });
    });

    // Active Navigation Highlighting (Intersection Observer)
    const sections = document.querySelectorAll('section, header');
    const navObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: "0px", threshold: 0.3 }); 

    sections.forEach(section => navObserver.observe(section));

    // --- 2. Pledge Counter & Social Share ---
    const pledgeButton = document.getElementById('pledgeButton');
    const pledgeCountElement = document.getElementById('pledgeCount');
    const socialShare = document.getElementById('socialShare');
    const shareTwitter = document.getElementById('shareTwitter');
    const shareFacebook = document.getElementById('shareFacebook');
    
    let currentPledgeCount = parseInt(localStorage.getItem('flowForwardPledgeCount')) || 0; 
    pledgeCountElement.textContent = currentPledgeCount.toLocaleString();

    pledgeButton.addEventListener('click', () => {
        currentPledgeCount++;
        localStorage.setItem('flowForwardPledgeCount', currentPledgeCount);
        animateCounter(pledgeCountElement, currentPledgeCount - 1, currentPledgeCount, 300, 0); 
        pledgeButton.classList.add('pulsing');
        setTimeout(() => pledgeButton.classList.remove('pulsing'), 300);
        
        socialShare.classList.remove('hidden');
        const shareText = encodeURIComponent(`I just joined ${currentPledgeCount} people in taking the #FlowForwardGreenPledge to choose sustainable periods!`);
        const shareURL = encodeURIComponent(window.location.href);

        shareTwitter.href = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareURL}`;
        shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${shareURL}&quote=${shareText}`;
    });

    // --- 3. Initial Stats Counters ---
    const statsCounters = document.querySelectorAll('.counter-value[data-target]');
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.getAttribute('data-target'));
                if (element.textContent.includes('0')) {
                   animateCounter(element, 0, target, 2500, 0);
                }
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 }); 

    statsCounters.forEach(counter => statsObserver.observe(counter));


    // --- 4. Flow Tracker & Prediction Tool ---
    const trackBtn = document.getElementById('trackBtn');
    const lastPeriodDateInput = document.getElementById('lastPeriodDate');
    const trackerResult = document.getElementById('trackerResult');
    const nextPeriodDateElement = document.getElementById('nextPeriodDate');
    const cycleLengthElement = document.getElementById('cycleLength');
    const fertileDatesElement = document.getElementById('fertileDates');

    const AVG_CYCLE = 28; 

    trackBtn.addEventListener('click', () => {
        const lastDateStr = lastPeriodDateInput.value;
        if (!lastDateStr) return;

        const lastDate = new Date(lastDateStr);
        lastDate.setDate(lastDate.getDate() + 1);

        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + AVG_CYCLE);

        const fertileStart = new Date(lastDate);
        fertileStart.setDate(fertileStart.getDate() + 10); 
        
        const fertileEnd = new Date(lastDate);
        fertileEnd.setDate(fertileEnd.getDate() + 17); 

        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        
        nextPeriodDateElement.textContent = nextDate.toLocaleDateString('en-US', options);
        cycleLengthElement.textContent = AVG_CYCLE;
        fertileDatesElement.textContent = `${fertileStart.toLocaleDateString('en-US', options)} - ${fertileEnd.toLocaleDateString('en-US', options)}`;
        
        trackerResult.classList.remove('hidden');
    });

    // --- 5. IMPROVED: Eco Period Calculator ---
    const productType = document.getElementById('productType');
    const padInput = document.getElementById('padInput');
    const calculateBtn = document.getElementById('calculateBtn');
    const calculatorResult = document.getElementById('calculatorResult');
    const itemsSavedCounter = document.getElementById('itemsSavedCounter');
    const wasteSavedCounter = document.getElementById('wasteSavedCounter');
    const ecoMessage = document.getElementById('ecoMessage');
    const LIFETIME_MONTHS = 12 * 10; 

    calculateBtn.addEventListener('click', () => {
        const itemsPerMonth = parseInt(padInput.value);
        const type = productType.value;
        
        if (isNaN(itemsPerMonth) || itemsPerMonth <= 0) {
            alert('Please enter a valid number of items used per month.');
            return;
        }

        const plasticGramPerItem = (type === 'pad') ? 5 : 3;
        
        const totalItemsSaved = itemsPerMonth * LIFETIME_MONTHS;
        const totalGramsSaved = totalItemsSaved * plasticGramPerItem;
        const totalKgSaved = (totalGramsSaved / 1000).toFixed(2); 

        calculatorResult.classList.remove('hidden');
        ecoMessage.textContent = '🌱 You are making a huge difference! This small change adds up to massive savings for the planet.';
        
        animateCounter(itemsSavedCounter, 0, totalItemsSaved, 1500, 0); 
        animateCounter(wasteSavedCounter, 0, parseFloat(totalKgSaved), 1500, 2); 
    });
    // --- FAQ Section (Fully Functional Accordion) ---
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const wasActive = header.classList.contains('active');

        // 1. Close all other open accordions first (Ensures only one is open at a time)
        document.querySelectorAll('.accordion-header.active').forEach(openHeader => {
            if (openHeader !== header) {
                openHeader.classList.remove('active');
                // Set max-height to null to trigger CSS transition for closing
                openHeader.nextElementSibling.style.maxHeight = null;
            }
        });

        // 2. Toggle the active class on the clicked header
        header.classList.toggle('active');
        
        if (wasActive) {
            // 3a. If it was active, close it
            content.style.maxHeight = null;
        } else {
            // 3b. If it was closed, open it dynamically
            // Set max-height to scrollHeight to allow CSS transition to reveal full content height.
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    });
});
    
    // --- 6. Personalized Product Quiz Logic ---
    const quizQuestionsContainer = document.getElementById('quizQuestions');
    const quizResult = document.getElementById('quizResult');
    const recommendationProduct = document.querySelector('.recommendation-product');
    const recommendationReason = document.querySelector('.recommendation-reason');

    const quizData = [
        {
            question: "What is your top priority?",
            options: [
                { text: "Maximum longevity and cost savings.", score: { cup: 3, cloth: 1 } },
                { text: "Soft, breathable comfort and easy washing.", score: { cup: 1, cloth: 3 } },
                { text: "Longest wear time (up to 12 hours).", score: { cup: 2, cloth: 0 } }
            ]
        },
        {
            question: "What is your main concern when switching?",
            options: [
                { text: "Dealing with mess/insertion.", score: { cup: 1, cloth: 2 } },
                { text: "Finding the right size/fit.", score: { cup: 3, cloth: 0 } },
                { text: "Need for washing/drying time.", score: { cup: 0, cloth: 3 } }
            ]
        }
    ];

    let currentQuestionIndex = 0;
    let scores = { cup: 0, cloth: 0 };

    function loadQuizQuestion(index) {
        if (index >= quizData.length) {
            showQuizResult();
            return;
        }

        const data = quizData[index];
        let html = `<h4>Q${index + 1}: ${data.question}</h4>`;
        
        data.options.forEach((option, i) => {
            html += `<div class="quiz-option" data-score-cup="${option.score.cup}" data-score-cloth="${option.score.cloth}" data-index="${i}">${option.text}</div>`;
        });

        quizQuestionsContainer.innerHTML = html;
        
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', handleQuizAnswer);
        });
    }

    function handleQuizAnswer(event) {
        const selectedOption = event.target;
        
        scores.cup += parseInt(selectedOption.getAttribute('data-score-cup'));
        scores.cloth += parseInt(selectedOption.getAttribute('data-score-cloth'));
        
        document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
        selectedOption.classList.add('selected');
        
        setTimeout(() => {
            currentQuestionIndex++;
            loadQuizQuestion(currentQuestionIndex);
        }, 400);
    }

    function showQuizResult() {
        quizQuestionsContainer.classList.add('hidden');
        quizResult.classList.remove('hidden');

        let product = "Menstrual Cup";
        let reason = "You prioritize **longevity, wear time, and efficiency**. The Menstrual Cup is the most cost-effective, durable, and longest-wearing option.";

        if (scores.cloth > scores.cup) {
            product = "Reusable Cloth Pad";
            reason = "You prioritize **comfort, breathability, and ease of cleaning**. Cloth pads offer soft material and a familiar feel with low environmental impact.";
        }
        
        recommendationProduct.textContent = product;
        recommendationReason.textContent = reason;
    }

    loadQuizQuestion(currentQuestionIndex);
    
    // --- 7. NEW: Interactive Myth vs. Fact Game Logic ---
    // --- 8. Interactive Myth vs. Fact Game (FULLY FUNCTIONAL) ---
    const mythFactData = [
        // --- QUESTIONS 1-3 (Health & Body Myths) ---
        {
            question: "MYTH or FACT: A menstrual cup can get 'lost' inside your body.",
            answer: "MYTH",
            explanation: "The vaginal canal is not connected to your abdominal cavity. The cup cannot go past your cervix, so it physically cannot get lost."
        },
        {
            question: "MYTH or FACT: Menstrual cups are only for people who have given birth.",
            answer: "MYTH",
            explanation: "Menstrual cups come in different sizes, and smaller cups are suitable and safe for teenagers and individuals who have not given birth."
        },
        {
            question: "MYTH or FACT: Using a menstrual cup can worsen cramps.",
            answer: "MYTH",
            explanation: "Cramps are caused by uterine contractions. If a cup is inserted correctly, it shouldn't cause discomfort, and may even alleviate pressure for some users."
        },
        
        // --- QUESTIONS 4-6 (Sustainability & Waste Myths) ---
        {
            question: "MYTH or FACT: Sustainable period products are less hygienic than disposable ones.",
            answer: "MYTH",
            explanation: "Reusable products like cups and cloth pads are made from medical-grade materials or natural fibers and are completely safe and hygienic when cleaned properly."
        },
        {
            question: "MYTH or FACT: Tampons labeled as 'organic cotton' are fully biodegradable in a landfill.",
            answer: "MYTH",
            explanation: "Even organic tampons often contain plastic strings or are wrapped in plastic, and most landfills lack the conditions (oxygen/microbes) for quick biodegradation."
        },
        {
            question: "MYTH or FACT: Cloth menstrual pads are difficult to wash and stain easily.",
            answer: "MYTH",
            explanation: "Modern cloth pads are made with wicking fabrics that wash easily. Rinsing in cold water immediately prevents staining, and they can be machine washed normally."
        },

        // --- QUESTIONS 7-9 (General & Lifestyle Myths) ---
        {
            question: "MYTH or FACT: Menstruating women should avoid high-intensity exercise.",
            answer: "MYTH",
            explanation: "Exercise during menstruation is perfectly fine and can even help reduce common symptoms like cramping and bloating."
        },
        {
            question: "MYTH or FACT: Menstrual synchrony (cycles aligning) has been scientifically proven.",
            answer: "MYTH",
            explanation: "Despite the popular belief, most large-scale studies have not found conclusive scientific evidence that women's cycles synchronize when living together."
        },
        {
            question: "MYTH or FACT: Using a menstrual cup saves you money after the first year.",
            answer: "FACT",
            explanation: "A menstrual cup typically costs $20-$40 but lasts up to 10 years, offering massive savings compared to disposable products which are a recurring monthly cost."
        }
    ];

    // ... (The rest of the game logic functions and event listeners follow) ...

    const startGameBtn = document.getElementById('startGameBtn');
    const gameStartScreen = document.getElementById('game-start-screen');
    const gameArea = document.getElementById('game-area');
    const gameQuestion = document.getElementById('game-question');
    const gameButtons = document.querySelectorAll('.game-btn');
    const feedbackArea = document.getElementById('feedback-area');
    const feedbackText = document.getElementById('feedback-text');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    const gameResultScreen = document.getElementById('game-result-screen');
    const finalScore = document.getElementById('final-score');
    const gameMessage = document.getElementById('game-message');
    const restartGameBtn = document.getElementById('restartGameBtn');
    

    let currentMythIndex = 0;
    let mythScore = 0;

    function resetGame() {
        currentMythIndex = 0;
        mythScore = 0;
        gameResultScreen.classList.add('hidden');
        gameArea.classList.add('hidden');
        gameStartScreen.classList.remove('hidden');
        feedbackArea.classList.add('hidden');
    }

    function loadMythQuestion() {
        if (currentMythIndex >= mythFactData.length) {
            showMythResults();
            return;
        }

        const currentData = mythFactData[currentMythIndex];
        gameQuestion.textContent = currentData.question;

        feedbackArea.classList.add('hidden');
        gameButtons.forEach(btn => btn.disabled = false);
    }

    function handleMythAnswer(event) {
        gameButtons.forEach(btn => btn.disabled = true);
        
        const selectedAnswer = event.target.getAttribute('data-answer').toUpperCase();
        const correct = mythFactData[currentMythIndex].answer;
        const explanation = mythFactData[currentMythIndex].explanation;

        feedbackArea.classList.remove('hidden');
        feedbackArea.classList.remove('correct', 'incorrect');

        if (selectedAnswer === correct.toUpperCase()) {
            mythScore++;
            feedbackArea.classList.add('correct');
            feedbackText.innerHTML = `✅ **Correct!** (${correct}): ${explanation}`;
        } else {
            feedbackArea.classList.add('incorrect');
            feedbackText.innerHTML = `❌ **Incorrect.** The answer is **${correct}**: ${explanation}`;
        }
    }

    function showMythResults() {
        gameArea.classList.add('hidden');
        gameResultScreen.classList.remove('hidden');
        finalScore.textContent = `You scored ${mythScore} out of ${mythFactData.length}!`;
        
        if (mythScore === mythFactData.length) {
            gameMessage.textContent = "Amazing! You are a FlowForward expert and a myth-buster!";
        } else if (mythScore >= 1) {
            gameMessage.textContent = "Great job! Keep reading and spreading the facts.";
        } else {
            gameMessage.textContent = "Keep learning! Awareness is the first step to change.";
        }
    }

    // Myth Game Event Listeners
    startGameBtn.addEventListener('click', () => {
        gameStartScreen.classList.add('hidden');
        gameArea.classList.remove('hidden');
        loadMythQuestion();
    });

    gameButtons.forEach(btn => {
        btn.addEventListener('click', handleMythAnswer);
    });

    nextQuestionBtn.addEventListener('click', () => {
        currentMythIndex++;
        loadMythQuestion();
    });

    restartGameBtn.addEventListener('click', resetGame);

    // Initialize the game on load
    resetGame();

    // --- 8. NGO Tabbed Filter Logic ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const ngoCards = document.querySelectorAll('.ngo-card');

    function filterNGOs(region) {
        ngoCards.forEach(card => {
            if (card.getAttribute('data-region') === region || region === 'global') {
                card.classList.remove('hidden');
                card.style.display = 'block'; 
            } else {
                card.classList.add('hidden');
                card.style.display = 'none'; 
            }
        });
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const region = this.getAttribute('data-region');
            filterNGOs(region);
        });
    });
    

        // --- CHATBOT FUNCTIONALITY (Internal Knowledge Base Only) ---

const chatLauncher = document.getElementById('chat-launcher');
const chatWindow = document.getElementById('chatbot-window');
const chatCloseBtn = document.getElementById('chat-close-btn');
const chatInput = document.getElementById('chat-input');
const chatSendBtn = document.getElementById('chat-send-btn');
const chatMessages = document.getElementById('chat-messages');

// Toggles chat window visibility
function toggleChat() {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) {
        chatInput.focus();
    }
}

// Add message to chat history
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.innerHTML = text; // Use innerHTML to handle bold/links
    chatMessages.appendChild(messageDiv);
    
    // Scroll to the bottom of the chat window
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// --- Internal Knowledge Base (Provides Direct Responses) ---
function getBotResponse(userMessage) {
    const msg = userMessage.toLowerCase();

    // 1. HYGIENE & CLEANLINESS QUESTIONS
    if (msg.includes('change pad') || msg.includes('how often to change') || msg.includes('change tampon')) {
        return "You should change pads and tampons at least every **4 to 8 hours**. Leaving them in longer can lead to odor and increase the risk of infection or TSS.";
    }
    if (msg.includes('clean private area') || msg.includes('wash area')) {
        return "Always wash the genital area with **plain water only**; avoid harsh soaps, douches, or specialized washes. Wash from front to back to prevent bacteria transfer.";
    }
    if (msg.includes('clean cup') || msg.includes('sterilize')) {
        return "Clean your menstrual cup by rinsing it with cold water between uses. **Sterilize it by boiling** for 5-10 minutes at the end of each cycle.";
    }
    
    // 2. SUSTAINABILITY & PRODUCT QUESTIONS
    if (msg.includes('plastic') || msg.includes('waste')) {
        return "Every year, **billions of pads and tampons** end up in landfills. This is why we promote reusable products like cups and cloth pads. Try the 'Calculator' tab to see your potential savings!";
    }
    if (msg.includes('decompose') || msg.includes('break down')) {
        return "Most disposable pads can take **up to 500 years** to decompose due to their plastic content. Reusable options drastically reduce this burden.";
    }
    if (msg.includes('product') || msg.includes('compare')) {
        return "We promote **Menstrual Cups** (long-lasting, cost-effective) and **Reusable Cloth Pads**. Try the 'Quiz' tab for a personal recommendation!";
    }

    // 3. HEALTH & CYCLE QUESTIONS
    if (msg.includes('cramps') || msg.includes('pain')) {
        return "Mild cramping is common, but **severe pain that disrupts daily life is not normal**. Please consult a doctor if your pain is debilitating.";
    }
    if (msg.includes('swim')) {
        return "Yes, you can swim during your period! We highly recommend using a **menstrual cup** or tampon.";
    }
    if (msg.includes('cycle length') || msg.includes('track')) {
        return "The average cycle length is **28 days**. Use the 'Tracker' tab to input your dates and predict your next flow!";
    }
    if (msg.includes('tss')) {
        return "TSS is a very rare but serious condition. It is primarily linked to prolonged use of high-absorbency tampons. Following hygiene rules is crucial with all products.";
    }

    // 4. WEBSITE/ACTION & NGO QUESTIONS
    if (msg.includes('pledge') || msg.includes('count')) {
        const count = parseInt(localStorage.getItem('flowForwardPledgeCount')) || 1250;
        return `We currently have **${count.toLocaleString()}** people who have taken the Green Pledge! Join them on the 'Pledge' tab!`;
    }
    if (msg.includes('ngo') || msg.includes('donate')) {
        return "Check the 'NGOs' tab for organizations focused on **Period Equity** and product distribution globally. We have regional contacts there.";
    }
    if (msg.includes('quiz') || msg.includes('test') || msg.includes('myth')) {
        return "You can find our fun 'Myth vs. Fact' game in the **Myths** tab, and your personal product recommendation in the **Quiz** tab!";
    }

    // 5. DEFAULT RESPONSES
    if (msg.includes('hello') || msg.includes('hi')) {
        return "Hi there! I'm your FlowForward assistant. I can answer questions about **hygiene tips, sustainable products, or menstrual myths!**";
    }
    
    // Final fallback
    return "I couldn't find a direct answer to that specific question in my knowledge base. Please try asking about **hygiene, waste, products, or the pledge**!";
}

// Main function to send and receive messages
function sendMessage() {
    const userInput = chatInput.value.trim();
    if (userInput === '') return;

    // 1. Display user message
    addMessage(userInput, 'user');
    chatInput.value = '';

    // 2. Display 'thinking' indicator
    const thinkingMessage = document.createElement('div');
    thinkingMessage.classList.add('message', 'bot-message', 'thinking');
    thinkingMessage.innerHTML = '...thinking...';
    chatMessages.appendChild(thinkingMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // 3. Get bot response instantly (no API delay)
    const botResponse = getBotResponse(userInput);
    
    // 4. Remove thinking indicator and display final response
    setTimeout(() => {
        thinkingMessage.remove();
        addMessage(botResponse, 'bot');
    }, 500); // Simulate a small delay for better user experience
}

// --- Event Listeners for Chatbot ---
chatLauncher.addEventListener('click', toggleChat);
chatCloseBtn.addEventListener('click', toggleChat);
chatSendBtn.addEventListener('click', sendMessage);

// Enable sending message on Enter key press
chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});




    
    filterNGOs('global'); 

    // --- 9. Smooth Scroll Navigation (Retained) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
        });
    });
});
