import Image from 'next/image'
import { BlogList } from '../../data'

const page = ({ params }) => {
  const blogId = params.blogId
  // Find the blog post by ID
  const blogPost = BlogList.find((blog) => {
    console.log(blog.id == blogId)
    return blog.id == blogId
  })

  if (!blogPost) {
    return (
      <div className="h-screen flex items-center justify-center gap-2">
        <p className="text-red-500 my-20 text-center text-3xl ">
          {' '}
          لا يوجد مقالة بهذا الرقم.
        </p>
        <a href="/" className="bg-blue-500 p-2 rounded-lg text-white">
          الرئيسية
        </a>
      </div>
    )
  }

  return (
    <div className="my-14">
      <Image
        width={300}
        height={200}
        src={blogPost.image}
        alt={blogPost.title}
        className="w-full h-full rounded-xl"
      />
      <div className="post-meta mt-8 p-4">
        <h1 className="text-4xl mb-8">{blogPost.title}</h1>
        <p className="text-2xl leading-10">{blogPost.description}</p>
      </div>
    </div>
  )
}

export default page
