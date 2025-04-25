import knowledgeBase from './knowledge-base.json'
import { processMessage } from './openai'

type KnowledgeResponse = {
  answer: string
  confidence: number
  source: 'knowledge_base' | 'ai_generated'
  category: string
}

// Recursive helper function to search nested objects
function findExactMatchRecursive(
    obj: any, 
    normalizedQuery: string, 
    categoryName: string
): KnowledgeResponse | null {
    if (typeof obj !== 'object' || obj === null) {
        return null
    }

    // Base case: Found the common_questions object
    if ('common_questions' in obj && typeof obj.common_questions === 'object' && obj.common_questions !== null) {
        const questions = obj.common_questions as Record<string, { answer: string; confidence: number }>
        for (const [question, data] of Object.entries(questions)) {
            console.log(`Comparing: |${normalizedQuery}| with KB Key: |${question}| (Category: ${categoryName})`)
            if (normalizedQuery === question) {
                console.log(">>> MATCH FOUND <<<")
                return {
                    answer: data.answer,
                    confidence: data.confidence,
                    source: 'knowledge_base',
                    category: categoryName, // Use the top-level category name
                }
            }
        }
    }

    // Recursive step: Search deeper in nested objects
    for (const key of Object.keys(obj)) {
        // Avoid infinite recursion if a key is named 'common_questions' but isn't the object we check above
        if (key === 'common_questions' && 'common_questions' in obj) continue 
        
        const result = findExactMatchRecursive(obj[key], normalizedQuery, categoryName)
        if (result) {
            return result // Found a match deeper down
        }
    }

    return null // No match found in this branch
}

// Main function to start the search
function findExactMatch(query: string): KnowledgeResponse | null {
    const normalizedQuery = query.toLowerCase().trim().replace(/[?.,!']/g, '')
    console.log(`Normalized Query: |${normalizedQuery}|`)

    for (const [categoryName, categoryData] of Object.entries(knowledgeBase)) {
        const match = findExactMatchRecursive(categoryData, normalizedQuery, categoryName)
        if (match) {
            return match
        }
    }

    console.log("--- No Match Found in KB ---")
    return null
}

export async function getAnswer(query: string): Promise<KnowledgeResponse> {
  // First, try to find an exact match in the knowledge base
  const exactMatch = findExactMatch(query)
  if (exactMatch) {
    return exactMatch
  }

  // If no exact match, fall back to OpenAI
  const aiResponse = await processMessage(query)
  
  return {
    answer: aiResponse.response,
    confidence: aiResponse.confidenceScore,
    source: 'ai_generated',
    category: aiResponse.category
  }
} 