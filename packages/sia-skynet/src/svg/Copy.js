import React from 'react'

export default function Copy(props) {
  return (
    <svg width={18} height={18} viewBox="0 0 18 18" {...props}>
      <path
        d="M15 13v2a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2h2m2.464 3.293L6.05 7.707a3 3 0 104.243 4.243l1.414-1.414h0m-1.414-7.072l1.414-1.414a3 3 0 114.243 4.243l-1.414 1.414h0M8.879 9.121L13.12 4.88"
        stroke="currentColor"
        strokeWidth={2}
        fill="none"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
