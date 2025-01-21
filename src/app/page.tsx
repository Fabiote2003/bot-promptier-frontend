import { ToastProvider } from "@/components/ui/toast"
import Chat from "./chat"

export default function Home() {
  return (
    <ToastProvider>
      <main className="min-h-screen p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <Chat />
      </main>
    </ToastProvider>
  )
}