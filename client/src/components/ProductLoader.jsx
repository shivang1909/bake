import React from 'react'
import ContentLoader from 'react-content-loader'

const SingleCatalogLoader = props => (
  <ContentLoader
    speed={2}
    width="100%"
    height={280}
    viewBox="0 0 260 280"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="30" y="20" rx="8" ry="8" width="200" height="200" />
    <rect x="30" y="230" rx="4" ry="4" width="200" height="16" />
    <rect x="30" y="255" rx="4" ry="4" width="120" height="16" />
  </ContentLoader>
)

const ProductLoader = () => {
  return (
    <div className="flex flex-wrap justify-center gap-6 px-4 py-8">
      <div className="w-full sm:w-[260px]">
        <SingleCatalogLoader />
      </div>
    </div>
  )
}

export default ProductLoader
