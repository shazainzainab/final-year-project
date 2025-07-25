// Combined Hero JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Header Navigation
    const loginBtn = document.querySelector('.login-btn');
    const signinBtn = document.querySelector('.signin-btn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            console.log('Login button clicked');
            // Add login functionality here
        });
    }
    
    if (signinBtn) {
        signinBtn.addEventListener('click', function() {
            console.log('Sign in button clicked');
            // Add sign in functionality here
        });
    }
    
    // Hero Button
    const heroButton = document.querySelector('.hero-button');
    
    if (heroButton) {
        heroButton.addEventListener('click', function() {
            console.log('Get Started button clicked');
            // Add hero button functionality here
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    }
    
    
     // Trip Planning Action Buttons
    const actionButtons = document.querySelectorAll('.box-actions .action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log(`Action button clicked: ${this.textContent}`);
            // Add action button functionality here
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    })
    
    // Navigation Buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log(`Navigation button clicked: ${this.textContent}`);
            // Add navigation functionality here
            
            // Example: Add active state
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
// Combined Destinations JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.destination-card');
    const heartIcons = document.querySelectorAll('.card-icon');
    
    // Handle card clicks
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const cityName = this.querySelector('.city-name').textContent;
            console.log(`Card clicked: ${cityName}`);
            
            // Example: Redirect to destination details page
            // window.location.href = `/destination/${cityName.toLowerCase()}`;
        });
    });
    
    // Handle favorite button clicks
    heartIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click
            
            // Toggle favorite state
            this.classList.toggle('favorited');
            
            const cityName = this.closest('.destination-card').querySelector('.city-name').textContent;
            
            if (this.classList.contains('favorited')) {
                this.style.filter = 'drop-shadow(0 0 5px rgba(255, 0, 0, 0.7))';
                console.log(`Added ${cityName} to favorites`);
                // You could add to localStorage here
            } else {
                this.style.filter = '';
                console.log(`Removed ${cityName} from favorites`);
                // You could remove from localStorage here
            }
        });
    });
});
// Features & Recommendations JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Handle Sign In buttons
    const signInButtons = document.querySelectorAll('.sign-in-button');
    
    signInButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Sign in button clicked');
            // You can add sign-in functionality here
        });
    });
    
    // Handle form inputs
    const destinationInput = document.querySelector('.destination-input');
    const dateInput = document.querySelector('.date-input');
    
    if (destinationInput) {
        destinationInput.addEventListener('click', function() {
            console.log('Destination input clicked');
            // You can add destination selection functionality here
        });
    }
    
    if (dateInput) {
        dateInput.addEventListener('click', function() {
            console.log('Date input clicked');
            // You can add date picker functionality here
        });
    }
    
    // Handle nav items
    const navItems = document.querySelectorAll('.nav-items span');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            console.log(`Nav item clicked: ${this.textContent}`);
            // You can add navigation functionality here
        });
    });
});
    // Handle home icon
    const homeIcon = document.querySelector('.home-icon');
    
    if (homeIcon) {
        homeIcon.addEventListener('click', function() {
            console.log('Home icon clicked');
            // You can add home functionality here
        });
    }
    // Handle arrow icons
    const arrowIcons = document.querySelectorAll('.arrow-icon');
    
    arrowIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent parent click
            console.log('Arrow icon clicked');
            // You can add dropdown functionality here
        });
    });
    // recommendation section
    document.querySelector('.signin-button').addEventListener('click', function() {
  alert('Sign in button clicked!');
});
  
  document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".signin-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      console.log("Sign-in clicked");
      alert("Sign-in functionality coming soon!");
    });
  });
});
// Weather & CTA Sections JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Handle CTA button click
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            console.log('CTA button clicked');
            // You can add functionality here, such as:
            // - Redirecting to a signup page
            // - Opening a modal
            // - Triggering an animation
            
            // Example: Add a click effect
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    }
    
    // Add any additional interactivity here
    // For example, you could add hover effects to the weather section
    const weatherSection = document.querySelector('.weather-section');
    
    if (weatherSection) {
        weatherSection.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
        });
        
        weatherSection.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    }
});
// FAQ & Footer Sections JavaScript
// Update the FAQ JavaScript
document.addEventListener('DOMContentLoaded', function () {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const container = item.querySelector('.question-container');
    const arrowIcon = item.querySelector('.arrow-icon');
    const answer = item.querySelector('.faq-answer');
    
    // Function to toggle answer
    function toggleAnswer() {
      answer.classList.toggle('active');
      
      // Rotate arrow icon
      if (answer.classList.contains('active')) {
        arrowIcon.style.transform = 'rotate(180deg)';
      } else {
        arrowIcon.style.transform = 'rotate(0deg)';
      }
    }
    
    // Add click event to both question container and arrow icon
    container.addEventListener('click', toggleAnswer);
    arrowIcon.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent event bubbling
      toggleAnswer();
    });
  });
});


    // Footer Section - Add hover effects to links
    const footerLinks = document.querySelectorAll('.footer-nav-column a');
    
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = '#f8b400'; /* Yellow accent on hover */
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.color = 'white'; /* Back to white */
        });
    });
    
    // Footer Section - Add click functionality to navigation links
     document.addEventListener('DOMContentLoaded', function () {
    const footerLinks = document.querySelectorAll('.footer a');

    if (footerLinks.length > 0) {
      footerLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault(); // Prevents default anchor behavior
          console.log(`You clicked: ${this.textContent}`);
        });
      });
    } else {
      console.warn('No footer links found.');
    }
  });

    document.addEventListener('DOMContentLoaded', function () {
            try {
                // Sticky Header and Scroll Behavior
                const stickyHeader = document.getElementById('stickyHeader');
                const heroSection = document.querySelector('.hero-section');
                const tripSection = document.querySelector('.trip-planning-section');
                const exploreSection = document.querySelector('.explore-section');
                const exploreNav = document.querySelector('.explore-nav');
                const exploreHeading = document.querySelector('.explore-section h3');
                const brandContainer = document.querySelector('.brand-container');
                const navButtons = document.querySelector('.nav-buttons');

                // Check if all elements exist to prevent null errors
                if (!stickyHeader || !heroSection || !tripSection || !exploreSection || !exploreNav || !exploreHeading || !brandContainer || !navButtons) {
                    console.error('One or more DOM elements not found');
                    return;
                }

                function handleScroll() {
                    if (window.scrollY > 200) {
                        stickyHeader.classList.add('active');
                        heroSection.classList.add('hero-hidden');
                        tripSection.classList.add('trip-hidden');
                        exploreSection.classList.add('explore-fixed');
                        brandContainer.classList.add('hidden');
                        navButtons.classList.add('hidden');
                    } else {
                        stickyHeader.classList.remove('active');
                        heroSection.classList.remove('hero-hidden');
                        tripSection.classList.remove('trip-hidden');
                        exploreSection.classList.remove('explore-fixed');
                        brandContainer.classList.remove('hidden');
                        navButtons.classList.remove('hidden');
                    }
                }

                // Throttle scroll event for better performance
                let isThrottled = false;
                window.addEventListener('scroll', function () {
                    if (!isThrottled) {
                        handleScroll();
                        isThrottled = true;
                        setTimeout(() => { isThrottled = false; }, 100);
                    }
                });

                // Trigger initial scroll check
                handleScroll();

                // Button Interactions
                const loginBtn = document.querySelector('.login-btn');
                const signinBtn = document.querySelector('.signin-btn');
                const heroButton = document.querySelector('.hero-button');
                const stickySearch = document.getElementById('stickySearch');
                const askAnythingBtn = document.querySelector('.sticky-header .ask-anything-btn');

                if (loginBtn) {
                    loginBtn.addEventListener('click', () => console.log('Login clicked'));
                } else {
                    console.warn('Login button not found');
                }

                if (signinBtn) {
                    signinBtn.addEventListener('click', () => console.log('Sign in clicked')); // Changed to console.log for consistency
                } else {
                    console.warn('Sign-in button not found');
                }

                if (heroButton) {
                    heroButton.addEventListener('click', function () {
                        console.log('Get Started clicked');
                        this.style.transform = 'scale(0.95)';
                        setTimeout(() => this.style.transform = '', 200);
                    });
                } else {
                    console.warn('Hero button not found');
                }

                if (stickySearch) {
                    stickySearch.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            console.log('Search for:', e.target.value);
                        }
                    });
                } else {
                    console.warn('Sticky search input not found');
                }

                if (askAnythingBtn) {
                    askAnythingBtn.addEventListener('click', () => console.log('Ask Anything clicked'));
                } else {
                    console.warn('Ask Anything button not found');
                }

                // Action Buttons
                document.querySelectorAll('.box-actions .action-btn').forEach(btn => {
                    btn.addEventListener('click', function () {
                        console.log(`Action: ${this.textContent}`);
                        this.style.transform = 'scale(0.95)';
                        setTimeout(() => this.style.transform = '', 200);
                    });
                });

                // Navigation Buttons
                document.querySelectorAll('.nav-btn').forEach(button => {
                    button.addEventListener('click', function () {
                        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
                        this.classList.add('active');
                    });
                });

                // Destination Cards
                document.querySelectorAll('.destination-card').forEach(card => {
                    card.addEventListener('click', function () {
                        const city = this.querySelector('.city-name').textContent;
                        console.log(`Clicked: ${city}`);
                    });
                });

                document.querySelectorAll('.card-icon').forEach(icon => {
                    icon.addEventListener('click', function (e) {
                        e.stopPropagation();
                        this.classList.toggle('favorited');
                        const city = this.closest('.destination-card').querySelector('.city-name').textContent;
                        console.log(`${this.classList.contains('favorited') ? 'Added' : 'Removed'} ${city} from favorites`);
                        this.style.filter = this.classList.contains('favorited') ? 'drop-shadow(0 0 5px rgba(255, 0, 0, 0.7))' : '';
                    });
                });
            } catch (error) {
                console.error('An error occurred in the script:', error);
            }
        });

        const stickyHeader = document.getElementById('stickyHeader');
