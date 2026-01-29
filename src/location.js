 // Minimal JavaScript just for interaction feedback
document.addEventListener('DOMContentLoaded', function() {
    // Add click feedback for dropdown items
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const text = this.textContent.trim();
            const button = this.closest('.dropdown').querySelector('.dropdown-toggle');
            
            // Visual feedback
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
                console.log(`Selected: ${text}`);
            }, 300);
        });
    });
    
    // Improve keyboard accessibility
    document.querySelectorAll('.dropdown-toggle').forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const dropdown = this.closest('.dropdown');
                dropdown.classList.toggle('active');
            }
        });
    });
});