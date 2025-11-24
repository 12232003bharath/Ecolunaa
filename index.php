<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
    <title>Ecoluna – Periods for People and the Planet</title>
    
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Quicksand:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

    <link rel="stylesheet" href="style.css">

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script> <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js'></script> <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script> </head>
<body>

    <div class="floating-petals">
        <span class="petal p1"></span>
        <span class="petal p2"></span>
        <span class="petal p3"></span>
        <span class="petal p4"></span>
    </div>

    <header id="hero" class="hero-section">
        <nav>
            <div class="logo">Ecoluna</div>
            <ul class="nav-links">
                <li><a href="#about">Awareness</a></li>
                <li><a href="#tracker">Tracker</a></li>
                <li><a href="#quiz">Quiz</a></li>
                <li><a href="#calculator">Impact</a></li>
                <li><a href="#faq-awareness">FAQ</a></li>
                <li><a href="#myth-fact">Myths</a></li>
                <li><a href="#pledge">Pledge</a></li>
            </ul>
            <div class="burger-menu"><i class="fas fa-bars"></i></div>
        </nav>

        <div class="hero-container">
            <div class="hero-text">
                <h1 data-aos="fade-right">Sync with Nature.<br>Flow with the Moon.</h1>
                <p data-aos="fade-right" data-aos-delay="100">Ecoluna helps you embrace sustainable periods for a healthier body and a cleaner planet.</p>
                <div class="hero-actions" data-aos="fade-up" data-aos-delay="200">
                    <a href="#about" class="btn primary-btn">Why it Matters</a>
                    <a href="#tracker" class="btn secondary-btn">Track Cycle</a>
                </div>
            </div>

            <div class="hero-visual" data-aos="zoom-in" data-aos-delay="300">
                <div class="ecoluna-emblem">
                    <div class="moon-glow"></div>
                    <div class="moon-body">
                        <div class="crater c1"></div>
                        <div class="crater c2"></div>
                        <div class="crater c3"></div>
                    </div>
                    <div class="orbit-ring">
                        <div class="orbiting-leaf"><i class="fas fa-leaf"></i></div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="wave-background"></div>
    </header>

    <section id="about" class="content-section">
        <div class="container" data-aos="fade-up">
            <h2>Why Sustainable Menstruation Matters</h2>
            <p class="section-subtext">Conventional products are 90% plastic. It's time for a change.</p>
            
            <div class="earth-container" data-aos="zoom-in">
                <div class="earth-orbit">
                    <div class="earth"><i class="fas fa-globe-americas"></i></div>
                    <div class="satellite s1"><i class="fas fa-leaf"></i></div>
                    <div class="satellite s2"><i class="fas fa-tint"></i></div>
                    <div class="satellite s3"><i class="fas fa-recycle"></i></div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card" data-aos="zoom-in" data-aos-delay="100">
                    <i class="fas fa-trash-alt icon-large"></i>
                    <div class="counter-value" data-target="12000000000">0</div>
                    <p>pads thrown away yearly.</p>
                </div>
                <div class="stat-card" data-aos="zoom-in" data-aos-delay="200">
                    <i class="fas fa-clock icon-large"></i>
                    <div class="counter-value" data-target="500">0</div>
                    <p>years for a pad to decompose.</p>
                </div>
                <div class="stat-card" data-aos="zoom-in" data-aos-delay="300">
                    <i class="fas fa-wallet icon-large"></i>
                    <div class="counter-value" data-target="6000">0</div>
                    <p>Rupees saved yearly by switching.</p>
                </div>
            </div>
        </div>
    </section>

    <section id="tracker" class="content-section light-bg">
        <div class="container" data-aos="fade-up">
            <h2>Cycle Tracker 📅</h2>
            <p class="section-subtext">Predict your next flow and fertile window.</p>
            
            <div class="tracker-box">
                <label for="lastPeriodDate">Start date of your last period:</label>
                <input type="date" id="lastPeriodDate" required>
                <button id="trackBtn" class="btn primary-btn">Predict Cycle</button>

                <div id="trackerResult" class="result-area hidden">
                    <p>Next Period: <span id="nextPeriodDate">--</span></p>
                    <p class="fertile-window">Fertile: <span id="fertileDates">--</span></p>
                    <div id="calendar"></div>
                </div>
            </div>
        </div>
    </section>

    <section id="quiz" class="content-section">
        <div class="container" data-aos="fade-up">
            <h2>Find Your Perfect Product 🌱</h2>
            <p class="section-subtext">Answer 3 questions to find your sustainable match.</p>
            <div class="quiz-box">
                <div id="quizQuestions"></div> <div id="quizResult" class="result-area hidden">
                    <h3>Your Match: <span class="recommendation-product"></span></h3>
                    <p class="recommendation-reason"></p>
                    <button onclick="location.reload()" class="btn secondary-btn">Retake Quiz</button>
                </div>
            </div>
        </div>
    </section>
    
    <section id="calculator" class="content-section light-bg">
        <div class="container" data-aos="fade-up">
            <h2>Eco Impact Calculator</h2>
            <p class="section-subtext">Select your current product to see what you can save.</p>
            <div class="calculator-box">
                <label for="productType">What do you currently use?</label>
                <select id="productType">
                    <option value="pad">Standard Disposable Pad (5g plastic)</option>
                    <option value="tampon">Tampon (Non-Applicator) (3g plastic)</option>
                    <option value="applicator">Tampon (Plastic Applicator) (7g plastic)</option>
                    <!-- <option value="liner">Panty Liner (2g plastic)</option> -->
                </select>

                <label for="padInput">How many items per month (approx)?</label>
                <input type="number" id="padInput" min="1" value="15">
                <button id="calculateBtn" class="btn primary-btn">Calculate Savings</button>
                
                <div id="calculatorResult" class="result-area hidden">
                    <p id="ecoMessage" class="eco-message"></p>
                    <canvas id="impactChart"></canvas>
                </div>
            </div>
        </div>
    </section>

    <section id="faq-awareness" class="content-section">
         <div class="container" data-aos="fade-up">
            <h2>Common Questions</h2>
            <div class="accordion-container">
                <div class="accordion-item">
                    <button class="accordion-header"><i class="fas fa-swimmer"></i> Can you swim during your period?</button>
                    <div class="accordion-content"><p>Yes! With a menstrual cup or tampon, swimming is perfectly safe and hygienic. Pads absorb water, so they are not recommended for swimming.</p></div>
                </div>
                <div class="accordion-item">
                    <button class="accordion-header"><i class="fas fa-recycle"></i> Why are pads harmful to the environment?</button>
                    <div class="accordion-content"><p>A single pad contains up to 90% plastic (equal to 4 plastic bags). It takes 500+ years to decompose in a landfill.</p></div>
                </div>
                <div class="accordion-item">
                    <button class="accordion-header"><i class="fas fa-lock"></i> Does a menstrual cup affect virginity?</button>
                    <div class="accordion-content"><p>No. Virginity is a social construct. Using a cup may stretch the hymen (a thin tissue), but the hymen can also stretch from sports or simple movement. It does not change your biological status.</p></div>
                </div>
                <div class="accordion-item">
                    <button class="accordion-header"><i class="fas fa-coins"></i> Are sustainable products expensive?</button>
                    <div class="accordion-content"><p>The upfront cost is higher (e.g., ₹300-₹1000 for a cup), but since one cup lasts 5-10 years, you save thousands of rupees compared to buying pads every month.</p></div>
                </div>
                <div class="accordion-item">
                    <button class="accordion-header"><i class="fas fa-biohazard"></i> Is period blood dirty?</button>
                    <div class="accordion-content"><p>No. Period blood is just blood and tissue from the uterus. It is not "bad blood" or a way for the body to release toxins. It is a natural biological process.</p></div>
                </div>
                <div class="accordion-item">
                    <button class="accordion-header"><i class="fas fa-bed"></i> Can I sleep with a tampon/cup in?</button>
                    <div class="accordion-content"><p>Yes. Cups can be worn for up to 12 hours, making them great for sleep. Tampons should be changed every 4-8 hours, so use them only if you sleep less than that duration.</p></div>
                </div>
            </div>
        </div>
    </section>

    <section id="myth-fact" class="content-section light-bg">
        <div class="container" data-aos="fade-up">
            <h2>Myth vs. Fact Game 💡</h2>
             <div class="game-box">
                <div id="game-start-screen">
                    <p>Test your knowledge with 10 rounds!</p>
                    <button id="startGameBtn" class="btn primary-btn">Start Game</button>
                </div>
                <div id="game-area" class="hidden">
                    <p class="q-counter">Question <span id="q-num">1</span>/10</p>
                    <h4 id="game-question">---</h4>
                    <div class="game-options">
                        <button class="btn game-btn" data-answer="myth">MYTH</button>
                        <button class="btn game-btn" data-answer="fact">FACT</button>
                    </div>
                    <div id="feedback-area" class="hidden">
                        <p id="feedback-text"></p>
                        <button id="nextQuestionBtn" class="btn secondary-btn">Next</button>
                    </div>
                </div>
                <div id="game-result-screen" class="hidden">
                    <h4>Game Over!</h4>
                    <p id="final-score"></p>
                    <button id="restartGameBtn" class="btn primary-btn">Play Again</button>
                </div>
            </div>
        </div>
    </section>

    

    <section id="pledge" class="content-section pledge-section">
        <div class="container" data-aos="zoom-in">
            <h2>Take the Green Pledge 💚</h2>
            <p>Join the movement to switch to sustainable products.</p>
            <button id="pledgeButton" class="btn primary-btn big-btn">I PLEDGE TO FLOW FORWARD!</button>
            <div class="pledge-counter-display">
                <span id="pledgeCount">Loading...</span>
                <p>People Have Pledged Globally!</p>
            </div>
        </div>
    </section>

    <div id="chat-launcher" class="chat-launcher"><i class="fas fa-comments"></i></div>
    <div id="chatbot-window" class="chatbot-window hidden">
        <div class="chat-header">
            <h3>Flow Assistant</h3>
            <button id="chat-close-btn" class="chat-close-btn">&times;</button>
        </div>
        <div id="chat-messages" class="chat-messages">
            <div class="message bot-message">Hi! Ask me about 'pain', 'cups', 'waste', or 'hygiene'.</div>
        </div>
        <div class="chat-input-area">
            <input type="text" id="chat-input" placeholder="Type here...">
            <button id="chat-send-btn"><i class="fas fa-paper-plane"></i></button>
        </div>
    </div>

    <footer class="footer-section">
        <p>© 2025 Ecoluna | Sustainable Periods Project.</p>
    </footer>

    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>AOS.init({ once: true, duration: 800 });</script>
    <script src="script.js"></script>
</body>
</html>