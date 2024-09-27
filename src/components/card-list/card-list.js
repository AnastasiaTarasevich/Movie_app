import React from 'react'
import { Row, Col } from 'antd'
import PropTypes from 'prop-types'

import Card from '../card/card'

function CardList({ cards, onRateMovie = () => {}, userRatings = {} }) {
  return (
    <Row gutter={[16, 24]}>
      {cards.map((card) => (
        <Col span={12} key={card.id} xs={24} sm={24} md={24} lg={12} style={{ marginBottom: '16px' }}>
          <Card
            title={card.title}
            description={card.description}
            image={card.image}
            time={card.time}
            rate={card.rate}
            genreIds={card.genreIds}
            movieId={card.id}
            userRating={userRatings[card.id]}
            onRateMovie={onRateMovie}
          />
        </Col>
      ))}
    </Row>
  )
}
CardList.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      image: PropTypes.string,
      time: PropTypes.string,
      rate: PropTypes.number,
      genreIds: PropTypes.arrayOf(PropTypes.number),
    })
  ).isRequired,
  onRateMovie: PropTypes.func.isRequired,
  userRatings: PropTypes.objectOf(PropTypes.number).isRequired,
}

export default CardList
