import SearchLayoutComponent from '@/components/explore/search/SearchLayoutComponent'
import React from 'react'

const SearchLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <SearchLayoutComponent>
        {children}
    </SearchLayoutComponent>
  )
}

export default SearchLayout