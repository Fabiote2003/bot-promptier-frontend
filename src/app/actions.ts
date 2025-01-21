"use server"

import { revalidatePath } from "next/cache"

interface Message {
  content: string
  isUser: boolean
}

interface ChatState {
  messages: Message[]
}

export async function sendMessage(prevState: ChatState, formData: FormData): Promise<ChatState> {
  const userMessage = formData.get("message") as string

  if (!userMessage?.trim()) {
    return prevState
  }

  const newUserMessage: Message = { content: userMessage, isUser: true }

  try {
    const response = await fetch(`${process.env.BACKEND_API_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: userMessage }),
    })

    if (!response.ok) {
      throw new Error("Network response was not ok")
    }

    const data = await response.json()
    const botMessage: Message = { content: data.answer, isUser: false }

    revalidatePath("/")
    return {
      messages: [...prevState.messages, newUserMessage, botMessage],
    }
  } catch (error) {
    console.error("Error:", error)
    const errorMessage: Message = { content: "Lo siento, hubo un error al procesar tu mensaje.", isUser: false }
    return {
      messages: [...prevState.messages, newUserMessage, errorMessage],
    }
  }
}

