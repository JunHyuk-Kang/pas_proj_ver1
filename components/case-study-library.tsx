"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CASE_STUDIES } from "@/lib/storage"
import { Search, Users, Lightbulb, AlertCircle } from "lucide-react"

export function CaseStudyLibrary() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCases = CASE_STUDIES.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.theme.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">과거 봉사 사례집</h2>
        <p className="text-gray-600">이전 봉사단의 경험과 노하우를 참고하여 더 나은 프로그램을 기획하세요</p>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="국가, 주제, 키워드로 검색..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredCases.map((caseStudy) => (
          <Card key={caseStudy.id} className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{caseStudy.title}</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {caseStudy.country}
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {caseStudy.theme}
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {caseStudy.year}년
                </Badge>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{caseStudy.targetAge}</span>
              </div>

              <p className="text-gray-600 leading-relaxed">{caseStudy.summary}</p>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-gray-900">주요 성과</span>
                </div>
                <ul className="space-y-1 ml-6">
                  {caseStudy.highlights.map((highlight, i) => (
                    <li key={i} className="text-gray-700 text-sm list-disc">
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-900">배운 점</span>
                </div>
                <ul className="space-y-1 ml-6">
                  {caseStudy.lessons.map((lesson, i) => (
                    <li key={i} className="text-gray-700 text-sm list-disc">
                      {lesson}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-500">검색 결과가 없습니다</p>
        </Card>
      )}
    </div>
  )
}
