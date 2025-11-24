document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // 1. UTILS: Animations & Nav
    // ============================================
    
    // The function that makes numbers count up
    function animateCounter(element, start, end, duration) {
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const value = Math.floor(start + progress * (end - start));
            element.textContent = value.toLocaleString();
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }

    // Navigation Logic
    const nav = document.querySelector('nav');
    const burger = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 50); });
    burger.addEventListener('click', () => { navLinks.classList.toggle('active'); });

    // *** THIS WAS MISSING: Trigger Animation when Stats scroll into view ***
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target.querySelector('.counter-value');
                if(el) animateCounter(el, 0, parseInt(el.getAttribute('data-target')), 2000);
                observer.unobserve(entry.target);
            }
        });
    });
    document.querySelectorAll('.stat-card').forEach(card => statsObserver.observe(card));


    // ============================================
    // 2. PLEDGE (PHP Backend)
    // ============================================
    const pledgeButton = document.getElementById('pledgeButton');
    const pledgeCountElement = document.getElementById('pledgeCount');

    async function fetchPledgeCount() {
        try {
            const response = await fetch('pledge.php');
            const data = await response.json();
            animateCounter(pledgeCountElement, 0, data.count, 1000);
        } catch (error) {
            pledgeCountElement.textContent = "1,250"; // Fallback if PHP fails
        }
    }
    fetchPledgeCount();

    pledgeButton.addEventListener('click', async () => {
        if(pledgeButton.disabled) return;
        pledgeButton.disabled = true;
        try {
            await fetch('pledge.php', { method: 'POST' });
            fetchPledgeCount(); 
            pledgeButton.innerHTML = "Thank You! <i class='fas fa-heart'></i>";
            pledgeButton.classList.add('pulsing');
        } catch (e) { alert("Thanks for pledging!"); }
    });


    // ============================================
    // 3. TRACKER (FullCalendar)
    // ============================================
    const trackBtn = document.getElementById('trackBtn');
    const lastPeriodDateInput = document.getElementById('lastPeriodDate');
    
    if(trackBtn) {
        trackBtn.addEventListener('click', () => {
            const dateVal = lastPeriodDateInput.value;
            if (!dateVal) return alert("Please select a date!");

            document.getElementById('trackerResult').classList.remove('hidden');
            const lastDate = new Date(dateVal);
            
            // Calculations
            const nextPeriod = new Date(lastDate); nextPeriod.setDate(lastDate.getDate() + 28);
            const fertileStart = new Date(lastDate); fertileStart.setDate(lastDate.getDate() + 11);
            const fertileEnd = new Date(lastDate); fertileEnd.setDate(lastDate.getDate() + 16);

            // Update Text
            document.getElementById('nextPeriodDate').textContent = nextPeriod.toLocaleDateString();
            document.getElementById('fertileDates').textContent = `${fertileStart.toLocaleDateString()} - ${fertileEnd.toLocaleDateString()}`;

            // Render Calendar
            const calendarEl = document.getElementById('calendar');
            calendarEl.innerHTML = ''; 
            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                initialDate: nextPeriod,
                height: 300,
                events: [
                    { title: 'Period', start: dateVal, color: '#FF6B6B' },
                    { title: 'Fertile', start: fertileStart, end: fertileEnd, color: '#A7C957' },
                    { title: 'Next', start: nextPeriod, color: '#E63946' }
                ]
            });
            calendar.render();
        });
    }


    // ============================================
    // 4. IMPACT CALCULATOR
    // ============================================
    const calculateBtn = document.getElementById('calculateBtn');
    let myChart = null;

    if(calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            const items = document.getElementById('padInput').value;
            const type = document.getElementById('productType').value;
            
            let plasticPerItem = 5; 
            if (type === 'tampon') plasticPerItem = 3;
            if (type === 'applicator') plasticPerItem = 7;
            if (type === 'liner') plasticPerItem = 2;

            const totalKg = (items * 12 * 10 * plasticPerItem) / 1000; 
            
            document.getElementById('calculatorResult').classList.remove('hidden');
            document.getElementById('ecoMessage').textContent = `Switching saves ${totalKg.toFixed(1)}kg of plastic waste over 10 years!`;

            const ctx = document.getElementById('impactChart').getContext('2d');
            if (myChart) myChart.destroy();

            myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Your Waste', 'Sustainable Waste'],
                    datasets: [{
                        label: 'Plastic Waste (kg) in 10 Years',
                        data: [totalKg, 0.2],
                        backgroundColor: ['#E63946', '#A7C957']
                    }]
                },
                options: { responsive: true }
            });
        });
    }


    // ============================================
    // 5. GLOBAL MAP (Leaflet)
    // ============================================
    if(document.getElementById('ngoMap')) {
        const map = L.map('ngoMap').setView([20, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);

        const ngoData = [
            { lat: 28.7041, lng: 77.1025, title: "Goonj (India)" },
            { lat: 19.0760, lng: 72.8777, title: "Myna Mahila (Mumbai)" },
            { lat: 40.7128, lng: -74.0060, title: "Period Equity (USA)" },
            { lat: 51.5074, lng: -0.1278, title: "Bloody Good Period (UK)" },
            { lat: -1.2921, lng: 36.8219, title: "ZanaAfrica (Kenya)" },
            { lat: -33.8688, lng: 151.2093, title: "Share the Dignity (Aus)" },
            { lat: 35.6762, lng: 139.6503, title: "Red Box Project (Japan)" },
            { lat: -23.5505, lng: -46.6333, title: "Fluxo Sem Tabu (Brazil)" }
        ];

        ngoData.forEach(loc => {
            L.marker([loc.lat, loc.lng]).addTo(map).bindPopup(`<b>${loc.title}</b>`);
        });
    }


    // ============================================
    // 6. PRODUCT QUIZ
    // ============================================
    const quizBox = document.getElementById('quizQuestions');
    const quizResult = document.getElementById('quizResult');
    
    let quizScore = 0;
    const qData = [
        { q: "1. Comfortable with internal products?", yes: 10, no: -10 },
        { q: "2. Very active lifestyle?", yes: 5, no: 0 },
        { q: "3. Is laundry/washing a hassle?", yes: 5, no: -5 }
    ];
    let currQ = 0;

    window.nextQuiz = (val) => {
        quizScore += val;
        currQ++;
        loadQuiz();
    };

    function loadQuiz() {
        if(!quizBox) return;
        if(currQ >= qData.length) {
            showQuizResult();
            return;
        }
        quizBox.innerHTML = `
            <h4>${qData[currQ].q}</h4>
            <button class="btn secondary-btn q-btn" onclick="nextQuiz(${qData[currQ].yes})">Yes</button>
            <button class="btn secondary-btn q-btn" onclick="nextQuiz(${qData[currQ].no})">No</button>
        `;
    }

    function showQuizResult() {
        quizBox.innerHTML = '';
        quizResult.classList.remove('hidden');
        let prod = "Menstrual Cup";
        let reason = "Great for active lifestyles and long wear!";
        
        if(quizScore < 0) {
            prod = "Reusable Cloth Pads";
            reason = "Soft, external protection similar to disposables.";
        } else if (quizScore >= 0 && quizScore < 10) {
             prod = "Period Underwear";
             reason = "Comfortable freedom for moderate days.";
        }

        document.querySelector('.recommendation-product').textContent = prod;
        document.querySelector('.recommendation-reason').textContent = reason;
    }
    loadQuiz();


    // ============================================
    // 7. MYTH GAME & FAQ
    // ============================================
    const mythData = [
        { q: "Myth or Fact: Cups get lost inside you?", a: "myth", r: "Impossible! The cervix blocks it." },
        { q: "Myth or Fact: You can swim on your period.", a: "fact", r: "Yes! Use a cup or tampon." },
        { q: "Myth or Fact: Period blood is dirty.", a: "myth", r: "No, it is natural tissue and blood." },
        { q: "4. You lose a gallon of blood.", a: "myth", r: "The average is only 2-3 tablespoons!" },
        { q: "5. Cycles sync up with best friends.", a: "myth", r: "Studies show this is just a mathematical coincidence." },
        { q: "6. You can't get pregnant on your period.", a: "myth", r: "Sperm can survive for days, so it IS possible." },
        { q: "7. Exercise helps with cramps.", a: "fact", r: "Light movement releases endorphins that reduce pain." },
        { q: "8. Sharks are attracted to period blood.", a: "myth", r: "There is no evidence sharks prefer human blood." },
        { q: "9. PMS is 'all in your head'.", a: "myth", r: "PMS is caused by real hormonal changes in the body." },
        { q: "10. Tampons take away your virginity.", a: "myth", r: "Virginity is a social concept, not a physical one." }
    ];
    let curMyth = 0;
    let score = 0;

    if(document.getElementById('startGameBtn')) {
        document.getElementById('startGameBtn').addEventListener('click', () => {
            document.getElementById('game-start-screen').classList.add('hidden');
            document.getElementById('game-area').classList.remove('hidden');
            loadMyth();
        });
    }

    function loadMyth() {
        if(curMyth >= mythData.length) {
            document.getElementById('game-area').classList.add('hidden');
            document.getElementById('game-result-screen').classList.remove('hidden');
            document.getElementById('final-score').textContent = `Score: ${score}/${mythData.length}`;
            return;
        }
        document.getElementById('q-num').textContent = curMyth + 1;
        document.getElementById('game-question').textContent = mythData[curMyth].q;
        document.getElementById('feedback-area').classList.add('hidden');
    }

    document.querySelectorAll('.game-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const ans = e.target.getAttribute('data-answer');
            const correct = mythData[curMyth].a;
            const fb = document.getElementById('feedback-text');
            document.getElementById('feedback-area').classList.remove('hidden');
            
            if(ans === correct) {
                score++;
                fb.innerHTML = `✅ Correct! ${mythData[curMyth].r}`;
                fb.style.color = 'green';
            } else {
                fb.innerHTML = `❌ Wrong. ${mythData[curMyth].r}`;
                fb.style.color = 'red';
            }
        });
    });

    const nextQBtn = document.getElementById('nextQuestionBtn');
    if(nextQBtn) nextQBtn.addEventListener('click', () => { curMyth++; loadMyth(); });
    
    const restartBtn = document.getElementById('restartGameBtn');
    if(restartBtn) restartBtn.addEventListener('click', () => location.reload());

    // FAQ Logic
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            header.classList.toggle('active');
            if (header.classList.contains('active')) content.style.maxHeight = content.scrollHeight + "px";
            else content.style.maxHeight = null;
        });
    });

    // ============================================
    // 8. CHATBOT
    // ============================================
    const chatWin = document.getElementById('chatbot-window');
    document.getElementById('chat-launcher').addEventListener('click', () => chatWin.classList.remove('hidden'));
    document.getElementById('chat-close-btn').addEventListener('click', () => chatWin.classList.add('hidden'));
    document.getElementById('chat-send-btn').addEventListener('click', sendChat);
    document.getElementById('chat-input').addEventListener('keypress', (e) => { if(e.key === 'Enter') sendChat(); });

    function sendChat() {
        const input = document.getElementById('chat-input');
        const val = input.value.toLowerCase();
        if(!val) return;
        
        const msgBox = document.getElementById('chat-messages');
        msgBox.innerHTML += `<div class="message user-message">${input.value}</div>`;
        input.value = '';

        setTimeout(() => {
            let reply = "Ask me about hygiene or products!";
            if(val.includes('pain') || val.includes('cramp')) reply = "For cramps: Try heat pads and hydration.";
            if(val.includes('swim')) reply = "Swimming is safe! Use a cup or tampon.";
            msgBox.innerHTML += `<div class="message bot-message">${reply}</div>`;
            msgBox.scrollTop = msgBox.scrollHeight;
        }, 500);
    }
});