const heroSection = document.querySelector('.hero-section');

window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
        stickyHeader.classList.add('active');
    } else {
        stickyHeader.classList.remove('active');
    }
}); 


  // Sticky header login
  document.querySelectorAll('.login-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = "login.html"; // apna login page ka link daalo
    });
  });

 // Sign-in ke sab buttons ke liye direct redirect karna
   // Sticky header sign in
  document.addEventListener("DOMContentLoaded", function () {
  // Remove any existing click handlers to prevent conflicts
  document.querySelectorAll('.signin-btn, .login-btn, .signin-button').forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
  });
  
  // Add clean redirect to all sign-in buttons
  document.querySelectorAll('.signin-btn, .login-btn, .signin-button').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault(); // Stop all default behaviors
      e.stopPropagation(); // Stop event bubbling
      window.location.href = "Sign in.html"; // Direct redirect
    });
  });
});
  // Navbar Sign-in (jo features section mein hai)
  document.addEventListener("DOMContentLoaded", function () {
  // Remove any existing click handlers to prevent conflicts
  document.querySelectorAll('.signin-btn, .login-btn, .signin-button').forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
  });
  
  // Add clean redirect to all sign-in buttons
  document.querySelectorAll('.signin-btn, .login-btn, .signin-button').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault(); // Stop all default behaviors
      e.stopPropagation(); // Stop event bubbling
      window.location.href = "Sign in.html"; // Direct redirect
    });
  });
});

  // Footer signin (agar needed ho)
  document.addEventListener("DOMContentLoaded", function () {
  // Remove any existing click handlers to prevent conflicts
  document.querySelectorAll('.signin-btn, .login-btn, .signin-button').forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
  });
  
  // Add clean redirect to all sign-in buttons
  document.querySelectorAll('.signin-btn, .login-btn, .signin-button').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault(); // Stop all default behaviors
      e.stopPropagation(); // Stop event bubbling
      window.location.href = "Sign in.html"; // Direct redirect
    });
  });
});

document.querySelectorAll('.hero-button, .cta-button').forEach(btn => {
    btn.addEventListener('click', function() {
        window.location.href = 'recommendation form.html'; // yahan apna form page ka link do
    });
});