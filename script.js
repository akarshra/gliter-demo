document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. PRELOADER
     ========================================================================== */
  const preloader = document.getElementById('preloader');
  
  window.addEventListener('load', () => {
    // Small delay to ensure smooth transition
    setTimeout(() => {
      preloader.classList.add('fade-out');
      // Trigger animations for elements in viewport on load
      triggerInitialReveal();
    }, 600);
  });

  /* ==========================================================================
     2. CUSTOM CURSOR
     ========================================================================== */
  const cursor = document.getElementById('custom-cursor');
  const follower = document.getElementById('custom-cursor-follower');

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Core cursor is direct
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  // Follower lags behind smoothly
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
    
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover state detection
  const interactiveElements = document.querySelectorAll('a, button, .btn, input, select, textarea, .faq-summary, .package-card');
  const viewableElements = document.querySelectorAll('.bento-card, .gallery-item, .slider-container');
  const cursorText = follower.querySelector('.cursor-text');

  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      follower.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      follower.classList.remove('hovered');
    });
  });

  viewableElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      follower.classList.add('hover-view');
      if (cursorText) {
        if (el.classList.contains('slider-container')) {
          cursorText.textContent = 'Drag';
        } else {
          cursorText.textContent = 'View';
        }
      }
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      follower.classList.remove('hover-view');
      if (cursorText) cursorText.textContent = '';
    });
  });

  // 3D mouse glow hover tracking for luxury cards
  const luxuryCards = document.querySelectorAll('.bento-card, .gallery-item, .testimonial-card, .price-card, .academy-card');
  luxuryCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* ==========================================================================
     3. STICKY NAVBAR FALLBACK & SCROLL PROGRESS
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const progressBar = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // 1. Scroll Progress Bar
    if (docHeight > 0) {
      const scrollPercent = (scrollY / docHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    }

    // 2. Sticky Navbar Fallback (if scroll timelines aren't supported)
    if (!CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)')) {
      if (scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    }
  });

  /* ==========================================================================
     4. HERO MOUSE PARALLAX & FLOATING SHAPES
     ========================================================================== */
  const hero = document.getElementById('home');
  const heroImg = document.getElementById('hero-img');
  const shape1 = document.getElementById('shape-1');
  const shape2 = document.getElementById('shape-2');

  hero.addEventListener('mousemove', (e) => {
    const { width, height } = hero.getBoundingClientRect();
    const moveX = (e.clientX - width / 2) / width;
    const moveY = (e.clientY - height / 2) / height;

    // Shift hero background image slightly in opposite direction
    heroImg.style.transform = `scale(1.05) translate(${moveX * -15}px, ${moveY * -15}px)`;

    // Shift floating shapes in positive direction for depth
    shape1.style.transform = `translate(${moveX * 50}px, ${moveY * 50}px)`;
    shape2.style.transform = `translate(${moveX * -40}px, ${moveY * -40}px)`;
  });

  /* ==========================================================================
     5. STATS COUNTER ANIMATION
     ========================================================================== */
  const statsSection = document.querySelector('.hero-stats');
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let countersStarted = false;

  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    const stepTime = Math.max(Math.floor(duration / target), 15);
    let current = 0;

    const timer = setInterval(() => {
      current += Math.ceil(target / (duration / stepTime));
      if (current >= target) {
        element.textContent = target + '+';
        clearInterval(timer);
      } else {
        element.textContent = current + '+';
      }
    }, stepTime);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        statNumbers.forEach(num => countUp(num));
        countersStarted = true;
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  /* ==========================================================================
     6. DRAGGABLE BEFORE & AFTER SLIDER
     ========================================================================== */
  const slider = document.getElementById('before-after-slider');
  const afterImage = document.getElementById('image-after');
  const sliderHandle = document.getElementById('slider-handle');

  if (slider && afterImage && sliderHandle) {
    let isDragging = false;

    const setSliderPosition = (xPos) => {
      const rect = slider.getBoundingClientRect();
      let offsetX = xPos - rect.left;
      
      // Boundaries check
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      
      // Update DOM
      afterImage.style.width = `${100 - percentage}%`;
      sliderHandle.style.left = `${percentage}%`;
    };

    // Events
    const startDrag = () => { isDragging = true; };
    const stopDrag = () => { isDragging = false; };
    
    const dragMove = (e) => {
      if (!isDragging) return;
      // Handle touch coordinates vs mouse coordinates
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setSliderPosition(clientX);
    };

    // Mouse Listeners
    sliderHandle.addEventListener('mousedown', startDrag);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('mousemove', dragMove);

    // Touch Listeners (Mobile compatibility)
    sliderHandle.addEventListener('touchstart', startDrag);
    window.addEventListener('touchend', stopDrag);
    window.addEventListener('touchmove', dragMove, { passive: true });
  }

  /* ==========================================================================
     7. TESTIMONIALS AUTO-SLIDER CAROUSEL
     ========================================================================== */
  const carousel = document.getElementById('testimonials-carousel');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  let currentSlide = 0;
  let carouselInterval;

  const goToSlide = (index) => {
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    currentSlide = index;

    // Transform slide container
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;

    // Toggle active slide styling
    slides.forEach((slide, idx) => {
      if (idx === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Toggle active dots
    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const startAutoSlide = () => {
    carouselInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 5000); // Shift every 5 seconds
  };

  const stopAutoSlide = () => {
    clearInterval(carouselInterval);
  };

  // Add click events to dots
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      stopAutoSlide();
      const slideIndex = parseInt(e.target.getAttribute('data-slide'), 10);
      goToSlide(slideIndex);
      startAutoSlide();
    });
  });

  // Initialize
  if (carousel && slides.length > 0) {
    startAutoSlide();
    
    // Pause auto slide on mouse enter
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
  }

  /* ==========================================================================
     8. FILTERABLE GALLERY (MASONRY)
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Toggle active filter button state
      filterButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      const filterValue = e.target.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  /* ==========================================================================
     9. BOOKING FORM VALIDATION
     ========================================================================== */
  const bookingForm = document.getElementById('appointment-form');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Field References
      const nameInput = document.getElementById('booking-name');
      const phoneInput = document.getElementById('booking-phone');
      const serviceInput = document.getElementById('booking-service');
      const dateInput = document.getElementById('booking-date');

      // Error References
      const nameError = document.getElementById('name-error');
      const phoneError = document.getElementById('phone-error');
      const serviceError = document.getElementById('service-error');
      const dateError = document.getElementById('date-error');

      let isValid = true;

      // 1. Validate Name
      if (nameInput.value.trim() === '') {
        nameError.style.display = 'block';
        nameInput.style.borderColor = '#FF453A';
        isValid = false;
      } else {
        nameError.style.display = 'none';
        nameInput.style.borderColor = 'var(--glass-border)';
      }

      // 2. Validate Phone (Simple 10 Digit validation)
      const phoneRegex = /^\+?[0-9\s-]{10,14}$/;
      if (!phoneRegex.test(phoneInput.value.trim())) {
        phoneError.style.display = 'block';
        phoneInput.style.borderColor = '#FF453A';
        isValid = false;
      } else {
        phoneError.style.display = 'none';
        phoneInput.style.borderColor = 'var(--glass-border)';
      }

      // 3. Validate Service
      if (serviceInput.value === '') {
        serviceError.style.display = 'block';
        serviceInput.style.borderColor = '#FF453A';
        isValid = false;
      } else {
        serviceError.style.display = 'none';
        serviceInput.style.borderColor = 'var(--glass-border)';
      }

      // 4. Validate Date (Cannot be past date)
      const selectedDate = new Date(dateInput.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dateInput.value === '' || selectedDate < today) {
        dateError.style.display = 'block';
        dateInput.style.borderColor = '#FF453A';
        isValid = false;
      } else {
        dateError.style.display = 'none';
        dateInput.style.borderColor = 'var(--glass-border)';
      }

      if (isValid) {
        // Mock successful validation
        alert(`Thank you, ${nameInput.value}! Your booking for ${serviceInput.value} on ${dateInput.value} has been confirmed. We will reach out to you shortly.`);
        bookingForm.reset();
      }
    });
  }

  /* ==========================================================================
     10. BUTTON CLICK RIPPLE EFFECTS
     ========================================================================== */
  const rippleButtons = document.querySelectorAll('.btn-ripple-container');

  rippleButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.classList.add('btn-ripple');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  /* ==========================================================================
     11. HAMBURGER NAVIGATION DRAWER (MOBILE)
     ========================================================================== */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const navLinksAnchors = navLinks.querySelectorAll('a');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking link
    navLinksAnchors.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  /* ==========================================================================
     12. SCROLL REVEAL (INTERSECTION OBSERVER) & ACTIVE SECTION LINK SYNC
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  const navItems = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  function triggerInitialReveal() {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('reveal-active');
      }
    });
  }

  // Synchronize Nav active indicators on scroll
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => sectionObserver.observe(sec));

  /* ==========================================================================
     13. ACCORDION (MUTUALLY EXCLUSIVE DETAILS FALLBACK)
     ========================================================================== */
  // Modern Baseline has exclusive `<details name="faq">` native grouping.
  // We add fallback behavior for older browsers that don't support exclusive details.
  const detailsElements = document.querySelectorAll('details[name="faq"]');
  
  if (detailsElements.length > 0) {
    detailsElements.forEach(targetDetails => {
      targetDetails.addEventListener('toggle', () => {
        if (targetDetails.open) {
          // If we open one, close all other details
          detailsElements.forEach(el => {
            if (el !== targetDetails && el.open) {
              el.open = false;
            }
          });
        }
      });
    });
  }

  /* ==========================================================================
     14. LUXURY AI CHATBOT WIDGET
     ========================================================================== */
  const chatbotWidget = document.getElementById('chatbot-widget');
  const chatbotTrigger = document.getElementById('chatbot-trigger');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSend = document.getElementById('chatbot-send');
  const chatbotBody = document.getElementById('chatbot-body');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');
  const chatbotBadge = chatbotWidget ? chatbotWidget.querySelector('.chatbot-badge') : null;

  if (chatbotTrigger && chatbotWindow) {
    // Open/Close toggle
    chatbotTrigger.addEventListener('click', () => {
      chatbotWindow.classList.toggle('active');
      if (chatbotWindow.classList.contains('active') && chatbotBadge) {
        chatbotBadge.style.display = 'none'; // Hide badge when opened
      }
    });

    chatbotClose.addEventListener('click', () => {
      chatbotWindow.classList.remove('active');
    });

    // Send logic
    const appendMessage = (text, sender) => {
      const msgDiv = document.createElement('div');
      msgDiv.classList.add('chat-message', `${sender}-message`);
      msgDiv.innerHTML = text;
      chatbotBody.appendChild(msgDiv);
      
      // Auto scroll
      chatbotBody.scrollTop = chatbotBody.scrollHeight;
    };

    const handleBotResponse = (userQuery) => {
      let botReply = '';
      const query = userQuery.toLowerCase();

      if (query.includes('book') || query.includes('appointment') || query.includes('session')) {
        botReply = `To book an appointment, you can fill out our reservation form here: <a href="#booking" style="color: var(--gold-metallic); text-decoration: underline;">Book Session</a>, or call our desk at <a href="tel:+919876543210" style="color: var(--gold-metallic); text-decoration: underline;">+91 98765 43210</a>.`;
      } else if (query.includes('academy') || query.includes('course') || query.includes('training') || query.includes('learn')) {
        botReply = `We offer professional government-certified training in Hair Designing, Makeup Artistry, and Cosmetology. Please explore the <a href="#academy" style="color: var(--gold-metallic); text-decoration: underline;">Academy section</a> or drop an inquiry in the form.`;
      } else if (query.includes('bridal') || query.includes('wedding') || query.includes('makeup')) {
        botReply = `We specialize in luxury bridal makeovers using premium global products (Dior, Sephora). View our signature wedding styling packages here: <a href="#bridal" style="color: var(--gold-metallic); text-decoration: underline;">Bridal Packages</a>.`;
      } else if (query.includes('hour') || query.includes('time') || query.includes('open') || query.includes('location') || query.includes('where') || query.includes('address')) {
        botReply = `We are located at <strong>N-182, Sector-12, Pratap Vihar, Ghaziabad</strong>. We are open daily from <strong>10:00 AM to 08:30 PM</strong>. See our map location here: <a href="#contact" style="color: var(--gold-metallic); text-decoration: underline;">Contact & Map</a>.`;
      } else {
        botReply = `Thank you for reaching out to <strong>Gliter Shine</strong>. Our front-desk coordinator is available to help you personally. Please call us at <a href="tel:+919876543210" style="color: var(--gold-metallic); text-decoration: underline;">+91 98765 43210</a> or submit our <a href="#booking" style="color: var(--gold-metallic); text-decoration: underline;">Booking Request Form</a>.`;
      }

      // Simulate network delay
      setTimeout(() => {
        appendMessage(botReply, 'bot');
      }, 800);
    };

    const handleUserSend = () => {
      const text = chatbotInput.value.trim();
      if (text === '') return;

      appendMessage(text, 'user');
      chatbotInput.value = '';
      
      handleBotResponse(text);
    };

    // Events
    chatbotSend.addEventListener('click', handleUserSend);
    chatbotInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleUserSend();
    });

    // Chip click events
    suggestionChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        const text = e.target.textContent;
        appendMessage(text, 'user');
        
        // Hide suggestions once selected to keep chat clean
        const suggestionsBox = document.getElementById('chat-suggestions');
        if (suggestionsBox) suggestionsBox.remove();
        
        handleBotResponse(text);
      });
    });
  }
});
