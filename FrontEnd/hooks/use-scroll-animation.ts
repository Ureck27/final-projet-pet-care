'use client';

import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';

export interface AnimationOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
}

const presets: Record<string, anime.AnimeParams> = {
  fadeIn: { opacity: [0, 1], duration: 1000, easing: 'easeOutQuad' },
  slideInLeft: { translateX: [-50, 0], opacity: [0, 1], duration: 1000, easing: 'easeOutQuad' },
  slideInRight: { translateX: [50, 0], opacity: [0, 1], duration: 1000, easing: 'easeOutQuad' },
  scaleIn: { scale: [0.9, 1], opacity: [0, 1], duration: 1000, easing: 'easeOutQuad' },
};

export function useScrollAnimation<T extends HTMLElement = HTMLElement>(
  animation: anime.AnimeParams | keyof typeof presets,
  options?: AnimationOptions,
) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Normalize animation to AnimeParams
  const animeParams =
    typeof animation === 'string' ? presets[animation] || { opacity: [0, 1] } : animation;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: options?.threshold || 0.1,
        rootMargin: options?.rootMargin || '0px 0px -50px 0px',
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !ref.current) return;

    const timer = setTimeout(() => {
      anime({
        targets: ref.current,
        ...animeParams,
      });
    }, options?.delay || 0);

    return () => clearTimeout(timer);
  }, [isVisible, animeParams, options?.delay]);

  return ref;
}

// Parallax scroll effect
export function useParallax(speed = 0.5) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * speed;
      element.style.transform = `translateY(${rate}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return ref;
}

// Mouse follow effect
export function useMouseFollow(strength = 0.1) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = element.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const deltaX = (clientX - centerX) * strength;
      const deltaY = (clientY - centerY) * strength;

      anime({
        targets: element,
        translateX: deltaX,
        translateY: deltaY,
        duration: 1000,
        easing: 'easeOutQuad',
      });
    };

    const handleMouseLeave = () => {
      anime({
        targets: element,
        translateX: 0,
        translateY: 0,
        duration: 1000,
        easing: 'easeOutQuad',
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return ref;
}
