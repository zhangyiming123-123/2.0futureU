import { type NextRequest, NextResponse } from "next/server"

const SILICONFLOW_API_URL = "https://api.siliconflow.cn/v1/chat/completions"
const SILICONFLOW_API_KEY = process.env.SILICONFLOW_API_KEY

interface EvaluationRequest {
  questionId: number
  question: string
  userAnswer: string
  keyPoints: string[]
  category: string
  difficulty: string
}

interface EvaluationResponse {
  overallScore: number
  coreCompetencyScores: {
    productThinking: number
    technicalUnderstanding: number
    projectManagement: number
    businessAcumen: number
  }
  performanceScores: {
    communication: number
    logicalStructure: number
    confidence: number
    adaptability: number
  }
  rating: string
  highlights: Array<{
    tag: string
    description: string
  }>
  improvements: Array<{
    tag: string
    description: string
  }>
  strategicSuggestions: Array<{
    tag: string
    suggestion: string
    example: string
  }>
}

function buildEvaluationPrompt(data: EvaluationRequest): string {
  return `你是一位资深产品总监，请扮演一名严谨且专业的面试官角色。你的任务是根据我的具体回答，进行全面、深入且具有可量化标准的分析。

你的反馈必须严格遵循以下结构化模板，并确保每个部分都针对我的回答内容进行独家生成，避免使用任何通用或模糊的词汇：

面试问题：${data.question}
问题类别：${data.category}
难度等级：${data.difficulty}

评分关键要点：
${data.keyPoints.map((point, index) => `${index + 1}. ${point}`).join("\n")}

用户回答：
${data.userAnswer}

### 评估要求：
请从以下维度进行评估，每个维度必须基于用户的具体回答内容，引用实际语句作为证据：

**核心能力维度（1-10分）：**
1. **产品思维**：用户痛点识别、商业价值理解、数据驱动思维
2. **技术理解**：AI技术认知、可行性评估、技术与产品平衡
3. **项目管理**：跨团队协作、资源协调、风险管理
4. **商业化能力**：ROI思维、市场洞察、竞争分析

**综合表现维度（1-10分）：**
1. **沟通表达**：语言流畅度、专业性、精确性
2. **逻辑结构**：条理清晰、重点突出、结构完整
3. **自信度**：表达自信、有说服力
4. **临场反应**：思维敏捷、应变能力

### 反馈结构要求：
- **回答亮点**：必须使用具体标签，并引用用户回答中的实际内容作为佐证
- **待改进点**：必须指出具体不足，分析原因，避免泛泛而谈
- **战略级改进建议**：必须提供可操作的具体建议，包含量化示例

请严格按照以下JSON格式返回评估结果，确保所有内容都基于用户的实际回答：
{
  "overallScore": <综合得分，1-100整数，计算公式：(核心能力平均分*0.7 + 综合表现平均分*0.3)*10>,
  "coreCompetencyScores": {
    "productThinking": <产品思维得分，1-10>,
    "technicalUnderstanding": <技术理解得分，1-10>,
    "projectManagement": <项目管理得分，1-10>,
    "businessAcumen": <商业化能力得分，1-10>
  },
  "performanceScores": {
    "communication": <沟通表达得分，1-10>,
    "logicalStructure": <逻辑结构得分，1-10>,
    "confidence": <自信度得分，1-10>,
    "adaptability": <临场反应得分，1-10>
  },
  "rating": "<根据总分给出评级：90+为'卓越'，80-89为'优秀'，70-79为'良好'，<70为'需改进'>",
  "highlights": [
    {
      "tag": "<具体标签，如'系统性思维'、'数据驱动决策'、'技术可行性分析'>",
      "description": "<详细描述该亮点的表现，必须引用用户回答中的具体内容作为证据>"
    }
  ],
  "improvements": [
    {
      "tag": "<具体问题标签，如'商业价值量化不足'、'用户场景分析浅层'、'技术风险考虑缺失'>",
      "description": "<具体描述需要改进的地方，分析原因，避免使用模糊词汇>"
    }
  ],
  "strategicSuggestions": [
    {
      "tag": "<建议标签，如'深化ROI量化分析'、'提升跨职能协作描述'、'强化竞争优势论述'>",
      "suggestion": "<详细的改进建议，必须具体可操作>",
      "example": "<提供具体的量化示例或补充内容，如：'可以补充：项目上线后，用户留存率提升了15%，ARPU增长了8%，ROI达到3.2倍'>"
    }
  ]
}`
}

