// Spotify API Configuration
const SPOTIFY_CONFIG = {
  CLIENT_ID: '2c1000d85c774b8aa40bea2037284538', // You'll need to replace this
  CLIENT_SECRET: '39bd8b403efc481e9a21b8d0e2f558b8', // You'll need to replace this
  ARTIST_ID: '2iKYcrm8aZUZdkDC0nzN1G' // Your Spotify artist ID from the URL you provided
};

class SpotifyAPI {
  constructor() {
    this.accessToken = null;
  }

  // Get access token using Client Credentials flow
  async getAccessToken() {
    if (this.accessToken) {
      return this.accessToken;
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(SPOTIFY_CONFIG.CLIENT_ID + ':' + SPOTIFY_CONFIG.CLIENT_SECRET)
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    
    // Token expires in 1 hour, so we'll clear it after 55 minutes
    setTimeout(() => {
      this.accessToken = null;
    }, 55 * 60 * 1000);

    return this.accessToken;
  }

  // Get artist's newest album
  async getNewestAlbum(artistId) {
    const token = await this.getAccessToken();
    
    const albumsResponse = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&market=US&limit=20`,
      {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }
    );

    if (!albumsResponse.ok) {
      throw new Error('Failed to fetch albums');
    }

    const albumsData = await albumsResponse.json();
    
    // Sort by release date and get the newest album
    const sortedAlbums = albumsData.items.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    
    if (sortedAlbums.length === 0) return null;
    
    const newestAlbum = sortedAlbums[0];
    
    // Get tracks for the newest album
    const tracksResponse = await fetch(
      `https://api.spotify.com/v1/albums/${newestAlbum.id}/tracks`,
      {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }
    );

    if (tracksResponse.ok) {
      const tracksData = await tracksResponse.json();
      newestAlbum.tracks = tracksData.items;
    }

    return newestAlbum;
  }

  // Get artist's top tracks
  async getTopTracks(artistId) {
    const token = await this.getAccessToken();
    
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
      {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch top tracks');
    }

    const data = await response.json();
    return data.tracks.slice(0, 5); // Return top 5 tracks
  }
}

// Function to display newest album
async function displayNewestAlbum() {
  const container = document.getElementById('newest-album');
  
  try {
    const spotify = new SpotifyAPI();
    const album = await spotify.getNewestAlbum(SPOTIFY_CONFIG.ARTIST_ID);
    
    if (!album) {
      container.innerHTML = '<div class="error">No albums found</div>';
      return;
    }

    // Clear loading message
    container.innerHTML = '';
    
    const imageUrl = album.images && album.images.length > 0 
      ? album.images[0].url 
      : 'assets/logo.jpg';
    
    const releaseDate = new Date(album.release_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const albumCard = document.createElement('div');
    albumCard.className = 'newest-album-card';
    
    albumCard.innerHTML = `
      <div class="album-info">
        <img src="${imageUrl}" alt="${album.name}" class="album-cover">
        <div class="album-details">
          <h3>${album.name}</h3>
          <p class="album-type">${album.album_type.toUpperCase()}</p>
          <p class="release-date">Released: ${releaseDate}</p>
          <p class="track-count">${album.total_tracks} tracks</p>
          <a href="${album.external_urls.spotify}" target="_blank" class="album-link">
            <i class="fab fa-spotify"></i> Listen on Spotify
          </a>
        </div>
      </div>
      ${album.tracks ? `
        <div class="album-tracks">
          <h4>Tracks:</h4>
          <div class="tracks-list">
            ${album.tracks.map((track, index) => `
              <div class="track-item">
                <span class="track-number">${index + 1}.</span>
                <a href="${track.external_urls.spotify}" target="_blank" class="track-name">
                  ${track.name}
                </a>
                <span class="track-duration">${formatDuration(track.duration_ms)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
    
    container.appendChild(albumCard);
    
  } catch (error) {
    console.error('Error fetching newest album:', error);
    container.innerHTML = '<div class="error">Unable to load newest album</div>';
  }
}

// Function to display top tracks
async function displayTopTracks() {
  const container = document.getElementById('top-tracks');
  
  try {
    const spotify = new SpotifyAPI();
    const tracks = await spotify.getTopTracks(SPOTIFY_CONFIG.ARTIST_ID);
    
    if (tracks.length === 0) {
      container.innerHTML = '<div class="error">No top tracks found</div>';
      return;
    }

    // Clear loading message
    container.innerHTML = '';
    
    tracks.forEach((track, index) => {
      const trackCard = document.createElement('a');
      trackCard.className = 'track-card';
      trackCard.href = track.external_urls.spotify;
      trackCard.target = '_blank';
      
      const imageUrl = track.album.images && track.album.images.length > 0 
        ? track.album.images[0].url 
        : 'assets/logo.jpg';
      
      trackCard.innerHTML = `
        <div class="track-rank">#${index + 1}</div>
        <img src="${imageUrl}" alt="${track.name}" class="track-image">
        <div class="track-title">${track.name}</div>
        <div class="track-album">${track.album.name}</div>
        <div class="track-popularity">${track.popularity}% popularity</div>
      `;
      
      container.appendChild(trackCard);
    });
    
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    container.innerHTML = '<div class="error">Unable to load top tracks</div>';
  }
}

// Helper function to format duration
function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only try to load Spotify content if we have valid credentials
  if (SPOTIFY_CONFIG.CLIENT_ID !== 'YOUR_SPOTIFY_CLIENT_ID') {
    displayNewestAlbum();
    displayTopTracks();
  } else {
    // Show setup instructions if credentials aren't configured
    const newestContainer = document.getElementById('newest-album');
    const topContainer = document.getElementById('top-tracks');
    
    const setupMessage = `
      <div class="error">
        <h3>Spotify Integration Setup Required</h3>
        <p>To display your music, you need to:</p>
        <ol style="text-align: left; max-width: 600px; margin: 0 auto;">
          <li>Go to <a href="https://developer.spotify.com/dashboard" target="_blank">Spotify Developer Dashboard</a></li>
          <li>Create a new app</li>
          <li>Copy your Client ID and Client Secret</li>
          <li>Replace the placeholders in spotify.js with your credentials</li>
        </ol>
      </div>
    `;
    
    if (newestContainer) newestContainer.innerHTML = setupMessage;
    if (topContainer) topContainer.innerHTML = setupMessage;
  }
});
