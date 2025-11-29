// ============== Attach UI Event Listeners ==============
function attachUIEventListeners() {
  // Allow reattachment of UI listeners for navigation
  // Mobile menu toggle
  var menuBtn = document.querySelector(".icon-menu");
  if (menuBtn) {
    // Remove existing listener
    const newMenuBtn = menuBtn.cloneNode(true);
    menuBtn.parentNode.replaceChild(newMenuBtn, menuBtn);
    
    newMenuBtn.addEventListener("click", function (event) {
      event.preventDefault();
      document.body.classList.toggle("menu-open");
    });
  }

  // Re-setup theme toggle for this page
  setupThemeToggle();
  
  // Remove background from shield logos
  removeShieldLogoBackground();

  // Theme (Dark/Light) Toggle - Simplified and reliable
  const STORAGE_KEY = "themePreference";
  
  function applyTheme(mode) {
    const isDark = mode === "dark";
    document.body.classList.toggle("theme-dark", isDark);
    
    // Update theme toggle button text
    const toggleEl = document.getElementById("themeToggle");
    if (toggleEl) {
      toggleEl.textContent = isDark ? "Light" : "Dark";
      toggleEl.setAttribute("aria-pressed", String(isDark));
      toggleEl.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
    }

    // Theme-aware logo handling
    const logos = document.querySelectorAll('img.logo__img[data-logo-light]');
    logos.forEach((img) => {
      const lightSrc = img.getAttribute('data-logo-light');
      const darkSrc = img.getAttribute('data-logo-dark');
      if (isDark && darkSrc) {
        const prev = img.src;
        img.onerror = () => { img.onerror = null; img.src = prev; img.classList.add('logo--filter-fallback'); };
        img.src = darkSrc;
        img.classList.remove('logo--filter-fallback');
      } else if (!isDark && lightSrc) {
        const prev = img.src;
        img.onerror = () => { img.onerror = null; img.src = prev; };
        img.src = lightSrc;
        img.classList.remove('logo--filter-fallback');
      } else {
        img.classList.toggle('logo--filter-fallback', isDark);
      }
    });
  }
  
  function getInitialTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "dark" || saved === "light") return saved;
    } catch (e) {}
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }
  
  // Initialize theme
  let currentTheme = getInitialTheme();
  applyTheme(currentTheme);
  
  // Direct theme toggle button handler with guard to prevent multiple setups
  function setupThemeToggle() {
    // Guard: Prevent multiple setups using a flag
    if (window.__themeToggleSetup) {
      return; // Already set up, skip
    }
    window.__themeToggleSetup = true;
    
    const themeToggleBtn = document.getElementById("themeToggle");
    if (themeToggleBtn) {
      console.log('✅ Theme toggle button found and setting up listener');
      
      // Remove any existing listeners (clean slate)
      const oldBtn = themeToggleBtn.cloneNode(true);
      themeToggleBtn.parentNode.replaceChild(oldBtn, themeToggleBtn);
      
      // Add fresh click listener
      oldBtn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        console.log('🌓 Theme toggle button clicked');
        
        // Toggle theme
        const newTheme = document.body.classList.contains("theme-dark") ? "light" : "dark";
        currentTheme = newTheme;
        applyTheme(currentTheme);
        
        // Save to localStorage
        try { 
          localStorage.setItem(STORAGE_KEY, currentTheme);
          localStorage.setItem(STORAGE_KEY + '_timestamp', Date.now());
          console.log(`✅ Theme changed to: ${currentTheme} | Button now shows: ${oldBtn.textContent}`);
        } catch (e2) {
          console.warn('Could not save theme preference:', e2);
        }
      }, true); // Use capture phase
    } else {
      console.warn('⚠️ Theme toggle button not found on this page');
    }
  }
  
  // Expose setupThemeToggle globally so PageLoader can call it
  window.setupThemeToggle = setupThemeToggle;
  
  // Setup theme toggle on initial load
  setupThemeToggle();

  // Home Button Function
  const homeBtn = document.querySelector('.menu__link[href="index.html"], .menu__link[href="./"], .menu__link[href="/"]');
  if (homeBtn) {
    homeBtn.addEventListener('click', function (e) {
      // Let browser handle navigation to home page (index.html)
    });
  }

  // Navigation (Home, About, Services, Contact)
  document.querySelectorAll('.menu__link').forEach(link => {
    link.addEventListener('click', function (e) {
      // Let the browser handle navigation for anchor links
    });
  });

  // ================= CONTACT BUTTON FUNCTIONALITY ================= 
  
  // Enhanced Contact Button with animations and feedback
  function setupContactButton() {
    const contactButtons = document.querySelectorAll('.outro__button, .button[href*="contact"], a[href*="contact.html"]');
    
    contactButtons.forEach(button => {
      // Remove existing listeners by cloning
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
      
      // Add enhanced click functionality
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Add loading state
        const originalText = newButton.textContent;
        newButton.textContent = 'Loading...';
        newButton.style.pointerEvents = 'none';
        newButton.classList.add('loading');
        
        // Create ripple effect
        createRippleEffect(newButton, e);
        
        // Show feedback animation
        newButton.style.transform = 'scale(0.95)';
        
        // Navigate after animation
        setTimeout(() => {
          // Check if we're already on contact page
          if (window.location.pathname.includes('contact.html')) {
            // If already on contact page, scroll to top and highlight content
            window.scrollTo({ top: 0, behavior: 'smooth' });
            highlightContactInfo();
            resetButton();
          } else {
            // Navigate to contact page with smooth transition
            window.location.href = newButton.getAttribute('href') || 'contact.html';
          }
        }, 300);
        
        function resetButton() {
          setTimeout(() => {
            newButton.textContent = originalText;
            newButton.style.pointerEvents = '';
            newButton.classList.remove('loading');
            newButton.style.transform = '';
          }, 1000);
        }
      });
      
      // Add hover effects
      newButton.addEventListener('mouseenter', function() {
        if (!newButton.classList.contains('loading')) {
          newButton.style.transform = 'translateY(-2px) scale(1.02)';
        }
      });
      
      newButton.addEventListener('mouseleave', function() {
        if (!newButton.classList.contains('loading')) {
          newButton.style.transform = '';
        }
      });
    });
  }
  
  // Create ripple effect on button click
  function createRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple-effect');
    
    // Add ripple styles if not already added
    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        .ripple-effect {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        }
        
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        .outro__button, .button {
          position: relative !important;
          overflow: hidden !important;
        }
      `;
      document.head.appendChild(style);
    }
    
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
  
  // Highlight contact information when button is clicked on same page
  function highlightContactInfo() {
    const contactSection = document.querySelector('.contact');
    const contactItems = document.querySelectorAll('.connect-contact__item');
    
    if (contactSection) {
      // Add highlight class to contact section
      contactSection.style.background = 'rgba(59, 130, 246, 0.05)';
      contactSection.style.transition = 'all 0.5s ease';
      
      // Animate contact items
      contactItems.forEach((item, index) => {
        setTimeout(() => {
          item.style.transform = 'scale(1.05)';
          item.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.15)';
          item.style.transition = 'all 0.3s ease';
          
          // Reset after highlight
          setTimeout(() => {
            item.style.transform = '';
            item.style.boxShadow = '';
          }, 2000);
        }, index * 100);
      });
      
      // Reset contact section background
      setTimeout(() => {
        contactSection.style.background = '';
      }, 3000);
    }
  }
  
  // Enhanced social media links functionality
  function setupSocialLinks() {
    const socialLinks = document.querySelectorAll('.contact__link');
    
    socialLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // For demo purposes, show an alert since URLs aren't provided
        if (link.getAttribute('href') === '#') {
          e.preventDefault();
          
          const img = link.querySelector('img');
          const platform = img ? img.getAttribute('src').split('/').pop().split('.')[0] : 'social media';
          
          // Create custom notification
          showNotification(`${platform.toUpperCase()} link coming soon!`, 'info');
        }
      });
      
      // Add hover effects
      link.addEventListener('mouseenter', function() {
        link.style.transform = 'scale(1.1) rotate(5deg)';
        link.style.transition = 'all 0.2s ease';
      });
      
      link.addEventListener('mouseleave', function() {
        link.style.transform = '';
      });
    });
  }
  
  // Custom notification system
  function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.custom-notification');
    existing.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;
    notification.textContent = message;
    
    // Add notification styles
    if (!document.querySelector('#notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        .custom-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #3b82f6;
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          z-index: 10000;
          animation: slideIn 0.3s ease;
          font-weight: 500;
        }
        
        .custom-notification.info {
          background: #3b82f6;
        }
        
        .custom-notification.success {
          background: #10b981;
        }
        
        .custom-notification.warning {
          background: #f59e0b;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
  
  // Initialize contact functionality
  setupContactButton();
  setupSocialLinks();
}

// ================= CONTACT BUTTON INITIALIZATION =================

// Initialize contact button functionality when DOM is ready
function initializeContactButton() {
  console.log('Contact button initialization disabled - handled by React Router');
  // Contact button functionality is now handled in PageLoader component
  return;
}

// Standalone contact button setup (can be called independently)
function setupContactButtonStandalone() {
  console.log('Setting up contact button standalone...');
  
  // Find all possible contact button selectors
  const selectors = [
    '.outro__button', 
    '.button[href*="contact"]', 
    'a[href*="contact.html"]',
    'a[href="contact.html"]',
    'a[href="/contact.html"]',
    '.outro .button',
    '[class*="contact"][class*="button"]'
  ];
  
  let contactButtons = [];
  
  // Try each selector to find contact buttons
  selectors.forEach(selector => {
    const found = document.querySelectorAll(selector);
    if (found.length > 0) {
      console.log(`Found ${found.length} elements with selector: ${selector}`);
      contactButtons = [...contactButtons, ...Array.from(found)];
    }
  });
  
  // Remove duplicates
  contactButtons = [...new Set(contactButtons)];
  
  console.log(`Total contact buttons found: ${contactButtons.length}`);
  
  if (contactButtons.length === 0) {
    console.warn('No contact buttons found. Available buttons:', 
      Array.from(document.querySelectorAll('button, a, .button')).map(el => ({
        tag: el.tagName,
        class: el.className,
        href: el.href,
        text: el.textContent?.trim()
      }))
    );
    return;
  }
  
  contactButtons.forEach((button, index) => {
    console.log(`Setting up contact button ${index + 1}:`, {
      tag: button.tagName,
      class: button.className,
      href: button.href,
      text: button.textContent?.trim()
    });
    
    // Remove existing listeners by cloning
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    // Add enhanced click functionality
    newButton.addEventListener('click', function(e) {
      console.log('Contact button clicked!');
      e.preventDefault();
      
      // Add loading state
      const originalText = newButton.textContent;
      const originalHref = newButton.getAttribute('href');
      
      console.log('Original text:', originalText);
      console.log('Original href:', originalHref);
      
      newButton.textContent = 'Loading...';
      newButton.style.pointerEvents = 'none';
      newButton.classList.add('loading');
      
      // Create ripple effect
      createRippleEffectStandalone(newButton, e);
      
      // Show feedback animation
      newButton.style.transform = 'scale(0.95)';
      newButton.style.transition = 'all 0.3s ease';
      
      // Navigate after animation
      setTimeout(() => {
        console.log('Navigating to contact page...');
        
        // Check if we're in a React app (HashRouter)
        const currentHash = window.location.hash;
        console.log('Current hash:', currentHash);
        console.log('Current pathname:', window.location.pathname);
        
        // For React HashRouter navigation
        if (currentHash.includes('#/contact')) {
          console.log('Already on contact page, highlighting info...');
          // If already on contact page, scroll to top and highlight content
          window.scrollTo({ top: 0, behavior: 'smooth' });
          highlightContactInfoStandalone();
          resetButton();
        } else {
          console.log('Navigating to contact page via React Router...');
          
          // Navigate using HashRouter format
          const contactUrl = window.location.pathname + '#/contact';
          console.log('Target URL:', contactUrl);
          
          // Use both methods to ensure navigation works
          window.location.hash = '#/contact';
          
          // Fallback: Direct navigation
          setTimeout(() => {
            if (!window.location.hash.includes('contact')) {
              window.location.href = contactUrl;
            }
          }, 100);
          
          resetButton();
        }
      }, 300);
      
      function resetButton() {
        setTimeout(() => {
          newButton.textContent = originalText;
          newButton.style.pointerEvents = '';
          newButton.classList.remove('loading');
          newButton.style.transform = '';
        }, 1000);
      }
    });
    
    // Add hover effects
    newButton.addEventListener('mouseenter', function() {
      if (!newButton.classList.contains('loading')) {
        newButton.style.transform = 'translateY(-2px) scale(1.02)';
        newButton.style.transition = 'all 0.3s ease';
      }
    });
    
    newButton.addEventListener('mouseleave', function() {
      if (!newButton.classList.contains('loading')) {
        newButton.style.transform = '';
      }
    });
    
    console.log(`Contact button ${index + 1} setup complete!`);
  });
}

// Standalone ripple effect function
function createRippleEffectStandalone(button, event) {
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.classList.add('ripple-effect');
  
  // Add ripple styles if not already added
  if (!document.querySelector('#ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
      .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 1000;
      }
      
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      
      .outro__button, .button {
        position: relative !important;
        overflow: hidden !important;
      }
      
      .loading {
        opacity: 0.7 !important;
        cursor: wait !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  button.appendChild(ripple);
  
  // Remove ripple after animation
  setTimeout(() => {
    if (ripple && ripple.parentNode) {
      ripple.remove();
    }
  }, 600);
}

// Standalone highlight function
function highlightContactInfoStandalone() {
  const contactSection = document.querySelector('.contact');
  const contactItems = document.querySelectorAll('.connect-contact__item');
  
  if (contactSection) {
    console.log('Highlighting contact section...');
    // Add highlight class to contact section
    contactSection.style.background = 'rgba(59, 130, 246, 0.05)';
    contactSection.style.transition = 'all 0.5s ease';
    
    // Animate contact items
    contactItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.transform = 'scale(1.05)';
        item.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.15)';
        item.style.transition = 'all 0.3s ease';
        
        // Reset after highlight
        setTimeout(() => {
          item.style.transform = '';
          item.style.boxShadow = '';
        }, 2000);
      }, index * 100);
    });
    
    // Reset contact section background
    setTimeout(() => {
      contactSection.style.background = '';
    }, 3000);
  }
}

// Initialize immediately and also on DOM ready
initializeContactButton();

// Also make it available globally for manual calling
window.setupContactButton = setupContactButtonStandalone;

// Attach listeners on initial load (guarded)
attachUIEventListeners();

// Allow React/SPA to call this after page injection
window.attachUIEventListeners = attachUIEventListeners;

function attachSpollerListeners() {
  if (window.__spollerListenersAttached) return;
  window.__spollerListenersAttached = true;
  const spollerButtons = document.querySelectorAll("[data-spoller] .spollers-faq__button");
  spollerButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const currentItem = button.closest("[data-spoller]");
      const content = currentItem.querySelector(".spollers-faq__text");
      const parent = currentItem.parentNode;
      const isOneSpoller = parent.hasAttribute("data-one-spoller");
      if (isOneSpoller) {
        const allItems = parent.querySelectorAll("[data-spoller]");
        allItems.forEach((item) => {
          if (item !== currentItem) {
            const otherContent = item.querySelector(".spollers-faq__text");
            item.classList.remove("active");
            otherContent.style.maxHeight = null;
          }
        });
      }
      if (currentItem.classList.contains("active")) {
        currentItem.classList.remove("active");
        content.style.maxHeight = null;
      } else {
        currentItem.classList.add("active");
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}
attachSpollerListeners();
window.attachSpollerListeners = attachSpollerListeners;

// ================== Configuration-Based Scanner Initialization ==================

/**
 * Initialize configuration system
 */
async function initConfigSystem() {
  try {
    // Check if configuration files are loaded
    if (typeof configManager === 'undefined') {
      console.warn('⚠️ Configuration manager not loaded, using defaults');
      return null;
    }
    
    // Initialize configuration manager
    await configManager.init();
    
    console.log('✅ Configuration system initialized');
    console.log('📊 Configuration summary:', configManager.getSummary());
    
    return configManager.getConfig();
  } catch (error) {
    console.error('❌ Failed to initialize configuration system:', error);
    return null;
  }
}

// Initialize config system on load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initConfigSystem().then(config => {
      if (config) {
        console.log('🎯 Scanner ready with configuration-based features');
      }
    });
  });
}

// Make init function available globally
window.initConfigSystem = initConfigSystem;

// ================== Link Safety Scanner ==================
function initScanner() {
  // Reset scanner state to allow reinitialization
  const input = document.getElementById("scannerInput");
  const scanBtn = document.getElementById("scanBtn");
  const restartBtn = document.getElementById("restartBtn");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");
  const resultsEl = document.getElementById("results");
  const historyList = document.getElementById("historyList");
  const summaryEl = document.getElementById("scanSummary");
  const filterButtons = document.querySelectorAll('.filter-button[data-filter]');
  
  // Elements for visual improvements
  const progressContainer = document.getElementById("progressContainer");
  const progressBar = document.getElementById("progressBar");
  
  // Concurrency cap from configuration (with fallback)
  const getMaxConcurrentScans = () => {
    const config = window.configManager ? window.configManager.getConfig() : {};
    return config.scanning?.maxConcurrentRequests || 3;
  };
  const MAX_CONCURRENT_SCANS = getMaxConcurrentScans();
  let currentHistoryFilter = 'all';

  if (!input || !scanBtn || !resultsEl) return;

  // ============== PERSIST INPUT VALUE ACROSS NAVIGATION ==============
  // Restore saved input value from sessionStorage
  const savedInput = sessionStorage.getItem('urly_scanner_input');
  if (savedInput && input) {
    input.value = savedInput;
    console.log('✅ Restored scanner input from session');
  }

  // Save input value whenever it changes
  if (input) {
    input.addEventListener('input', () => {
      sessionStorage.setItem('urly_scanner_input', input.value);
    });
    
    // Also save on blur (when user clicks away)
    input.addEventListener('blur', () => {
      sessionStorage.setItem('urly_scanner_input', input.value);
    });
  }
  // ===================================================================

  // Remove existing event listeners to prevent duplicates
  const newScanBtn = scanBtn.cloneNode(true);
  scanBtn.parentNode.replaceChild(newScanBtn, scanBtn);
  
  if (restartBtn) {
    const newRestartBtn = restartBtn.cloneNode(true);
    restartBtn.parentNode.replaceChild(newRestartBtn, restartBtn);
  }

  // Update references to new elements
  const scanButton = newScanBtn;
  const restartButton = document.getElementById("restartBtn");

  // ============== Progress Bar Functions ==============
  function showProgress() {
    if (progressContainer) {
      progressContainer.classList.add('active');
      progressBar.style.width = '0%';
    }
  }

  function updateProgress(percentage) {
    if (progressBar) {
      progressBar.style.width = percentage + '%';
    }
  }

  function hideProgress() {
    if (progressContainer) {
      setTimeout(() => {
        progressContainer.classList.remove('active');
      }, 500);
    }
  }

  // No tracking needed: we won't show final percentage in the live preview area.

  const commonMisspellings = [
    "definately",
    "seperate",
    "occured",
    "recieve",
    "untill",
    "adress",
    "calender",
    "goverment",
    "enviroment",
    "publically",
    "occassion",
    "accomodate",
    "independant",
    "refered",
    "comming",
    "limted",
  ];

  const socialMediaDomains = new Set([
    "youtube.com",
    "youtu.be",
    "facebook.com",
    "fb.com",
    "instagram.com",
    "twitter.com",
    "x.com",
    "linkedin.com",
    "tiktok.com",
    "reddit.com"
  ]);

  const newsDomains = new Set([
    "nytimes.com",
    "cnn.com",
    "bbc.co.uk",
    "theguardian.com",
    "reuters.com",
    "apnews.com",
    "bloomberg.com",
    "wsj.com"
  ]);

  const researchDomains = new Set([
    "arxiv.org",
    "nature.com",
    "sciencedirect.com",
    "springer.com",
    "acm.org",
    "ieee.org",
    "nih.gov",
    "ncbi.nlm.nih.gov",
    "who.int"
  ]);

  const companyDomains = new Set([
    "microsoft.com",
    "google.com",
    "apple.com",
    "amazon.com",
    "meta.com",
    "openai.com",
    "adobe.com"
  ]);

  // Lightweight integration with local no-API scanner (if running on port 5050)
  async function tryLocalScan(url) {
    try {
      // Get configuration settings
      const config = window.configManager ? window.configManager.getConfig() : {};
      const apiEndpoint = config.api?.endpoint || 'http://localhost:5050/api/scan';
      const timeout = config.api?.timeout || 30000;
      const scanningOptions = config.scanning || {};
      const heuristicsOptions = config.heuristics || {};
      const gsbOptions = config.api?.googleSafeBrowsing || {};
      
      // Build options object
      const options = {
        enableDNS: scanningOptions.enableDNSLookup !== false,
        enableSSL: scanningOptions.enableSSLCheck !== false,
        enableContent: scanningOptions.enableContentAnalysis !== false,
        followRedirects: scanningOptions.followRedirects !== false,
        maxRedirects: scanningOptions.maxRedirects || 5,
        enableGSB: gsbOptions.enabled !== false,
        enableHeuristics: heuristicsOptions.enabled !== false,
        heuristicWeights: heuristicsOptions.weights || {},
        safetyWeights: config.safetyScore?.weights || {}
      };
      
      // Log configuration being sent
      console.log('🔍 Scanning with configuration:', {
        enableGSB: options.enableGSB,
        enableHeuristics: options.enableHeuristics,
        enableDNS: options.enableDNS,
        enableSSL: options.enableSSL,
        weightsCount: Object.keys(options.heuristicWeights).length
      });
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const resp = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, options }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!resp.ok) return null;
      return await resp.json();
    } catch (e) {
      if (e.name === 'AbortError') {
        console.warn('Scan timeout for URL:', url);
      }
      return null; // scanner not running or blocked; fall back to heuristics only
    }
  }

  // ==================== ADVANCED PHISHING DETECTION PATTERNS ====================
  
  // Known phishing keywords and patterns
  const phishingKeywords = new Set([
    "verify", "confirm", "suspend", "urgent", "immediate", "expired", "locked",
    "security", "alert", "warning", "action", "required", "update", "billing",
    "payment", "account", "login", "signin", "secure", "validation", "authenticate",
    "unauthorized", "unusual", "activity", "click", "here", "now", "limited", "time"
  ]);
  
  // Common phishing URL patterns
  const phishingPatterns = [
    /\b(secure|safety|security|verify|confirm|update|login|signin)[-_]?[a-z0-9]*\.(tk|ml|cf|ga|gq|xyz|top|click)/i,
    /\b[a-z0-9]+-?(login|signin|verify|secure|update|account)\./i,
    /\b(paypal|amazon|apple|google|microsoft|facebook|instagram|twitter|linkedin|netflix|ebay)[-_][a-z0-9]+\./i,
    /\b[a-z0-9]+(paypal|amazon|apple|google|microsoft|facebook|instagram|twitter|linkedin|netflix|ebay)\./i,
    /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/,  // IP addresses
    /[a-z0-9]{20,}\.(com|net|org)/i,  // Very long random domains
    /[a-z]+-?[0-9]+-?[a-z]+\.(com|net|org)/i,  // Mixed letters and numbers
  ];
  
  // Brand impersonation patterns (more comprehensive)
  const brandImpersonationPatterns = [
    { brand: "paypal", patterns: [/p[a4y]yp[a4l]l?/i, /payp[a4]l/i, /p[a4]yp[a4]l/i] },
    { brand: "amazon", patterns: [/[a4]m[a4]z[o0]n/i, /amaz[o0]n/i, /amazon[a-z0-9]/i] },
    { brand: "apple", patterns: [/[a4]ppl[e3]/i, /appl[e3]/i, /apple[a-z0-9]/i] },
    { brand: "google", patterns: [/g[o0]{1,2}gl[e3]/i, /googl[e3]/i, /google[a-z0-9]/i] },
    { brand: "microsoft", patterns: [/micr[o0]s[o0]ft/i, /micro[s5]oft/i, /microsoft[a-z0-9]/i] },
    { brand: "facebook", patterns: [/f[a4]ceb[o0]{1,2}k/i, /facebook[a-z0-9]/i] },
    { brand: "netflix", patterns: [/n[e3]tfl[i1]x/i, /netflix[a-z0-9]/i] },
    { brand: "ebay", patterns: [/[e3]b[a4]y/i, /ebay[a-z0-9]/i] },
    { brand: "instagram", patterns: [/[i1]nst[a4]gr[a4]m/i, /instagram[a-z0-9]/i] },
    { brand: "twitter", patterns: [/tw[i1]tt[e3]r/i, /twitter[a-z0-9]/i] },
    { brand: "linkedin", patterns: [/l[i1]nk[e3]d[i1]n/i, /linkedin[a-z0-9]/i] }
  ];
  
  // URL obfuscation patterns
  const obfuscationPatterns = [
    /%[0-9a-f]{2}/gi,  // URL encoding
    /\\u[0-9a-f]{4}/gi,  // Unicode escapes
    /\\x[0-9a-f]{2}/gi,  // Hex escapes
    /[^\x20-\x7E]/g,  // Non-printable characters
    /[а-я]/gi,  // Cyrillic characters (common in IDN attacks)
    /[α-ω]/gi,  // Greek characters
    /[\u4e00-\u9fff]/g,  // Chinese characters
    /[\u3040-\u309f\u30a0-\u30ff]/g,  // Japanese characters
  ];
  
  // Suspicious file extensions in URLs
  const suspiciousExtensions = new Set([
    "exe", "bat", "cmd", "com", "pif", "scr", "vbs", "js", "jar", "zip", "rar", "7z", "dmg", "pkg", "deb", "rpm"
  ]);
  
  // Heuristic lists for unsafe link patterns
  const suspiciousTlds = new Set(["ru", "cn", "biz", "tk", "xyz", "rest", "work", "zip", "top", "guru", "click", "to", "ml", "cf", "ga", "gq"]);
  const shortenerHosts = new Set([
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "goo.gl",
    "ow.ly",
    "is.gd",
    "buff.ly",
    "cutt.ly",
    "short.ly",
    "short.link",
    "rb.gy",
    "s.id",
    ".co",
    ".c"
  ]);
  const wrongProtocolPatterns = ["hxxp://", "hxxps://", "htp://", "htt://", "hxtp://", "hxxtp://"];
  const fakeWwwRegex = /^(ww(?!w\.)|www\d\.|vvw\.|wvw\.)/i; // ww., www1., vvw., wvw.
  // Typosquat patterns: require a digit substitution to avoid flagging the exact brand word
  const brandLeetRegexes = [
    { brand: "google", re: /g[o0]{2}g[l1]e/i, canonical: "google.com", requireDigit: true },
    { brand: "facebook", re: /f[a4]ce(?:b|8)[o0]{2}k|faceb[o0]{2}k/i, canonical: "facebook.com", requireDigit: true },
    { brand: "yahoo", re: /yah[o0]{2}/i, canonical: "yahoo.com", requireDigit: true },
    { brand: "microsoft", re: /micr[o0]s[o0]ft|micr0soft/i, canonical: "microsoft.com", requireDigit: true },
    { brand: "apple", re: /app[l1]e/i, canonical: "apple.com", requireDigit: true },
    { brand: "amazon", re: /am[a4]z[o0]n/i, canonical: "amazon.com", requireDigit: true }
  ];
  const brandAttachWords = ["login", "secure", "update", "verify", "free", "gift", "support"];

  // ==================== PHISHING DETECTION FUNCTIONS ====================
  
  function detectPhishingPatterns(url, hostname, path) {
    const phishingFlags = [];
    const phishingNotes = [];
    let phishingScore = 0;
    
    // Check for IP address instead of domain name
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      phishingFlags.push("ip-address");
      phishingNotes.push("Uses IP address instead of domain name - highly suspicious");
      phishingScore += 30;
    }
    
    // Check for URL obfuscation
    const fullUrl = url.toLowerCase();
    let obfuscationCount = 0;
    obfuscationPatterns.forEach(pattern => {
      const matches = fullUrl.match(pattern);
      if (matches) {
        obfuscationCount += matches.length;
      }
    });
    
    if (obfuscationCount > 3) {
      phishingFlags.push("url-obfuscation");
      phishingNotes.push(`High level of URL obfuscation detected (${obfuscationCount} instances)`);
      phishingScore += 25;
    } else if (obfuscationCount > 0) {
      phishingFlags.push("minor-obfuscation");
      phishingNotes.push(`URL obfuscation detected (${obfuscationCount} instances)`);
      phishingScore += 10;
    }
    
    // Check for brand impersonation
    brandImpersonationPatterns.forEach(brand => {
      brand.patterns.forEach(pattern => {
        if (pattern.test(hostname) && !hostname.includes(brand.brand)) {
          phishingFlags.push("brand-impersonation");
          phishingNotes.push(`Possible ${brand.brand} impersonation detected`);
          phishingScore += 40;
        }
      });
    });
    
    // Check for phishing keywords in URL
    let keywordCount = 0;
    phishingKeywords.forEach(keyword => {
      if (fullUrl.includes(keyword)) {
        keywordCount++;
      }
    });
    
    if (keywordCount >= 3) {
      phishingFlags.push("high-phishing-keywords");
      phishingNotes.push(`High concentration of phishing keywords (${keywordCount} found)`);
      phishingScore += 35;
    } else if (keywordCount >= 1) {
      phishingFlags.push("phishing-keywords");
      phishingNotes.push(`Phishing keywords detected (${keywordCount} found)`);
      phishingScore += 15;
    }
    
    // Check for suspicious patterns
    phishingPatterns.forEach(pattern => {
      if (pattern.test(fullUrl)) {
        phishingFlags.push("suspicious-pattern");
        phishingNotes.push("URL matches known phishing pattern");
        phishingScore += 30;
      }
    });
    
    // Check for suspicious file extensions
    const pathLower = path.toLowerCase();
    suspiciousExtensions.forEach(ext => {
      if (pathLower.includes('.' + ext)) {
        phishingFlags.push("suspicious-file");
        phishingNotes.push(`Suspicious file extension detected: .${ext}`);
        phishingScore += 20;
      }
    });
    
    // Check for excessive subdomain levels (subdomain stuffing)
    const subdomains = hostname.split('.');
    if (subdomains.length > 4) {
      phishingFlags.push("subdomain-stuffing");
      phishingNotes.push(`Excessive subdomain levels (${subdomains.length}) - possible subdomain stuffing`);
      phishingScore += 15;
    }
    
    // Check for lookalike domains (homograph attacks)
    const suspiciousChars = /[\u0430-\u044f\u03b1-\u03c9]/gi;  // Cyrillic and Greek
    if (suspiciousChars.test(hostname)) {
      phishingFlags.push("homograph-attack");
      phishingNotes.push("Domain contains lookalike characters (possible homograph attack)");
      phishingScore += 45;
    }
    
    // Check for very long domains (often random)
    if (hostname.length > 50) {
      phishingFlags.push("long-domain");
      phishingNotes.push(`Unusually long domain name (${hostname.length} characters)`);
      phishingScore += 10;
    }
    
    // Check for mixed case in unusual patterns
    if (/[A-Z].*[a-z].*[A-Z]/.test(hostname)) {
      phishingFlags.push("mixed-case");
      phishingNotes.push("Unusual mixed case pattern in domain");
      phishingScore += 5;
    }
    
    return { flags: phishingFlags, notes: phishingNotes, score: phishingScore };
  }

  function analyzeUrlHeuristics(urlString, rawInput) {
    const flags = [];
    const notes = [];
    let host = "";
    let tld = "";
    let pathname = "";
    try {
      const u = new URL(urlString);
      host = normalizeHost(u.hostname);
      pathname = u.pathname || "";
      tld = (host.split(".").pop() || "").toLowerCase();
      // Shorteners (exact or subdomain)
      if ([...shortenerHosts].some((d) => domainMatches(host, d))) {
        flags.push("shortener");
        notes.push("Appears to use a link shortener.");
      } else {
        // Lookalike shorteners: same TLD and ending with known shortener second-level label (e.g. keanbit.ly vs bit.ly)
        // Extract second-level (SLD) + TLD for host and known shorteners to compare suffixes.
        const hostParts = host.split('.');
        if (hostParts.length >= 2) {
          const sld = hostParts.slice(-2)[0]; // e.g. 'keanbit' in keanbit.ly
          const tld = hostParts.slice(-1)[0];
          for (const sh of shortenerHosts) {
            const shParts = sh.split('.');
            if (shParts.length >= 2) {
              const shSld = shParts.slice(-2)[0]; // 'bit' in bit.ly
              const shTld = shParts.slice(-1)[0];
              if (tld === shTld && sld.endsWith(shSld) && sld !== shSld) {
                flags.push("shortener-lookalike");
                notes.push(`Hostname ends with known shortener label '${shSld}' (possible impersonation).`);
                break;
              }
            }
          }
        }
      }
      // Fake www
      if (fakeWwwRegex.test(u.host)) {
        flags.push("fake-www");
        notes.push("Hostname starts with suspicious www variant.");
      }
      // Suspicious TLD
      if (suspiciousTlds.has(tld)) {
        flags.push("suspicious-tld");
        notes.push(`Suspicious top-level domain .${tld}.`);
      }
      // Brand + attach words
      const hostPath = (u.hostname + u.pathname).toLowerCase();
      for (const kw of brandAttachWords) {
        for (const b of ["google", "facebook", "yahoo", "microsoft", "apple", "amazon", "meta", "instagram", "twitter", "linkedin"]) {
          if (hostPath.includes(b + kw) || hostPath.includes(kw + b)) {
            flags.push("brand-keyword");
            notes.push(`Brand name appears attached to word '${kw}'.`);
            break;
          }
        }
      }
      // Typosquatting with leetspeak
      for (const r of brandLeetRegexes) {
        // Skip official domains (e.g., *.facebook.com is not typosquat)
        if (r.canonical && domainMatches(host, r.canonical)) continue;
        if (r.re.test(host)) {
          if (r.requireDigit && !/[0-9]/.test(host)) {
            // Match found but no digit substitution present; treat as benign brand mention
            continue;
          }
          flags.push("typosquat");
          notes.push(`Hostname resembles a leetspeak variant of ${r.brand}.`);
          break;
        }
      }
      // Non-http(s) protocol handled earlier; but detect obfuscated in raw
    } catch (e) {
      // ignore parse error here
    }
    // Wrong protocol spellings in raw input
    const raw = (rawInput || "").trim();
    if (raw) {
      const rawLower = raw.toLowerCase();
      if (wrongProtocolPatterns.some((p) => rawLower.startsWith(p))) {
        flags.push("wrong-protocol");
        notes.push("Protocol appears obfuscated or misspelled.");
      }
    }
    // ==================== INTEGRATE PHISHING DETECTION ====================
    const phishingAnalysis = detectPhishingPatterns(urlString, host, pathname);
    flags.push(...phishingAnalysis.flags);
    notes.push(...phishingAnalysis.notes);
    
    // Add phishing score to the analysis
    const phishingScore = phishingAnalysis.score;
    if (phishingScore >= 50) {
      flags.push("high-phishing-risk");
      notes.push(`High phishing risk detected (score: ${phishingScore})`);
    } else if (phishingScore >= 25) {
      flags.push("moderate-phishing-risk");
      notes.push(`Moderate phishing risk detected (score: ${phishingScore})`);
    } else if (phishingScore > 0) {
      flags.push("low-phishing-risk");
      notes.push(`Low phishing risk detected (score: ${phishingScore})`);
    }
    
    return { flags, notes, tld, phishingScore };
  }

  function domainMatches(hostname, root) {
    const h = normalizeHost(hostname);
    const r = root.toLowerCase();
    return h === r || h.endsWith("." + r);
  }

  function categorizeHost(hostname) {
    const host = normalizeHost(hostname);
    const tld = host.split(".").pop();
    const lowerHost = host;
    // TLD-based
    if (/(^|\.)gov(\.|$)/.test(lowerHost) || tld === "gov") {
      return { category: "Government", trusted: true };
    }
    if (tld === "edu" || /(^|\.)ac\./.test(lowerHost)) {
      return { category: "Education", trusted: true };
    }
    if (domainMatches(lowerHost, "who.int")) {
      return { category: "International Organization", trusted: true };
    }
    // List-based
    for (const d of socialMediaDomains) if (domainMatches(lowerHost, d)) return { category: "Social Media", trusted: true };
    for (const d of newsDomains) if (domainMatches(lowerHost, d)) return { category: "News / Media", trusted: true };
    for (const d of researchDomains) if (domainMatches(lowerHost, d)) return { category: "Research / Study", trusted: true };
    for (const d of companyDomains) if (domainMatches(lowerHost, d)) return { category: "Company", trusted: true };
    if (lowerHost.endsWith(".org")) return { category: "Organization / Nonprofit", trusted: false };
    return { category: "General Website", trusted: false };
  }

  function normalizeHost(hostname) {
    return hostname.replace(/^www\./i, "").toLowerCase();
  }

  function parseLinksFromHtml(html, baseUrl) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const anchors = Array.from(doc.querySelectorAll("a[href]"));
      const baseHost = (() => {
        try {
          return normalizeHost(new URL(baseUrl).hostname);
        } catch (e) {
          return "";
        }
      })();

      let externalCount = 0;
      anchors.forEach((a) => {
        let href = a.getAttribute("href") || "";
        if (!href) return;
        try {
          const urlObj = new URL(href, baseUrl);
          const isExternal = normalizeHost(urlObj.hostname) !== baseHost;
          if (isExternal) externalCount += 1;
        } catch (e) {
          // ignore bad hrefs in HTML
        }
      });
      const text = doc.body ? doc.body.textContent || "" : "";
      return { externalCount, textContent: text };
    } catch (e) {
      return { externalCount: 0, textContent: "" };
    }
  }

  async function fetchPageHtmlWithProxy(url, timeoutMs = 1500) {
    // If running from file:// or offline, avoid network fetches — return null to indicate unavailable
    try {
      if (typeof window !== 'undefined' && (window.location.protocol === 'file:' || (typeof navigator !== 'undefined' && navigator.onLine === false))) {
        return null;
      }
    } catch (e) {
      // fall through to attempt fetch
    }

    const proxies = [
      (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
      (u) => `https://r.jina.ai/http://${u.replace(/^https?:\/\//i, "")}`
    ];

    // Helper to fetch with a timeout via AbortController
    async function fetchWithTimeout(endpoint, ms) {
      const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const id = ctl ? setTimeout(() => ctl.abort(), ms) : null;
      try {
        const res = await fetch(endpoint, { method: "GET", signal: ctl ? ctl.signal : undefined });
        if (res && res.ok) return await res.text();
      } catch (e) {
        // ignore and move to next proxy
      } finally {
        if (id) clearTimeout(id);
      }
      return null;
    }

    for (const make of proxies) {
      const endpoint = make(url);
      const txt = await fetchWithTimeout(endpoint, timeoutMs);
      if (txt) return txt;
    }
    // Return null rather than throwing so callers can handle "no deep scan available" gracefully
    return null;
  }

  function analyzeTextForSuspicion(text) {
    const lower = text.toLowerCase();
    const foundMisspellings = [];
    commonMisspellings.forEach((w) => {
      if (lower.includes(w)) foundMisspellings.push(w);
    });

    return { foundMisspellings };
  }

  function computeRiskScore({ isHttps, externalLinks, foundMisspellings, categoryInfo, heuristicFlags, tld, phishingScore }) {
    let risk = 0;
    const reasons = [];
    // Policy: HTTP is not safe, HTTPS is required for safety
    if (!isHttps) {
      risk = 100; // max risk for HTTP
      reasons.push("HTTP detected: only HTTPS is considered safe.");
    } else {
      reasons.push("HTTPS detected: baseline safe.");
    }

    // If deep content checks couldn't run (no externalLinks number), DON'T penalize
    // Many legitimate sites (Instagram, Facebook, etc.) block scrapers for security
    // This is not a sign of malicious behavior - it's actually good security practice
    if (typeof externalLinks !== "number") {
      // Just note that content analysis wasn't available, but don't add risk
      reasons.push("Deep content analysis unavailable (site may block automated access).");
      // NO PENALTY - Removed the "risk += 20" that was penalizing legitimate sites
    }

    if (Array.isArray(heuristicFlags) && heuristicFlags.length) {
      let extra = 0;
      heuristicFlags.forEach((f) => {
        if (f === "wrong-protocol") extra += 25;
        else if (f === "fake-www") extra += 15;
  else if (f === "shortener") extra += 35; // Increased to trigger "Not Safe" level (below 70%)
  else if (f === "shortener-lookalike") extra += 30; // stronger weight for impersonation of a shortener
        else if (f === "suspicious-tld") extra += 14;
        else if (f === "typosquat") extra += 20;
        else if (f === "brand-keyword") extra += 10;
        // ==================== PHISHING-SPECIFIC FLAGS ====================
        else if (f === "ip-address") extra += 35;
        else if (f === "brand-impersonation") extra += 40;
        else if (f === "homograph-attack") extra += 45;
        else if (f === "url-obfuscation") extra += 25;
        else if (f === "suspicious-pattern") extra += 30;
        else if (f === "phishing-keywords") extra += 15;
        else if (f === "high-phishing-keywords") extra += 35;
        else if (f === "suspicious-file") extra += 20;
        else if (f === "subdomain-stuffing") extra += 15;
        else if (f === "high-phishing-risk") extra += 60;
        else if (f === "moderate-phishing-risk") extra += 30;
        else if (f === "low-phishing-risk") extra += 10;
        else if (f === "domain-not-found") extra += 80; // Very high penalty for non-existent domains
        else extra += 6;
      });
      risk += extra;
      reasons.push(`Heuristic flags: ${heuristicFlags.join(' • ')}.`);
    }

    // ==================== PHISHING SCORE ADJUSTMENT ====================
    if (phishingScore && phishingScore > 0) {
      risk += phishingScore;
      if (phishingScore >= 50) {
        reasons.push(`Critical phishing risk detected (score: ${phishingScore})`);
      } else if (phishingScore >= 25) {
        reasons.push(`Moderate phishing risk detected (score: ${phishingScore})`);
      } else {
        reasons.push(`Low phishing risk detected (score: ${phishingScore})`);
      }
    }

    // Apply baseline TLD risk AFTER additive flags so we can clamp
    if (tld) {
      if (tld === 'to') {
        if (risk < 55) {
          risk = 55;
          reasons.push('Baseline risk elevated due to policy for TLD .to.');
        }
      }
    }

    if (Array.isArray(foundMisspellings)) {
      if (foundMisspellings.length >= 3) {
        risk += 20;
        reasons.push("Multiple common misspellings detected.");
      } else if (foundMisspellings.length === 2) {
        risk += 12;
        reasons.push("Some misspellings detected.");
      } else if (foundMisspellings.length === 1) {
        risk += 6;
        reasons.push("A misspelling was detected.");
      } else {
        reasons.push("No common misspellings detected.");
      }
    }

    if (typeof externalLinks === "number") {
      if (externalLinks > 50) {
        risk += 20;
        reasons.push(`High number of external links (${externalLinks}).`);
      } else if (externalLinks > 20) {
        risk += 12;
        reasons.push(`Many external links (${externalLinks}).`);
      } else if (externalLinks > 10) {
        risk += 6;
        reasons.push(`Some external links (${externalLinks}).`);
      } else {
        reasons.push(`Few external links (${externalLinks}).`);
      }
    }

    // Trusted categories reduce sensitivity to content-only flags
    if (categoryInfo && categoryInfo.trusted) {
      risk = Math.max(0, Math.round(risk * 0.6));
      reasons.push(`Trusted category: ${categoryInfo.category}.`);
    } else if (categoryInfo) {
      reasons.push(`Category: ${categoryInfo.category}.`);
    }

  // Map: any HTTP stays unsafe, HTTPS can still move to caution/unsafe if other severe issues found
  let status = isHttps ? "safe" : "unsafe";
  if (risk >= 50) status = "unsafe";
  else if (risk >= 20) status = "caution";

    return { risk, status, reasons };
  }

  function calculateSafetyRating(risk, phishingScore = 0) {
    // Convert risk score (0-100+) to safety rating (10%-100%)
    // Higher risk = lower safety rating
    // Include phishing score for better accuracy with suspicious patterns like shorteners
    const totalRisk = risk + phishingScore;
    const safetyRating = Math.max(10, Math.min(100, 100 - totalRisk));
    return Math.round(safetyRating);
  }

  function getSafetyLevel(safetyRating) {
    // Make HTTP always read as Not Safe or Very Unsafe due to max risk mapping above
    if (safetyRating >= 90) return "Very Safe";
    if (safetyRating >= 70) return "Safe but...";
    if (safetyRating >= 30) return "Not Safe";
    return "Very Unsafe";
  }

  // Return a descriptive explanation for each 10% decile bucket and include a short summary of computed reasons.
  function getDecileExplanation(safetyRating, reasons) {
    const bucket = Math.max(0, Math.min(100, safetyRating));
    const dec = Math.floor(bucket / 10) * 10;
    const grouped = groupReasons(reasons || []);
    const summaryParts = [];
    if (grouped.protocol) summaryParts.push(grouped.protocol);
    if (grouped.fetch) summaryParts.push(grouped.fetch);
    if (grouped.heuristics) summaryParts.push(grouped.heuristics);
    if (grouped.content) summaryParts.push(grouped.content);
    if (grouped.category) summaryParts.push(grouped.category);
    const summaryLine = summaryParts.length ? `Key signals: ${summaryParts.join(' | ')}` : '';

    const messages = {
      90: `${bucket}% — Very Safe. Strong indicators of legitimacy; no major risk factors detected. ${summaryLine}`,
      80: `${bucket}% — Safe. Generally fine; only minor indicators present. ${summaryLine}`,
      70: `${bucket}% — Caution (upper). Mostly safe but some heuristics suggest a quick double-check. ${summaryLine}`,
      60: `${bucket}% — Caution. Multiple moderate indicators; verify before trusting sensitive info. ${summaryLine}`,
      50: `${bucket}% — Not Safe (borderline). Several warning signs present. ${summaryLine}`,
      40: `${bucket}% — Not Safe. Significant red flags (typos, suspicious TLD, or many external links). ${summaryLine}`,
      30: `${bucket}% — Unsafe. Strong signals of impersonation or manipulation. ${summaryLine}`,
      20: `${bucket}% — Very Unsafe. High likelihood of malicious intent. ${summaryLine}`,
      10: `${bucket}% — Extremely Unsafe. Multiple severe indicators. ${summaryLine}`,
      0:  `${bucket}% — Critical: Unsafe. Do not interact with this link. ${summaryLine}`
    };
    const key = dec >= 90 ? 90 : dec;
    return messages[key] || messages[0];
  }

  function groupReasons(reasonList) {
    // Helper function to capitalize first letter of each word and format flag names
    function formatFlagName(flagName) {
      return flagName
        .replace(/-/g, ' ')           // Replace hyphens with spaces
        .replace(/([a-z])([A-Z])/g, '$1 $2')  // Add space before capital letters
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }
    
    const lowerList = reasonList.map(r => r.toLowerCase());
    const pick = (predicate) => reasonList.find(r => predicate(r.toLowerCase()));
    const contains = (substr) => lowerList.some(r => r.includes(substr));
    const out = {};
    if (contains('uses https')) out.protocol = 'HTTPS';
    else if (contains('uses http instead')) out.protocol = 'HTTP only';
    
    if (contains('deep content checks unavailable')) out.fetch = 'No deep scan';
    else if (contains('could not fetch page')) out.fetch = 'Fetch failed';
    else if (contains('domain does not exist')) out.fetch = 'Domain does not exist';
    else if (contains('domain unreachable')) out.fetch = 'Domain unreachable';
    const flagMatch = pick(r => r.includes('heuristic flags'));
    if (flagMatch) {
      const colon = flagMatch.indexOf(':');
      if (colon !== -1) {
        // Split by bullet points (•) or commas, then clean up
        const list = flagMatch.slice(colon + 1).replace(/\.$/, '').split(/[•,]\s*/).map(s => s.trim()).filter(s => s);
        if (list.length) {
          const formattedFlags = list.slice(0,5).map(flag => formatFlagName(flag));
          out.heuristics = `Flags: ${formattedFlags.join(' • ')}`;
        }
      }
    }
    if (contains('multiple common misspellings')) out.content = 'Many misspellings';
    else if (contains('some misspellings')) out.content = 'Some misspellings';
    else if (contains('a misspelling')) out.content = '1 misspelling';
    else if (contains('no common misspellings')) out.content = (out.content || 'No misspellings');
    const extReason = pick(r => r.includes('external links'));
    if (extReason) {
      if (/few external links/i.test(extReason)) out.content = (out.content ? out.content + ', few external links' : 'Few external links');
      else if (/some external links/i.test(extReason)) out.content = (out.content ? out.content + ', some external links' : 'Some external links');
      else if (/many external links/i.test(extReason)) out.content = (out.content ? out.content + ', many external links' : 'Many external links');
      else if (/high number of external links/i.test(extReason)) out.content = (out.content ? out.content + ', high external link count' : 'High external link count');
    }
    if (contains('trusted category')) out.category = 'Trusted category';
    else {
      const catMatch = pick(r => r.startsWith('Category:'));
      if (catMatch) out.category = catMatch.replace('Category:','Category').replace(/\.$/, '').trim();
    }
    return out;
  }

  function getSafetyCircleColor(safetyRating) {
    if (safetyRating >= 90) return "#2e7d32"; // Green
    if (safetyRating >= 70) return "#f9a825"; // Yellow
    if (safetyRating >= 30) return "#f57c00"; // Orange
    return "#c62828"; // Red
  }

  function validateAndNormalizeUrl(raw) {
    let candidate = (raw || "").trim();
    if (!candidate) return null;
    if (!/^https?:\/\//i.test(candidate)) {
      candidate = "http://" + candidate;
    }
    try {
      const u = new URL(candidate);
      return u.toString();
    } catch (e) {
      return null;
    }
  }

  function renderBadge(text, className) {
    const span = document.createElement("span");
    span.className = `badge ${className || ""}`.trim();
    span.textContent = text;
    return span;
  }

  function renderResult(item) {
    const wrapper = document.createElement("div");
    let statusClass = "scanner-result--safe";
    if (item.status === "unsafe") statusClass = "scanner-result--unsafe";
    else if (item.status === "caution") statusClass = "scanner-result--caution";
    wrapper.className = `scanner-result ${statusClass}`;

    const head = document.createElement("div");
    head.className = "scanner-result__head";

    const urlEl = document.createElement("div");
    urlEl.className = "scanner-result__url";
    urlEl.textContent = item.url;

    const iconEl = document.createElement("div");
    iconEl.setAttribute("aria-label", item.status);
    iconEl.textContent = item.status === "unsafe" ? "❌" : item.status === "caution" ? "⚠️" : "✅";

    head.appendChild(urlEl);
    head.appendChild(iconEl);

    // Safety Rating Display with Circle
    const safetyRatingEl = document.createElement("div");
    safetyRatingEl.className = "scanner-result__safety-rating";
    
    const safetyCircle = document.createElement("div");
    safetyCircle.className = "safety-circle";
    safetyCircle.style.setProperty('--circle-color', getSafetyCircleColor(item.safetyRating));
    safetyCircle.textContent = `${item.safetyRating}%`;
    
    const safetyLevelEl = document.createElement("div");
    safetyLevelEl.className = "safety-level";
    safetyLevelEl.textContent = item.safetyLevel;
    
    const safetyExplanationEl = document.createElement("div");
    safetyExplanationEl.className = "safety-explanation";
    safetyExplanationEl.textContent = item.safetyExplanation;
    
    safetyRatingEl.appendChild(safetyCircle);
    safetyRatingEl.appendChild(safetyLevelEl);
    safetyRatingEl.appendChild(safetyExplanationEl);

    // Build a structured body with one row per detail for clearer spacing
    const body = document.createElement('div');
    body.className = 'scanner-result__body';
    
    // Add title at the very top
    const bodyTitle = document.createElement('h4');
    bodyTitle.className = 'scanner-result__body-title scanner-result__body-title--top';
    bodyTitle.innerHTML = '🔍 SCAN RESULT';
    body.appendChild(bodyTitle);
    
    // Add safety rating below the title
    body.appendChild(safetyRatingEl);
    
    // Container for the details
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'scanner-result__details-container';

    function addDetail(label, value, extraClass) {
      const row = document.createElement('div');
      row.className = 'scanner-result__row ' + (extraClass || '');

      const lbl = document.createElement('span');
      lbl.className = 'scanner-result__label';
      lbl.textContent = label + ':';

      const val = document.createElement('span');
      val.className = 'scanner-result__value';
      val.textContent = value;

      row.appendChild(lbl);
      row.appendChild(val);
      detailsContainer.appendChild(row);
    }

    addDetail('Protocol', item.isHttps ? 'HTTPS' : 'HTTP');
    
    // SSL Certificate Information (if available)
    if (item.localScan && item.localScan.tls && item.isHttps) {
      const tls = item.localScan.tls;
      if (tls.ok !== undefined && tls.ok !== null) {
        const sslStatus = tls.ok ? '✓ Valid' : '✗ Invalid';
        const sslClass = tls.ok ? 'row--ssl-valid' : 'row--ssl-invalid';
        addDetail('SSL Certificate', sslStatus, sslClass);
        
        // Show days to expiration if available
        if (tls.daysToExpire !== null && tls.daysToExpire !== undefined) {
          let expiryText = `${tls.daysToExpire} days`;
          let expiryClass = 'row--ssl-expiry';
          
          if (tls.daysToExpire < 0) {
            expiryText += ' (EXPIRED!)';
            expiryClass = 'row--ssl-expired';
          } else if (tls.daysToExpire <= 7) {
            expiryText += ' (⚠️ Expires soon!)';
            expiryClass = 'row--ssl-warning';
          } else if (tls.daysToExpire <= 30) {
            expiryText += ' (Renew soon)';
          }
          
          addDetail('Certificate Expiry', expiryText, expiryClass);
        }
        
        // Show certificate issuer if available
        if (tls.issuer) {
          addDetail('Certificate Authority', tls.issuer);
        }
        
        // Show TLS protocol version if available
        if (tls.protocol) {
          addDetail('TLS Protocol', tls.protocol);
        }
      }
    }
    
    addDetail('Category', item.category || 'Unknown');
    
    // External links - make clickable if data exists
    if (item.localScan && item.localScan.externalLinks) {
      const externalLinksRow = document.createElement('div');
      externalLinksRow.className = 'scanner-result__row';
      
      const label = document.createElement('div');
      label.className = 'scanner-result__label';
      label.textContent = 'External links';
      
      const value = document.createElement('div');
      value.className = 'scanner-result__value';
      value.style.cursor = 'pointer';
      value.style.color = '#2196f3';
      value.style.textDecoration = 'underline';
      value.textContent = `${item.localScan.externalLinks.count} 👁️`;
      value.title = 'Click to view external links';
      
      value.addEventListener('click', () => {
        showExternalLinksModal(item.localScan.externalLinks);
      });
      
      externalLinksRow.appendChild(label);
      externalLinksRow.appendChild(value);
      detailsContainer.appendChild(externalLinksRow);
    } else {
      addDetail('External links', typeof item.externalLinks === 'number' ? item.externalLinks : 'Unknown');
    }
    
    // Risk score - make clickable if scan data exists
    if (item.localScan && item.safetyRating !== undefined) {
      const riskScoreRow = document.createElement('div');
      riskScoreRow.className = 'scanner-result__row row--risk';
      
      const label = document.createElement('div');
      label.className = 'scanner-result__label';
      label.textContent = 'Risk score';
      
      const value = document.createElement('div');
      value.className = 'scanner-result__value';
      value.style.cursor = 'pointer';
      value.style.textDecoration = 'underline';
      value.textContent = `${item.risk} (${item.status.toUpperCase()}) 👁️`;
      value.title = 'Click to view detailed breakdown';
      
      value.addEventListener('click', () => {
        showRiskScoreModal(item);
      });
      
      riskScoreRow.appendChild(label);
      riskScoreRow.appendChild(value);
      detailsContainer.appendChild(riskScoreRow);
    } else {
      addDetail('Risk score', `${item.risk} (${item.status.toUpperCase()})`, 'row--risk');
    }
    
    addDetail('Scanned at', item.scannedAt || 'Unknown');
  const grouped = groupReasons(item.reasons || []);
  const summaryParts = [];
  
  if (grouped.protocol) summaryParts.push(grouped.protocol);
  if (grouped.fetch) summaryParts.push(grouped.fetch);
  if (grouped.heuristics) summaryParts.push(grouped.heuristics);
  if (grouped.content) summaryParts.push(grouped.content);
  if (grouped.category) summaryParts.push(grouped.category);
  
  // Enhanced fallback for better debugging with proper separation
  let summary;
  if (summaryParts.length) {
    // Use proper separators for better readability
    if (summaryParts.length > 1) {
      summary = summaryParts.join(' | ');
    } else {
      summary = summaryParts[0];
    }
  } else {
    summary = item.isSafe ? 'No notable issues' : 
     (item.reasons && item.reasons.length ? 
      `${item.reasons.length} detection${item.reasons.length > 1 ? 's' : ''} found` : 
      'Potential risks detected');
  }
      
  addDetail('Notes', summary);

    // If local scanner results exist, surface key reputation details (HTTP/DNS hidden by request)
    if (item.localScan) {
      const ls = item.localScan;
      // Reputation summary (blocklist + GSB)
      const repParts = [];
      if (ls.blocklist && typeof ls.blocklist.match === 'boolean') {
        repParts.push(ls.blocklist.match ? `blocklist match${ls.blocklist.matchType ? ' (' + ls.blocklist.matchType + ')' : ''}` : 'no blocklist match');
      }
      if (ls.gsb && ls.gsb.enabled) {
        const overallUnsafe = item.status === 'unsafe';
        if (ls.gsb.verdict === 'unsafe') {
          repParts.push('GSB unsafe');
        } else if (overallUnsafe) {
          // Reflect overall verdict in GSB display when scan says unsafe
          repParts.push('GSB unsafe (derived)');
        } else if (ls.gsb.verdict === 'safe') {
          repParts.push('GSB safe');
        } else {
          repParts.push('GSB error');
        }
      }
      if (repParts.length) addDetail('Reputation', repParts.join(', '), 'row--server');
      // HTTP and DNS details intentionally hidden
    }
    
    // Append details container to body
    body.appendChild(detailsContainer);

    // Score Breakdown Section
    const scoreBreakdown = document.createElement('div');
    scoreBreakdown.className = 'scanner-result__score-breakdown';
    
    // Add title
    const scoreBreakdownTitle = document.createElement('h4');
    scoreBreakdownTitle.className = 'breakdown-title';
    scoreBreakdownTitle.innerHTML = '📊 SCORE BREAKDOWN';
    scoreBreakdown.appendChild(scoreBreakdownTitle);
    
    if (item.localScan) {
      const breakdownGrid = document.createElement('div');
      breakdownGrid.className = 'breakdown-grid';
      
      // Heuristics Score
      if (item.localScan.heuristics && !item.localScan.heuristics.skipped) {
        const heuristicItem = document.createElement('div');
        heuristicItem.className = 'breakdown-item breakdown-item--clickable';
        heuristicItem.style.cursor = 'pointer';
        heuristicItem.innerHTML = `
          <div class="breakdown-label">🧠 Heuristic Analysis</div>
          <div class="breakdown-score">${item.localScan.heuristics.score || 0} points</div>
          <div class="breakdown-detail">Flags: ${(item.localScan.heuristics.flags || []).length} 👁️</div>
        `;
        
        // Make it clickable to show details
        heuristicItem.addEventListener('click', () => {
          showHeuristicDetailsModal(item.localScan.heuristics);
        });
        
        breakdownGrid.appendChild(heuristicItem);
      }
      
      // Google Safe Browsing
      if (item.localScan.gsb && item.localScan.gsb.enabled) {
        const gsbItem = document.createElement('div');
        gsbItem.className = 'breakdown-item';
        const gsbScore = item.localScan.gsb.verdict === 'safe' ? 100 : 0;
        gsbItem.innerHTML = `
          <div class="breakdown-label">🛡️ Google Safe Browsing</div>
          <div class="breakdown-score">${gsbScore} points</div>
          <div class="breakdown-detail">Status: ${item.localScan.gsb.verdict}</div>
        `;
        breakdownGrid.appendChild(gsbItem);
      }
      
      // Blocklist Check
      if (item.localScan.blocklist) {
        const blocklistItem = document.createElement('div');
        blocklistItem.className = 'breakdown-item';
        const blocklistScore = item.localScan.blocklist.match ? 0 : 100;
        blocklistItem.innerHTML = `
          <div class="breakdown-label">📋 Blocklist</div>
          <div class="breakdown-score">${blocklistScore} points</div>
          <div class="breakdown-detail">${item.localScan.blocklist.match ? 'Match found' : 'No match'}</div>
        `;
        breakdownGrid.appendChild(blocklistItem);
      }
      
      // DNS Check
      if (item.localScan.dns && !item.localScan.dns.skipped) {
        const dnsItem = document.createElement('div');
        dnsItem.className = 'breakdown-item';
        const dnsScore = item.localScan.dns.ok ? 100 : 0;
        dnsItem.innerHTML = `
          <div class="breakdown-label">🌐 DNS Lookup</div>
          <div class="breakdown-score">${dnsScore} points</div>
          <div class="breakdown-detail">${item.localScan.dns.ok ? 'Resolved' : 'Failed'}</div>
        `;
        breakdownGrid.appendChild(dnsItem);
      }
      
      // SSL/TLS Check
      if (item.localScan.tls && !item.localScan.tls.skipped) {
        const tlsItem = document.createElement('div');
        tlsItem.className = 'breakdown-item';
        // Fix: use 'ok' property instead of 'valid' (backend returns 'ok')
        const tlsScore = item.localScan.tls.ok ? 100 : 0;
        const tlsStatus = item.localScan.tls.ok ? 'Valid' : 'Invalid';
        const tlsDetail = item.localScan.tls.error ? ` (${item.localScan.tls.error})` : '';
        tlsItem.innerHTML = `
          <div class="breakdown-label">🔒 SSL/TLS</div>
          <div class="breakdown-score">${tlsScore} points</div>
          <div class="breakdown-detail">${tlsStatus}${tlsDetail}</div>
        `;
        breakdownGrid.appendChild(tlsItem);
      }
      
      scoreBreakdown.appendChild(breakdownGrid);
    }
    
    // Always show Score Breakdown even if localScan is incomplete
    // This ensures users see what checks failed for low-scoring URLs
    if (!item.localScan && item.safetyRating < 30) {
      const breakdownTitle = document.createElement('h4');
      breakdownTitle.className = 'breakdown-title';
      breakdownTitle.innerHTML = '📊 Score Breakdown';
      scoreBreakdown.appendChild(breakdownTitle);
      
      const breakdownGrid = document.createElement('div');
      breakdownGrid.className = 'breakdown-grid';
      
      // Show why the score is so low
      const errorItem = document.createElement('div');
      errorItem.className = 'breakdown-item breakdown-item--critical';
      errorItem.innerHTML = `
        <div class="breakdown-label">⚠️ Critical Issues</div>
        <div class="breakdown-score">0 points</div>
        <div class="breakdown-detail">${item.reasons && item.reasons.length > 0 ? item.reasons[0] : 'Multiple security failures detected'}</div>
      `;
      breakdownGrid.appendChild(errorItem);
      
      scoreBreakdown.appendChild(breakdownGrid);
    }
    
    // Recommendations Section
    const recommendationsSection = document.createElement('div');
    recommendationsSection.className = 'scanner-result__recommendations';
    
    // Always add title
    const recTitle = document.createElement('h4');
    recTitle.className = 'recommendations-title';
    recTitle.innerHTML = '💡 RECOMMENDATIONS';
    recommendationsSection.appendChild(recTitle);
    
    if (item.localScan && item.localScan.recommendations) {
      const rec = item.localScan.recommendations;
      
      // Messages
      if (rec.messages && rec.messages.length > 0) {
        const messagesDiv = document.createElement('div');
        messagesDiv.className = 'recommendations-messages';
        rec.messages.forEach(msg => {
          const msgEl = document.createElement('div');
          msgEl.className = 'recommendation-message';
          msgEl.textContent = msg;
          messagesDiv.appendChild(msgEl);
        });
        recommendationsSection.appendChild(messagesDiv);
      }
      
      // Actions
      if (rec.actions && rec.actions.length > 0) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'recommendations-actions';
        const actionsTitle = document.createElement('div');
        actionsTitle.className = 'actions-title';
        actionsTitle.textContent = 'Suggested Actions:';
        actionsDiv.appendChild(actionsTitle);
        
        rec.actions.forEach(action => {
          const actionEl = document.createElement('div');
          actionEl.className = 'recommendation-action';
          actionEl.textContent = `• ${action}`;
          actionsDiv.appendChild(actionEl);
        });
        recommendationsSection.appendChild(actionsDiv);
      }
      
      // Context
      if (rec.context && rec.context.length > 0) {
        const contextDiv = document.createElement('div');
        contextDiv.className = 'recommendations-context';
        const contextTitle = document.createElement('div');
        contextTitle.className = 'context-title';
        contextTitle.textContent = 'Technical Context:';
        contextDiv.appendChild(contextTitle);
        
        rec.context.forEach(ctx => {
          const ctxEl = document.createElement('div');
          ctxEl.className = 'recommendation-context-item';
          ctxEl.textContent = `ℹ️ ${ctx}`;
          contextDiv.appendChild(ctxEl);
        });
        recommendationsSection.appendChild(contextDiv);
      }
    } else {
      // Show placeholder when no recommendations
      const placeholderDiv = document.createElement('div');
      placeholderDiv.className = 'recommendations-placeholder';
      placeholderDiv.innerHTML = `
        <div class="placeholder-icon">✓</div>
        <div class="placeholder-text">This URL appears ${item.isSafe ? 'safe' : 'to have issues'}. ${item.isSafe ? 'No additional recommendations needed.' : 'Review the scan results for details.'}</div>
      `;
      recommendationsSection.appendChild(placeholderDiv);
    }

    const badges = document.createElement("div");
    badges.className = "scanner-result__badges";
    // Critical badges first
    if (item.localScan && item.localScan.blocklist && item.localScan.blocklist.match) {
      badges.appendChild(renderBadge('BLOCKLIST', 'badge--critical'));
    }
    if (item.localScan && item.localScan.gsb && item.localScan.gsb.enabled) {
      const overallUnsafe = item.status === 'unsafe';
      if (item.localScan.gsb.verdict === 'unsafe') {
        badges.appendChild(renderBadge('GSB: UNSAFE', 'badge--critical'));
      } else if (overallUnsafe) {
        // Show derived unsafe state when overall verdict is unsafe
        badges.appendChild(renderBadge('GSB: UNSAFE (derived)', 'badge--critical'));
      } else if (item.localScan.gsb.verdict === 'safe') {
        badges.appendChild(renderBadge('GSB: SAFE', 'badge--ok'));
      } else {
        badges.appendChild(renderBadge('GSB: ERROR', 'badge--warn'));
      }
    }
    (item.misspellings || []).forEach((t) => badges.appendChild(renderBadge(`missp: ${t}`, "badge--suspicious")));
    // Heuristic flags badges removed for cleaner display

  wrapper.appendChild(head);
  // safetyRatingEl is now inside body
  
    // Create three-column content grid
    const contentGrid = document.createElement('div');
    contentGrid.className = 'scanner-result__content-grid';
    
    contentGrid.appendChild(scoreBreakdown);
    contentGrid.appendChild(body);
    contentGrid.appendChild(recommendationsSection);
    
    if (badges.childNodes.length) wrapper.appendChild(badges);
    wrapper.appendChild(contentGrid);
    
    // Apply display config - check both ways for compatibility
    if (window.configManager) {
      try {
        const showDetailedAnalysis = window.configManager.get('display.showDetailedAnalysis');
        const showScoreBreakdown = window.configManager.get('display.showScoreBreakdown');
        const showRecommendations = window.configManager.get('display.showRecommendations');
        const showTimestamps = window.configManager.get('display.showTimestamps');
        const showPerformanceMetrics = window.configManager.get('display.showPerformanceMetrics');
        
        // Apply visibility for body (detailed analysis) - use flex to maintain layout
        body.style.display = showDetailedAnalysis ? 'flex' : 'none';
        body.dataset.configKey = 'display.showDetailedAnalysis';
        
        // Hide/show details container based on config
        if (detailsContainer) {
          detailsContainer.style.display = showDetailedAnalysis ? 'grid' : 'none';
        }
        
        // Apply visibility for score breakdown
        scoreBreakdown.style.display = showScoreBreakdown ? 'block' : 'none';
        scoreBreakdown.dataset.configKey = 'display.showScoreBreakdown';
        
        // Apply visibility for recommendations
        recommendationsSection.style.display = showRecommendations ? 'block' : 'none';
        recommendationsSection.dataset.configKey = 'display.showRecommendations';
        
        // Handle timestamp and performance metrics rows
        const rows = body.querySelectorAll('.scanner-result__row');
        rows.forEach(row => {
          const label = row.querySelector('.scanner-result__label');
          if (label) {
            const text = label.textContent.toLowerCase();
            if (text.includes('scanned at') || text.includes('scan time') || text.includes('duration')) {
              row.style.display = (showTimestamps || showPerformanceMetrics) ? 'flex' : 'none';
            }
          }
        });
        
      } catch (e) {
        console.warn('Could not apply display config:', e);
        // Default to showing if config manager not available
        body.style.display = 'flex';
        scoreBreakdown.style.display = 'block';
        recommendationsSection.style.display = 'block';
      }
    } else {
      // No config manager - show by default
      body.style.display = 'flex';
      scoreBreakdown.style.display = 'block';
      recommendationsSection.style.display = 'block';
    }

    // Add entrance animation class after inserting to trigger CSS animation
    wrapper.classList.add('scanner-result--enter');
    resultsEl.appendChild(wrapper);
    // Slight delay to allow CSS transition to play (add pop to safety circle)
    requestAnimationFrame(() => {
      wrapper.classList.add('scanner-result--visible');
      const circle = wrapper.querySelector('.safety-circle');
      if (circle) circle.classList.add('safety-circle--pop');
    });
  }

  function loadHistory() {
    try {
      const raw = localStorage.getItem("scannerHistory");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory(history) {
    try {
      localStorage.setItem("scannerHistory", JSON.stringify(history));
    } catch (e) {
      // ignore
    }
  }

  function addToHistory(entry) {
    const history = loadHistory();
    history.unshift(entry);
    saveHistory(history);
    renderHistory(history);
  }

  // State for show more functionality
  let showingAllHistory = false;
  const HISTORY_INITIAL_LIMIT = 8;

  function renderHistory(history) {
    if (!historyList) return;
    
    // Use requestAnimationFrame for smoother rendering
    requestAnimationFrame(() => {
      historyList.innerHTML = "";
      
      // Filter history based on current filter
      const filteredHistory = (history || []).filter((h) => {
        const status = h.status || (h.isSafe ? 'safe' : 'unsafe');
        return currentHistoryFilter === 'all' || status === currentHistoryFilter;
      });

      // Determine how many items to show
      const itemsToShow = showingAllHistory ? filteredHistory.length : Math.min(HISTORY_INITIAL_LIMIT, filteredHistory.length);
      const hasMore = filteredHistory.length > HISTORY_INITIAL_LIMIT;

      // OPTIMIZED: Use DocumentFragment for batch DOM updates
      const fragment = document.createDocumentFragment();

      // Render history items
      filteredHistory.slice(0, itemsToShow).forEach((h) => {
        const status = h.status || (h.isSafe ? 'safe' : 'unsafe');
        const item = document.createElement('div');
        item.className = `history-item history-item--${status}`;
        
        // Make history item clickable
        item.style.cursor = 'pointer';
        item.setAttribute('title', 'Click to view scan results');
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        
        const left = document.createElement('div');
        left.innerHTML = `<div>${h.url}</div><div class="history-item__meta">${h.scannedAt}</div>`;
        const right = document.createElement('div');
        right.className = 'history-item__status';
        const badge = document.createElement('span');
        badge.className = `status-badge status-badge--${status}`;
        badge.setAttribute('aria-label', `Status: ${status}`);
        badge.textContent = status === 'safe' ? 'SAFE' : status === 'caution' ? 'CAUTION' : 'UNSAFE';
        right.appendChild(badge);
        item.appendChild(left);
        item.appendChild(right);
        
        // Add click functionality to display cached results
        const showCachedResult = () => {
          // Clear current results
          resultsEl.innerHTML = "";
          summaryEl.textContent = "Showing cached scan result:";
          
          // Display the cached result
          renderResult(h);
          
          // Update page status based on cached result
          const isAllSafe = h.status === 'safe';
          const anyUnsafe = h.status === 'unsafe';
          setPageStatus(isAllSafe, anyUnsafe);
          
          // Scroll to results
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
        
        item.addEventListener('click', showCachedResult);
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            showCachedResult();
          }
        });
        
        fragment.appendChild(item);
      });

      // Add "Show More" / "Show Less" button if needed
      if (hasMore) {
        const showMoreContainer = document.createElement('div');
        showMoreContainer.className = 'history-show-more';
        showMoreContainer.style.cssText = 'text-align: center; padding: 16px 0; margin-top: 8px;';
        
        const showMoreBtn = document.createElement('button');
        showMoreBtn.type = 'button';
        showMoreBtn.className = 'show-more-button';
        showMoreBtn.style.cssText = `
          background: rgba(76, 175, 80, 0.1);
          border: 2px solid rgba(76, 175, 80, 0.3);
          color: #4CAF50;
          padding: 10px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        `;
        
        const updateButtonText = () => {
          const arrow = showingAllHistory ? '▲' : '▼';
          const text = showingAllHistory ? 'Show Less' : `Show More (${filteredHistory.length - HISTORY_INITIAL_LIMIT} more)`;
          showMoreBtn.innerHTML = `${text} ${arrow}`;
        };
        
        updateButtonText();
        
        showMoreBtn.addEventListener('mouseenter', () => {
          showMoreBtn.style.background = 'rgba(76, 175, 80, 0.2)';
          showMoreBtn.style.borderColor = 'rgba(76, 175, 80, 0.5)';
          showMoreBtn.style.transform = 'translateY(-2px)';
        });
        
        showMoreBtn.addEventListener('mouseleave', () => {
          showMoreBtn.style.background = 'rgba(76, 175, 80, 0.1)';
          showMoreBtn.style.borderColor = 'rgba(76, 175, 80, 0.3)';
          showMoreBtn.style.transform = 'translateY(0)';
        });
        
        showMoreBtn.addEventListener('click', () => {
          showingAllHistory = !showingAllHistory;
          renderHistory(history);
        });
        
        showMoreContainer.appendChild(showMoreBtn);
        fragment.appendChild(showMoreContainer);
      }
      
      // OPTIMIZED: Single DOM update instead of multiple appends
      historyList.appendChild(fragment);
    });
  }

  // Filter button handlers
  if (filterButtons.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const value = btn.getAttribute('data-filter');
        currentHistoryFilter = value;
        showingAllHistory = false; // Reset to show limited items when filter changes
        filterButtons.forEach(b => b.classList.remove('filter-active'));
        filterButtons.forEach(b => b.setAttribute('aria-pressed','false'));
        btn.classList.add('filter-active');
        btn.setAttribute('aria-pressed','true');
        renderHistory(loadHistory());
      });
    });
    // Initialize first (all) as active if none marked
    const anyActive = Array.from(filterButtons).some(b => b.classList.contains('filter-active'));
    if (!anyActive) {
      const allBtn = Array.from(filterButtons).find(b => b.getAttribute('data-filter') === 'all') || filterButtons[0];
      allBtn.classList.add('filter-active');
      allBtn.setAttribute('aria-pressed','true');
    }
  }

  function setPageStatus(isAllSafe, anyUnsafe) {
    // Use enhanced version if available
    if (typeof window.setPageStatus === 'function' && window.setPageStatus !== setPageStatus) {
      return window.setPageStatus(isAllSafe, anyUnsafe);
    }
    
    // Fallback to basic version
    document.body.classList.remove("scan-safe", "scan-unsafe");
    if (anyUnsafe) {
      document.body.classList.add("scan-unsafe");
      if (summaryEl) summaryEl.textContent = "At least one link appears unsafe. Review details below.";
    } else if (isAllSafe) {
      document.body.classList.add("scan-safe");
      if (summaryEl) summaryEl.textContent = "All scanned links look safe based on basic checks.";
    } else {
      if (summaryEl) summaryEl.textContent = "Scan complete.";
    }
  }

  // ==================== DOMAIN EXISTENCE CHECKING ====================
  
  async function checkDomainExists(url) {
    try {
      // Try to fetch just the headers with a very short timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch(url, {
        method: 'HEAD', // Just get headers, not the full content
        mode: 'no-cors', // Avoid CORS issues
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return { exists: true, error: null };
    } catch (error) {
      if (error.name === 'AbortError') {
        return { exists: false, error: 'timeout' };
      }
      // Network errors, DNS failures, etc.
      return { exists: false, error: error.message || 'domain_not_found' };
    }
  }

  // Pure scanning of one URL (no DOM side-effects). Returns result object or error wrapper.
  async function scanOne(url, rawInput) {
    try {
      const parsed = new URL(url);
      const isHttps = parsed.protocol.toLowerCase() === "https:";
      const scannedAt = new Date().toLocaleString();
      const categoryInfo = categorizeHost(parsed.hostname);
      let externalLinks = null;
      let misspellingsFound = [];
      let reasons = [];
  const { flags: heuristicFlags, notes: heuristicNotes, tld, phishingScore } = analyzeUrlHeuristics(url, rawInput);

      // ==================== DOMAIN EXISTENCE CHECK ====================
      const domainCheck = await checkDomainExists(url);
      if (!domainCheck.exists) {
        // Domain doesn't exist - this is highly suspicious
        // Add domain-not-found to existing heuristic flags
        const allFlags = [...heuristicFlags, "domain-not-found"];
        
        // Build comprehensive reasons including heuristic analysis
        const allReasons = [];
        allReasons.push(`Domain does not exist or is unreachable (${domainCheck.error})`);
        allReasons.push(`Uses ${isHttps ? 'HTTPS' : 'HTTP'}.`);
        
        // Add heuristic reasons if any were found
        if (heuristicFlags.length > 0) {
          allReasons.push(`Heuristic flags: ${heuristicFlags.join(' • ')}.`);
        }
        
        // Add specific suspicious pattern explanations
        if (heuristicFlags.includes('suspicious-tld')) {
          allReasons.push(`Suspicious TLD (.${tld}) commonly used in phishing.`);
        }
        if (heuristicFlags.includes('phishing-keywords')) {
          allReasons.push('Contains phishing-related keywords (account, suspended, verify).');
        }
        if (heuristicFlags.includes('suspicious-pattern')) {
          allReasons.push('Matches known phishing URL patterns.');
        }
        if (heuristicFlags.includes('typosquatting')) {
          allReasons.push('Potential typosquatting or brand impersonation attempt.');
        }
        if (heuristicFlags.includes('high-phishing-risk')) {
          allReasons.push('High phishing risk based on URL structure and keywords.');
        }
        
        // For non-existent domains, return early with high risk but comprehensive analysis
        const nonExistentResult = {
          url,
          isHttps,
          externalLinks: 0,
          misspellings: [],
          heuristicFlags: allFlags,
          localScan: null,
          isSafe: false,
          status: "unsafe",
          risk: 150, // Very high risk for non-existent domains
          safetyRating: 5, // Very low safety rating
          safetyLevel: "Very Unsafe",
          safetyExplanation: "5% — Critical: Domain does not exist. This could be a typosquatting attempt or fraudulent link.",
          category: "Non-existent Domain",
          scannedAt,
          reasons: allReasons
        };
        return nonExistentResult;
      }

      // Attempt local deep scan (no-API server) and merge signals if available
      let localScan = null;
      try {
        localScan = await tryLocalScan(url);
      } catch (e) { /* ignore */ }

      // If local scanner already indicates a strong signal (blocklist, early exit, or GSB unsafe),
      // skip the slow HTML proxy fetch to keep results snappy.
      const strongLocalSignal = !!(localScan && (
        (localScan.blocklist && localScan.blocklist.match) ||
        (localScan.gsb && localScan.gsb.enabled && localScan.gsb.verdict === 'unsafe') ||
        (localScan.verdict && /fast result\s*\(early exit\)/i.test(String(localScan.verdict.notes || '')))
      ));

      if (!strongLocalSignal) {
        try {
          const html = await fetchPageHtmlWithProxy(url, 1500);
          if (html) {
            const { externalCount, textContent } = parseLinksFromHtml(html, url);
            externalLinks = externalCount;
            const { foundMisspellings } = analyzeTextForSuspicion(textContent || "");
            misspellingsFound = foundMisspellings;
          }
        } catch (e) {
          // ignore, rely on localScan + heuristics
        }
      }

      const { risk, status, reasons: computedReasons } = computeRiskScore({
        isHttps,
        externalLinks,
        foundMisspellings: misspellingsFound,
        categoryInfo,
        heuristicFlags,
        tld,
        phishingScore
      });

      // Merge reasons with local scan diagnostics
      if (localScan) {
        if (localScan.http) {
          const s = localScan.http.status;
          if (typeof s === 'number') reasons.push(`HTTP status ${s}`);
          if (localScan.http.redirects) reasons.push(`Redirects: ${localScan.http.redirects}`);
        }
        if (localScan.tls) {
          if (localScan.tls.validHostname === false) reasons.push('TLS hostname mismatch');
          if (typeof localScan.tls.daysToExpire === 'number') reasons.push(`TLS expires in ${localScan.tls.daysToExpire} days`);
        }
        if (localScan.dns && !localScan.dns.ok) reasons.push(`DNS error: ${localScan.dns.error}`);
      }
      reasons = reasons.concat(computedReasons);
      
      // For safety explanation, only include basic non-technical reasons
      const basicReasons = reasons.filter(reason => {
        const lowerReason = reason.toLowerCase();
        return lowerReason.includes('https') || 
               lowerReason.includes('http') || 
               lowerReason.includes('misspelling') ||
               lowerReason.includes('external link') ||
               lowerReason.includes('category') ||
               lowerReason.includes('deep content') ||
               lowerReason.includes('fetch');
      });
      
      const isSafe = status === "safe";
      const safetyRating = calculateSafetyRating(risk, phishingScore);
      const safetyLevel = getSafetyLevel(safetyRating);
      const safetyExplanation = getDecileExplanation(safetyRating, basicReasons);

      return {
        url,
        isHttps,
        externalLinks,
        misspellings: misspellingsFound,
        heuristicFlags,
        localScan,
        isSafe,
        status,
        risk,
        safetyRating,
        safetyLevel,
        safetyExplanation,
        category: categoryInfo.category,
        scannedAt,
        reasons
      };
    } catch (err) {
      return { error: true, url, raw: rawInput, message: err && err.message ? err.message : "Unknown scan error" };
    }
  }

  // Run an array of tasks (functions returning promises) with limited concurrency.
  async function runWithConcurrency(tasks, limit, onProgress) {
    const results = new Array(tasks.length);
    let inFlight = 0;
    let cursor = 0;
    let completed = 0;
    return new Promise((resolve) => {
      function launchNext() {
        if (completed === tasks.length) return resolve(results);
        while (inFlight < limit && cursor < tasks.length) {
          const index = cursor++;
            inFlight++;
          tasks[index]().then((res) => {
            results[index] = res;
          }).catch((e) => {
            results[index] = { error: true, message: e && e.message ? e.message : "Task failed" };
          }).finally(() => {
            inFlight--;
            completed++;
            if (onProgress) onProgress({ completed, total: tasks.length });
            launchNext();
          });
        }
      }
      launchNext();
    });
  }

  function renderAndStore(result) {
    if (!result) return;
    if (!result.error) {
      renderResult(result);
      addToHistory(result);
    } else {
      const wrapper = document.createElement("div");
      wrapper.className = "scanner-result scanner-result--unsafe";
      wrapper.textContent = `Failed to scan ${result.url || result.raw || ''}: ${result.message}`;
      resultsEl.appendChild(wrapper);
    }
  }

  async function scanAll() {
    resultsEl.innerHTML = "";
    document.body.classList.remove("scan-safe", "scan-unsafe");
    if (summaryEl) summaryEl.textContent = "";

    // Show progress bar
    showProgress();

    const rawLines = (input.value || "")
      .split(/\n|\r/)
      .map((s) => s.trim())
      .filter(Boolean);
    const pairs = rawLines
      .map((raw) => ({ raw, normalized: validateAndNormalizeUrl(raw) }))
      .filter((p) => Boolean(p.normalized));

    if (!pairs.length) {
      summaryEl.textContent = "Please paste at least one valid URL (one per line).";
      if (liveSafetyEl) liveSafetyEl.innerHTML = "";
      hideProgress();
      return;
    }

    if (liveSafetyEl) liveSafetyEl.innerHTML = '<div class="live-safety__scanning">Scanning (0/' + pairs.length + ')...</div>';

    // Build task array (preserve order)
    const tasks = pairs.map((p) => () => scanOne(p.normalized, p.raw));

    const orderedResults = await runWithConcurrency(tasks, MAX_CONCURRENT_SCANS, (progress) => {
      // Update both live safety and progress bar
      const percentage = Math.round((progress.completed / progress.total) * 100);
      updateProgress(percentage);
      
      if (liveSafetyEl) liveSafetyEl.innerHTML = '<div class="live-safety__scanning">Scanning (' + progress.completed + '/' + progress.total + ')...</div>';
    });

    // Complete progress bar
    updateProgress(100);
    
    // Render in original order
    orderedResults.forEach(renderAndStore);

    const filtered = orderedResults.filter(r => r && !r.error);
    const anyUnsafe = filtered.some((r) => r.status === "unsafe");
    const allSafe = filtered.length && filtered.every((r) => r.status === "safe");
    setPageStatus(allSafe, anyUnsafe);
    if (!anyUnsafe && !allSafe && filtered.length) {
      summaryEl.textContent = "Some links may require caution. Review details below.";
    }
    if (liveSafetyEl) liveSafetyEl.innerHTML = "";
    
    // Hide progress bar after completion
    hideProgress();
  }

  // ---------------- Live Safety Preview ----------------
  const liveSafetyEl = document.getElementById("liveSafety");

  function renderLiveSafety(result) {
    if (!liveSafetyEl) return;
    if (!result) {
      liveSafetyEl.innerHTML = "";
      return;
    }
    // Always render the non-numeric preview in the live preview area.
    liveSafetyEl.innerHTML = `
      <div class="live-safety__wrapper live-safety__preview">
        <div class="live-safety__info">
          <div class="live-safety__level">${result.safetyLevel}</div>
          <div class="live-safety__text">${result.safetyExplanation}</div>
          ${result.previewNote ? `<div class="live-safety__note">${result.previewNote}</div>` : ""}
        </div>
      </div>
    `;
  }

  // Lightweight compute for preview (no proxy fetch)
  function computePreviewForRaw(raw) {
    const normalized = validateAndNormalizeUrl(raw);
    if (!normalized) return null;
    try {
      const parsed = new URL(normalized);
      const isHttps = parsed.protocol.toLowerCase() === "https:";
      const categoryInfo = categorizeHost(parsed.hostname);
  const { flags: heuristicFlags, notes: heuristicNotes, tld, phishingScore } = analyzeUrlHeuristics(normalized, raw);
      // We can't fetch page content here — assume zero misspellings and external links unknown
      const { risk, status, reasons } = computeRiskScore({
        isHttps,
        externalLinks: 0,
        foundMisspellings: [],
        categoryInfo,
        heuristicFlags,
        tld,
        phishingScore
      });
      const safetyRating = calculateSafetyRating(risk, phishingScore);
      const safetyLevel = getSafetyLevel(safetyRating);
      const safetyExplanation = getSafetyExplanation(safetyRating, status, reasons);
      // Be slightly conservative in the heuristic preview: cap very-high heuristic scores
      // so users understand this is an estimate. We'll also show a clear preview note.
      let previewRating = safetyRating;
      if (!(categoryInfo && categoryInfo.trusted) && safetyRating >= 95) {
        previewRating = Math.max(90, safetyRating - 10);
      }
      const previewNote = "Heuristic preview — full scan may update the rating.";
      return {
        url: normalized,
        safetyRating: previewRating,
        safetyLevel,
        safetyExplanation,
        previewNote,
        isPreview: true
      };
    } catch (e) {
      return null;
    }
  }

  let previewTimeout = null;
  input.addEventListener("input", function (e) {
    const firstLine = (input.value || "").split(/\n|\r/)[0] || "";
    if (previewTimeout) clearTimeout(previewTimeout);
    previewTimeout = setTimeout(() => {
      // Do not show heuristic preview on input — clear live preview until user clicks Scan
      if (liveSafetyEl) liveSafetyEl.innerHTML = "";
    }, 250);
  });

  input.addEventListener("paste", function (e) {
    setTimeout(() => {
      // Clear any live preview when user pastes until they click Scan Links
      if (liveSafetyEl) liveSafetyEl.innerHTML = "";
    }, 50);
  });

  function restart() {
    input.value = "";
    resultsEl.innerHTML = "";
    summaryEl.textContent = "";
    document.body.classList.remove("scan-safe", "scan-unsafe");
  }

  function clearHistory() {
    saveHistory([]);
    renderHistory([]);
  }

  scanButton.addEventListener("click", function (e) {
    e.preventDefault();
    scanAll();
  });

  restartButton && restartButton.addEventListener("click", function (e) {
    e.preventDefault();
    restart();
  });

  clearHistoryBtn && clearHistoryBtn.addEventListener("click", function (e) {
    e.preventDefault();
    clearHistory();
  });

  // Initial history render
  renderHistory(loadHistory());
  
  // Initialize security theme enhancements
  if (typeof initSecurityTheme === 'function') {
    initSecurityTheme();
  }
  
  // Initialize display from config
  if (typeof window.updateDisplayFromConfig === 'function') {
    window.updateDisplayFromConfig();
  }
}

