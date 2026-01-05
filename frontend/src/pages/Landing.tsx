import { useNavigate } from 'react-router-dom';
import { Star, Loader2, CheckCircle, Menu, X, ChevronRight, Sparkles, Network, Search, History, Zap, Shield, Globe } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useAppStore } from '@/store/useAppStore';
import { saveNewsletterEmail } from '@/lib/supabase';

// 리뷰 데이터 - 다양한 분류의 작가들
const reviews = [
  { id: 1, name: 'Kim S.', role: '소설가', rating: 5, review: '장편 소설 집필 시 참고자료 관리가 정말 편해졌어요. 캐릭터와 세계관 설정을 네트워크로 연결하니 일관성 유지가 쉬워요.' },
  { id: 2, name: 'Park J.', role: '시나리오 작가', rating: 5, review: '드라마 시나리오 작업에 최고예요. 복선과 에피소드 연결을 한눈에 파악할 수 있습니다.' },
  { id: 3, name: 'Lee M.', role: '시인', rating: 5, review: '시적 영감과 이미지들을 연결해서 관리하니 창작의 흐름이 끊기지 않아요.' },
  { id: 4, name: 'Choi Y.', role: '에세이 작가', rating: 5, review: '일상의 기록들이 어떻게 연결되는지 보면서 새로운 글감을 발견하게 됩니다.' },
  { id: 5, name: 'Jung H.', role: '논픽션 작가', rating: 5, review: '취재 자료와 인터뷰 내용을 체계적으로 정리할 수 있어서 업무 효율이 크게 올랐습니다.' },
  { id: 6, name: 'Kang D.', role: '웹소설 작가', rating: 5, review: '연재 중인 작품의 복잡한 설정을 관리하기 좋아요. AI 검색으로 설정 오류도 바로 찾아냅니다!' },
];

// 기능 데이터
const features = [
  {
    icon: Network,
    title: '노드 기반 시각화',
    description: '아이디어와 자료를 네트워크로 연결하여 관계를 한눈에 파악하세요.'
  },
  {
    icon: Search,
    title: 'AI 맞춤 검색',
    description: 'AI가 맥락을 이해하여 관련 자료를 정확하게 찾아드립니다.'
  },
  {
    icon: History,
    title: '히스토리 기반 요약',
    description: '참고한 자료의 흐름을 추적하고 자동으로 요약해드립니다.'
  },
  {
    icon: Zap,
    title: '빠른 자료 추가',
    description: '기사, 논문, 메모, 아이디어를 손쉽게 아카이브하세요.'
  },
  {
    icon: Shield,
    title: '안전한 데이터 보관',
    description: '소중한 자료를 안전하게 보관하고 언제든 접근하세요.'
  },
  {
    icon: Globe,
    title: '어디서나 접근',
    description: '웹 기반으로 어디서든 자료에 접근할 수 있습니다.'
  }
];

// 별점 컴포넌트
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          fill={i < rating ? '#FBBF24' : 'transparent'}
          stroke={i < rating ? '#FBBF24' : '#6B7280'}
        />
      ))}
    </div>
  );
}

// Three.js 천구 배경 컴포넌트
function CelestialSphereCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene 생성
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);

    // Camera 생성
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Renderer 생성
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // 와이어프레임 구체 생성
    const sphereGeometry = new THREE.IcosahedronGeometry(2, 4);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const sphere = new THREE.Mesh(sphereGeometry, wireframeMaterial);
    scene.add(sphere);

    // 내부 구체 (더 밀도 높은 와이어프레임)
    const innerSphereGeometry = new THREE.IcosahedronGeometry(1.8, 3);
    const innerWireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const innerSphere = new THREE.Mesh(innerSphereGeometry, innerWireframeMaterial);
    scene.add(innerSphere);

    // 별 색상 팔레트
    const starColors = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xa78bfa),
      new THREE.Color(0x818cf8),
      new THREE.Color(0xc4b5fd),
      new THREE.Color(0xe0e7ff),
    ];

    // 별 생성 (배경)
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = 5 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi) - 5;

      const color = starColors[Math.floor(Math.random() * starColors.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // 원형 별을 위한 텍스처 생성
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 32;
    starCanvas.height = 32;
    const ctx = starCanvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    const starTexture = new THREE.CanvasTexture(starCanvas);

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.08,
      map: starTexture,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      vertexColors: true,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // 애니메이션
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      sphere.rotation.x += 0.0008;
      sphere.rotation.y += 0.0012;
      innerSphere.rotation.x -= 0.001;
      innerSphere.rotation.y -= 0.0008;

      stars.rotation.x += 0.0001;
      stars.rotation.y += 0.0002;

      renderer.render(scene, camera);
    };
    animate();

    // 리사이즈 핸들러
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-0" />;
}

