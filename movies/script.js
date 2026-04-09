document.addEventListener('DOMContentLoaded', function() {
    const watchButtons = document.querySelectorAll('.watch-btn');
    const movieCards = document.querySelectorAll('.movie-card');
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    const moreBtn = document.getElementById('more-btn');
    const movieGrid = document.getElementById('movie-grid');

    // Additional movie data for "More" button
    const extraMovies = [
        {
            name: 'The Dark Knight',
            img: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
            movie: 'dark-knight'
        },
        {
            name: 'Pulp Fiction',
            img: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
            movie: 'pulp-fiction'
        },
        {
            name: 'Fight Club',
            img: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
            movie: 'fight-club'
        }
    ];

    let movieCount = 3; // Start with 3 movies

    function redirectToNetflix() {
        window.location.href = 'https://www.netflix.com';
    }

    // Add click listeners to all watch buttons
    function attachWatchListeners() {
        document.querySelectorAll('.watch-btn').forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                redirectToNetflix();
            });
        });
    }

    // Add click listeners to movie cards
    function attachCardListeners() {
        document.querySelectorAll('.movie-card').forEach(function(card) {
            card.addEventListener('click', function() {
                redirectToNetflix();
            });
        });
    }

    // Search functionality
    searchBtn.addEventListener('click', function() {
        const query = searchInput.value.toLowerCase();
        const cards = document.querySelectorAll('.movie-card');
        
        cards.forEach(function(card) {
            const title = card.querySelector('h3').textContent.toLowerCase();
            if (title.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });

    moreBtn.addEventListener('click', function() {
        extraMovies.forEach(function(movie) {
            if (movieCount < 6) { // Limit to prevent duplicates
                const card = document.createElement('div');
                card.className = 'movie-card';
                card.setAttribute('data-movie', movie.movie);
                
                card.innerHTML = `
                    <img src="${movie.img}" alt="${movie.name}">
                    <h3>${movie.name}</h3>
                    <button class="watch-btn">Watch Now</button>
                `;
                
                movieGrid.appendChild(card);
                movieCount++;
            }
        });
        
        // Re-attach listeners to new elements
        attachWatchListeners();
        attachCardListeners();
        
        if (movieCount >= 6) {
            moreBtn.disabled = true;
            moreBtn.textContent = 'No More Movies';
        }
    });

    // Initial attachment
    attachWatchListeners();
    attachCardListeners();
});