// Do not auto-run multiple times; React will call window.initScanner() after injection.

// Allow React/SPA to call this after page injection
window.initScanner = initScanner;

// Function to update display based on configuration changes
window.updateDisplayFromConfig = function() {
  if (!window.configManager) return;
  
  try {
    // Get all display configuration values
    const showDetailedAnalysis = window.configManager.get('display.showDetailedAnalysis');
    const showScoreBreakdown = window.configManager.get('display.showScoreBreakdown');
    const showRecommendations = window.configManager.get('display.showRecommendations');
    const showPerformanceMetrics = window.configManager.get('display.showPerformanceMetrics');
    const showTimestamps = window.configManager.get('display.showTimestamps');
    const colorScheme = window.configManager.get('display.colorScheme');
    
    // Update score breakdown sections
    document.querySelectorAll('.scanner-result__score-breakdown').forEach(el => {
      el.style.display = showScoreBreakdown ? 'block' : 'none';
    });
    
    // Update recommendations sections
    document.querySelectorAll('.scanner-result__recommendations').forEach(el => {
      el.style.display = showRecommendations ? 'block' : 'none';
    });
    
    // Update detailed analysis (body section with all details)
    document.querySelectorAll('.scanner-result__body').forEach(el => {
      el.style.display = showDetailedAnalysis ? 'block' : 'none';
    });
    
    // Update performance metrics rows
    document.querySelectorAll('.scanner-result__row').forEach(row => {
      const label = row.querySelector('.scanner-result__label');
      if (label) {
        const text = label.textContent.toLowerCase();
        // Check if this is a performance-related row
        if (text.includes('scanned at') || text.includes('scan time') || text.includes('duration')) {
          row.style.display = (showTimestamps || showPerformanceMetrics) ? 'flex' : 'none';
        }
      }
    });
    
    // Apply color scheme - BUT don't override manual theme toggle
    // Skip if user has manually set theme preference
    const manualThemePreference = localStorage.getItem('themePreference');
    if (colorScheme && !manualThemePreference) {
      const body = document.body;
      body.classList.remove('theme-light', 'theme-dark', 'theme-auto');
      
      if (colorScheme === 'light') {
        body.classList.add('theme-light');
        body.style.colorScheme = 'light';
      } else if (colorScheme === 'dark') {
        body.classList.add('theme-dark');
        body.style.colorScheme = 'dark';
      } else if (colorScheme === 'auto') {
        body.classList.add('theme-auto');
        body.style.colorScheme = 'light dark';
        // Let CSS prefer-color-scheme handle it
      }
    }
    
    console.log('✅ Display updated from config:', {
      showDetailedAnalysis,
      showScoreBreakdown,
      showRecommendations,
      showPerformanceMetrics,
      showTimestamps,
      colorScheme
    });
  } catch (e) {
    console.warn('Could not update display from config:', e);
  }
};

