"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Play,
  Send,
  Brain,
  CheckCircle,
  Star,
  Clock,
  Target,
  Lightbulb,
  RefreshCw,
  TrendingUp,
} from "lucide-react"
import { useState, useEffect } from "react"
import { CoreCompetencyRadarChart } from "@/components/radar-chart"

// 模拟题库数据
const questionBank = {
  hr: [
    {
      id: 1,
      question: "请简单介绍一下你自己，以及为什么想要成为AI产品经理？",
      category: "自我介绍",
      difficulty: "基础",
      keyPoints: ["个人背景", "对技术的好奇心", "商业价值的思考", "用户体验的热情", "职业规划"],
      standardAnswer:
        "一个好的回答应该包含：1）简洁的个人背景介绍；2）对AI技术的理解和兴趣；3）产品思维和商业敏感度；4）对用户体验的关注；5）清晰的职业发展规划。",
      timeLimit: 180,
    },
    {
      id: 2,
      question: "你认为AI产品经理与传统产品经理最大的区别是什么？",
      category: "岗位认知",
      difficulty: "基础",
      keyPoints: ["技术理解深度", "数据驱动决策", "算法产品化", "伦理考量", "跨学科协作"],
      standardAnswer:
        "AI产品经理需要更深入理解技术原理，具备数据分析能力，关注算法的可解释性和公平性，同时需要平衡技术可行性与商业价值。",
      timeLimit: 120,
    },
  ],
  professional: [
    {
      id: 3,
      question: "如果要设计一个AI客服产品，你会如何规划整个产品架构？",
      category: "产品设计",
      difficulty: "进阶",
      keyPoints: ["用户需求分析", "技术架构设计", "数据流程", "交互设计", "效果评估"],
      standardAnswer:
        "需要考虑：用户场景分析、NLP技术选型、知识库构建、多轮对话设计、人机协作机制、效果监控体系等关键要素。",
      timeLimit: 300,
    },
  ],
  final: [
    {
      id: 4,
      question: "请分析当前AI大模型市场的竞争格局，并提出一个创新的商业模式。",
      category: "战略分析",
      difficulty: "高级",
      keyPoints: ["市场分析", "竞争格局", "技术趋势", "商业模式创新", "风险评估"],
      standardAnswer:
        "应该从技术壁垒、市场定位、商业化路径、差异化竞争等多个维度进行分析，并提出具有可行性的创新方案。",
      timeLimit: 600,
    },
  ],
}

interface InterviewPracticeProps {
  moduleType: "hr" | "professional" | "final"
  onBack: () => void
}

interface InterviewQuestion {
  id: number
  question: string
  category: string
  difficulty: string
  keyPoints: string[]
  standardAnswer: string
  timeLimit: number
}

