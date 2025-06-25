document.addEventListener('DOMContentLoaded', function() {
    const menu = document.getElementById('ec-mobile-menu');
    const overlay = document.querySelector('.ec-menu-overlay');
    const closeBtn = document.querySelector('.ec-close');
  
    // Toggle menu
    document.querySelector('.ec-side-toggle').addEventListener('click', function(e) {
      e.preventDefault();
      menu.classList.add('ec-open');
      overlay.classList.add('active');
    });
  
    // Close menu
    function closeMenu() {
      menu.classList.remove('ec-open');
      overlay.classList.remove('active');
    }
  
    // Close button
    closeBtn.addEventListener('click', closeMenu);
  
    // Overlay click
    overlay.addEventListener('click', closeMenu);
  
    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  });