// Listen for configuration changes
if (window.configManager) {
  window.configManager.on('change', () => {
    console.log('🔄 Configuration changed, updating display...');
    window.updateDisplayFromConfig();
  });
}

// ========== New Features: API Integration, Training, Whitelist/Blacklist ==========

// 1. Free API Integration (PhishTank example, can be swapped for any open API)
async function checkUrlWithPhishAPI(url) {
  // Example: Use PhishTank public API (or any similar open API)
  // This is a placeholder; you may need to register for an API key for real use.
  // For demo, we'll use a fake endpoint and always return safe.
  // Replace with a real API call as needed.
  try {
    // Example: const res = await fetch(`https://checkurl.phishtank.com/checkurl/?url=${encodeURIComponent(url)}&format=json`);
    // const data = await res.json();
    // if (data.results.in_database && data.results.valid) return { flagged: true, reason: 'PhishTank flagged as phishing' };
    // return { flagged: false };
    return { flagged: false }; // Always safe for demo
  } catch (e) {
    return { flagged: false };
  }
}

// 2. Training System: Store scan results in localStorage and allow user correction
const TRAINING_KEY = 'scannerTrainingData';
function getTrainingData() {
  try {
    return JSON.parse(localStorage.getItem(TRAINING_KEY)) || {};
  } catch {
    return {};
  }
}
function saveTrainingData(data) {
  try {
    localStorage.setItem(TRAINING_KEY, JSON.stringify(data));
  } catch {}
}
function getTrainedStatus(url) {
  const data = getTrainingData();
  return data[url]; // {status, reason}
}
function setTrainedStatus(url, status, reason) {
  const data = getTrainingData();
  data[url] = { status, reason, updated: Date.now() };
  saveTrainingData(data);
}

