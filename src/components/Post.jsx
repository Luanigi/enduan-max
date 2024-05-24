import { HiOutlineDotsVertical } from "react-icons/hi"
import LikeSection from "./LikeSection"
import CommentSection from "./CommentSection"

export default function Post({post}) {
  return (
    <div className="bg-slate-700 my-7 border rounded-md mx-10">
        <div className="flex items-center p-5 border-bottom border-gray-100 border-b-2">
            <img src={post.profileImg} alt={post.username} className="h-12 rounded-full object-cover border-2 border-slate-600 p-1 mr-3" />
            <p className="flex-1 font-bold">{post.username}</p>
            {/* auf click kleine dropdown unten hinzufügen */}
            <HiOutlineDotsVertical className="cursor-pointer h-5"/>
        </div>

        <img src={post.image} alt={post.caption} className="object-cover w-full" />
        <LikeSection id = {post.id} />
        <p className="p-5">
            <span className="font-bold mr-2">{post.username}</span>
            <br />
            <p className="">{post.caption}</p>
        </p>
        <CommentSection id = {post.id} />
    </div>
  )
}