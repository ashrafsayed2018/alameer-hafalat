import { BlogList } from '../app/data'
import Card from './Card'

function Blog() {
  return (
    <div className="mt-28 px-4 md:px-6 lg:px-8 xl:px-10">
      <h2 className="headingColor">المدونة </h2>
      <span className="headingBorderColor"></span>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {BlogList.map((blog) => {
          return <Card key={blog.id} item={blog} imageStyle="w-full h-full" />
        })}
      </div>
    </div>
  )
}

export default Blog