// 3. Whitelist/Blacklist (domain-based, in localStorage)
const WL_KEY = 'scannerWhitelist';
const BL_KEY = 'scannerBlacklist';
function getWhitelist() {
  try {
    return JSON.parse(localStorage.getItem(WL_KEY)) || [];
  } catch {
    return [];
  }
}
function getBlacklist() {
  try {
    return JSON.parse(localStorage.getItem(BL_KEY)) || [];
  } catch {
    return [];
  }
}
function addToWhitelist(domain) {
  const wl = getWhitelist();
  if (!wl.includes(domain)) wl.push(domain);
  localStorage.setItem(WL_KEY, JSON.stringify(wl));
}
function removeFromWhitelist(domain) {
  const wl = getWhitelist().filter(d => d !== domain);
  localStorage.setItem(WL_KEY, JSON.stringify(wl));
}
function addToBlacklist(domain) {
  const bl = getBlacklist();
  if (!bl.includes(domain)) bl.push(domain);
  localStorage.setItem(BL_KEY, JSON.stringify(bl));
}
function removeFromBlacklist(domain) {
  const bl = getBlacklist().filter(d => d !== domain);
  localStorage.setItem(BL_KEY, JSON.stringify(bl));
}
function getDomainFromUrl(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return '';
  }
}

