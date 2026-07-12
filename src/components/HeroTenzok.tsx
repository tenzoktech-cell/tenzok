"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Globe2, GraduationCap } from "lucide-react";
import StartJourneyButton from "./StartJourneyModal";
import TenzokNav from "./TenzokNav";

/* ---------------------------------------------------------------- */
/* Assets & constants                                                */
/* ---------------------------------------------------------------- */

const BG_IMAGE_1 =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85";

const BG_IMAGE_2 =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85";

const SPOTLIGHT_R = 260;

const KPIS = [
  { icon: Building2, label: "Real briefs, not toy projects" },
  { icon: Globe2, label: "Remote-first, worldwide" },
  { icon: GraduationCap, label: "Launch-ready mentoring" },
] as const;

/* ---------------------------------------------------------------- */
/* RevealLayer — cursor-following spotlight over the second image    */
/* ---------------------------------------------------------------- */

interface RevealLayerProps {
  image: string;
  cursorX: number;
  cursorY: number;
}

function RevealLayer({ image, cursorX, cursorY }: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  // Keep the mask canvas sized to the viewport.
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Redraw the soft circular mask wherever the smoothed cursor is.
  useEffect(() => {
    const canvas = canvasRef.current;
    const reveal = revealRef.current;
    if (!canvas || !reveal) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createRadialGradient(
      cursorX,
      cursorY,
      0,
      cursorX,
      cursorY,
      SPOTLIGHT_R,
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.4, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.6, "rgba(255, 255, 255, 0.75)");
    gradient.addColorStop(0.75, "rgba(255, 255, 255, 0.4)");
    gradient.addColorStop(0.88, "rgba(255, 255, 255, 0.12)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    const mask = `url(${canvas.toDataURL()})`;
    reveal.style.maskImage = mask;
    reveal.style.webkitMaskImage = mask;
    reveal.style.maskSize = "100% 100%";
    reveal.style.webkitMaskSize = "100% 100%";
  }, [cursorX, cursorY]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: "none" }}
      />
      <div
        ref={revealRef}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{ backgroundImage: `url(${image})` }}
      />
    </>
  );
}

/* ---------------------------------------------------------------- */
/* HeroTenzok                                                        */
/* ---------------------------------------------------------------- */

export default function HeroTenzok() {
  const mouse = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number>(0);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    const loop = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
      setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="bg-black tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <TenzokNav />

      <section
        className="relative w-full overflow-hidden h-screen bg-black"
        style={{ height: "100dvh" }}
      >
        {/* Base image with Ken Burns zoom-out */}
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
          style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
        />

        {/* Cursor spotlight revealing the future-vision layer */}
        <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

        {/* Heading */}
        <div className="absolute top-[14%] left-0 right-0 z-50 flex flex-col items-center text-center px-5 pointer-events-none">
          <h1 className="text-white leading-[0.95]">
            <span
              className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
              style={{ letterSpacing: "-0.05em", animationDelay: "0.25s" }}
            >
              Obsession. Purpose. Excellence.
            </span>
            <span
              className="block font-normal text-4xl sm:text-5xl md:text-6xl -mt-1 hero-anim hero-reveal"
              style={{ letterSpacing: "-0.08em", animationDelay: "0.42s" }}
            >
              We turn projects into careers.
            </span>
          </h1>
        </div>

        {/* Bottom-left statement */}
        <div
          className="hidden sm:block absolute bottom-14 left-10 md:left-14 z-50 max-w-[260px] hero-anim hero-fade"
          style={{ animationDelay: "0.7s" }}
        >
          <p className="text-sm text-white/80 leading-relaxed">
            At Tenzok, we don&rsquo;t just deliver projects. We architect,
            build, and walk students through every decision, so they graduate
            with deployable skills and real-world confidence.
          </p>
        </div>

        {/* Bottom-right block: copy, KPIs, CTAs */}
        <div
          className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 z-50 max-w-full sm:max-w-[280px] flex flex-col items-start gap-4 sm:gap-5 hero-anim hero-fade"
          style={{ animationDelay: "0.85s" }}
        >
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            From capstone projects to startup MVPs, Tenzok mentors teams
            end-to-end&mdash;planning, building, marketing, and launching, so
            every brief becomes a portfolio-ready outcome.
          </p>

          <div className="flex flex-wrap gap-2">
            {KPIS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-white/6 border border-white/10 backdrop-blur-md rounded-full px-3.5 py-2 text-xs text-white/80 transition-all hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/20"
              >
                <Icon size={14} className="text-[#e8702a]" />
                {label}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start gap-3">
            <StartJourneyButton className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30" />
            <Link
              href="/services/mentorship"
              className="border border-white/20 bg-white/5 hover:bg-white/10 text-white/80 text-xs sm:text-sm px-6 py-2 rounded-full flex items-center gap-2 transition-all"
            >
              View Mentorship Tracks
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