function cleanJsonResponse(content: string): string {
  console.log("🔧 [JSON清理] 开始清理AI响应")

  // Remove markdown code blocks and language identifiers
  let cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "")

  // Remove any leading/trailing whitespace
  cleaned = cleaned.trim()

  // Remove any text before the first { and after the last }
  const firstBrace = cleaned.indexOf("{")
  const lastBrace = cleaned.lastIndexOf("}")

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1)
  }

  // Fix common JSON formatting issues
  cleaned = cleaned
    // Remove any trailing commas before closing braces/brackets
    .replace(/,(\s*[}\]])/g, "$1")
    // Fix unescaped quotes in strings
    .replace(/([^\\])"/g, '$1\\"')
    // Fix the previous replacement if it affected JSON structure
    .replace(/\\"/g, '"')
    // Ensure proper spacing around colons and commas
    .replace(/:\s*/g, ": ")
    .replace(/,\s*/g, ", ")
    // Remove any control characters that might cause parsing issues
    .replace(/[\x00-\x1F\x7F]/g, "")
    // Fix any double quotes that got mangled
    .replace(/"{2,}/g, '"')

  console.log("✨ [JSON清理] 清理完成，长度:", cleaned.length)

  // Validate basic JSON structure
  const openBraces = (cleaned.match(/{/g) || []).length
  const closeBraces = (cleaned.match(/}/g) || []).length

  if (openBraces !== closeBraces) {
    console.warn("⚠️ [JSON清理] 大括号不匹配:", { openBraces, closeBraces })
  }

  return cleaned
}

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 [API] 开始处理增强版评估请求")

    if (!SILICONFLOW_API_KEY) {
      console.error("❌ [API] SiliconFlow API密钥未配置")
      return NextResponse.json(
        {
          error: "SiliconFlow API key not configured",
          message: "请在项目设置中添加 SILICONFLOW_API_KEY 环境变量",
        },
        { status: 500 },
      )
    }

    const body: EvaluationRequest = await request.json()
    console.log("📝 [API] 收到评估请求:", {
      questionId: body.questionId,
      category: body.category,
      difficulty: body.difficulty,
      answerLength: body.userAnswer?.length,
    })

    // 验证请求数据
    if (!body.question || !body.userAnswer || !body.keyPoints) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const prompt = buildEvaluationPrompt(body)
    console.log("📋 [API] 构建增强版提示词完成")

    const requestPayload = {
      model: "deepseek-ai/DeepSeek-V3",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 3000,
    }

    const response = await fetch(SILICONFLOW_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SILICONFLOW_API_KEY}`,
      },
      body: JSON.stringify(requestPayload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ [API] SiliconFlow API错误:`, errorText)
      throw new Error(`SiliconFlow API error: ${response.status}`)
    }

    const aiResponse = await response.json()
    const aiContent = aiResponse.choices[0]?.message?.content

    if (!aiContent) {
      throw new Error("No response from AI")
    }

    console.log("🔧 [API] 原始AI响应长度:", aiContent.length)

    let evaluationResult: EvaluationResponse
    try {
      const cleanedContent = cleanJsonResponse(aiContent)
      console.log("✨ [API] JSON清理完成，准备解析")

      try {
        evaluationResult = JSON.parse(cleanedContent)
      } catch (parseError) {
        console.error("❌ [JSON解析] 详细错误信息:", parseError)
        console.error("🔍 [JSON解析] 清理后内容前500字符:", cleanedContent.substring(0, 500))
        console.error(
          "🔍 [JSON解析] 清理后内容后500字符:",
          cleanedContent.substring(Math.max(0, cleanedContent.length - 500)),
        )

        // Try to identify the problematic character position
        if (parseError instanceof SyntaxError && parseError.message.includes("position")) {
          const match = parseError.message.match(/position (\d+)/)
          if (match) {
            const position = Number.parseInt(match[1])
            const context = cleanedContent.substring(Math.max(0, position - 50), position + 50)
            console.error("🎯 [JSON解析] 错误位置上下文:", context)
          }
        }

        throw parseError
      }

      console.log("✅ [API] 增强版评估解析成功:", {
        overallScore: evaluationResult.overallScore,
        rating: evaluationResult.rating,
        highlightsCount: evaluationResult.highlights?.length,
      })
    } catch (parseError) {
      console.error("❌ [API] JSON解析失败:", parseError)
      throw new Error("Invalid AI response format")
    }

    return NextResponse.json(evaluationResult)
  } catch (error) {
    console.error("💥 [API] 增强版评估API错误:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      {
        error: errorMessage,
        message: "AI评估服务暂时不可用，请稍后再试",
      },
      { status: 500 },
    )
  }
}