// 4. Integration: Wrap scanOne to add new features (without modifying original)
if (typeof scanOne === 'function') {
  window._originalScanOne = scanOne;
  window.scanOne = async function(url, rawInput) {
    // 1. Whitelist/Blacklist check
    const domain = getDomainFromUrl(url);
    const wl = getWhitelist();
    const bl = getBlacklist();
    if (wl.includes(domain)) {
      return {
        url,
        isHttps: url.startsWith('https://'),
        externalLinks: 0,
        misspellings: [],
        heuristicFlags: [],
        isSafe: true,
        status: 'safe',
        risk: 0,
        safetyRating: 100,
        safetyLevel: 'Very Safe',
        safetyExplanation: 'Whitelisted domain',
        category: 'Whitelisted',
        scannedAt: new Date().toLocaleString(),
        reasons: ['Domain is whitelisted']
      };
    }
    if (bl.includes(domain)) {
      return {
        url,
        isHttps: url.startsWith('https://'),
        externalLinks: 0,
        misspellings: [],
        heuristicFlags: [],
        isSafe: false,
        status: 'unsafe',
        risk: 100,
        safetyRating: 10,
        safetyLevel: 'Very Unsafe',
        safetyExplanation: 'Blacklisted domain',
        category: 'Blacklisted',
        scannedAt: new Date().toLocaleString(),
        reasons: ['Domain is blacklisted']
      };
    }
    // 2. Training data check
    const trained = getTrainedStatus(url);
    if (trained) {
      return {
        url,
        isHttps: url.startsWith('https://'),
        externalLinks: 0,
        misspellings: [],
        heuristicFlags: [],
        isSafe: trained.status === 'safe',
        status: trained.status,
        risk: trained.status === 'safe' ? 0 : 100,
        safetyRating: trained.status === 'safe' ? 100 : 10,
        safetyLevel: trained.status === 'safe' ? 'Very Safe' : 'Very Unsafe',
        safetyExplanation: 'Learned from user correction',
        category: 'Trained',
        scannedAt: new Date().toLocaleString(),
        reasons: [trained.reason || 'User correction']
      };
    }
    // 3. Run original scan
    const result = await window._originalScanOne(url, rawInput);
    // 4. API check (async, can be slow)
    const apiRes = await checkUrlWithPhishAPI(url);
    if (apiRes.flagged) {
      result.risk = Math.max(result.risk, 80);
      result.status = 'unsafe';
      result.isSafe = false;
      result.safetyRating = Math.min(result.safetyRating, 20);
      result.safetyLevel = 'Very Unsafe';
      result.safetyExplanation = (result.safetyExplanation ? result.safetyExplanation + ' | ' : '') + (apiRes.reason || 'Flagged by API');
      result.reasons = (result.reasons || []).concat([apiRes.reason || 'Flagged by API']);
    }
    return result;
  };
}

