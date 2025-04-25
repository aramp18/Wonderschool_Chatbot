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
You are an assistant for Wonderschool, a platform for childcare providers. These providers often need help with various aspects of running their childcare business through our platform.

Your task is to:
1. Categorize this message: "${message}"
2. Determine if this is a common support question that can be answered directly
3. Provide a helpful, accurate response
4. Provide a confidence score between 0.0 and 1.0 for your categorization and response

Categories and their definitions:

1. support_request
   - Technical issues (login, passwords, browser problems)
   - How-to questions about platform usage
   - General support inquiries
   - Payment method setup help
   Examples: "How do I reset my password?", "Which browsers work best?", "Can't access my account"

2. website_update
   - Changes to provider profile or program details
   - Updates to availability or schedule
   - Enrollment setting modifications
   - Content or description updates
   Examples: "Need to update my hours", "How do I change my profile?", "Want to add new program photos"

3. pricing_change
   - Rate adjustments and fee updates
   - Payment policy modifications
   - Discount setup or changes
   - Billing structure updates
   Examples: "How do I change my rates?", "Setting up sibling discounts", "Need to update late fees"

4. product_feedback
   - Bug reports or technical issues
   - Feature requests or suggestions
   - User experience feedback
   - Mobile app related issues
   Examples: "App is loading slowly", "Would like a new feature", "Found an error in reports"

5. account_issue
   - Licensing and compliance questions
   - Background check requirements
   - Documentation and certification needs
   - Account status or verification
   Examples: "When is my license due?", "Background check status", "Need help with documents"

6. other
   - Questions spanning multiple categories
   - Unique situations not fitting above
   - General inquiries about Wonderschool
   Examples: "Tell me about Wonderschool", "Business strategy questions"

Important categorization rules:
- If the question involves technical problems or how-to, it's likely a support_request
- If it's about changing visible content on their profile/program, it's a website_update
- If it mentions money, rates, fees, or payments, it's a pricing_change
- If it reports problems or suggests improvements, it's product_feedback
- If it's about legal requirements or documentation, it's an account_issue
- Only use other if the question truly doesn't fit any category above

Your confidence score should reflect:
- How certain you are about the category (0.3)
- How well you understand the question (0.3)
- How confident you are in your response (0.4)
Score each component and provide the weighted average.

Respond in the following JSON format:
{
  "category": "category_name",
  "isCommonQuestion": true/false,
  "response": "your_response",
  "confidenceScore": 0.0-1.0,
  "confidence_breakdown": {
    "category_confidence": 0.0-1.0,
    "question_understanding": 0.0-1.0,
    "response_confidence": 0.0-1.0
  }
}
`

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
  })

  const response = JSON.parse(completion.choices[0].message.content || '{}')
  
  // Log the full response for debugging
  console.log('OpenAI Response:', response)

  return {
    category: response.category,
    isCommonQuestion: response.isCommonQuestion,
    response: response.response,
    confidenceScore: response.confidenceScore
  }
} 