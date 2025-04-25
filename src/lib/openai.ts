import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export type MessageCategory = 
  | 'support_request'
  | 'website_update'
  | 'pricing_change'
  | 'product_feedback'
  | 'account_issue'
  | 'other'

export type ProcessedMessage = {
  category: MessageCategory
  isCommonQuestion: boolean
  response: string
  confidenceScore: number
}

export async function processMessage(message: string): Promise<ProcessedMessage> {
  const prompt = `
You are an assistant for Wonderschool, a platform for childcare providers.
Your task is to:
1. Categorize this message: "${message}"
2. Determine if this is a common support question that can be answered directly
3. If it is, provide a helpful response
4. If not, acknowledge receipt and explain next steps

Categories include:
- support_request
- website_update
- pricing_change
- product_feedback
- account_issue
- other

Respond in the following JSON format:
{
  "category": "category_name",
  "isCommonQuestion": true/false,
  "response": "your_response",
  "confidenceScore": 0.0-1.0
}
`

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
  })

  const response = JSON.parse(completion.choices[0].message.content || '{}')
  return response as ProcessedMessage
} 