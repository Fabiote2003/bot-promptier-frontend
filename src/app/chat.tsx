"use client"

import { useRef, useEffect, useState, useActionState } from "react"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useFormState, useFormStatus } from "react-dom"
import { sendMessage } from "./actions"

interface Message {
  content: string
  isUser: boolean
}

interface ChatState {
  messages: Message[]
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-gradient-to-r cursor-pointer from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
    >
      <Send className="h-5 w-5 mr-2" />
      Enviar
    </Button>
  )
}

function ProcessingIndicator() {
  return (
    <div className="flex items-center space-x-2 text-gray-400 animate-pulse">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Procesando respuesta...</span>
    </div>
  )
}

export default function Chat() {
  const { pending } = useFormStatus()
  console.log(pending);
  const initialState: ChatState = { messages: [] }
  const [state, formAction] = useActionState(sendMessage, initialState)
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  console.log(isProcessing);
  useEffect(() => {
    scrollToBottom()
  }, [state.messages])

  const handleSubmit = async (formData: FormData) => {
    setIsProcessing(true)
    await formAction(formData)
    setIsProcessing(false)
    formRef.current?.reset()
  }

  return (
    <Card className="w-full max-w-3xl mx-auto h-[80vh] flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl rounded-xl overflow-hidden border-2 border-cyan-400">
      <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 py-6">
        <CardTitle className="text-center text-white text-3xl font-bold tracking-wider">
          Conoce más sobre <span className="text-cyan-200 font-extrabold">Promptier.ai</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-6 space-y-4 overflow-hidden bg-opacity-50 backdrop-blur-sm">
        <div className="flex-1 overflow-y-auto space-y-4 pr-4 scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-gray-700">
          {state.messages.map((message, index) => (
            <div key={index} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  message.isUser ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.isUser ? "bg-cyan-500" : "bg-blue-500"
                  }`}
                >
                  {message.isUser ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div
                  className={`rounded-2xl p-4 ${
                    message.isUser
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                      : "bg-gray-700 text-gray-100"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          {pending && <ProcessingIndicator />}
          <div ref={messagesEndRef} />
        </div>
        <form ref={formRef} action={handleSubmit} className="flex gap-2 pt-4 border-t border-gray-700">
          <Input
            name="message"
            placeholder="Escribe tu mensaje aquí..."
            className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400"
          />
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}

