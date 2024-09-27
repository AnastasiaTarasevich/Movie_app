export default class MovieService {
  apiKey = '286f9830e76ee3677630a9cb10402f95'

  apiMain = 'https://api.themoviedb.org/3/'

  // eslint-disable-next-line class-methods-use-this
  async getResourse(url) {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(res.status)
    }
    const body = await res.json()
    const movies = body.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      time: movie.release_date,
      rate: movie.vote_average,
      description: movie.overview,
      image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      genreIds: movie.genre_ids,
    }))

    return {
      movies,
      total_pages: body.total_pages,
    }
  }

  async getGenres() {
    const res = await fetch(`${this.apiMain}genre/movie/list?api_key=${this.apiKey}`)
    if (!res.ok) {
      throw new Error(res.status)
    }
    const body = await res.json()
    return body.genres
  }

  async mainMoviePagination(page) {
    const url = `${this.apiMain}discover/movie?api_key=${this.apiKey}&page=${page}`
    return this.getResourse(url)
  }

  async searchMovie(query, page) {
    const url = `${this.apiMain}search/movie?api_key=${this.apiKey}&page=${page}&query=${query}`
    return this.getResourse(url)
  }

  async createGuestSession() {
    const url = `${this.apiMain}authentication/guest_session/new?api_key=${this.apiKey}`
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(res.status)
    }
    const body = await res.json()
    return body.guest_session_id
  }

  async getRatedMovies(sessionId, page) {
    const url = `${this.apiMain}guest_session/${sessionId}/rated/movies?api_key=${this.apiKey}&page=${page}`
    return this.getResourse(url)
  }

  async rateMovie(movieId, value, sessionId) {
    return fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${sessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
      }
    ).then((response) => {
      if (!response.ok) {
        throw new Error(response.status)
      }
      return response.json()
    })
  }

  deleteRating(movieId, sessionId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${sessionId}`
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error(res.status)
      }
      return res.json()
    })
  }
}
