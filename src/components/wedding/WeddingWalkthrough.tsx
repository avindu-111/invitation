import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowLeft, ArrowRight, CalendarDays, ChevronDown, Compass, MapPin, Sparkles, X } from "lucide-react";
import { CEREMONY_ISO, VENUE, timeLeft } from "@/lib/wedding";

type Stop = { id: string; z: number; eyebrow: string; title: string; body: string; detail: string; image?: string; icon: string };
const STOPS: Stop[] = [
  { id: "welcome", z: 11, eyebrow: "WELCOME TO OUR CELEBRATION", title: "Avindu & Yavishka", body: "Two hearts. One beautiful journey.", detail: "We would be honoured to have you with us as we begin our forever. Walk through our wedding world and discover the details of our special day.", image: "/wedding3d/venue-entrance.webp", icon: "✦" },
  { id: "date", z: 1, eyebrow: "SAVE THE DATE", title: "20 January 2027", body: "Wednesday · 9.00 AM – 3.30 PM", detail: "The Poruwa ceremony is scheduled for 9.42 AM. Join us for a day filled with love, family, traditions and celebration.", image: "/wedding3d/venue-banquet.webp", icon: "♡" },
  { id: "venue", z: -9, eyebrow: "THE CELEBRATION VENUE", title: "Ruwanara Royal Majestry", body: "Narammala, Sri Lanka", detail: "Our celebration will take place at Ruwanara Royal Majestry. Explore the venue photographs and use the directions link to plan your journey.", image: "/wedding3d/venue-main-building.webp", icon: "⌖" },
  { id: "moments", z: -19, eyebrow: "A PLACE FOR MEMORIES", title: "The Celebration", body: "A beautiful day, shared with you.", detail: "From the floral entrance to the reception hall, every detail is part of a day we cannot wait to share with our family and friends.", image: "/wedding3d/venue-reception.webp", icon: "❀" },
  { id: "rsvp", z: -29, eyebrow: "WE HOPE YOU CAN JOIN US", title: "Kindly RSVP", body: "Your presence is our greatest gift.", detail: "Please let us know if you can celebrate with us. You can confirm your attendance through our original wedding invitation page.", image: "/wedding3d/venue-pool-night.webp", icon: "✉" },
];

function makeLabel(title: string, sub: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024; canvas.height = 320;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 1024, 320);
  ctx.fillStyle = "rgba(30,20,16,.78)";
  ctx.strokeStyle = "#d8b66c"; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.roundRect(18, 18, 988, 284, 28); ctx.fill(); ctx.stroke();
  ctx.textAlign = "center";
  ctx.fillStyle = "#e9cf91"; ctx.font = "36px Georgia"; ctx.fillText(sub.toUpperCase(), 512, 105);
  ctx.fillStyle = "#fff9eb"; ctx.font = "italic 72px Georgia"; ctx.fillText(title, 512, 210);
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material); sprite.scale.set(7.5, 2.35, 1);
  return sprite;
}

