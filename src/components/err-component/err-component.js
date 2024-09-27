import React from 'react'
import { Alert } from 'antd'

import './err-component.css'

function ErrComponent() {
  return <Alert message="Произошла ошибка" type="error" className="error-part" />
}
export default ErrComponent
