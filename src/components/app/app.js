import React, { Component } from 'react'
import { Layout, Alert, Pagination } from 'antd'

import Header from '../header'
import SearchForm from '../search-form'
import CardList from '../card-list'
import MovieService from '../../service'
import './app.css'
import Loader from '../loader/loader'
import ErrComponent from '../err-component'
import { GenreProvider } from '../genre-context/genre-context'

const { Content } = Layout
const movie = new MovieService()

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: [],
      loading: true,
      genres: [],
      error: false,
      isOnline: navigator.onLine,
      totalPage: 0,
      currentPage: 1,
      searchQuery: '',
      noResults: false,
      sessionId: null,
      currentTab: '1',
      userRatings: {},
    }
    this.onLoadedCard = this.onLoadedCard.bind(this)
    this.handleNetworkChange = this.handleNetworkChange.bind(this)
    this.onChangePage = this.onChangePage.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
  }

  componentDidMount() {
    window.addEventListener('online', this.handleNetworkChange)
    window.addEventListener('offline', this.handleNetworkChange)
    const { isOnline, currentPage } = this.state
    this.fetchMovies(currentPage)
    this.createGuestSession()
    this.fetchGenres()
    if (!isOnline) {
      this.setState({ loading: false })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleNetworkChange)
    window.removeEventListener('offline', this.handleNetworkChange)
  }

  handleNetworkChange() {
    this.setState({ isOnline: navigator.onLine })
  }

  handleSearchChange(query) {
    const { currentPage } = this.state
    this.setState({ searchQuery: query, currentPage: 1, noResults: false }, () => {
      if (query) {
        this.fetchMoviesBySearch(query, 1)
      } else {
        this.fetchMovies(currentPage)
      }
    })
  }

  onError = () => {
    this.setState({ error: true, loading: false })
  }

  onLoadedCard() {
    this.setState({ loading: false })
  }

  onChangePage(page) {
    this.setState({ currentPage: page }, () => {
      const { searchQuery, currentTab } = this.state

      if (currentTab === '1') {
        if (searchQuery) {
          this.fetchMoviesBySearch(searchQuery, page)
        } else {
          this.fetchMovies(page)
        }
      } else if (currentTab === '2') {
        this.fetchRatedMovies(page)
      }
    })
  }

  createGuestSession = () => {
    const { currentPage } = this.state
    movie.createGuestSession().then((sessionId) => {
      this.setState({ sessionId }, () => {
        this.fetchMovies(currentPage)
      })
    })
  }

  onChangeTab = (key) => {
    this.setState({ currentTab: key, currentPage: 1 })
    if (key === '1') {
      this.fetchMovies(1)
    } else if (key === '2') {
      this.fetchRatedMovies(1)
    }
  }

  onRateMovie = (movieId, value) => {
    const { sessionId } = this.state

    if (!sessionId) {
      return
    }
    if (value === 0) {
      this.deleteRateMovie(movieId)
      return
    }
    movie
      .rateMovie(movieId, value, sessionId)
      .then(() => {
        this.setState((prevState) => ({
          userRatings: {
            ...prevState.userRatings,
            [movieId]: value,
          },
        }))
      })
      .catch((error) => {
        console.error('Ошибка при оценке фильма:', error)
      })
  }

  deleteRateMovie = (movieId) => {
    const { sessionId } = this.state

    if (!sessionId) {
      console.error('Нет активной сессии. Удаление оценки невозможно.')
      return
    }

    movie
      .deleteRating(movieId, sessionId)
      .then((response) => {
        console.log('Оценка успешно удалена:', response)
        this.setState((prevState) => {
          const newRatings = { ...prevState.userRatings }
          delete newRatings[movieId]
          return { userRatings: newRatings }
        })
      })
      .catch((error) => {
        console.error('Ошибка при удалении оценки:', error)
      })
  }

  fetchRatedMovies = (page) => {
    const { sessionId } = this.state
    this.setState({ loading: true })
    movie
      .getRatedMovies(sessionId, page)
      .then((response) => {
        this.setState({
          movies: response.movies,
          totalPage: response.total_pages,
          loading: false,
        })
      })
      .catch(this.onError)
  }

  fetchGenres() {
    movie.getGenres().then((genres) => {
      this.setState({ genres })
    })
  }

  fetchMoviesBySearch(query, page) {
    this.setState({ loading: true })
    movie
      .searchMovie(query, page)
      .then((response) => {
        this.setState(
          {
            movies: response.movies,
            totalPage: response.total_pages,
            noResults: response.movies.length === 0,
          },
          this.onLoadedCard
        )
      })
      .catch(this.onError)
  }

  fetchMovies(page) {
    this.setState({ loading: true })
    movie
      .mainMoviePagination(page)
      .then((response) => {
        this.setState(
          {
            movies: response.movies,
            totalPage: response.total_pages,
          },
          this.onLoadedCard
        )
      })
      .catch(this.onError)
  }

  render() {
    const { movies, genres, loading, error, isOnline, totalPage, currentPage, noResults, currentTab, userRatings } =
      this.state
    const errorMessage = error ? <ErrComponent /> : null
    const spinner = loading ? <Loader /> : null
    const loadCard =
      !loading && !error && isOnline ? (
        <CardList cards={movies} userRatings={userRatings} onRateMovie={this.onRateMovie} />
      ) : null
    const noMoviesMessage =
      noResults && !loading && !error ? (
        <Alert message="Ничего не найдено" description="По вашему запросу не найдено фильмов." type="info" showIcon />
      ) : null
    if (!isOnline) {
      return (
        <Alert
          className="offNetwork"
          message="Вы оффлайн"
          description="Нет подключения к интернету. Попробуйте позже."
          type="warning"
          showIcon
        />
      )
    }
    return (
      <Layout>
        <GenreProvider value={genres}>
          <Header onChangeTab={this.onChangeTab} />
          <Content>
            {currentTab === '1' && <SearchForm onSearchChange={this.handleSearchChange} />}
            {errorMessage}
            {spinner}
            {noMoviesMessage}
            {loadCard}
            <Pagination
              current={currentPage}
              total={totalPage * 10}
              onChange={this.onChangePage}
              className="pages__pagination"
              showSizeChanger={false}
            />
          </Content>
        </GenreProvider>
      </Layout>
    )
  }
}

App.defaultProps = {
  movies: [],
  loading: true,
  genres: [],
  error: false,
  isOnline: navigator.onLine,
  totalPage: 0,
  currentPage: 1,
  searchQuery: '',
  noResults: false,
  sessionId: null,
  currentTab: '1',
  userRatings: {},
}
