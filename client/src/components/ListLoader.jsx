import React from 'react'
import ContentLoader from 'react-content-loader'

const ListLoader = props => (
  <ContentLoader
    speed={2}
    width="100%"
    height={120}
    viewBox="0 0 400 120"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="10" y="15" rx="8" ry="8" width="100" height="100" />
    <rect x="120" y="20" rx="4" ry="4" width="250" height="16" />
    <rect x="120" y="45" rx="4" ry="4" width="180" height="14" />
    <rect x="120" y="70" rx="4" ry="4" width="200" height="12" />
    <rect x="120" y="95" rx="4" ry="4" width="100" height="10" />
  </ContentLoader>
)

export default ListLoader
