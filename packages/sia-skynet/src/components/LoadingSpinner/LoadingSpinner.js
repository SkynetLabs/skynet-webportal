import React from 'react'

import './LoadingSpinner.scss'
import { Loading } from '../../svg'

export default function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <Loading />
    </div>
  )
}
