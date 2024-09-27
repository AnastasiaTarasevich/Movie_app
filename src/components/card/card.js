import React from 'react'
import PropTypes from 'prop-types'
import { Card as AntCard, Tag, Rate } from 'antd'
import './card.css'
import { format } from 'date-fns'

import { GenreConsumer } from '../genre-context/genre-context'

import noImage from './noImage.png'

const { Meta } = AntCard

function Card({
  title = 'Without Information',
  description = 'Without Information',
  image = noImage,
  time = new Date(),
  genreIds = [],
  rate = 0,
  movieId = 0,
  userRating = {},
  onRateMovie = () => {},
}) {
  function getRatingColor(rating) {
    if (rating <= 3) return 'card-info__elips-rate red'
    if (rating > 3 && rating <= 5) return 'card-info__elips-rate orange'
    if (rating > 5 && rating <= 7) return 'card-info__elips-rate yellow'
    return 'card-info__elips-rate green'
  }
  const truncateDescription = (des) => {
    const maxLength = 150
    if (des.length <= maxLength) return des

    let truncated = description.slice(0, maxLength)
    const lastSpaceIndex = truncated.lastIndexOf(' ')
    if (lastSpaceIndex !== -1) {
      truncated = truncated.slice(0, lastSpaceIndex)
    }
    return `${truncated}...`
  }
  const imageUrl = image && image !== 'https://image.tmdb.org/t/p/w500null' ? image : noImage
  return (
    <GenreConsumer>
      {(genres) => (
        <AntCard className="card-info" hoverable cover={<img alt={title} src={imageUrl} className="card-info__img" />}>
          <div className="card-info__header">
            <h3 className="card-info__title">{title || 'Without Information'}</h3>
            <div className={getRatingColor(rate)}>{rate.toFixed(1)}</div>
          </div>
          <span className="card-info__time">{time ? format(new Date(time), 'PP') : 'Unknown Date'}</span>
          <div className="card-info__tags">
            {genreIds.map((id) => {
              const genreItem = genres.find((genre) => genre.id === id)
              return (
                <Tag key={id} className="card-info__tag">
                  {genreItem ? genreItem.name : 'Unknown'}
                </Tag>
              )
            })}
          </div>
          <Meta
            className="card-info__des"
            description={description ? truncateDescription(description) : 'Without Information'}
          />
          <Rate allowHalf value={userRating} onChange={(value) => onRateMovie(movieId, value)} count={10} />
        </AntCard>
      )}
    </GenreConsumer>
  )
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  time: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  genreIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  rate: PropTypes.number.isRequired,
  movieId: PropTypes.number.isRequired,
  onRateMovie: PropTypes.func.isRequired,
}

export default Card
