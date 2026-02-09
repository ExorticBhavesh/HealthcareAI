import { useState, useCallback, useEffect, useRef } from 'react';

type RiskLevel = 'low' | 'medium' | 'high';

const riskLabels: Record<RiskLevel, string> = {
  low: 'Low',
  medium: 'Moderate',
  high: 'Attention Needed',
};

function getRiskMessage(level: RiskLevel): string {
  return `Your current health risk level is ${riskLabels[level]}. Please take appropriate wellness actions.`;
}

export function useRiskVoiceFeedback() {
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('wellness_voice_enabled');
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const analysisIdRef = useRef<string | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Persist voice preference
  useEffect(() => {
    try {
      localStorage.setItem('wellness_voice_enabled', String(voiceEnabled));
    } catch {
      // ignore
    }
  }, [voiceEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  // Sync speaking state
  useEffect(() => {
    if (!isSupported) return;
    const interval = setInterval(() => {
      const speaking = window.speechSynthesis.speaking;
      const paused = window.speechSynthesis.paused;
      if (!speaking && !paused && isSpeaking) {
        setIsSpeaking(false);
        setIsPaused(false);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [isSupported, isSpeaking]);

  const speak = useCallback((riskLevel: RiskLevel) => {
    if (!isSupported || !voiceEnabled) return;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    window.speechSynthesis.cancel();

    const message = getRiskMessage(riskLevel);
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    utterance.lang = 'en-US';

    // Pick a calm, clear voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Natural'))
    );
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setHasSpoken(true);
  }, [isSupported, voiceEnabled]);

  const play = useCallback((riskLevel: RiskLevel) => {
    if (isPaused && isSupported) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
    } else {
      speak(riskLevel);
    }
  }, [isPaused, isSupported, speak]);

  const pause = useCallback(() => {
    if (isSupported && isSpeaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  }, [isSupported, isSpeaking]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [isSupported]);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled((prev) => {
      if (prev) {
        // Turning off — stop any speech
        if (isSupported) window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
      }
      return !prev;
    });
  }, [isSupported]);

  const autoSpeak = useCallback((riskLevel: RiskLevel, analysisId: string) => {
    if (analysisIdRef.current === analysisId) return; // Already spoke for this analysis
    analysisIdRef.current = analysisId;
    setHasSpoken(false);

    if (voiceEnabled && isSupported) {
      // Short delay to let the modal render first
      setTimeout(() => speak(riskLevel), 600);
    }
  }, [voiceEnabled, isSupported, speak]);

  return {
    voiceEnabled,
    isSpeaking,
    isPaused,
    hasSpoken,
    isSupported,
    play,
    pause,
    stop,
    toggleVoice,
    autoSpeak,
  };
}