// 5. UI Helper: User can correct scan result (call from UI as needed)
window.setTrainedStatus = setTrainedStatus;
window.getTrainedStatus = getTrainedStatus;
window.addToWhitelist = addToWhitelist;
window.removeFromWhitelist = removeFromWhitelist;
window.addToBlacklist = addToBlacklist;

// 6. Background Removal for Shield Logos
function removeShieldLogoBackground() {
  const shieldLogos = document.querySelectorAll('img[src*="shield"]');
  
  shieldLogos.forEach(img => {
    // Wait for image to load
    if (img.complete) {
      processShieldLogo(img);
    } else {
      img.onload = () => processShieldLogo(img);
    }
  });
}

function processShieldLogo(img) {
  try {
    // Create a canvas to process the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match image
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    
    // Draw the image to canvas
    ctx.drawImage(img, 0, 0);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Define background colors to remove (gray/light gray)
    const backgroundColors = [
      [169, 169, 169], // Gray
      [192, 192, 192], // Silver/Light Gray
      [211, 211, 211], // Light Gray
      [220, 220, 220], // Gainsboro
      [245, 245, 245], // White Smoke
      [255, 255, 255], // White
    ];
    
    // Process each pixel
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Check if this pixel matches any background color (with tolerance)
      const isBackground = backgroundColors.some(bgColor => {
        const tolerance = 30;
        return Math.abs(r - bgColor[0]) < tolerance &&
               Math.abs(g - bgColor[1]) < tolerance &&
               Math.abs(b - bgColor[2]) < tolerance;
      });
      
      // Make background pixels transparent
      if (isBackground) {
        data[i + 3] = 0; // Set alpha to 0 (transparent)
      }
    }
    
    // Put the processed image data back
    ctx.putImageData(imageData, 0, 0);
    
    // Replace the original image with the processed one
    img.src = canvas.toDataURL('image/png');
    
    // Add a class to indicate it's been processed
    img.classList.add('background-removed');
    
  } catch (error) {
    console.warn('Could not process shield logo background removal:', error);
    // Fallback to CSS-only approach
    img.style.filter = 'contrast(200%) brightness(120%) saturate(150%)';
    img.style.mixBlendMode = 'multiply';
  }
}
window.removeFromBlacklist = removeFromBlacklist;
window.getWhitelist = getWhitelist;
window.getBlacklist = getBlacklist;

// ==================== CYBERSECURITY THEME ENHANCEMENTS (OPTIMIZED) ====================

// Create floating security particles (OPTIMIZED - reduced count and using CSS transforms)
function createSecurityParticles() {
  // Reduced from 15 to 6 particles for better performance
  const particleCount = 15;
  const colors = [
    'rgba(33, 150, 243, 0.2)',   // Security Blue (reduced opacity)
    'rgba(76, 175, 80, 0.2)',    // Security Green (reduced opacity)
    'rgba(244, 67, 54, 0.2)',    // Security Red (reduced opacity)
    'rgba(156, 39, 176, 0.2)'    // Security Purple (reduced opacity)
  ];
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'security-particle';
    particle.style.cssText = `
      position: fixed;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      pointer-events: none;
      z-index: 1;
      animation-delay: ${Math.random() * 6}s;
      animation-duration: ${Math.random() * 4 + 6}s;
    `;
    document.body.appendChild(particle);
  }
}

// Add scan button pulse effect
function enhanceScanButton() {
  const scanBtn = document.querySelector('#scanBtn, button[onclick*="scanLinks"], .button');
  if (scanBtn) {
    scanBtn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px) scale(1.02)';
      this.style.boxShadow = '0 8px 25px rgba(33, 150, 243, 0.4)';
    });
    
    scanBtn.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = '0 4px 15px rgba(33, 150, 243, 0.3)';
    });
  }
}

// Add typing effect to URL input
function enhanceUrlInput() {
  const urlInput = document.querySelector('#scannerInput, textarea[placeholder*="URL"], input[type="url"]');
  if (urlInput) {
    urlInput.addEventListener('focus', function() {
      this.style.boxShadow = '0 0 20px rgba(33, 150, 243, 0.3)';
      this.style.borderColor = '#2196f3';
    });
    
    urlInput.addEventListener('blur', function() {
      this.style.boxShadow = 'none';
      this.style.borderColor = '#ddd';
    });
  }
}

// Initialize security theme enhancements (OPTIMIZED)
function initSecurityTheme() {
  // Check if already initialized to prevent duplicates
  if (window.__securityThemeInitialized) return;
  window.__securityThemeInitialized = true;
  
  // Create particles after a delay
  setTimeout(() => {
    createSecurityParticles();
  }, 1500);
  
  // Enhance interactive elements
  enhanceScanButton();
  enhanceUrlInput();
  
  // Watch for new scan results being added
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.classList) {
            // Add animation to newly added result cards
            if (node.classList.contains('scanner-result')) {
              node.classList.add('security-enhanced');
            }
          }
        });
      }
    });
  });
    
  // Start observing the document body for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSecurityTheme);
} else {
  initSecurityTheme();
}

// Make it available for React/SPA
window.initSecurityTheme = initSecurityTheme;

// ==================== ENHANCED SCAN RESULT EFFECTS (OPTIMIZED) ====================

// Create additional visual effects for scan results (OPTIMIZED - reduced particles)
function createScanResultEffects(isUnsafe) {
  // Remove any existing scan effects
  document.querySelectorAll('.scan-effect-particle').forEach(p => p.remove());
  
  const color = isUnsafe ? 'rgba(244, 67, 54, 0.4)' : 'rgba(76, 175, 80, 0.4)';
  const glowColor = isUnsafe ? '#f44336' : '#4caf50';
  
  // Create 25 particles for a nice effect
  const particleCount = 25;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'scan-effect-particle';
    particle.style.cssText = `
      position: fixed;
      width: 5px;
      height: 5px;
      background: ${color};
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: scanParticleFloat ${Math.random() * 2 + 1.5}s ease-out forwards;
      box-shadow: 0 0 8px ${glowColor};
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => particle.remove(), 3500);
  }
  
  // OPTIMIZED: Simplified flash effect
  const flash = document.createElement('div');
  flash.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${color};
    pointer-events: none;
    z-index: 10000;
    opacity: 0;
    animation: screenFlash 0.4s ease-out forwards;
  `;
  document.body.appendChild(flash);
  
  // Remove flash after animation
  setTimeout(() => {
    if (flash.parentNode) {
      flash.remove();
    }
  }, 400);
}

// Enhanced page status function with visual effects (OPTIMIZED)
function setPageStatusEnhanced(isAllSafe, anyUnsafe) {
  // Remove existing scan classes
  document.body.classList.remove("scan-safe", "scan-unsafe");
  
  if (anyUnsafe) {
    document.body.classList.add("scan-unsafe");
    createScanResultEffects(true);
    
    // Add pulsing border to viewport
    document.body.style.boxShadow = 'inset 0 0 50px rgba(244, 67, 54, 0.3)';
    
  } else if (isAllSafe) {
    document.body.classList.add("scan-safe");
    createScanResultEffects(false);
    
    // Add pulsing border to viewport
    document.body.style.boxShadow = 'inset 0 0 50px rgba(76, 175, 80, 0.3)';
  } else {
    // Reset effects for neutral state
    document.body.style.boxShadow = '';
    document.querySelectorAll('.scan-effect-particle').forEach(p => p.remove());
  }
}

// ============== Modal Functions for Clickable Details ==============

/**
 * Show heuristic analysis details in a modal
 */
function showHeuristicDetailsModal(heuristics) {
  // Check if dark mode is active
  const isDarkMode = document.body.classList.contains('theme-dark');
  
  // Create modal overlay
  const modal = document.createElement('div');
  modal.className = 'details-modal-overlay';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, ${isDarkMode ? '0.85' : '0.7'});
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.2s ease;
  `;
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'details-modal-content';
  const bgColor = isDarkMode ? '#1e293b' : 'white';
  const textColor = isDarkMode ? '#e2e8f0' : '#333';
  const borderColor = isDarkMode ? '#334155' : '#e5e7eb';
  
  modalContent.style.cssText = `
    background: ${bgColor};
    color: ${textColor};
    border-radius: 12px;
    padding: 30px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, ${isDarkMode ? '0.6' : '0.3'});
    border: 1px solid ${borderColor};
    animation: slideUp 0.3s ease;
  `;
  
  // Flag descriptions
  const flagDescriptions = {
    'http_not_encrypted': { name: 'HTTP Not Encrypted', points: 100, description: 'Site uses insecure HTTP instead of HTTPS' },
    'ip_literal_host': { name: 'IP Address Host', points: 30, description: 'URL uses IP address instead of domain name' },
    'punycode_host': { name: 'Punycode/IDN', points: 15, description: 'Domain contains internationalized characters (potential spoofing)' },
    'suspicious_tld': { name: 'Suspicious TLD', points: 10, description: 'Top-level domain commonly used for phishing (.xyz, .top, etc.)' },
    'many_subdomains': { name: 'Many Subdomains', points: 10, description: 'Excessive subdomains detected (potential obfuscation)' },
    'many_hyphens': { name: 'Many Hyphens', points: 8, description: 'URL contains many hyphens (potential typosquatting)' },
    'long_hostname': { name: 'Long Hostname', points: 8, description: 'Domain name is unusually long' },
    'long_path': { name: 'Long URL Path', points: 6, description: 'URL path is unusually long' },
    'long_query': { name: 'Long Query String', points: 6, description: 'Query parameters are unusually long' },
    'high_host_entropy': { name: 'High Hostname Entropy', points: 10, description: 'Domain appears random or obfuscated' },
    'high_path_entropy': { name: 'High Path Entropy', points: 6, description: 'URL path appears random or obfuscated' },
    'at_in_path': { name: '@ Symbol in Path', points: 8, description: 'URL path contains @ symbol (potential credential phishing)' },
    'many_encoded_chars': { name: 'Many Encoded Characters', points: 6, description: 'Excessive URL encoding detected' },
    'link_shortener': { name: 'Link Shortener', points: 6, description: 'URL uses a link shortening service' },
    'phishy_keywords': { name: 'Phishing Keywords', points: 10, description: 'Contains keywords commonly used in phishing (login, verify, secure, etc.)' },
    'tld_help_with_reward_pattern': { name: 'Suspicious Pattern', points: 12, description: 'Suspicious TLD combined with reward-related keywords' },
    'typosquat_leetspeak': { name: 'Typosquatting/Leetspeak', points: 14, description: 'Domain appears to mimic a legitimate brand using number substitutions' }
  };
  
  // Theme-aware colors
  const titleColor = isDarkMode ? '#e2e8f0' : '#333';
  const buttonColor = isDarkMode ? '#94a3b8' : '#666';
  const buttonHoverBg = isDarkMode ? '#334155' : '#f5f5f5';
  const boxBg = isDarkMode ? '#0f172a' : '#f5f5f5';
  const labelColor = isDarkMode ? '#94a3b8' : '#666';
  const cardBg = isDarkMode ? '#0f172a' : 'white';
  const cardBorder = isDarkMode ? '#334155' : '#e5e7eb';
  
  // Build modal HTML
  let html = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2 style="margin: 0; color: ${titleColor};">🧠 Heuristic Analysis Details</h2>
      <button class="modal-close-btn" style="background: none; border: none; font-size: 28px; cursor: pointer; color: ${buttonColor}; padding: 0; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s;">×</button>
    </div>
    
    <div style="background: ${boxBg}; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid ${cardBorder};">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="font-weight: bold; color: ${labelColor};">Total Risk Score:</span>
        <span style="font-weight: bold; color: ${heuristics.score >= 35 ? '#f44336' : heuristics.score >= 18 ? '#ff9800' : '#4caf50'}; font-size: 18px;">${heuristics.score}/100</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span style="font-weight: bold; color: ${labelColor};">Risk Level:</span>
        <span style="font-weight: bold; color: ${heuristics.risk === 'high' ? '#f44336' : heuristics.risk === 'medium' ? '#ff9800' : '#4caf50'}; text-transform: uppercase;">${heuristics.risk}</span>
      </div>
    </div>
  `;
  
  if (heuristics.flags && heuristics.flags.length > 0) {
    html += `<h3 style="margin-top: 0; color: ${labelColor}; font-size: 16px; margin-bottom: 15px;">Detected Flags:</h3>`;
    
    heuristics.flags.forEach(flag => {
      const flagInfo = flagDescriptions[flag] || { 
        name: flag.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 
        points: 0, 
        description: 'Risk factor detected' 
      };
      
      const severity = flagInfo.points >= 30 ? 'high' : (flagInfo.points >= 10 ? 'medium' : 'low');
      const severityColor = severity === 'high' ? '#f44336' : (severity === 'medium' ? '#ff9800' : '#2196f3');
      const flagCardBg = isDarkMode ? '#0f172a' : 'white';
      const flagTextColor = isDarkMode ? '#e2e8f0' : '#333';
      const flagDescColor = isDarkMode ? '#94a3b8' : '#666';
      
      html += `
        <div style="background: ${flagCardBg}; border-left: 4px solid ${severityColor}; padding: 15px; margin-bottom: 12px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,${isDarkMode ? '0.3' : '0.1'}); border: 1px solid ${cardBorder};">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <span style="font-weight: bold; color: ${flagTextColor}; flex: 1;">${flagInfo.name}</span>
            <span style="background: ${severityColor}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold; white-space: nowrap; margin-left: 10px;">+${flagInfo.points} pts</span>
          </div>
          <div style="color: ${flagDescColor}; font-size: 14px; line-height: 1.5;">${flagInfo.description}</div>
        </div>
      `;
    });
  } else {
    html += `<div style="text-align: center; color: #4caf50; padding: 20px;">✅ No risk flags detected - URL appears clean</div>`;
  }
  
  modalContent.innerHTML = html;
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .modal-close-btn:hover {
      background: ${buttonHoverBg} !important;
      color: ${isDarkMode ? '#e2e8f0' : '#333'} !important;
    }
    .details-modal-content::-webkit-scrollbar {
      width: 10px;
    }
    .details-modal-content::-webkit-scrollbar-track {
      background: ${isDarkMode ? '#0f172a' : '#f5f5f5'};
      border-radius: 10px;
    }
    .details-modal-content::-webkit-scrollbar-thumb {
      background: ${isDarkMode ? '#475569' : '#cbd5e1'};
      border-radius: 10px;
    }
    .details-modal-content::-webkit-scrollbar-thumb:hover {
      background: ${isDarkMode ? '#64748b' : '#94a3b8'};
    }
  `;
  document.head.appendChild(style);
  
  // Close modal on overlay click or close button
  const closeModal = () => {
    modal.style.animation = 'fadeOut 0.2s ease';
    setTimeout(() => {
      document.body.removeChild(modal);
      document.head.removeChild(style);
    }, 200);
  };
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  modalContent.querySelector('.modal-close-btn').addEventListener('click', closeModal);
  
  // Add fadeOut animation
  style.textContent += `
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
}

/**
 * Show external links details in a modal
 */
