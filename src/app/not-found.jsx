import Link from "next/link"

export default function NotFound() {
  return (
    <main className="text-center text-white h-[90dvh] flex flex-col items-center justify-center ">
          <h2 className="text-3xl">We have a <b>Problem</b>!</h2>
          <p>We couln&apos;t find the page you were looking for</p>
          <p>Go back to the <Link href="/" className="text-red-300 drop-shadow-lg">Homepage</Link></p>
    </main>
  )
}