import ExploreLayoutComponent from '@/components/explore/ExploreLayout'

const ExploreLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <ExploreLayoutComponent>
        {children}
    </ExploreLayoutComponent>
  )
}

export default ExploreLayout