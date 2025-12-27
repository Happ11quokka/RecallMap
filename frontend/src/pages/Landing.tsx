import { useNavigate } from 'react-router-dom';
import { Network, Search, FileText, ArrowRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-8 h-8 text-nova-600" />
            <span className="text-xl font-bold text-gray-900">NOVA</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-nova-50 rounded-full mb-8">
            <span className="text-nova-700 text-sm font-medium">
              Nodes Of Valuable Archives
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            지식을 <span className="text-nova-600">연결</span>하고,
            <br />
            <span className="text-nova-600">맥락</span>으로 다시 찾으세요
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            흩어진 메모와 자료를 하나의 네트워크로 연결합니다.
            <br />
            AI가 자료 간의 관계를 분석하고, 새로운 통찰을 발견하도록 도와드립니다.
          </p>

          {/* CTA */}
          <button
            onClick={() => navigate('/start')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-nova-600 text-white rounded-xl font-semibold hover:bg-nova-700 transition-colors shadow-lg shadow-nova-200"
          >
            시작하기
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">자료 저장</h3>
            <p className="text-gray-600">
              기사, 논문, 메모, 아이디어를 맥락과 함께 저장합니다.
              AI가 자동으로 요약하고 임베딩을 생성합니다.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Network className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">네트워크 시각화</h3>
            <p className="text-gray-600">
              자료 간의 연결 관계를 네트워크로 시각화합니다.
              강한 연결과 약한 연결을 한눈에 파악하세요.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Agent</h3>
            <p className="text-gray-600">
              자연어로 자료를 검색하고 분석합니다.
              주제 분류, 약한 연결 탐색 등 다양한 분석이 가능합니다.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="max-w-4xl mx-auto mt-24">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            이렇게 사용하세요
          </h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-nova-100 rounded-full flex items-center justify-center text-nova-700 font-semibold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">자료 업로드</h4>
                <p className="text-gray-600">
                  저장하고 싶은 텍스트와 함께 형식(기사/논문/메모/아이디어)과 맥락을 입력합니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-nova-100 rounded-full flex items-center justify-center text-nova-700 font-semibold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">네트워크 탐색</h4>
                <p className="text-gray-600">
                  자료가 쌓이면 자동으로 네트워크가 생성됩니다. 노드를 클릭해서 상세 정보를 확인하세요.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-nova-100 rounded-full flex items-center justify-center text-nova-700 font-semibold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Agent와 대화</h4>
                <p className="text-gray-600">
                  "주제별로 분류해줘", "약한 연결을 찾아줘" 같은 질문으로 자료를 분석하세요.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-nova-100 rounded-full flex items-center justify-center text-nova-700 font-semibold flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">참고 자료 추출</h4>
                <p className="text-gray-600">
                  활동 중 참고한 노드들이 자동으로 기록됩니다. 마무리 단계에서 내보내기 하세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>NOVA - Nodes Of Valuable Archives</p>
        </div>
      </footer>
    </div>
  );
}
