import React from 'react'
import './header.css'
import { Tabs } from 'antd'
import PropTypes from 'prop-types'

function Header({ onChangeTab = () => {} }) {
  const items = [
    { label: 'Search', key: '1' },
    { label: 'Rated', key: '2' },
  ]
  return (
    <header className="header">
      <Tabs defaultActiveKey="1" items={items} className="header__tabs" onChange={onChangeTab} />
    </header>
  )
}

Header.propTypes = {
  onChangeTab: PropTypes.func.isRequired,
}

export default Header
