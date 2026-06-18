  const navbar = document.getElementById('navbar');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        const particlesContainer = document.getElementById('particles');
        const contactForm = document.getElementById('contactForm');

        // Create floating particles
        function createParticles() {
            const particleCount = 20;
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 8 + 's';
                particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        // Navbar scroll effect
        function handleScroll() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Mobile menu toggle
        function toggleMobileMenu() {
            mobileMenu.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
        }

        // Scroll reveal animation
        function setupScrollReveal() {
            const revealElements = document.querySelectorAll('.reveal');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            revealElements.forEach(el => observer.observe(el));
        }

        // Counter animation
        function animateCounters() {
            const counters = document.querySelectorAll('.stat-number');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = parseInt(entry.target.dataset.target);
                        const duration = 2000;
                        const step = target / (duration / 16);
                        let current = 0;

                        const updateCounter = () => {
                            current += step;
                            if (current < target) {
                                entry.target.textContent = Math.floor(current);
                                requestAnimationFrame(updateCounter);
                            } else {
                                entry.target.textContent = target;
                                if (target === 98) {
                                    entry.target.textContent += '%';
                                } else if (target === 25) {
                                    entry.target.textContent += '+';
                                } else {
                                    entry.target.textContent += '+';
                                }
                            }
                        };

                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(counter => observer.observe(counter));
        }

        // Smooth scroll for navigation links
        function setupSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        // Close mobile menu if open
                        mobileMenu.classList.remove('active');
                        mobileMenuOverlay.classList.remove('active');
                    }
                });
            });
        }

        // Form submission
        function setupForm() {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = `
                    <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/>
                    </svg>
                    <span>جاري الإرسال...</span>
                `;
                submitBtn.disabled = true;

                setTimeout(() => {
                    submitBtn.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        <span>تم الإرسال بنجاح</span>
                    `;
                    submitBtn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';

                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                        contactForm.reset();
                    }, 2000);
                }, 1500);
            });
        }

        // Initialize all functions
        document.addEventListener('DOMContentLoaded', function() {
            createParticles();
            setupScrollReveal();
            animateCounters();
            setupSmoothScroll();
            setupForm();
        });

        // Event listeners
        window.addEventListener('scroll', handleScroll);
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        mobileMenuOverlay.addEventListener('click', toggleMobileMenu);

        // Close mobile menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
             });
             });