interface EnhancedEvaluationResponse {
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

export default function InterviewPractice({ moduleType = "hr", onBack }: InterviewPracticeProps) {
  const [currentStep, setCurrentStep] = useState<"question" | "answering" | "analyzing" | "result">("question")
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [timeLeft, setTimeLeft] = useState(0)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [score, setScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<EnhancedEvaluationResponse | null>(null)
  const [evaluationError, setEvaluationError] = useState<string | null>(null)

  const moduleConfig = {
    hr: { title: "HR面试", color: "blue", icon: "👤" },
    professional: { title: "专业面试", color: "green", icon: "💼" },
    final: { title: "终面", color: "purple", icon: "🎯" },
  }

  const config = moduleConfig[moduleType]

  const selectRandomQuestion = () => {
    const questions = questionBank[moduleType]
    const randomIndex = Math.floor(Math.random() * questions.length)
    const question = questions[randomIndex]
    setCurrentQuestion(question)
    setTimeLeft(question.timeLimit)
    setCurrentStep("question")
    setUserAnswer("")
    setScore(null)
    setFeedback(null)
    setEvaluationError(null)
    console.log("🔄 [前端] 切换到新问题:", {
      questionId: question.id,
      category: question.category,
    })
  }

  const startAnswering = () => {
    setCurrentStep("answering")
  }

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return

    console.log("🎯 [前端] 开始提交答案:", {
      questionId: currentQuestion?.id,
      answerLength: userAnswer.length,
      category: currentQuestion?.category,
      difficulty: currentQuestion?.difficulty,
      answerPreview: userAnswer.substring(0, 100) + (userAnswer.length > 100 ? "..." : ""),
    })

    setCurrentStep("analyzing")
    setAnalysisProgress(0)
    setEvaluationError(null)

    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 10
      })
    }, 300)

    try {
      const requestData = {
        questionId: currentQuestion?.id,
        question: currentQuestion?.question,
        userAnswer: userAnswer,
        keyPoints: currentQuestion?.keyPoints,
        category: currentQuestion?.category,
        difficulty: currentQuestion?.difficulty,
      }

      console.log("📤 [前端] 发送请求数据:", {
        ...requestData,
        userAnswer: requestData.userAnswer.substring(0, 200) + "...",
      })

      const response = await fetch("/api/evaluate-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "评估服务暂时不可用")
      }

      const evaluationResult: EnhancedEvaluationResponse = await response.json()
      console.log("✅ [前端] 收到增强版评估结果:", evaluationResult)

      clearInterval(progressInterval)
      setAnalysisProgress(100)

      setTimeout(() => {
        setScore(evaluationResult.overallScore)
        setFeedback(evaluationResult)
        setCurrentStep("result")
        setUserAnswer("")
      }, 800)
    } catch (error) {
      console.error("💥 [前端] AI评估失败:", error)
      clearInterval(progressInterval)
      setEvaluationError(error instanceof Error ? error.message : "评估失败，请稍后重试")

      const fallbackResult = generateEnhancedFallbackEvaluation(currentQuestion, userAnswer)
      setAnalysisProgress(100)

      setTimeout(() => {
        setScore(fallbackResult.overallScore)
        setFeedback(fallbackResult)
        setCurrentStep("result")
        setUserAnswer("")
      }, 1000)
    }
  }

  const generateEnhancedFallbackEvaluation = (
    question: InterviewQuestion | null,
    answer: string,
  ): EnhancedEvaluationResponse => {
    const baseScore = Math.floor(Math.random() * 20) + 70

    return {
      overallScore: baseScore,
      coreCompetencyScores: {
        productThinking: Math.floor(Math.random() * 3) + 7,
        technicalUnderstanding: Math.floor(Math.random() * 3) + 6,
        projectManagement: Math.floor(Math.random() * 3) + 7,
        businessAcumen: Math.floor(Math.random() * 3) + 6,
      },
      performanceScores: {
        communication: Math.floor(Math.random() * 3) + 7,
        logicalStructure: Math.floor(Math.random() * 3) + 7,
        confidence: Math.floor(Math.random() * 3) + 6,
        adaptability: Math.floor(Math.random() * 3) + 7,
      },
      rating: baseScore >= 85 ? "优秀" : baseScore >= 75 ? "良好" : "需改进",
      highlights: [
        { tag: "逻辑结构", description: "回答结构相对清晰，有一定的逻辑性" },
        { tag: "问题理解", description: "对问题有基本的理解和思考" },
        { tag: "语言表达", description: "表达较为流畅，语言组织能力良好" },
      ],
      improvements: [
        { tag: "案例支撑", description: "建议结合更多具体案例来支撑观点" },
        { tag: "深度分析", description: "可以进一步深入分析问题的本质" },
        { tag: "专业表达", description: "表达可以更加精炼和专业" },
      ],
      strategicSuggestions: [
        {
          tag: "商业价值量化",
          suggestion: "在描述项目成果时，补充具体的ROI数据和业务影响",
          example: "例如：通过该项目，预期可提升用户转化率15%，年化收益增长200万",
        },
        {
          tag: "技术决策深度",
          suggestion: "说明技术选型的战略考量和权衡过程",
          example: "例如：选择该技术方案是基于成本效益分析和长期可维护性考虑",
        },
        {
          tag: "跨职能协作",
          suggestion: "展现作为PM在多团队协作中的协调和推动能力",
          example: "例如：通过建立跨部门沟通机制，确保项目按时交付并达成预期目标",
        },
      ],
    }
  }

  const selectQuestion = (question: InterviewQuestion) => {
    setCurrentQuestion(question)
    setCurrentStep("answering")
    setScore(null)
    setFeedback(null)
    setEvaluationError(null)
    setUserAnswer("")
    console.log("🔄 [前端] 切换到新问题:", {
      questionId: question.id,
      category: question.category,
    })
  }

  const tryAgain = () => {
    setCurrentStep("answering")
    setScore(null)
    setFeedback(null)
    setEvaluationError(null)
    setAnalysisProgress(0)
    setUserAnswer("")
    console.log("🔄 [前端] 重新开始回答")
  }

  useEffect(() => {
    if (currentStep === "answering" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [currentStep, timeLeft])

  useEffect(() => {
    selectRandomQuestion()
  }, [moduleType])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回模块选择
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">F</span>
                </div>
                <span className="font-semibold text-gray-900">FutureU</span>
                <span className="text-gray-500">•</span>
                <span className="text-xl">{config.icon}</span>
                <h1 className="text-xl font-semibold text-gray-900">{config.title}训练</h1>
              </div>
            </div>
            {currentStep === "answering" && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className={`font-mono text-lg ${timeLeft < 30 ? "text-red-500" : "text-orange-500"}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {currentStep === "question" && currentQuestion && (
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-900">面试题目</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {currentQuestion.category}
                    </Badge>
                    <Badge variant="outline" className={`border-${config.color}-200 text-${config.color}-700`}>
                      {currentQuestion.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <p className="text-lg text-gray-800 leading-relaxed">{currentQuestion.question}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Clock className="w-4 h-4 text-gray-600 mr-2" />
                      <span className="font-semibold text-gray-700">建议用时</span>
                    </div>
                    <p className="text-gray-600">{Math.floor(currentQuestion.timeLimit / 60)} 分钟</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Target className="w-4 h-4 text-gray-600 mr-2" />
                      <span className="font-semibold text-gray-700">考察重点</span>
                    </div>
                    <p className="text-gray-600">{currentQuestion.keyPoints.slice(0, 2).join("、")}等</p>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button
                    size="lg"
                    onClick={startAnswering}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    开始回答
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === "answering" && currentQuestion && (
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">{currentQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="请在此输入您的回答..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="min-h-[300px] text-base leading-relaxed"
                />

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">已输入 {userAnswer.length} 字符</div>
                  <Button
                    onClick={submitAnswer}
                    disabled={!userAnswer.trim()}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    完成回答
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === "analyzing" && (
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardContent className="p-8 text-center">
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {evaluationError ? "使用备用评估系统..." : "FutureU AI教练正在分析你的回答..."}
                    </h3>
                    <p className="text-gray-600">
                      {evaluationError ? "AI服务暂时不可用，正在使用备用评估" : "正在进行语义分析和专业评估"}
                    </p>
                    {evaluationError && (
                      <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm text-orange-700">{evaluationError}</p>
                      </div>
                    )}
                  </div>
                  <div className="max-w-md mx-auto">
                    <Progress value={analysisProgress} className="h-2" />
                    <p className="text-sm text-gray-500 mt-2">{Math.round(analysisProgress)}% 完成</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === "result" && feedback && (
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-3xl font-bold text-white">{feedback.overallScore}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">综合得分</h3>
                    <Badge
                      variant="secondary"
                      className={`mt-2 ${
                        feedback.rating === "卓越"
                          ? "bg-purple-100 text-purple-700"
                          : feedback.rating === "优秀"
                            ? "bg-green-100 text-green-700"
                            : feedback.rating === "良好"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {feedback.rating}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  核心能力雷达图
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CoreCompetencyRadarChart coreCompetencyScores={feedback.coreCompetencyScores} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {feedback.coreCompetencyScores.productThinking}
                    </div>
                    <div className="text-sm text-gray-600">产品思维</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {feedback.coreCompetencyScores.technicalUnderstanding}
                    </div>
                    <div className="text-sm text-gray-600">技术理解</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {feedback.coreCompetencyScores.projectManagement}
                    </div>
                    <div className="text-sm text-gray-600">项目管理</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {feedback.coreCompetencyScores.businessAcumen}
                    </div>
                    <div className="text-sm text-gray-600">商业化能力</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-700">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    回答亮点
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {feedback.highlights.map((highlight, index) => (
                      <div key={index} className="border-l-4 border-green-500 pl-4">
                        <div className="flex items-center mb-1">
                          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                            {highlight.tag}
                          </Badge>
                        </div>
                        <p className="text-gray-700 text-sm">{highlight.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-700">
                    <Lightbulb className="w-5 h-5 mr-2" />
                    改进建议
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {feedback.improvements.map((improvement, index) => (
                      <div key={index} className="border-l-4 border-orange-500 pl-4">
                        <div className="flex items-center mb-1">
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                            {improvement.tag}
                          </Badge>
                        </div>
                        <p className="text-gray-700 text-sm">{improvement.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-700">
                  <Target className="w-5 h-5 mr-2" />
                  战略级改进建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Enhanced strategic suggestions display with tags and examples */}
                <div className="space-y-6">
                  {feedback.strategicSuggestions.map((suggestion, index) => (
                    <div key={index} className="border-l-4 border-purple-500 pl-6 py-4 bg-purple-50/50 rounded-r-lg">
                      <div className="flex items-center mb-3">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 font-medium">
                          {suggestion.tag}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">建议</h4>
                          <p className="text-gray-700 leading-relaxed">{suggestion.suggestion}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">你可以补充</h4>
                          <div className="bg-white/80 rounded-lg p-3 border border-purple-200">
                            <p className="text-gray-700 italic leading-relaxed">{suggestion.example}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  参考答案要点
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-gray-700 leading-relaxed">{currentQuestion?.standardAnswer}</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={selectRandomQuestion}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                再来一题
              </Button>
              <Button variant="outline" onClick={onBack}>
                返回模块选择
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
