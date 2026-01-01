import { useNavigate } from 'react-router-dom';
import { Star, Loader2, CheckCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useAppStore } from '@/store/useAppStore';
import { saveNewsletterEmail } from '@/lib/supabase';

// 리뷰 데이터
const reviews = [
  { id: 1, name: 'Kim S.', rating: 5, review: '아이디어 정리가 이렇게 쉬워질 줄 몰랐어요. 네트워크 뷰가 정말 직관적입니다!' },
  { id: 2, name: 'Park J.', rating: 5, review: '연구 논문 관리에 최고예요. AI 검색 기능이 특히 유용합니다.' },
  { id: 3, name: 'Lee M.', rating: 4, review: '창작 작업에 필수 도구가 되었습니다. 참고자료 추출 기능이 너무 좋아요.' },
  { id: 4, name: 'Choi Y.', rating: 5, review: '팀 프로젝트에서 사용 중인데, 협업이 훨씬 수월해졌어요.' },
  { id: 5, name: 'Jung H.', rating: 5, review: '복잡한 프로젝트도 한눈에 파악할 수 있어서 업무 효율이 크게 올랐습니다.' },
  { id: 6, name: 'Kang D.', rating: 4, review: '인터페이스가 깔끔하고 사용하기 편해요. 강력 추천합니다!' },
];

// 별점 컴포넌트
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          fill={i < rating ? '#FFD700' : 'transparent'}
          stroke={i < rating ? '#FFD700' : '#666'}
        />
      ))}
    </div>
  );
}

