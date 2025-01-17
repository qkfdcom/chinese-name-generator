export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_1px]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:1px_4rem]"></div>
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-br from-red-50 via-pink-50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-white via-pink-50/20 to-transparent"></div>
    </div>
  )
} 