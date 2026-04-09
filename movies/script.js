document.addEventListener('DOMContentLoaded', function() {
    const watchButtons = document.querySelectorAll('.watch-btn');
    
    function redirectToNetflix() {
        window.location.href = 'https://www.netflix.com';
    }
    
    watchButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            redirectToNetflix();
        });
    });
    
    const movieCards = document.querySelectorAll('.movie-card');
    movieCards.forEach(function(card) {
        card.addEventListener('click', function() {
            redirectToNetflix();
        });
    });
});