export function WeddingWalkthrough() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const [panel, setPanel] = useState(false);
  const [seconds, setSeconds] = useState("");
  const progress = useRef(0);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const t = timeLeft(Date.parse(CEREMONY_ISO), Date.now());
      setSeconds(`${t.days} days · ${t.hours} hrs · ${t.minutes} min`);
    };
    tick();
    const timer = window.setInterval(tick, 60000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#17120f");
    scene.fog = new THREE.Fog("#17120f", 18, 58);
    const camera = new THREE.PerspectiveCamera(68, canvas.clientWidth / canvas.clientHeight, .1, 100);
    camera.position.set(0, 1.65, 18);
    camera.lookAt(0, 1.65, 8);

    scene.add(new THREE.HemisphereLight("#fff2d2", "#30221b", 2.0));
    const warm = new THREE.PointLight("#ffd78a", 65, 48); warm.position.set(0, 5, 8); scene.add(warm);
    const goldLight = new THREE.PointLight("#f5c86e", 40, 55); goldLight.position.set(0, 4, -12); scene.add(goldLight);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 62), new THREE.MeshStandardMaterial({ color: "#d8cdbb", roughness: .42, metalness: .08 }));
    floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, -10); floor.receiveShadow = true; scene.add(floor);
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(12, 62), new THREE.MeshStandardMaterial({ color: "#eee5d5", roughness: .9 }));
    ceiling.rotation.x = Math.PI / 2; ceiling.position.set(0, 6.2, -10); scene.add(ceiling);
    const wallMat = new THREE.MeshStandardMaterial({ color: "#f2eadb", roughness: .8 });
    for (const x of [-6, 6]) {
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(62, 6.2), wallMat);
      wall.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2;
      wall.position.set(x, 3.1, -10); wall.receiveShadow = true; scene.add(wall);
      const trim = new THREE.Mesh(new THREE.BoxGeometry(.18, .22, 62), new THREE.MeshStandardMaterial({ color: "#c49a45", metalness: .55, roughness: .3 }));
      trim.position.set(x * .985, 5.7, -10); scene.add(trim);
    }
    const gold = new THREE.MeshStandardMaterial({ color: "#c69b43", metalness: .62, roughness: .28 });
    const dark = new THREE.MeshStandardMaterial({ color: "#39251d", roughness: .65 });
    // Entrance portal and repeating architectural frames create a real sense of depth.
    for (let i = 0; i < 7; i++) {
      const z = 15 - i * 7.3;
      for (const x of [-4.6, 4.6]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(.16, 5.2, .18), gold);
        post.position.set(x, 2.6, z); post.castShadow = true; scene.add(post);
      }
      const beam = new THREE.Mesh(new THREE.BoxGeometry(9.2, .16, .18), gold);
      beam.position.set(0, 5.15, z); beam.castShadow = true; scene.add(beam);
      const lamp = new THREE.PointLight("#ffdc91", 16, 12); lamp.position.set(0, 4.8, z - 1); scene.add(lamp);
    }
    // Floral-inspired hanging ornaments and floor lights.
    for (let i = 0; i < 24; i++) {
      const z = 14 - i * 1.8;
      for (const x of [-5.35, 5.35]) {
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(.07, 12, 12), new THREE.MeshBasicMaterial({ color: "#ffe5a8" }));
        bulb.position.set(x, 4.9 + Math.sin(i * .8) * .22, z); scene.add(bulb);
      }
    }
    // Low platform at the far end, inspired by the reception stage.
    const stage = new THREE.Mesh(new THREE.BoxGeometry(7.5, .55, 2.4), dark);
    stage.position.set(0, .28, -32); stage.castShadow = true; scene.add(stage);
    const stageTop = new THREE.Mesh(new THREE.BoxGeometry(7.4, .08, 2.3), gold);
    stageTop.position.set(0, .6, -32); scene.add(stageTop);

    const loader = new THREE.TextureLoader();
    const imagePanels = [
      { src: "/wedding3d/venue-entrance.webp", x: -5.84, y: 2.7, z: 12 },
      { src: "/wedding3d/venue-pool-night.webp", x: 5.84, y: 2.7, z: 4 },
      { src: "/wedding3d/venue-lobby.webp", x: -5.84, y: 2.7, z: -4 },
      { src: "/wedding3d/venue-banquet.webp", x: 5.84, y: 2.7, z: -12 },
      { src: "/wedding3d/venue-garden.webp", x: -5.84, y: 2.7, z: -20 },
      { src: "/wedding3d/venue-main-building.webp", x: 5.84, y: 2.7, z: -28 },
    ];
    imagePanels.forEach((p) => loader.load(p.src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      const mat = new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide, roughness: .72 });
      const frame = new THREE.Mesh(new THREE.BoxGeometry(.18, 3.1, 4.2), gold);
      frame.position.set(p.x, p.y, p.z); scene.add(frame);
      const photo = new THREE.Mesh(new THREE.PlaneGeometry(3.9, 2.8), mat);
      photo.position.set(p.x + (p.x < 0 ? .11 : -.11), p.y, p.z);
      photo.rotation.y = p.x < 0 ? Math.PI / 2 : -Math.PI / 2; scene.add(photo);
    }));
    STOPS.forEach((s, i) => {
      const sign = makeLabel(s.title, s.eyebrow);
      sign.position.set(0, 3.5, s.z);
      scene.add(sign);
      const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(.12, .18, .8, 20), gold);
      pedestal.position.set(0, .4, s.z); scene.add(pedestal);
      const orb = new THREE.Mesh(new THREE.SphereGeometry(.22, 24, 24), new THREE.MeshStandardMaterial({ color: "#ffe3a0", emissive: "#8a5a16", emissiveIntensity: .8, metalness: .5 }));
      orb.position.set(0, 1, s.z); scene.add(orb);
    });

    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      const dt = Math.min(clock.getDelta(), .05);
      const targetZ = 18 - progress.current * 9.6;
      camera.position.z += (targetZ - camera.position.z) * Math.min(1, dt * 3.2);
      camera.position.x += (0 - camera.position.x) * Math.min(1, dt * 2);
      camera.position.y = 1.65 + Math.sin(clock.elapsedTime * .55) * .035;
      camera.lookAt(0, 1.65, camera.position.z - 8);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();
    const resize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h, false);
    };
    window.addEventListener("resize", resize);
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowRight", " "].includes(e.key)) { e.preventDefault(); progress.current = Math.min(4, progress.current + .12); }
      if (["ArrowUp", "ArrowLeft"].includes(e.key)) { e.preventDefault(); progress.current = Math.max(0, progress.current - .12); }
    };
    const onWheel = (e: WheelEvent) => { progress.current = THREE.MathUtils.clamp(progress.current + e.deltaY * .0022, 0, 4); };
    const onTouchStart = (e: TouchEvent) => { touchX.current = e.touches[0]?.clientX ?? null; };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchX.current === null) return;
      const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
      if (Math.abs(dx) > 24) progress.current = THREE.MathUtils.clamp(progress.current + (dx < 0 ? .22 : -.22), 0, 4);
      touchX.current = null;
    };
    window.addEventListener("keydown", onKey);
    canvas.addEventListener("wheel", onWheel, { passive: true });
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("wheel", onWheel); canvas.removeEventListener("touchstart", onTouchStart); canvas.removeEventListener("touchend", onTouchEnd);
      renderer.dispose(); scene.traverse((o) => { if (o instanceof THREE.Mesh) o.geometry.dispose(); if (o instanceof THREE.Sprite) o.material.dispose(); if (o instanceof THREE.Mesh) { const m = o.material; (Array.isArray(m) ? m : [m]).forEach((x) => x.dispose()); } });
    };
  }, []);

  const goTo = (i: number) => { setActive(i); setPanel(true); progress.current = i; };
  const current = STOPS[active];

  return (
    <main className="walkthrough-shell">
      <canvas ref={canvasRef} className="walkthrough-canvas" aria-label="Interactive 3D wedding venue walkthrough" />
      <div className="walkthrough-vignette" />
      <header className="walkthrough-header">
        <a className="walkthrough-monogram" href="#top">A <span>&</span> Y</a>
        <div className="walkthrough-header-copy"><span>THE WEDDING OF</span><strong>Avindu & Yavishka</strong></div>
        <a className="walkthrough-exit" href="https://invitationaviyaviwedding.lovable.app/" target="_blank" rel="noreferrer">Classic invitation ↗</a>
      </header>
      <div className="walkthrough-intro">
        <span className="walkthrough-kicker">A 3D WEDDING JOURNEY</span>
        <h1>Step into<br /><em>our forever.</em></h1>
        <p>Explore the venue and discover our wedding details along the way.</p>
        <button onClick={() => { progress.current = 0; setActive(0); setPanel(true); }}>Begin the journey <ArrowRight size={16} /></button>
      </div>
      <div className="walkthrough-hud">
        <span><Compass size={15}/> EXPLORE THE VENUE</span>
        <span className="hud-separator" />
        <span>{active + 1} / {STOPS.length}</span>
      </div>
      <nav className="walkthrough-nav" aria-label="Journey stops">
        {STOPS.map((s, i) => <button key={s.id} className={active === i ? "active" : ""} onClick={() => goTo(i)} aria-label={`Go to ${s.title}`}><span>{i + 1}</span><small>{s.title}</small></button>)}
      </nav>
      <div className="walkthrough-controls">
        <button aria-label="Previous stop" onClick={() => goTo(Math.max(0, active - 1))}><ArrowLeft size={17}/></button>
        <span>Scroll / swipe to move through the venue</span>
        <button aria-label="Next stop" onClick={() => goTo(Math.min(STOPS.length - 1, active + 1))}><ArrowRight size={17}/></button>
      </div>
      {panel && <section className="walkthrough-card">
        <button className="walkthrough-close" onClick={() => setPanel(false)} aria-label="Close details"><X size={18}/></button>
        <span className="walkthrough-kicker">{current.eyebrow}</span>
        <h2>{current.title}</h2>
        <p className="walkthrough-lead">{current.body}</p>
        <p>{current.detail}</p>
        {current.image && <img src={current.image} alt={current.title} />}
        {active === 1 && <div className="walkthrough-countdown"><CalendarDays size={17}/><span>{seconds} until we say “I do”</span></div>}
        {active === 2 && <a className="walkthrough-link" href={VENUE.link} target="_blank" rel="noreferrer"><MapPin size={16}/> Get directions</a>}
        {active === 4 && <a className="walkthrough-link" href="https://invitationaviyaviwedding.lovable.app/#rsvp" target="_blank" rel="noreferrer">Open RSVP form <ArrowRight size={16}/></a>}
        <div className="walkthrough-card-actions">
          <button onClick={() => goTo(Math.max(0, active - 1))} disabled={active === 0}>Previous</button>
          <button onClick={() => goTo(Math.min(STOPS.length - 1, active + 1))} disabled={active === STOPS.length - 1}>Next stop <ArrowRight size={15}/></button>
        </div>
      </section>}
      <div className="walkthrough-hint"><Sparkles size={14}/> Use the controls or scroll to explore <ChevronDown size={14}/></div>
      <footer className="walkthrough-footer">MADE WITH LOVE · 20 JANUARY 2027</footer>
    </main>
  );
}