// Three.js 천구 컴포넌트
function CelestialSphereCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene 생성
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1A2B50);

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
      color: 0x5a7faa,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const sphere = new THREE.Mesh(sphereGeometry, wireframeMaterial);
    scene.add(sphere);

    // 내부 구체 (더 밀도 높은 와이어프레임)
    const innerSphereGeometry = new THREE.IcosahedronGeometry(1.8, 3);
    const innerWireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x4a6a8a,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const innerSphere = new THREE.Mesh(innerSphereGeometry, innerWireframeMaterial);
    scene.add(innerSphere);

    // 별 색상 팔레트 (흰색 제외)
    const starColors = [
      new THREE.Color(0xFFD700),
      new THREE.Color(0x87CEEB),
      new THREE.Color(0xFFB6C1),
      new THREE.Color(0x98FB98),
      new THREE.Color(0xDDA0DD),
      new THREE.Color(0xFFA07A),
    ];

    // 별 생성 (배경)
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1500;
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = 3 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi) - 5;

      sizes[i] = Math.random() * 3 + 1;

      let color: THREE.Color;
      if (Math.random() < 0.4) {
        color = new THREE.Color(0xffffff);
      } else {
        color = starColors[Math.floor(Math.random() * starColors.length)];
      }
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // 원형 별을 위한 텍스처 생성
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 32;
    starCanvas.height = 32;
    const ctx = starCanvas.getContext('2d')!;
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(16, 16, 12, 0, Math.PI * 2);
    ctx.fill();
    const starTexture = new THREE.CanvasTexture(starCanvas);

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.06,
      map: starTexture,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      vertexColors: true,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // 추가 큰 별들
    const bigStarsGeometry = new THREE.BufferGeometry();
    const bigStarCount = 100;
    const bigPositions = new Float32Array(bigStarCount * 3);
    const bigColors = new Float32Array(bigStarCount * 3);

    for (let i = 0; i < bigStarCount; i++) {
      const i3 = i * 3;
      bigPositions[i3] = (Math.random() - 0.5) * 20;
      bigPositions[i3 + 1] = (Math.random() - 0.5) * 15;
      bigPositions[i3 + 2] = (Math.random() - 0.5) * 10 - 10;

      let color: THREE.Color;
      if (Math.random() < 0.4) {
        color = new THREE.Color(0xffffff);
      } else {
        color = starColors[Math.floor(Math.random() * starColors.length)];
      }
      bigColors[i3] = color.r;
      bigColors[i3 + 1] = color.g;
      bigColors[i3 + 2] = color.b;
    }

    bigStarsGeometry.setAttribute('position', new THREE.BufferAttribute(bigPositions, 3));
    bigStarsGeometry.setAttribute('color', new THREE.BufferAttribute(bigColors, 3));

    const bigStarsMaterial = new THREE.PointsMaterial({
      size: 0.08,
      map: starTexture,
      transparent: true,
      opacity: 1,
      sizeAttenuation: true,
      vertexColors: true,
    });

    const bigStars = new THREE.Points(bigStarsGeometry, bigStarsMaterial);
    scene.add(bigStars);

    // 애니메이션
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      sphere.rotation.x += 0.001;
      sphere.rotation.y += 0.002;
      innerSphere.rotation.x -= 0.0015;
      innerSphere.rotation.y -= 0.001;

      stars.rotation.x += 0.0003;
      stars.rotation.y += 0.0005;
      bigStars.rotation.x += 0.0002;
      bigStars.rotation.y += 0.0004;

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
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [sectionOpacities, setSectionOpacities] = useState<number[]>([1, 0, 0, 0, 0, 0, 0]);
  const [currentSection, setCurrentSection] = useState(0);
  const [email, setEmail] = useState('');
  const [agreeRequired, setAgreeRequired] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showTeamModal, setShowTeamModal] = useState(false);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const isScrolling = useRef(false);
  const scrollAccumulator = useRef(0);
  const scrollThreshold = 150;

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

  useEffect(() => {
    if (currentSection === 0) {
      setWelcomeVisible(false);
      const showTimer = setTimeout(() => {
        setWelcomeVisible(true);
      }, 1000);
      const hideTimer = setTimeout(() => {
        setWelcomeVisible(false);
      }, 5000);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    } else {
      setWelcomeVisible(false);
    }
  }, [currentSection]);

  useEffect(() => {
    const totalSections = 7;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling.current) return;
      scrollAccumulator.current += e.deltaY;
      if (Math.abs(scrollAccumulator.current) >= scrollThreshold) {
        const direction = scrollAccumulator.current > 0 ? 1 : -1;
        const nextSection = Math.max(0, Math.min(totalSections - 1, currentSection + direction));
        if (nextSection !== currentSection) {
          isScrolling.current = true;
          setCurrentSection(nextSection);
          sectionsRef.current[nextSection]?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
          setTimeout(() => {
            isScrolling.current = false;
          }, 800);
        }
        scrollAccumulator.current = 0;
      }
      clearTimeout((handleWheel as any).resetTimer);
      (handleWheel as any).resetTimer = setTimeout(() => {
        scrollAccumulator.current = 0;
      }, 200);
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [currentSection]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    sectionsRef.current.forEach((section, index) => {
      if (!section) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setSectionOpacities((prev) => {
              const newOpacities = [...prev];
              newOpacities[index] = entry.isIntersecting ? entry.intersectionRatio : 0;
              return newOpacities;
            });
          });
        },
        { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
      );
      observer.observe(section);
      observers.push(observer);
    });
    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <div className="overflow-x-hidden relative">
      {/* 고정 배경 Three.js Canvas */}
      <CelestialSphereCanvas />

      {/* Section 1: Welcome */}
      <section
        ref={(el) => (sectionsRef.current[0] = el)}
        className="section relative bg-transparent transition-opacity duration-500"
        style={{ opacity: sectionOpacities[0] }}
      >
        {/* 중앙 Welcome 멘트 */}
        <div
          className={`absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-1000 ${
            welcomeVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <p className="font-english text-5xl text-white tracking-wider">
            Welcome, explorer! We are <span className="font-bold">NOVA</span>.
          </p>
        </div>

        {/* 우측 하단 버튼들 */}
        <div className="absolute bottom-10 right-10 flex gap-4 z-10">
          <button
            onClick={handleDemoLogin}
            className="glass-btn font-english text-lg tracking-wider"
          >
            DEMO
          </button>
        </div>
      </section>

      {/* Section 2: Vision */}
      <section
        ref={(el) => (sectionsRef.current[1] = el)}
        className="section bg-transparent transition-opacity duration-500"
        style={{ opacity: sectionOpacities[1] }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-english text-7xl mb-12 tracking-wide">VISION</h2>
          <p className="text-xl leading-relaxed text-white/90">
            <span className="emphasis">NOVA</span>는 여러분들의 소중한 아이디어를 체계적으로 관리하고 연결하는
            <span className="emphasis"> 혁신적인 아카이브 플랫폼</span>입니다.
            <br /><br />
            현대 사회에서 우리는 많은 컨텐츠를 접하고, 사유하고, 새로운 가치를 창출합니다.
            <br />
            그 과정에서 때때로 <span className="emphasis">참신한 접근</span> 또한 필요합니다.
            <br /><br />
            <span className="emphasis">NOVA</span>는 그 모든 과정에서 <span className="emphasis">든든한 조력자</span>가 될 것입니다.
          </p>
        </div>
      </section>

      {/* Section 3: Reviews */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        className="section bg-transparent transition-opacity duration-500"
        style={{ opacity: sectionOpacities[2] }}
      >
        <div className="w-full max-w-6xl mx-auto">
          <h2 className="text-3xl text-center mb-12">
            벌써 많은 사람들이 저희의 <span className="emphasis">user</span>입니다!
          </h2>

          {/* 회전하는 리뷰 캐러셀 */}
          <div className="overflow-hidden">
            <div className="review-track">
              {/* 리뷰 카드들 (2배로 복제하여 무한 스크롤 효과) */}
              {[...reviews, ...reviews].map((review, index) => (
                <div
                  key={`${review.id}-${index}`}
                  className="glass-card p-6 min-w-[320px] flex-shrink-0"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-white text-lg">{review.name}</span>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-white/80 text-base leading-relaxed">
                    "{review.review}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: How to Use #1 */}
      <section
        ref={(el) => (sectionsRef.current[3] = el)}
        className="section bg-transparent transition-opacity duration-500"
        style={{ opacity: sectionOpacities[3] }}
      >
        <div className="w-full max-w-6xl mx-auto">
          <h2 className="font-english text-7xl mb-12 text-center tracking-wide">HOW TO USE</h2>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* 메인 스크린샷 */}
            <div className="w-full lg:w-1/2">
              <img
                src="/screenshot-main.png"
                alt="NOVA 메인화면"
                className="w-full h-auto rounded-2xl shadow-2xl border border-white/10"
              />
            </div>

            {/* 설명 텍스트 */}
            <div className="w-full lg:w-1/2 text-left">
              <p className="text-xl leading-relaxed text-white/90">
                <span className="emphasis">직관적인 노드 기반 인터페이스</span>로 모든 정보를 한눈에 파악할 수 있습니다.
                <br /><br />
                <span className="emphasis">zoom in/out</span>을 통해 자료를 쉽게 탐색하세요.
                <br /><br />
                <span className="emphasis">AI agent</span>는 사용자의 요구에 따라 맞춤형 검색을 수행합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: How to Use #2 */}
      <section
        ref={(el) => (sectionsRef.current[4] = el)}
        className="section bg-transparent transition-opacity duration-500"
        style={{ opacity: sectionOpacities[4] }}
      >
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
            {/* 히스토리 스크린샷 */}
            <div className="w-full lg:w-1/2">
              <img
                src="/screenshot-history.png"
                alt="NOVA 히스토리 기능"
                className="w-full h-auto rounded-2xl shadow-2xl border border-white/10"
              />
            </div>

            {/* 설명 텍스트 - 오른쪽 정렬 */}
            <div className="w-full lg:w-1/2 text-right">
              <p className="text-xl leading-relaxed text-white/90">
                노드를 클릭한 <span className="emphasis">히스토리</span>를 기반으로 지금까지 참고했던 자료만을 추출하여 요약합니다.
                <br /><br />
                여러분의 결과물에 <span className="emphasis">신뢰</span>를 더하고, 작업의 흐름을 이해합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Policy (Pricing) */}
      <section
        ref={(el) => (sectionsRef.current[5] = el)}
        className="section bg-transparent transition-opacity duration-500"
        style={{ opacity: sectionOpacities[5] }}
      >
        <div className="w-full max-w-6xl mx-auto">
          <h2 className="font-english text-7xl mb-16 text-center tracking-wide">POLICY</h2>

          {/* 요금제 카드들 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free 요금제 */}
            <div className="glass-pricing p-8 text-center flex flex-col">
              <h3 className="font-english text-4xl mb-4 text-gray-800">FREE</h3>
              <div className="text-5xl font-bold mb-6 text-gray-900">₩0</div>
              <ul className="space-y-4 text-gray-700 text-lg flex-grow">
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-600">&#10003;</span>
                  최대 100개 노드
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-600">&#10003;</span>
                  100GB 저장공간
                </li>
              </ul>
              <button
                onClick={() => {
                  setCurrentSection(6);
                  sectionsRef.current[6]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="w-full py-3 bg-gray-800 text-white rounded-lg font-semibold text-lg hover:bg-gray-700 transition-colors mt-8"
              >
                출시 알림 받기
              </button>
            </div>

            {/* Pro 요금제 */}
            <div className="glass-pricing p-8 text-center relative overflow-hidden flex flex-col">
              <div className="absolute top-4 right-4 bg-purple-600 text-white text-sm px-3 py-1 rounded-full">
                POPULAR
              </div>
              <h3 className="font-english text-4xl mb-4 text-gray-800">PRO</h3>
              <div className="text-5xl font-bold mb-6 text-gray-900">₩15,000<span className="text-xl font-normal">/월</span></div>
              <ul className="space-y-4 text-gray-700 text-lg flex-grow">
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-600">&#10003;</span>
                  무제한 노드
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-600">&#10003;</span>
                  500GB 저장공간
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-600">&#10003;</span>
                  고급 분석 기능
                </li>
              </ul>
              <button
                onClick={() => {
                  setCurrentSection(6);
                  sectionsRef.current[6]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors mt-8"
              >
                출시 알림 받기
              </button>
            </div>

            {/* Team 요금제 */}
            <div className="glass-pricing p-8 text-center flex flex-col">
              <h3 className="font-english text-4xl mb-4 text-gray-800">TEAM</h3>
              <div className="text-5xl font-bold mb-6 text-gray-900">맞춤형</div>
              <ul className="space-y-4 text-gray-700 text-lg flex-grow">
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-600">&#10003;</span>
                  Pro의 모든 기능
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-600">&#10003;</span>
                  맞춤형 저장공간
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-600">&#10003;</span>
                  팀 협업 기능
                </li>
              </ul>
              <button
                onClick={() => setShowTeamModal(true)}
                className="w-full py-3 bg-gray-800 text-white rounded-lg font-semibold text-lg hover:bg-gray-700 transition-colors mt-8"
              >
                문의하기
              </button>
              <p className="text-gray-500 text-sm mt-3">
                팀 협업은 맞춤형 제작을 도와드립니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Notice */}
      <section
        ref={(el) => (sectionsRef.current[6] = el)}
        className="section bg-transparent transition-opacity duration-500"
        style={{ opacity: sectionOpacities[6] }}
      >
        <div className="w-full max-w-3xl mx-auto text-center">
          <h2 className="font-english text-7xl mb-12 tracking-wide">NOTICE</h2>

          <p className="text-xl leading-relaxed text-white/90 mb-12">
            지금 이메일을 등록하면 <span className="emphasis">런칭 소식</span>을 가장 먼저 받아볼 수 있어요.
            <br /><br />
            베타/사전예약 오픈 소식도 함께 안내드릴게요.
          </p>

          {/* 이메일 입력 폼 */}
          <div className="flex flex-col items-center gap-4 mb-12">
            <div className="flex justify-center gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                disabled={isSubmitting || submitStatus === 'success'}
                className="px-6 py-3 w-80 rounded-lg bg-white text-gray-800 border-2 border-purple-500 focus:border-purple-700 focus:outline-none text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleEmailSubmit}
                disabled={isSubmitting || submitStatus === 'success'}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
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
                  '전송'
                )}
              </button>
            </div>
            {submitStatus === 'success' && (
              <p className="text-green-400 text-sm">등록이 완료되었습니다! 런칭 소식을 가장 먼저 알려드릴게요.</p>
            )}
            {submitStatus === 'error' && errorMessage && (
              <p className="text-red-400 text-sm">{errorMessage}</p>
            )}
          </div>

          {/* 개인정보 처리방침 안내 */}
          <div className="glass-card p-6 text-left max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-white">개인정보 처리방침 안내</h3>
            <ul className="text-white/80 space-y-2 text-sm mb-6">
              <li>• 수집 항목: 이메일 주소</li>
              <li>• 수집 목적: 런칭 알림 및 서비스 관련 정보 제공</li>
              <li>• 보유 기간: 수신 거부 시까지</li>
            </ul>

            {/* 동의 체크박스 */}
            <div className="space-y-3 pt-4 border-t border-white/20 flex flex-col items-end">
              <label className="flex items-center gap-3 cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={agreeRequired}
                  onChange={(e) => setAgreeRequired(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-purple-500 accent-purple-600 flex-shrink-0"
                />
                <span className="text-white/90 w-72 text-left">
                  [필수] 개인정보 수집 및 이용에 동의합니다.
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={agreeMarketing}
                  onChange={(e) => setAgreeMarketing(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-purple-500 accent-purple-600 flex-shrink-0"
                />
                <span className="text-white/90 w-72 text-left">
                  [선택] 마케팅 정보 수신에 동의합니다.
                </span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Team 문의 모달 */}
      {showTeamModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowTeamModal(false)}
        >
          <div
            className="glass-card p-8 max-w-md mx-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-4">팀 협업 문의</h3>
            <p className="text-white/90 mb-6 leading-relaxed">
              팀 협업은 현재 맞춤형 제작을 도와드리고 있습니다.
              <br />
              아래 이메일로 문의 부탁드립니다.
            </p>
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <p className="text-white font-mono text-lg select-all">
                limdongxian1207@gmail.com
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <a
                href="mailto:limdongxian1207@gmail.com?subject=[NOVA] 팀 협업 문의"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                이메일 보내기
              </a>
              <button
                onClick={() => setShowTeamModal(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 text-center text-white/50 text-sm" style={{ backgroundColor: '#1A2B50' }}>
        <p>&copy; 2024 <span className="font-bold">NOVA</span> - Nodes Of Valuable Archives. All rights reserved.</p>
      </footer>
    </div>
  );
}
