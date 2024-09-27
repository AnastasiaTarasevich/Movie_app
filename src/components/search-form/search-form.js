import React from 'react'
import { Input } from 'antd'
import './search-form.css'
import debounce from 'lodash/debounce'
import PropTypes from 'prop-types'

function SearchForm({ onSearchChange = () => {} }) {
  return (
    <form className="search-form">
      <Input
        placeholder="Type to search"
        className="search-form__input"
        onChange={debounce((e) => onSearchChange(e.target.value.trim()), 1000)}
      />
    </form>
  )
}
SearchForm.propTypes = {
  onSearchChange: PropTypes.func.isRequired,
}

export default SearchForm