export default function Landing() {
  const navigate = useNavigate();
  const { setDemoMode, clearChatMessages } = useAppStore();
  const [email, setEmail] = useState('');
  const [agreeRequired, setAgreeRequired] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      setErrorMessage('이메일을 입력해주세요.');
      setSubmitStatus('error');
      return;
    }
    if (!agreeRequired) {
      setErrorMessage('필수 약관에 동의해주세요.');
      setSubmitStatus('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('올바른 이메일 형식을 입력해주세요.');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await saveNewsletterEmail(email, agreeRequired, agreeMarketing);
      setSubmitStatus('success');
      setEmail('');
      setAgreeRequired(false);
      setAgreeMarketing(false);
    } catch (error: any) {
      setSubmitStatus('error');
      if (error?.code === '23505') {
        setErrorMessage('이미 등록된 이메일입니다.');
      } else {
        setErrorMessage('오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = () => {
    setDemoMode(true);
    clearChatMessages();
    navigate('/app');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen relative">
      {/* Three.js 우주 배경 */}
      <CelestialSphereCanvas />

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-900/90 backdrop-blur-md shadow-lg shadow-black/10' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">NOVA</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-white/70 hover:text-white transition-colors text-sm font-medium">
                기능 소개
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-white/70 hover:text-white transition-colors text-sm font-medium">
                요금제
              </button>
              <button onClick={() => scrollToSection('reviews')} className="text-white/70 hover:text-white transition-colors text-sm font-medium">
                고객 후기
              </button>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={handleDemoLogin}
                className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                데모 체험
              </button>
              <button
                onClick={() => scrollToSection('cta')}
                className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-500 transition-colors"
              >
                시작하기
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-white/10">
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollToSection('features')} className="block w-full text-left py-2 text-white/70 hover:text-white">
                기능 소개
              </button>
              <button onClick={() => scrollToSection('pricing')} className="block w-full text-left py-2 text-white/70 hover:text-white">
                요금제
              </button>
              <button onClick={() => scrollToSection('reviews')} className="block w-full text-left py-2 text-white/70 hover:text-white">
                고객 후기
              </button>
              <hr className="border-white/10 my-3" />
              <button
                onClick={handleDemoLogin}
                className="block w-full text-left py-2 text-white/70 hover:text-white"
              >
                데모 체험
              </button>
              <button
                onClick={() => scrollToSection('cta')}
                className="block w-full py-2.5 bg-violet-600 text-white text-center rounded-lg font-medium"
              >
                시작하기
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Content Container */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-violet-300 rounded-full text-xs font-medium mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI 기반 지식 관리 플랫폼</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
                아이디어를 연결하고,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">맥락을 기억하는</span> AI
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-white/70 mb-6 max-w-2xl mx-auto">
                흩어진 자료와 아이디어를 네트워크로 연결하고, AI가 맥락을 이해하여 필요한 정보를 정확하게 찾아드립니다.
              </p>

              {/* CTA Button */}
              <div className="flex justify-center mb-6">
                <button
                  onClick={handleDemoLogin}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2"
                >
                  데모 체험하기
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Social Proof */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center -space-x-2">
                  {['김', '이', '박', '최', '정'].map((name, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 border-2 border-slate-900 flex items-center justify-center text-white text-xs font-medium"
                    >
                      {name}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/50">
                  <span className="font-semibold text-white/80">10+</span> 명의 사용자가 NOVA와 함께합니다
                </p>
              </div>
            </div>

            {/* Hero Image */}
            <div className="mt-8 relative max-w-4xl mx-auto">
              <div className="absolute -inset-2 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 blur-2xl rounded-2xl" />
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="/screenshot-history.png"
                  alt="NOVA 메인 화면"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                더 스마트한 지식 관리
              </h2>
              <p className="text-lg text-white/60">
                NOVA는 단순한 메모 앱이 아닙니다. AI가 여러분의 지식을 연결하고 맥락을 이해합니다.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-violet-500/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-violet-500/20 group-hover:bg-violet-500 flex items-center justify-center mb-4 transition-colors">
                    <feature.icon className="w-6 h-6 text-violet-400 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/60">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                어떻게 작동하나요?
              </h2>
              <p className="text-lg text-white/60">
                간단한 3단계로 지식 관리를 시작하세요
              </p>
            </div>

            {/* Step 1 & 2: 자료 추가 + AI 챗봇 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
              <div className="order-2 lg:order-1">
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">자료 추가</h3>
                      <p className="text-white/60">기사, 논문, 메모, 아이디어 등 다양한 형식의 자료를 간편하게 추가하세요.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">AI와 대화</h3>
                      <p className="text-white/60">필요한 정보를 AI에게 물어보세요. 맥락을 이해하여 관련 자료를 찾아 정확하게 답변합니다.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 blur-2xl rounded-3xl" />
                  <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/10">
                    <img
                      src="/screenshot-history.png"
                      alt="NOVA AI 챗봇"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: 히스토리 추적 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 blur-2xl rounded-3xl" />
                  <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/10">
                    <img
                      src="/screenshot-main.png"
                      alt="NOVA 네트워크 뷰"
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex gap-4 mb-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full text-sm font-medium mb-2">
                      <History className="w-4 h-4" />
                      <span>히스토리 추적</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                      작업 흐름을 기억합니다
                    </h3>
                  </div>
                </div>
                <p className="text-lg text-white/60 mb-6">
                  클릭한 노드의 히스토리를 기반으로 지금까지 참고했던 자료를 추출하여 요약합니다.
                  결과물에 신뢰를 더하고, 작업의 흐름을 이해할 수 있습니다.
                </p>
                <ul className="space-y-3">
                  {['참고 자료 자동 추적', '맥락 기반 요약 생성', '작업 흐름 시각화'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/80">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                사용자들의 이야기
              </h2>
              <p className="text-lg text-white/60">
                이미 많은 분들이 NOVA로 지식 관리를 혁신하고 있습니다
              </p>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-violet-500/30 transition-all"
                >
                  <StarRating rating={review.rating} />
                  <p className="mt-4 text-white/80 leading-relaxed">
                    "{review.review}"
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="font-semibold text-white">{review.name}</p>
                    <p className="text-sm text-white/50">{review.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                합리적인 요금제
              </h2>
              <p className="text-lg text-white/60 mb-8">
                필요에 맞는 플랜을 선택하세요
              </p>

              {/* Billing Toggle */}
              <div className="inline-flex items-center p-1 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-violet-600 text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  월간
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    billingCycle === 'yearly'
                      ? 'bg-violet-600 text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  연간 <span className={billingCycle === 'yearly' ? 'text-violet-200' : 'text-violet-400'}>-20%</span>
                </button>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Free */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-violet-500/30 transition-all">
                <h3 className="text-xl font-semibold text-white mb-2">Free</h3>
                <p className="text-white/50 text-sm mb-6">개인 사용자를 위한</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">₩0</span>
                  <span className="text-white/50">/월</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['최대 100개 노드', '100GB 저장공간', '기본 AI 검색', '이메일 지원'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => scrollToSection('cta')}
                  className="w-full py-3 border border-white/20 text-white rounded-xl font-medium hover:bg-white/10 transition-colors"
                >
                  출시 알림 받기
                </button>
              </div>

              {/* Pro - Popular */}
              <div className="bg-gradient-to-b from-violet-600/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-violet-500 relative shadow-xl shadow-violet-500/10">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-sm font-medium rounded-full">
                  인기
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
                <p className="text-white/50 text-sm mb-6">전문가를 위한</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">
                    ₩{billingCycle === 'monthly' ? '15,000' : '12,000'}
                  </span>
                  <span className="text-white/50">/월</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['무제한 노드', '500GB 저장공간', '고급 AI 분석', '우선 지원', '히스토리 추적'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => scrollToSection('cta')}
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:from-violet-500 hover:to-indigo-500 transition-all"
                >
                  출시 알림 받기
                </button>
              </div>

              {/* Team */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-violet-500/30 transition-all">
                <h3 className="text-xl font-semibold text-white mb-2">Team</h3>
                <p className="text-white/50 text-sm mb-6">팀을 위한</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">맞춤형</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['Pro의 모든 기능', '무제한 저장공간', '팀 협업 기능', '전담 지원', 'SSO 지원'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/70 text-sm">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowTeamModal(true)}
                  className="w-full py-3 border border-white/20 text-white rounded-xl font-medium hover:bg-white/10 transition-colors"
                >
                  문의하기
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/30 to-indigo-600/30 blur-3xl rounded-3xl" />
              <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-white/20">
                <div className="text-center mb-8">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    지금 바로 시작하세요
                  </h2>
                  <p className="text-lg text-white/70">
                    런칭 소식을 가장 먼저 받아보고, 베타 테스터로 참여하세요.
                  </p>
                </div>

                {/* Email Form */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 입력하세요"
                    disabled={isSubmitting || submitStatus === 'success'}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={handleEmailSubmit}
                    disabled={isSubmitting || submitStatus === 'success'}
                    className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-medium hover:from-violet-500 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        전송 중...
                      </>
                    ) : submitStatus === 'success' ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        완료
                      </>
                    ) : (
                      '알림 신청'
                    )}
                  </button>
                </div>

                {submitStatus === 'success' && (
                  <p className="text-green-400 text-sm mb-4 text-center">등록이 완료되었습니다! 런칭 소식을 가장 먼저 알려드릴게요.</p>
                )}
                {submitStatus === 'error' && errorMessage && (
                  <p className="text-red-400 text-sm mb-4 text-center">{errorMessage}</p>
                )}

                {/* Checkboxes */}
                <div className="space-y-2 text-sm">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeRequired}
                      onChange={(e) => setAgreeRequired(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-white/30 bg-white/10 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-white/70">
                      [필수] 개인정보 수집 및 이용에 동의합니다.
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeMarketing}
                      onChange={(e) => setAgreeMarketing(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-white/30 bg-white/10 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-white/70">
                      [선택] 마케팅 정보 수신에 동의합니다.
                    </span>
                  </label>
                </div>

                <p className="mt-4 text-xs text-white/40 text-center">
                  수집 항목: 이메일 주소 | 수집 목적: 런칭 알림 및 서비스 정보 제공 | 보유 기간: 수신 거부 시까지
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">NOVA</span>
              </div>
              <p className="text-white/40 text-sm">
                &copy; 2024 NOVA - Nodes Of Valuable Archives. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a href="mailto:limdongxian1207@gmail.com" className="text-white/40 hover:text-white transition-colors text-sm">
                  문의하기
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Team Modal */}
      {showTeamModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowTeamModal(false)}
        >
          <div
            className="bg-slate-900 border border-white/20 rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-4">팀 협업 문의</h3>
            <p className="text-white/70 mb-6 leading-relaxed">
              팀 협업은 현재 맞춤형 제작을 도와드리고 있습니다.
              아래 이메일로 문의 부탁드립니다.
            </p>
            <div className="bg-white/10 rounded-xl p-4 mb-6">
              <p className="text-white font-mono text-center select-all">
                limdongxian1207@gmail.com
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="mailto:limdongxian1207@gmail.com?subject=[NOVA] 팀 협업 문의"
                className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-center rounded-xl font-medium hover:from-violet-500 hover:to-indigo-500 transition-all"
              >
                이메일 보내기
              </a>
              <button
                onClick={() => setShowTeamModal(false)}
                className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
