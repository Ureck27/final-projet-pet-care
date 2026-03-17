import Loader from "@/components/ui/loader"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loader />
    </div>
  )
}
