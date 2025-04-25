import { NextResponse } from 'next/server'
import { getAnswer } from '@/lib/knowledge'
import { supabase } from '@/lib/supabase'

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
      // Process message with knowledge base + OpenAI fallback
      const processedMessage = await getAnswer(message)

      // Store in Supabase
      const { data, error } = await supabase
        .from('queries')
        .insert({
          query: message,
          category: processedMessage.category,
          response: processedMessage.answer,
          confidence_score: processedMessage.confidence,
          response_source: processedMessage.source,
          status: processedMessage.confidence >= 0.9 ? 'processed' : 'needs_review',
          timestamp: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      // Log the response for debugging
      console.log('Processed message:', {
        source: processedMessage.source,
        confidence: processedMessage.confidence,
        status: processedMessage.confidence >= 0.9 ? 'processed' : 'needs_review'
      })

      return NextResponse.json({
        category: processedMessage.category,
        isCommonQuestion: processedMessage.source === 'knowledge_base',
        response: processedMessage.answer,
        confidenceScore: processedMessage.confidence,
        source: processedMessage.source
      })
    } catch (error: any) {
      // Handle quota errors gracefully
      if (error.code === 'insufficient_quota') {
        const fallbackResponse = {
          category: 'support_request',
          isCommonQuestion: true,
          response: "I apologize, but I'm currently unable to process your message due to technical limitations. Please try again later or contact Wonderschool support directly at support@wonderschool.com.",
          confidenceScore: 1.0,
          source: 'ai_generated' as const
        }

        // Store fallback response in Supabase
        await supabase
          .from('queries')
          .insert({
            query: message,
            category: 'support_request',
            response: fallbackResponse.response,
            confidence_score: fallbackResponse.confidenceScore,
            response_source: fallbackResponse.source,
            status: 'needs_review',
            timestamp: new Date().toISOString()
          })

        return NextResponse.json(fallbackResponse)
      }
      throw error
    }
  } catch (error) {
    console.error('Error processing message:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
} 