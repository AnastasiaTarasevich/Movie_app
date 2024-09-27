import React from 'react'
import { Spin } from 'antd'
import './loader.css'

function Loader() {
  return (
    <div className="loader-container">
      <Spin size="large" className="loader-spin" />
    </div>
  )
}
export default Loader
