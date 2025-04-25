import { NextResponse } from 'next/server'
import { processMessage } from '@/lib/openai'

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    try {
      const processedMessage = await processMessage(message)
      return NextResponse.json(processedMessage)
    } catch (error: any) {
      // Handle quota errors gracefully
      if (error.code === 'insufficient_quota') {
        return NextResponse.json({
          category: 'support_request',
          isCommonQuestion: true,
          response: "I apologize, but I'm currently unable to process your message due to technical limitations. Please try again later or contact Wonderschool support directly at support@wonderschool.com.",
          confidenceScore: 1.0
        })
      }
      throw error // Re-throw other errors
    }
  } catch (error) {
    console.error('Error processing message:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
} 