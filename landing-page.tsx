"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Briefcase, Target, CheckCircle, ArrowRight, Play, BarChart3, Brain, Zap, LogIn } from "lucide-react"
import { useState } from "react"
import InterviewPractice from "./interview-practice"
import AuthModal from "./auth-modal"
import UserMenu from "./user-menu"

interface User {
  email: string
  // 可以添加更多用户信息
}

export default function LandingPage() {
  const [currentView, setCurrentView] = useState<"home" | "modules" | "practice">("home")
  const [selectedModule, setSelectedModule] = useState<"hr" | "professional" | "final">("hr")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const features = [
    {
      icon: Brain,
      title: "AI智能评估",
      description: "基于语义比对技术，精准分析回答质量和覆盖度",
    },
    {
      icon: BarChart3,
      title: "专业反馈",
      description: "详细的得分分析和改进建议，助您快速提升",
    },
    {
      icon: Zap,
      title: "实时练习",
      description: "随机抽题，仿真面试环境，让练习更高效",
    },
  ]

  const modules = [
    {
      id: 1,
      key: "hr" as const,
      title: "HR面试",
      subtitle: "模块一",
      description: "考察AI PM求职动机、软技能和个人素质",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      features: ["自我介绍与职业规划", "为什么选择AI PM", "团队协作经验", "沟通表达能力", "抗压能力评估"],
      duration: "30-45分钟",
      difficulty: "基础",
      questionCount: "15-20题",
      completionRate: "92%",
    },
    {
      id: 2,
      key: "professional" as const,
      title: "专业面试",
      subtitle: "模块二",
      description: "考察AI产品能力、技术理解和行业认知",
      icon: Briefcase,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      features: ["AI产品设计思维", "技术与商业平衡", "用户需求分析", "竞品分析能力", "数据驱动决策"],
      duration: "45-60分钟",
      difficulty: "进阶",
      questionCount: "20-25题",
      completionRate: "87%",
    },
    {
      id: 3,
      key: "final" as const,
      title: "终面",
      subtitle: "模块三",
      description: "考察AI行业洞察、战略思维和领导潜质",
      icon: Target,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      features: ["AI行业趋势判断", "复杂场景分析", "商业模式设计", "团队管理能力", "创新思维展示"],
      duration: "60-90分钟",
      difficulty: "高级",
      questionCount: "10-15题",
      completionRate: "78%",
    },
  ]

  // 模拟登录函数 - 后续替换为真实API调用
  const handleLogin = async (email: string, password: string) => {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 模拟登录成功
    setUser({ email })
    console.log("Login:", { email, password })
  }

  // 模拟注册函数 - 后续替换为真实API调用
  const handleRegister = async (email: string, password: string, confirmPassword: string) => {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("Register:", { email, password, confirmPassword })
  }

  // 模拟忘记密码函数 - 后续替换为真实API调用
  const handleForgotPassword = async (email: string) => {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Forgot password:", { email })
  }

  // 退出登录
  const handleLogout = () => {
    setUser(null)
    setCurrentView("home")
  }

  const startPractice = (moduleKey: "hr" | "professional" | "final") => {
    setSelectedModule(moduleKey)
    setCurrentView("practice")
  }

  if (currentView === "practice") {
    return <InterviewPractice moduleType={selectedModule} onBack={() => setCurrentView("modules")} />
  }

  if (currentView === "modules") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header with back button */}
        <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView("home")}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ← 返回首页
                </Button>
                <div className="h-6 w-px bg-gray-300" />
                <h1 className="text-xl font-semibold text-gray-900">FutureU - AI产品经理面试训练</h1>
              </div>
              <div className="flex items-center space-x-4">
                {user ? (
                  <UserMenu userEmail={user.email} onLogout={handleLogout} />
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center space-x-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>登录</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Enhanced Header */}
          <div className="text-center mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-green-600/10 rounded-3xl blur-3xl" />
            <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                🤖 FutureU - AI产品经理专业训练平台
              </Badge>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
                选择您的面试模块
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                专为AI产品经理打造的智能面试训练系统，助您在AI时代脱颖而出
              </p>
              <div className="mt-8 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center mb-2">
                    <Users className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-semibold text-blue-900">HR面试模块</span>
                  </div>
                  <p className="text-sm text-blue-700">考察AI PM求职动机、软技能和个人素质</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <div className="flex items-center mb-2">
                    <Briefcase className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-900">专业面试模块</span>
                  </div>
                  <p className="text-sm text-green-700">考察AI产品能力、技术理解和行业认知</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <div className="flex items-center mb-2">
                    <Target className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="font-semibold text-purple-900">终面模块</span>
                  </div>
                  <p className="text-sm text-purple-700">考察AI行业洞察、战略思维和领导潜质</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Module Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {modules.map((module, index) => {
              const IconComponent = module.icon
              return (
                <Card
                  key={module.id}
                  className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-white/20"
                >
                  {/* Animated background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />

                  {/* Progress indicator */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
                    <div
                      className={`h-full bg-gradient-to-r ${module.color} transition-all duration-1000`}
                      style={{ width: module.completionRate }}
                    />
                  </div>

                  <div className="relative p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className={`${module.bgColor} ${module.textColor} border-0`}>
                        {module.subtitle}
                      </Badge>
                      <div
                        className={`p-3 rounded-xl ${module.bgColor} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className={`w-6 h-6 ${module.textColor}`} />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
                    <p className="text-gray-600 mb-6">{module.description}</p>

                    {/* Enhanced Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-sm font-semibold text-gray-900">{module.duration}</div>
                        <div className="text-xs text-gray-500">预计时长</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-sm font-semibold text-gray-900">{module.questionCount}</div>
                        <div className="text-xs text-gray-500">题目数量</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-sm font-semibold text-gray-900">{module.difficulty}</div>
                        <div className="text-xs text-gray-500">难度等级</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center">
                        <div className="text-sm font-semibold text-gray-900">{module.completionRate}</div>
                        <div className="text-xs text-gray-500">完成率</div>
                      </div>
                    </div>

                    {/* Features with checkmarks */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-sm mb-3 text-gray-700">核心能力训练：</h4>
                      <div className="space-y-2">
                        {module.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                        {module.features.length > 3 && (
                          <div className="text-sm text-gray-500 ml-6">+{module.features.length - 3} 项更多训练</div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-3">
                      <Button
                        onClick={() => startPractice(module.key)}
                        className={`w-full bg-gradient-to-r ${module.color} hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                        size="lg"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        开始训练
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-white/50 hover:bg-white/80 transition-all duration-300"
                        size="sm"
                      >
                        查看详情
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {/* Enhanced Features Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">AI驱动的智能训练</h2>
              <p className="text-gray-600">专业的AI产品经理面试训练平台，助您提升面试成功率</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div key={index} className="text-center group">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onForgotPassword={handleForgotPassword}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000" />
        </div>

        {/* Header */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <span className="text-xl font-bold text-gray-900">FutureU</span>
              </div>
              <div className="flex items-center space-x-4">
                {user ? (
                  <UserMenu userEmail={user.email} onLogout={handleLogout} />
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>登录</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            {/* Badge */}
            <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm">
              🤖 专为AI产品经理打造的智能面试训练平台
            </Badge>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                FutureU
              </span>
              <br />
              <span className="text-gray-900">AI产品经理面试训练</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              基于真实AI产品经理面试场景，提供个性化训练方案
              <br />
              <span className="text-blue-600 font-semibold">让您在AI时代的职场竞争中脱颖而出</span>
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => setCurrentView("modules")}
              >
                <Play className="w-5 h-5 mr-2" />
                立即开始AI PM面试训练
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              >
                了解更多
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* 三大核心训练模块 */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">三大核心训练模块</h2>
              <p className="text-xl text-gray-600 mb-12">从基础到高级，全方位提升您的AI产品经理面试能力</p>

              <div className="grid md:grid-cols-3 gap-8">
                {modules.map((module, index) => {
                  const IconComponent = module.icon
                  return (
                    <Card
                      key={module.id}
                      className="bg-white/80 backdrop-blur-sm border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                    >
                      <CardContent className="p-8 text-center">
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${module.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <Badge className={`mb-4 ${module.bgColor} ${module.textColor} border-0`}>
                          {module.subtitle}
                        </Badge>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{module.title}</h3>
                        <p className="text-gray-600 mb-4">{module.description}</p>
                        <div className="text-sm text-gray-500">
                          {module.questionCount} • {module.difficulty}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="text-center mt-12">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => setCurrentView("modules")}
                >
                  开始您的FutureU学习之旅
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onForgotPassword={handleForgotPassword}
      />
    </div>
  )
}