function showExternalLinksModal(externalLinksData) {
  // Check if dark mode is active
  const isDarkMode = document.body.classList.contains('theme-dark');
  
  // Create modal overlay
  const modal = document.createElement('div');
  modal.className = 'details-modal-overlay';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, ${isDarkMode ? '0.85' : '0.7'});
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.2s ease;
  `;
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'details-modal-content';
  const bgColor = isDarkMode ? '#1e293b' : 'white';
  const textColor = isDarkMode ? '#e2e8f0' : '#333';
  const borderColor = isDarkMode ? '#334155' : '#e5e7eb';
  
  modalContent.style.cssText = `
    background: ${bgColor};
    color: ${textColor};
    border-radius: 12px;
    padding: 30px;
    max-width: 700px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, ${isDarkMode ? '0.6' : '0.3'});
    border: 1px solid ${borderColor};
    animation: slideUp 0.3s ease;
  `;
  
  // Theme-aware colors
  const titleColor = isDarkMode ? '#e2e8f0' : '#333';
  const buttonColor = isDarkMode ? '#94a3b8' : '#666';
  const buttonHoverBg = isDarkMode ? '#334155' : '#f5f5f5';
  const boxBg = isDarkMode ? '#0f172a' : '#f5f5f5';
  const labelColor = isDarkMode ? '#94a3b8' : '#666';
  const cardBg = isDarkMode ? '#0f172a' : 'white';
  const cardBorder = isDarkMode ? '#334155' : '#e5e7eb';
  const linkColor = isDarkMode ? '#60a5fa' : '#2196f3';
  const numberColor = isDarkMode ? '#64748b' : '#999';
  
  // Build modal HTML
  let html = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2 style="margin: 0; color: ${titleColor};">🔗 External Links Found</h2>
      <button class="modal-close-btn" style="background: none; border: none; font-size: 28px; cursor: pointer; color: ${buttonColor}; padding: 0; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s;">×</button>
    </div>
  `;
  
  if (externalLinksData.links && externalLinksData.links.length > 0) {
    html += `
      <div style="background: ${boxBg}; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid ${cardBorder};">
        <div style="display: flex; justify-content: space-between;">
          <span style="font-weight: bold; color: ${labelColor};">Total External Links:</span>
          <span style="font-weight: bold; color: ${linkColor}; font-size: 18px;">${externalLinksData.links.length}</span>
        </div>
      </div>
      
      <h3 style="margin-top: 0; color: ${labelColor}; font-size: 16px; margin-bottom: 15px;">Link List:</h3>
      <div style="max-height: 400px; overflow-y: auto;">
    `;
    
    externalLinksData.links.forEach((link, index) => {
      const displayUrl = link.length > 80 ? link.substring(0, 77) + '...' : link;
      html += `
        <div style="background: ${cardBg}; border-left: 4px solid ${linkColor}; padding: 12px 15px; margin-bottom: 10px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,${isDarkMode ? '0.3' : '0.1'}); border: 1px solid ${cardBorder};">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
            <span style="color: ${numberColor}; font-size: 12px; min-width: 30px;">#${index + 1}</span>
            <a href="${link}" target="_blank" rel="noopener noreferrer" style="color: ${linkColor}; text-decoration: none; flex: 1; word-break: break-all; font-size: 14px;" title="${link}">${displayUrl}</a>
            <span style="font-size: 18px;">🔗</span>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
  } else {
    html += `<div style="text-align: center; color: ${labelColor}; padding: 20px;">No external links detected on this page</div>`;
  }
  
  modalContent.innerHTML = html;
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // Add CSS animations and styling
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    .modal-close-btn:hover {
      background: ${buttonHoverBg} !important;
      color: ${isDarkMode ? '#e2e8f0' : '#333'} !important;
    }
    .details-modal-content::-webkit-scrollbar {
      width: 10px;
    }
    .details-modal-content::-webkit-scrollbar-track {
      background: ${isDarkMode ? '#0f172a' : '#f5f5f5'};
      border-radius: 10px;
    }
    .details-modal-content::-webkit-scrollbar-thumb {
      background: ${isDarkMode ? '#475569' : '#cbd5e1'};
      border-radius: 10px;
    }
    .details-modal-content::-webkit-scrollbar-thumb:hover {
      background: ${isDarkMode ? '#64748b' : '#94a3b8'};
    }
  `;
  document.head.appendChild(style);
  
  // Close modal on overlay click or close button
  const closeModal = () => {
    modal.style.animation = 'fadeOut 0.2s ease';
    setTimeout(() => {
      document.body.removeChild(modal);
      document.head.removeChild(style);
    }, 200);
  };
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  modalContent.querySelector('.modal-close-btn').addEventListener('click', closeModal);
}

/**
 * Show risk score breakdown in a modal
 */
function showRiskScoreModal(scanData) {
  // Check if dark mode is active
  const isDarkMode = document.body.classList.contains('theme-dark');
  
  // Create modal overlay
  const modal = document.createElement('div');
  modal.className = 'details-modal-overlay';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, ${isDarkMode ? '0.85' : '0.7'});
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.2s ease;
  `;
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'details-modal-content';
  const bgColor = isDarkMode ? '#1e293b' : 'white';
  const textColor = isDarkMode ? '#e2e8f0' : '#333';
  const borderColor = isDarkMode ? '#334155' : '#e5e7eb';
  
  modalContent.style.cssText = `
    background: ${bgColor};
    color: ${textColor};
    border-radius: 12px;
    padding: 30px;
    max-width: 650px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, ${isDarkMode ? '0.6' : '0.3'});
    border: 1px solid ${borderColor};
    animation: slideUp 0.3s ease;
  `;
  
  // Theme-aware colors
  const titleColor = isDarkMode ? '#e2e8f0' : '#333';
  const buttonColor = isDarkMode ? '#94a3b8' : '#666';
  const buttonHoverBg = isDarkMode ? '#334155' : '#f5f5f5';
  const boxBg = isDarkMode ? '#0f172a' : '#f5f5f5';
  const labelColor = isDarkMode ? '#94a3b8' : '#666';
  const cardBg = isDarkMode ? '#0f172a' : 'white';
  const cardBorder = isDarkMode ? '#334155' : '#e5e7eb';
  
  // Determine status color
  const statusColor = scanData.status === 'safe' ? '#4caf50' : 
                     scanData.status === 'caution' ? '#ff9800' : '#f44336';
  
  // Calculate Risk Level (inverse of Safety Score)
  const riskLevel = 100 - scanData.safetyRating;
  
  // Get heuristic data - the ACTUAL score calculated by the backend
  const heuristicScore = scanData.localScan && scanData.localScan.heuristics ? (scanData.localScan.heuristics.score || 0) : 0;
  const heuristicFlags = scanData.localScan && scanData.localScan.heuristics ? (scanData.localScan.heuristics.flags || []) : [];
  
  // Get additional data for detailed Step 3 breakdown
  const externalLinks = scanData.externalLinks || (scanData.localScan && scanData.localScan.externalLinks ? scanData.localScan.externalLinks.count : null);
  const misspellings = scanData.misspellings || 0;
  const categoryTrusted = scanData.categoryTrusted || false;
  
  // Reconstruct the Step 3 calculation to show EXACTLY what happened
  let step3StartingSafety = 100 - heuristicScore;
  let step3CurrentSafety = step3StartingSafety;
  const step3Penalties = [];
  
  // Check for external links penalties
  if (typeof externalLinks === 'number') {
    if (externalLinks > 50) {
      step3Penalties.push({
        name: 'High External Links',
        detail: `${externalLinks} external links detected (> 50 threshold)`,
        penalty: 20,
        formula: `${step3CurrentSafety}% - 20% = ${step3CurrentSafety - 20}%`
      });
      step3CurrentSafety -= 20;
    } else if (externalLinks > 20) {
      step3Penalties.push({
        name: 'Many External Links',
        detail: `${externalLinks} external links detected (> 20 threshold)`,
        penalty: 12,
        formula: `${step3CurrentSafety}% - 12% = ${step3CurrentSafety - 12}%`
      });
      step3CurrentSafety -= 12;
    } else if (externalLinks > 10) {
      step3Penalties.push({
        name: 'Some External Links',
        detail: `${externalLinks} external links detected (> 10 threshold)`,
        penalty: 6,
        formula: `${step3CurrentSafety}% - 6% = ${step3CurrentSafety - 6}%`
      });
      step3CurrentSafety -= 6;
    }
  }
  
  // Check for misspellings penalty
  if (misspellings > 0) {
    step3Penalties.push({
      name: 'Misspellings Detected',
      detail: `${misspellings} common misspellings found`,
      penalty: 10,
      formula: `${step3CurrentSafety}% - 10% = ${step3CurrentSafety - 10}%`
    });
    step3CurrentSafety -= 10;
  }
  
  // Check for blocklist cap
  if (scanData.localScan && scanData.localScan.blocklist && scanData.localScan.blocklist.match) {
    const beforeCap = step3CurrentSafety;
    step3CurrentSafety = Math.min(step3CurrentSafety, 25);
    if (beforeCap > 25) {
      step3Penalties.push({
        name: 'Blocklist Match',
        detail: 'URL found in blocklist database',
        penalty: beforeCap - 25,
        formula: `min(${beforeCap}%, 25%) = 25%`,
        isCap: true
      });
    }
  }
  
  // Check for GSB cap
  if (scanData.localScan && scanData.localScan.gsb && scanData.localScan.gsb.verdict === 'unsafe') {
    const beforeCap = step3CurrentSafety;
    step3CurrentSafety = Math.min(step3CurrentSafety, 20);
    if (beforeCap > 20) {
      step3Penalties.push({
        name: 'Google Safe Browsing Threat',
        detail: 'Flagged as unsafe by Google',
        penalty: beforeCap - 20,
        formula: `min(${beforeCap}%, 20%) = 20%`,
        isCap: true
      });
    }
  }
  
  // Check for trusted category reduction
  if (categoryTrusted && step3CurrentSafety < 100) {
    const beforeReduction = step3CurrentSafety;
    const riskPortion = 100 - step3CurrentSafety;
    const reducedRisk = Math.round(riskPortion * 0.6);
    step3CurrentSafety = 100 - reducedRisk;
    step3Penalties.push({
      name: 'Trusted Category Bonus',
      detail: 'Site in trusted category, risk reduced by 40%',
      penalty: -(step3CurrentSafety - beforeReduction),
      formula: `Risk: ${riskPortion} × 0.6 = ${reducedRisk}, Safety: 100 - ${reducedRisk} = ${step3CurrentSafety}%`,
      isBonus: true
    });
  }
  
  // Calculate any remaining unexplained difference
  const unexplainedDiff = step3CurrentSafety - scanData.safetyRating;
  if (Math.abs(unexplainedDiff) > 0.5) {
    step3Penalties.push({
      name: 'Additional Adjustments',
      detail: 'Other risk factors or rounding adjustments',
      penalty: unexplainedDiff,
      formula: `${step3CurrentSafety}% → ${scanData.safetyRating}%`
    });
  }
  
  // Flag point values (MUST match backend exactly!)
  const flagPoints = {
    'http_not_encrypted': 100,
    'ip_literal_host': 30,
    'ip_address': 30,  // Alternative name
    'punycode_host': 15,
    'punycode': 15,  // Alternative name
    'suspicious_tld': 10,
    'many_subdomains': 10,
    'many_hyphens': 8,
    'long_hostname': 8,
    'long_path': 6,
    'long_query': 6,
    'high_host_entropy': 10,
    'high_path_entropy': 6,
    'at_in_path': 8,
    'many_encoded_chars': 6,
    'link_shortener': 6,
    'phishy_keywords': 10,
    'phishing_keywords': 10,  // Alternative name
    'tld_help_with_reward_pattern': 12,
    'suspicious_patterns': 12,  // Alternative name
    'typosquat_leetspeak': 14
  };
  
  // Calculate the ACTUAL total from detected flags to verify
  let calculatedTotal = 0;
  heuristicFlags.forEach(flag => {
    calculatedTotal += (flagPoints[flag] || 0);
  });
  
  // Build modal HTML
  let html = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2 style="margin: 0; color: ${titleColor};">📊 Risk Score Breakdown</h2>
      <button class="modal-close-btn" style="background: none; border: none; font-size: 28px; cursor: pointer; color: ${buttonColor}; padding: 0; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.2s;">×</button>
    </div>
    
    <div style="background: ${boxBg}; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid ${cardBorder};">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="font-weight: bold; color: ${labelColor};">Safety Score:</span>
        <span style="font-weight: bold; color: ${statusColor}; font-size: 18px;">${scanData.safetyRating}%</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="font-weight: bold; color: ${labelColor};">Risk Level:</span>
        <span style="font-weight: bold; color: ${statusColor}; text-transform: uppercase;">${scanData.risk} (${riskLevel})</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span style="font-weight: bold; color: ${labelColor};">Status:</span>
        <span style="font-weight: bold; color: ${statusColor}; text-transform: uppercase;">${scanData.status}</span>
      </div>
    </div>
    
    <h3 style="margin-top: 0; color: ${titleColor}; font-size: 18px; margin-bottom: 15px; text-align: center; border-bottom: 2px solid ${statusColor}; padding-bottom: 10px;">🧮 COMPLETE CALCULATION - Step by Step Formula</h3>
     
    <!-- Show EVERY factor that contributes to risk -->
    <div style="background: ${cardBg}; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 2px solid ${statusColor};">
      
      <!-- SECTION 1: URL PATTERN ANALYSIS (Heuristics) -->
      <div style="background: ${boxBg}; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ff9800;">
        <div style="color: ${textColor}; margin-bottom: 12px;">
          <strong style="color: #ff9800; font-size: 16px;">📍 STEP 1: URL Pattern Analysis (Heuristics)</strong><br>
          <span style="color: ${labelColor}; font-size: 13px;">Scanning the URL for suspicious patterns...</span>
        </div>
        
        ${heuristicFlags.length > 0 ? `
          <div style="background: ${isDarkMode ? '#0f172a' : 'white'}; padding: 12px; border-radius: 6px; margin-bottom: 12px;">
            <div style="color: ${labelColor}; font-size: 13px; margin-bottom: 10px;">
              <strong>Detected Patterns:</strong>
            </div>
            ${heuristicFlags.map((flag, index) => {
              const points = flagPoints[flag] || 0;
              const flagName = flag.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              return `
                <div style="padding: 8px; margin-bottom: 6px; background: ${isDarkMode ? '#1e293b' : '#f9fafb'}; border-radius: 4px; border-left: 3px solid #ff9800;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: ${textColor}; font-size: 14px; font-weight: 500;">${index + 1}. ${flagName}</span>
                    <span style="color: #ff9800; font-weight: bold; font-size: 16px;">+${points} pts</span>
                  </div>
                  <div style="color: ${labelColor}; font-size: 12px; margin-top: 4px; font-style: italic;">
                    Risk contribution: ${points} points
                  </div>
                </div>
              `;
            }).join('')}
            
            <div style="border-top: 2px solid ${cardBorder}; margin-top: 15px; padding-top: 15px;">
              <div style="background: ${isDarkMode ? '#1e293b' : '#fff3cd'}; padding: 12px; border-radius: 6px; border: 2px solid #ff9800;">
                <div style="color: ${textColor}; font-size: 15px; font-family: 'Courier New', monospace; line-height: 2;">
                  <strong style="color: ${labelColor};">Calculation:</strong><br>
                  ${heuristicFlags.map((flag, index) => {
                    const points = flagPoints[flag] || 0;
                    return `${index > 0 ? '+ ' : ''}${points}`;
                  }).join(' ')} = <strong style="color: #ff9800; font-size: 18px;">${calculatedTotal} points</strong>
                </div>
                <div style="color: ${labelColor}; font-size: 12px; margin-top: 8px; text-align: center;">
                  Total Heuristic Risk Points
                </div>
              </div>
            </div>
          </div>
        ` : `
          <div style="background: ${isDarkMode ? '#0f172a' : '#e8f5e9'}; padding: 12px; border-radius: 6px; border: 2px solid #4caf50;">
            <div style="color: #4caf50; font-size: 14px; font-weight: 500; text-align: center;">
              ✅ No suspicious patterns detected
            </div>
            <div style="color: ${labelColor}; font-size: 13px; margin-top: 8px; text-align: center; font-family: 'Courier New', monospace;">
              Heuristic Risk = <strong style="color: #4caf50;">0 points</strong>
            </div>
          </div>
        `}
        
        <div style="background: ${isDarkMode ? '#1e293b' : '#f9fafb'}; padding: 12px; border-radius: 6px; margin-top: 12px; border: 2px solid ${statusColor};">
          <div style="color: ${textColor}; font-size: 14px; text-align: center;">
            <strong style="color: ${labelColor};">STEP 1 RESULT:</strong><br>
            <span style="font-size: 20px; font-weight: bold; color: ${statusColor};">${heuristicScore} Heuristic Points</span>
          </div>
        </div>
      </div>
      
      <!-- SECTION 2: BASE SAFETY SCORE CALCULATION -->
      <div style="background: ${boxBg}; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #2196f3;">
        <div style="color: ${textColor}; margin-bottom: 12px;">
          <strong style="color: #2196f3; font-size: 16px;">📍 STEP 2: Calculate Base Safety Score</strong><br>
          <span style="color: ${labelColor}; font-size: 13px;">Convert heuristic risk to safety percentage...</span>
        </div>
        
        <div style="background: ${isDarkMode ? '#0f172a' : 'white'}; padding: 15px; border-radius: 6px;">
          <div style="color: ${labelColor}; font-size: 13px; margin-bottom: 10px;">
            <strong>Formula:</strong>
          </div>
          <div style="background: ${isDarkMode ? '#1e293b' : '#e3f2fd'}; padding: 15px; border-radius: 6px; border: 2px solid #2196f3; font-family: 'Courier New', monospace;">
            <div style="color: ${textColor}; font-size: 15px; line-height: 2;">
              Safety Score = 100 - Heuristic Points<br>
              <span style="color: ${labelColor};">↓ Substitute values ↓</span><br>
              Safety Score = 100 - ${heuristicScore}<br>
              <span style="color: ${labelColor};">↓ Calculate ↓</span><br>
              Safety Score = <strong style="color: #2196f3; font-size: 18px;">${100 - heuristicScore}%</strong>
            </div>
          </div>
          
          <div style="color: ${labelColor}; font-size: 12px; margin-top: 10px; text-align: center;">
            💡 Lower heuristic risk = Higher safety
          </div>
        </div>
        
        <div style="background: ${isDarkMode ? '#1e293b' : '#f9fafb'}; padding: 12px; border-radius: 6px; margin-top: 12px; border: 2px solid #2196f3;">
          <div style="color: ${textColor}; font-size: 14px; text-align: center;">
            <strong style="color: ${labelColor};">STEP 2 RESULT:</strong><br>
            <span style="font-size: 20px; font-weight: bold; color: #2196f3;">${100 - heuristicScore}% Safety</span>
          </div>
        </div>
      </div>
      
      <!-- SECTION 3: ADDITIONAL SECURITY CHECKS AND PENALTIES -->
      <div style="background: ${boxBg}; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #9c27b0;">
        <div style="color: ${textColor}; margin-bottom: 12px;">
          <strong style="color: #9c27b0; font-size: 16px;">📍 STEP 3: Apply ALL Penalties & Adjustments</strong><br>
          <span style="color: ${labelColor}; font-size: 13px;">Every single factor that affects the final safety score...</span>
        </div>
        
        <div style="background: ${isDarkMode ? '#0f172a' : 'white'}; padding: 15px; border-radius: 6px;">
          
          <!-- Starting Point -->
          <div style="background: ${isDarkMode ? '#1e293b' : '#e3f2fd'}; padding: 12px; border-radius: 6px; margin-bottom: 15px; border: 2px solid #2196f3;">
            <div style="color: ${textColor}; font-size: 15px; font-weight: 600; margin-bottom: 8px;">
              🎬 STARTING POINT (from Step 2):
            </div>
            <div style="color: ${labelColor}; font-size: 16px; font-family: 'Courier New', monospace; text-align: center; padding: 10px; background: ${isDarkMode ? '#0f172a' : 'white'}; border-radius: 4px;">
              <strong style="color: #2196f3; font-size: 24px;">${step3StartingSafety}%</strong> Safety Score
            </div>
          </div>
          
          ${step3Penalties.length > 0 ? `
            <!-- Show EACH penalty step by step -->
            <div style="margin-bottom: 15px;">
              <div style="color: ${textColor}; font-size: 14px; font-weight: 600; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 2px solid ${cardBorder};">
                ⚡ PENALTIES & ADJUSTMENTS APPLIED:
              </div>
              
              ${step3Penalties.map((penalty, index) => {
                const isBonus = penalty.isBonus || penalty.penalty < 0;
                const penaltyColor = penalty.isCap ? '#f44336' : (isBonus ? '#4caf50' : '#ff9800');
                const icon = penalty.isCap ? '🚫' : (isBonus ? '✨' : '⚠️');
                const sign = isBonus ? '+' : '-';
                const absValue = Math.abs(penalty.penalty);
                
                return `
                  <div style="background: ${isDarkMode ? '#1e293b' : '#fafafa'}; padding: 12px; border-radius: 6px; margin-bottom: 10px; border-left: 4px solid ${penaltyColor};">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                      <div>
                        <div style="color: ${textColor}; font-size: 14px; font-weight: 600;">
                          ${icon} ${index + 1}. ${penalty.name}
                        </div>
                        <div style="color: ${labelColor}; font-size: 12px; margin-top: 4px;">
                          ${penalty.detail}
                        </div>
                      </div>
                      <div style="background: ${penaltyColor}20; padding: 8px 12px; border-radius: 6px; border: 2px solid ${penaltyColor};">
                        <span style="color: ${penaltyColor}; font-weight: bold; font-size: 16px;">
                          ${sign}${absValue.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    <div style="background: ${isDarkMode ? '#0f172a' : 'white'}; padding: 10px; border-radius: 4px; margin-top: 8px;">
                      <div style="color: ${labelColor}; font-size: 13px; font-family: 'Courier New', monospace; line-height: 1.8;">
                        <strong style="color: ${textColor};">Calculation:</strong><br>
                        ${penalty.formula}
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            
            <!-- Show the step-by-step progression -->
            <div style="background: ${isDarkMode ? '#1e293b' : '#fff3e0'}; padding: 15px; border-radius: 6px; margin-bottom: 15px; border: 2px solid #ff9800;">
              <div style="color: ${textColor}; font-size: 14px; font-weight: 600; margin-bottom: 10px;">
                📊 COMPLETE STEP-BY-STEP CALCULATION:
              </div>
              <div style="background: ${isDarkMode ? '#0f172a' : 'white'}; padding: 12px; border-radius: 4px; font-family: 'Courier New', monospace; font-size: 13px; line-height: 2;">
                <div style="color: ${labelColor};">
                  <strong style="color: #2196f3;">Start:</strong> ${step3StartingSafety}%<br>
                  ${step3Penalties.map((penalty, index) => {
                    const isBonus = penalty.isBonus || penalty.penalty < 0;
                    const sign = isBonus ? '+' : '-';
                    const absValue = Math.abs(penalty.penalty);
                    let runningTotal = step3StartingSafety;
                    
                    // Calculate running total up to this point
                    for (let i = 0; i <= index; i++) {
                      if (step3Penalties[i].isBonus || step3Penalties[i].penalty < 0) {
                        runningTotal += Math.abs(step3Penalties[i].penalty);
                      } else {
                        runningTotal -= Math.abs(step3Penalties[i].penalty);
                      }
                    }
                    
                    return `<strong style="color: ${isBonus ? '#4caf50' : (penalty.isCap ? '#f44336' : '#ff9800')}">${sign}${absValue.toFixed(1)}%</strong> ${penalty.name} → <strong style="color: ${textColor}">${runningTotal.toFixed(1)}%</strong><br>`;
                  }).join('')}
                  <div style="border-top: 2px solid ${cardBorder}; margin: 10px 0; padding-top: 10px;">
                    <strong style="color: #9c27b0; font-size: 15px;">FINAL:</strong> <strong style="color: #9c27b0; font-size: 18px;">${scanData.safetyRating}%</strong>
                  </div>
                </div>
              </div>
            </div>
          ` : `
            <!-- No penalties applied -->
            <div style="background: ${isDarkMode ? '#1e293b' : '#e8f5e9'}; padding: 15px; border-radius: 6px; border: 2px solid #4caf50; text-align: center;">
              <div style="color: #4caf50; font-size: 16px; font-weight: 600; margin-bottom: 8px;">
                ✅ NO PENALTIES APPLIED
              </div>
              <div style="color: ${labelColor}; font-size: 14px;">
                No external links penalties, no blocklist match, no GSB threats detected
              </div>
              <div style="color: ${textColor}; font-size: 13px; margin-top: 10px; font-family: 'Courier New', monospace;">
                Safety remains: <strong style="color: #4caf50; font-size: 16px;">${step3StartingSafety}%</strong>
              </div>
            </div>
          `}
          
          <!-- Final Result Box -->
          <div style="background: linear-gradient(135deg, ${isDarkMode ? '#1e293b' : '#f3e5f5'} 0%, ${isDarkMode ? '#0f172a' : '#e1bee7'} 100%); padding: 15px; border-radius: 8px; border: 3px solid #9c27b0; text-align: center;">
            <div style="color: ${labelColor}; font-size: 13px; margin-bottom: 8px;">
              🎯 STEP 3 FINAL RESULT
            </div>
            <div style="color: #9c27b0; font-size: 28px; font-weight: bold; margin-bottom: 8px;">
              ${scanData.safetyRating}%
            </div>
            <div style="color: ${labelColor}; font-size: 13px;">
              Final Safety Score
              ${step3StartingSafety !== scanData.safetyRating ? 
                `<br>(Changed from ${step3StartingSafety}% by ${(scanData.safetyRating - step3StartingSafety).toFixed(1)}%)` : ''}
            </div>
          </div>
        </div>
      </div>
      
      <!-- SECTION 4: FINAL RISK CALCULATION -->
      <div style="background: ${boxBg}; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid ${statusColor};">
        <div style="color: ${textColor}; margin-bottom: 12px;">
          <strong style="color: ${statusColor}; font-size: 16px;">📍 STEP 4: Calculate Final Risk Level</strong><br>
          <span style="color: ${labelColor}; font-size: 13px;">Convert final safety to risk score...</span>
        </div>
        
        <div style="background: ${isDarkMode ? '#0f172a' : 'white'}; padding: 15px; border-radius: 6px;">
          <div style="color: ${labelColor}; font-size: 13px; margin-bottom: 10px;">
            <strong>Formula:</strong>
          </div>
          <div style="background: ${isDarkMode ? '#1e293b' : statusColor === '#4caf50' ? '#e8f5e9' : (statusColor === '#ff9800' ? '#fff3e0' : '#ffebee')}; padding: 15px; border-radius: 6px; border: 2px solid ${statusColor}; font-family: 'Courier New', monospace;">
            <div style="color: ${textColor}; font-size: 16px; line-height: 2.2;">
              Risk Level = 100 - Final Safety Score<br>
              <span style="color: ${labelColor}; font-size: 14px;">↓ Substitute values ↓</span><br>
              Risk Level = 100 - ${scanData.safetyRating}%<br>
              <span style="color: ${labelColor}; font-size: 14px;">↓ Calculate ↓</span><br>
              Risk Level = <strong style="color: ${statusColor}; font-size: 22px; background: ${isDarkMode ? '#0f172a' : 'white'}; padding: 8px 16px; border-radius: 6px; border: 2px solid ${statusColor};">${riskLevel}</strong>
            </div>
          </div>
          
          <div style="color: ${labelColor}; font-size: 12px; margin-top: 10px; text-align: center;">
            💡 Higher safety = Lower risk
          </div>
        </div>
        
        <div style="background: ${isDarkMode ? '#1e293b' : '#f9fafb'}; padding: 12px; border-radius: 6px; margin-top: 12px; border: 2px solid ${statusColor};">
          <div style="color: ${textColor}; font-size: 14px; text-align: center;">
            <strong style="color: ${labelColor};">STEP 4 RESULT:</strong><br>
            <span style="font-size: 20px; font-weight: bold; color: ${statusColor};">Risk Level ${riskLevel}</span>
          </div>
        </div>
      </div>
      
      <!-- FINAL SUMMARY BOX -->
      <div style="background: linear-gradient(135deg, ${isDarkMode ? '#1e293b' : '#f0f9ff'} 0%, ${isDarkMode ? '#0f172a' : '#e0f2fe'} 100%); padding: 20px; border-radius: 8px; border: 3px solid ${statusColor}; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        <div style="text-align: center;">
          <div style="color: ${statusColor}; font-size: 18px; font-weight: bold; margin-bottom: 15px;">
            🎯 COMPLETE CALCULATION SUMMARY
          </div>
          
          <div style="background: ${isDarkMode ? '#0f172a' : 'white'}; padding: 15px; border-radius: 8px; margin-bottom: 15px; border: 2px solid ${cardBorder};">
            <div style="color: ${textColor}; font-size: 14px; line-height: 2; font-family: 'Courier New', monospace; text-align: left;">
              <strong style="color: ${labelColor};">Step 1:</strong> Heuristic Analysis = ${heuristicScore} points<br>
              <strong style="color: ${labelColor};">Step 2:</strong> Base Safety = 100 - ${heuristicScore} = ${100 - heuristicScore}%<br>
              ${scanData.localScan && scanData.localScan.blocklist && scanData.localScan.blocklist.match ? 
                `<strong style="color: ${labelColor};">Step 3a:</strong> Blocklist Cap = min(${100 - heuristicScore}%, 25%) = 25%<br>` : ''}
              ${scanData.localScan && scanData.localScan.gsb && scanData.localScan.gsb.verdict === 'unsafe' ? 
                `<strong style="color: ${labelColor};">Step 3b:</strong> GSB Cap = min(${scanData.localScan.blocklist && scanData.localScan.blocklist.match ? '25' : (100 - heuristicScore)}%, 20%) = 20%<br>` : ''}
              <strong style="color: ${labelColor};">Step 3:</strong> Final Safety = ${scanData.safetyRating}%<br>
              <strong style="color: ${labelColor};">Step 4:</strong> Risk Level = 100 - ${scanData.safetyRating}% = <strong style="color: ${statusColor}; font-size: 16px;">${riskLevel}</strong>
            </div>
          </div>
          
          <div style="background: ${statusColor}20; padding: 15px; border-radius: 8px; border: 2px solid ${statusColor};">
            <div style="color: ${textColor}; font-size: 16px; margin-bottom: 8px;">
              <strong>FINAL ANSWER:</strong>
            </div>
            <div style="color: ${statusColor}; font-size: 28px; font-weight: bold; margin-bottom: 8px;">
              Risk Level: ${riskLevel}
            </div>
            <div style="color: ${labelColor}; font-size: 14px;">
              ${heuristicFlags.length > 0 ? 
                `Based on ${heuristicFlags.length} detected pattern${heuristicFlags.length > 1 ? 's' : ''} (${heuristicScore} pts)` : 
                'No suspicious patterns detected'}
            </div>
          </div>
        </div>
      </div>
    </div>
          <span style="color: ${labelColor}; font-size: 13px; margin-top: 8px; display: block;">
            ${heuristicFlags.length > 0 ? `${heuristicFlags.length} detected pattern${heuristicFlags.length > 1 ? 's' : ''} totaling ${heuristicScore} heuristic points` : 'No suspicious patterns detected (0 points)'}
          </span>
        </div>
      </div>
    </div>
    
    <h3 style="margin-top: 0; color: ${labelColor}; font-size: 16px; margin-bottom: 15px;">🔍 Security Checks:</h3>
  `;
  
  // Build checks array
  const checks = [];
  
  // Heuristic Analysis
  if (scanData.localScan && scanData.localScan.heuristics && !scanData.localScan.heuristics.skipped) {
    const heur = scanData.localScan.heuristics;
    const heurScore = heur.score || 0;
    const heurStatus = heurScore === 0 ? 'safe' : (heurScore >= 35 ? 'unsafe' : (heurScore >= 18 ? 'caution' : 'safe'));
    const heurColor = heurStatus === 'safe' ? '#4caf50' : (heurStatus === 'caution' ? '#ff9800' : '#f44336');
    checks.push({
      icon: '🧠',
      name: 'Heuristic Analysis',
      score: `${heurScore}/100 risk points`,
      detail: `${heur.flags ? heur.flags.length : 0} flags detected`,
      status: heurStatus,
      color: heurColor
    });
  }
  
  // Google Safe Browsing
  if (scanData.localScan && scanData.localScan.gsb && scanData.localScan.gsb.enabled) {
    const gsb = scanData.localScan.gsb;
    const gsbStatus = gsb.verdict === 'safe' ? 'safe' : 'unsafe';
    const gsbColor = gsbStatus === 'safe' ? '#4caf50' : '#f44336';
    checks.push({
      icon: '🛡️',
      name: 'Google Safe Browsing',
      score: gsb.verdict.toUpperCase(),
      detail: gsb.matches && gsb.matches.length > 0 ? `${gsb.matches.length} threats found` : 'No threats detected',
      status: gsbStatus,
      color: gsbColor
    });
  }
  
  // Blocklist Check
  if (scanData.localScan && scanData.localScan.blocklist) {
    const blocklist = scanData.localScan.blocklist;
    const blockStatus = blocklist.match ? 'unsafe' : 'safe';
    const blockColor = blockStatus === 'safe' ? '#4caf50' : '#f44336';
    checks.push({
      icon: '📋',
      name: 'Blocklist Check',
      score: blocklist.match ? 'BLOCKED' : 'CLEAN',
      detail: blocklist.match ? `Match: ${blocklist.type}` : 'Not in blocklist',
      status: blockStatus,
      color: blockColor
    });
  }
  
  // DNS Check
  if (scanData.localScan && scanData.localScan.dns && !scanData.localScan.dns.skipped) {
    const dns = scanData.localScan.dns;
    const dnsStatus = dns.ok ? 'safe' : 'unsafe';
    const dnsColor = dnsStatus === 'safe' ? '#4caf50' : '#f44336';
    checks.push({
      icon: '🌐',
      name: 'DNS Lookup',
      score: dns.ok ? 'RESOLVED' : 'FAILED',
      detail: dns.ok ? 'Domain resolves correctly' : dns.error || 'Resolution failed',
      status: dnsStatus,
      color: dnsColor
    });
  }
  
  // SSL/TLS Check
  if (scanData.localScan && scanData.localScan.tls && !scanData.localScan.tls.skipped) {
    const tls = scanData.localScan.tls;
    const tlsStatus = tls.ok ? 'safe' : 'unsafe';
    const tlsColor = tlsStatus === 'safe' ? '#4caf50' : '#f44336';
    let tlsDetail = tls.ok ? 'Valid certificate' : 'Invalid certificate';
    if (tls.daysToExpire !== null && tls.daysToExpire !== undefined) {
      if (tls.daysToExpire < 0) {
        tlsDetail = 'Certificate EXPIRED';
      } else if (tls.daysToExpire <= 7) {
        tlsDetail = `Expires in ${tls.daysToExpire} days ⚠️`;
      } else {
        tlsDetail = `Valid for ${tls.daysToExpire} days`;
      }
    }
    checks.push({
      icon: '🔒',
      name: 'SSL/TLS Certificate',
      score: tls.ok ? 'VALID' : 'INVALID',
      detail: tlsDetail,
      status: tlsStatus,
      color: tlsColor
    });
  }
  
  // HTTP/HTTPS Check
  if (scanData.localScan && scanData.localScan.http) {
    const http = scanData.localScan.http;
    const isHttps = http.finalUrl ? http.finalUrl.startsWith('https://') : false;
    const httpStatus = isHttps ? 'safe' : 'caution';
    const httpColor = httpStatus === 'safe' ? '#4caf50' : '#ff9800';
    checks.push({
      icon: '🔐',
      name: 'Protocol Security',
      score: isHttps ? 'HTTPS' : 'HTTP',
      detail: isHttps ? 'Encrypted connection' : 'Unencrypted connection',
      status: httpStatus,
      color: httpColor
    });
  }
  
  // Render all checks
  checks.forEach(check => {
    html += `
      <div style="background: ${cardBg}; border-left: 4px solid ${check.color}; padding: 15px; margin-bottom: 12px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,${isDarkMode ? '0.3' : '0.1'}); border: 1px solid ${cardBorder};">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
          <div style="flex: 1;">
            <div style="font-weight: bold; color: ${textColor}; margin-bottom: 4px;">${check.icon} ${check.name}</div>
            <div style="color: ${labelColor}; font-size: 14px;">${check.detail}</div>
          </div>
          <span style="background: ${check.color}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold; white-space: nowrap; margin-left: 10px;">${check.score}</span>
        </div>
      </div>
    `;
  });
  
  // If no checks available
  if (checks.length === 0) {
    html += `<div style="text-align: center; color: ${labelColor}; padding: 20px;">No detailed scan data available</div>`;
  }
  
  modalContent.innerHTML = html;
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // Add CSS animations and styling
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    .modal-close-btn:hover {
      background: ${buttonHoverBg} !important;
      color: ${isDarkMode ? '#e2e8f0' : '#333'} !important;
    }
    .details-modal-content::-webkit-scrollbar {
      width: 10px;
    }
    .details-modal-content::-webkit-scrollbar-track {
      background: ${isDarkMode ? '#0f172a' : '#f5f5f5'};
      border-radius: 10px;
    }
    .details-modal-content::-webkit-scrollbar-thumb {
      background: ${isDarkMode ? '#475569' : '#cbd5e1'};
      border-radius: 10px;
    }
    .details-modal-content::-webkit-scrollbar-thumb:hover {
      background: ${isDarkMode ? '#64748b' : '#94a3b8'};
    }
  `;
  document.head.appendChild(style);
  
  // Close modal on overlay click or close button
  const closeModal = () => {
    modal.style.animation = 'fadeOut 0.2s ease';
    setTimeout(() => {
      document.body.removeChild(modal);
      document.head.removeChild(style);
    }, 200);
  };
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  modalContent.querySelector('.modal-close-btn').addEventListener('click', closeModal);
}

// Override the existing setPageStatus function if it exists
if (typeof window.setPageStatus === 'function') {
  window.originalSetPageStatus = window.setPageStatus;
}
window.setPageStatus = setPageStatusEnhanced;

// Initialize display configuration on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for configManager to be ready
    setTimeout(() => {
      if (window.updateDisplayFromConfig) {
        window.updateDisplayFromConfig();
      }
    }, 100);
  });
} else {
  // DOM is already loaded
  setTimeout(() => {
    if (window.updateDisplayFromConfig) {
      window.updateDisplayFromConfig();
    }
  }, 100);
}