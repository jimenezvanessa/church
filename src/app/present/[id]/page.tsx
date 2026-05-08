'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Presentation {
  _id: string;
  title: string;
  slides: string[];
  songId: {
    title: string;
    lyrics: string;
  };
}

export default function PresentationViewer() {
  const params = useParams();
  const router = useRouter();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showBack, setShowBack] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        const res = await fetch(`/api/presentations?songId=${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setPresentation(data);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Failed to fetch:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    fetchPresentation();
  }, [params.id, router]);

  const shouldSkip = (text: string) => {
    const pattern = /^(Verse \d+|Chorus|Bridge|Intro|Outro|Pre-Chorus)$/i;
    return pattern.test(text.trim());
  };

  const nextSlide = useCallback(() => {
    if (presentation && currentSlide < presentation.slides.length) {
      let nextIndex = currentSlide + 1;
      while (nextIndex < presentation.slides.length && shouldSkip(presentation.slides[nextIndex - 1])) {
        nextIndex++;
      }
      setCurrentSlide(nextIndex);
    }
  }, [currentSlide, presentation]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 1) {
      setCurrentSlide(currentSlide - 1);
    } else if (currentSlide === 1) {
      setCurrentSlide(0);
    }
  }, [currentSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowLeft') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.();
        }
      }
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape') {
        router.push('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, router]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 100) {
        setShowBack(true);
      } else {
        setShowBack(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartX.current;
    const diffY = touchEndY - touchStartY.current;
    
    if (Math.abs(diffX) > 30 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    } else if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
      if (touchEndX > window.innerWidth / 2) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-blue flex items-center justify-center touch-none">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!presentation) {
    return null;
  }

  const currentText = presentation.slides[currentSlide - 1] || '';
  const lineCount = currentText.split('\n').length;
  const fontSize = lineCount <= 3 ? 'text-3xl md:text-5xl lg:text-6xl xl:text-7xl' : lineCount <= 5 ? 'text-2xl md:text-4xl lg:text-5xl' : 'text-lg md:text-2xl lg:text-3xl';

  if (currentSlide === 0) {
    return (
      <div 
        className="min-h-screen bg-dark-blue flex flex-col items-center justify-center p-4 touch-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <h1 className="text-3xl md:text-6xl lg:text-8xl font-bold text-center text-white">
          {presentation.title}
        </h1>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-dark-blue flex flex-col touch-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className={`fixed top-4 left-4 z-50 transition-opacity duration-300 ${
          showBack ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Link
          href="/"
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-gray-300 hover:text-white transition-all duration-200"
        >
          ← Exit
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="max-w-4xl w-full">
          <div className={`${fontSize} font-bold text-center leading-relaxed whitespace-pre-wrap animate-fade-in`}>
            {currentText}
          </div>
        </div>
      </div>
    </div>
  );
}