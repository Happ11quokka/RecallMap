import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

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
    const width = container.clientWidth;
    const height = container.clientHeight;

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

    // 별 생성 (배경)
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1500;
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      // 구체 주변과 배경에 별 배치
      const radius = 3 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi) - 5;

      sizes[i] = Math.random() * 3 + 1;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // 사각형 별을 위한 텍스처 생성
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 32;
    starCanvas.height = 32;
    const ctx = starCanvas.getContext('2d')!;
    ctx.fillStyle = 'white';
    ctx.fillRect(4, 4, 24, 24);
    const starTexture = new THREE.CanvasTexture(starCanvas);

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      map: starTexture,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // 추가 큰 별들
    const bigStarsGeometry = new THREE.BufferGeometry();
    const bigStarCount = 100;
    const bigPositions = new Float32Array(bigStarCount * 3);

    for (let i = 0; i < bigStarCount; i++) {
      const i3 = i * 3;
      bigPositions[i3] = (Math.random() - 0.5) * 20;
      bigPositions[i3 + 1] = (Math.random() - 0.5) * 15;
      bigPositions[i3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }

    bigStarsGeometry.setAttribute('position', new THREE.BufferAttribute(bigPositions, 3));

    const bigStarsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.15,
      map: starTexture,
      transparent: true,
      opacity: 1,
      sizeAttenuation: true,
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

      // 별들도 함께 회전
      stars.rotation.x += 0.0003;
      stars.rotation.y += 0.0005;
      bigStars.rotation.x += 0.0002;
      bigStars.rotation.y += 0.0004;

      renderer.render(scene, camera);
    };
    animate();

    // 리사이즈 핸들러
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
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

  return <div ref={containerRef} className="absolute inset-0" />;
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-hidden">
      {/* Section 1: Welcome */}
      <section className="section relative">
        {/* Three.js Canvas */}
        <CelestialSphereCanvas />

        {/* 상단 좌측 멘트 */}
        <div className="absolute top-8 left-10 z-10">
          <p className="font-code text-2xl text-white tracking-wide">
            Welcome, explorer! We are NOVA.
          </p>
        </div>

        {/* 우측 하단 버튼들 */}
        <div className="absolute bottom-10 right-10 flex gap-4 z-10">
          <button
            onClick={() => navigate('/start')}
            className="glass-btn font-english text-lg tracking-wider"
          >
            SIGN UP
          </button>
          <button
            onClick={() => navigate('/app')}
            className="glass-btn font-english text-lg tracking-wider"
          >
            LOG IN
          </button>
        </div>
      </section>

      {/* Section 2: Vision */}
      <section className="section">
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
            NOVA는 그 모든 과정에서 <span className="emphasis">든든한 조력자</span>가 될 것입니다.
          </p>
        </div>
      </section>

      {/* Section 3: Reviews */}
      <section className="section">
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
      <section className="section">
        <div className="w-full max-w-6xl mx-auto">
          <h2 className="font-english text-7xl mb-12 text-center tracking-wide">HOW TO USE</h2>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* 이미지 플레이스홀더 */}
            <div className="w-full lg:w-1/2">
              <div className="placeholder-image w-full h-[400px]">
                <span className="text-xl">메인화면 스크린샷</span>
              </div>
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
      <section className="section">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
            {/* 이미지 플레이스홀더 */}
            <div className="w-full lg:w-1/2">
              <div className="placeholder-image w-full h-[400px]">
                <span className="text-xl">히스토리 기능 스크린샷</span>
              </div>
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
      <section className="section">
        <div className="w-full max-w-6xl mx-auto">
          <h2 className="font-english text-7xl mb-16 text-center tracking-wide">POLICY</h2>

          {/* 요금제 카드들 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free 요금제 */}
            <div className="glass-pricing p-8 text-center">
              <h3 className="font-english text-4xl mb-4 text-gray-800">FREE</h3>
              <div className="text-5xl font-bold mb-6 text-gray-900">$0</div>
              <ul className="space-y-4 text-gray-700 mb-8 text-lg">
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-600">&#10003;</span>
                  최대 100개 노드
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-600">&#10003;</span>
                  100GB 저장공간
                </li>
              </ul>
              <button className="w-full py-3 bg-gray-800 text-white rounded-lg font-semibold text-lg hover:bg-gray-700 transition-colors">
                시작하기
              </button>
            </div>

            {/* Pro 요금제 */}
            <div className="glass-pricing p-8 text-center relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-purple-600 text-white text-sm px-3 py-1 rounded-full">
                POPULAR
              </div>
              <h3 className="font-english text-4xl mb-4 text-gray-800">PRO</h3>
              <div className="text-5xl font-bold mb-6 text-gray-900">$9.99<span className="text-xl font-normal">/월</span></div>
              <ul className="space-y-4 text-gray-700 mb-8 text-lg">
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
              <button className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors">
                업그레이드
              </button>
            </div>

            {/* Premium 요금제 */}
            <div className="glass-pricing p-8 text-center">
              <h3 className="font-english text-4xl mb-4 text-gray-800">PREMIUM</h3>
              <div className="text-5xl font-bold mb-6 text-gray-900">$24.99<span className="text-xl font-normal">/월</span></div>
              <ul className="space-y-4 text-gray-700 mb-8 text-lg">
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-600">&#10003;</span>
                  Pro의 모든 기능
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-600">&#10003;</span>
                  1TB 저장공간
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="text-green-600">&#10003;</span>
                  팀 협업 가능
                </li>
              </ul>
              <button className="w-full py-3 bg-gray-800 text-white rounded-lg font-semibold text-lg hover:bg-gray-700 transition-colors">
                팀 시작하기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-white/50 text-sm" style={{ backgroundColor: '#1A2B50' }}>
        <p>&copy; 2024 NOVA - Nodes Of Valuable Archives. All rights reserved.</p>
      </footer>
    </div>
  );
}
