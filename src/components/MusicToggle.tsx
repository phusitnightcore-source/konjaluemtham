"use client";

// เพลงคลอสบายๆ - สังเคราะห์เอง (Web Audio API), self-contained ไม่มีไฟล์ภายนอก
// แนว "เสียงธรรมชาติบำบัด" (Nature Relaxing): สายน้ำ/ฝนเบาๆ + pad อุ่นสงบ + นกเบาๆ
// ปิดเป็นค่าเริ่มต้นเสมอ ไม่เล่นเองอัตโนมัติ (สำคัญในบริบทนี้ spec C12)

import { useEffect, useRef, useState } from "react";

// ไฟล์เพลงคลอของคุณ - วางไว้ที่ public/audio/ (ดู README ในโฟลเดอร์นั้น)
// ถ้าไม่มีไฟล์ ระบบจะเล่นเสียงธรรมชาติสังเคราะห์แทนอัตโนมัติ
const FILE_SRC = "/audio/ambient.mp3";

interface Engine {
  ctx: AudioContext;
  master: GainNode;
  sources: { stop: (t?: number) => void }[]; // oscillator + buffer source
  timers: number[];
}

export default function MusicToggle() {
  const [on, setOn] = useState(false);
  const engineRef = useRef<Engine | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const tokenRef = useRef(0); // กัน race เวลา toggle เร็วๆ ระหว่างไฟล์กำลังโหลด

  // ลองเล่นไฟล์จริงก่อน; คืน true ถ้าเล่นได้ (มีไฟล์)
  function tryPlayFile(): Promise<boolean> {
    return new Promise((resolve) => {
      const audio = new Audio(FILE_SRC);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = 0;
      let settled = false;
      const onReady = () => {
        if (settled) return;
        settled = true;
        audio
          .play()
          .then(() => {
            audioRef.current = audio;
            fadeAudio(audio, 0.4, 3000);
            resolve(true);
          })
          .catch(() => resolve(false));
      };
      const onError = () => {
        if (settled) return;
        settled = true;
        resolve(false);
      };
      audio.addEventListener("canplaythrough", onReady, { once: true });
      audio.addEventListener("error", onError, { once: true });
      audio.load();
      // กันค้าง: ถ้าไม่ ready ใน 3.5 วิ ถือว่าไม่มีไฟล์
      window.setTimeout(onError, 3500);
    });
  }

  function fadeAudio(audio: HTMLAudioElement, to: number, ms: number) {
    if (fadeRef.current) clearInterval(fadeRef.current);
    const steps = 24;
    const from = audio.volume;
    let i = 0;
    fadeRef.current = window.setInterval(() => {
      i++;
      audio.volume = Math.max(0, Math.min(1, from + (to - from) * (i / steps)));
      if (i >= steps && fadeRef.current) {
        clearInterval(fadeRef.current);
        fadeRef.current = null;
      }
    }, ms / steps);
  }

  function stopFile() {
    const audio = audioRef.current;
    if (!audio) return;
    audioRef.current = null;
    fadeAudio(audio, 0, 900);
    window.setTimeout(() => {
      audio.pause();
      audio.src = "";
    }, 1000);
  }

  function startEngine() {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AC();

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.34, ctx.currentTime + 3); // fade in นุ่มๆ

    const sources: Engine["sources"] = [];
    const timers: number[] = [];

    // ---- noise buffer (ใช้ร่วมกันสำหรับฝน + สายน้ำ) ----
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;

    // ฝนเบาๆ: noise ผ่าน lowpass + หายใจช้าๆ
    const rainLP = ctx.createBiquadFilter();
    rainLP.type = "lowpass";
    rainLP.frequency.value = 1600;
    rainLP.Q.value = 0.4;
    const rainGain = ctx.createGain();
    rainGain.gain.value = 0.09;
    noise.connect(rainLP);
    rainLP.connect(rainGain);
    rainGain.connect(master);

    // สายน้ำไหล: noise ผ่าน bandpass + LFO ขยับความถี่ให้รู้สึกไหลริน
    const streamBP = ctx.createBiquadFilter();
    streamBP.type = "bandpass";
    streamBP.frequency.value = 750;
    streamBP.Q.value = 0.9;
    const streamGain = ctx.createGain();
    streamGain.gain.value = 0.06;
    noise.connect(streamBP);
    streamBP.connect(streamGain);
    streamGain.connect(master);
    noise.start();
    sources.push(noise);

    const streamLfo = ctx.createOscillator();
    streamLfo.frequency.value = 0.18;
    const streamLfoGain = ctx.createGain();
    streamLfoGain.gain.value = 260;
    streamLfo.connect(streamLfoGain);
    streamLfoGain.connect(streamBP.frequency);
    streamLfo.start();
    sources.push(streamLfo);

    // ---- pad อุ่นสงบ (คอร์ด A minor + fifth) ผ่าน lowpass ----
    const padLP = ctx.createBiquadFilter();
    padLP.type = "lowpass";
    padLP.frequency.value = 650;
    padLP.Q.value = 0.4;
    const padGain = ctx.createGain();
    padGain.gain.value = 0.14;
    padLP.connect(padGain);
    padGain.connect(master);

    const chord = [110, 164.81, 220, 246.94]; // A2 · E3 · A3 · B3
    chord.forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      o.detune.value = (i - 1.5) * 3;
      o.connect(padLP);
      o.start();
      sources.push(o);
    });

    // LFO หายใจช้าๆ ที่ master
    const breatheLfo = ctx.createOscillator();
    breatheLfo.frequency.value = 0.05;
    const breatheGain = ctx.createGain();
    breatheGain.gain.value = 0.03;
    breatheLfo.connect(breatheGain);
    breatheGain.connect(master.gain);
    breatheLfo.start();
    sources.push(breatheLfo);

    // ---- เสียงนกเบาๆ เป็นระยะ (สุ่ม, ไม่ถี่) ----
    const birdBus = ctx.createGain();
    birdBus.gain.value = 0.05;
    birdBus.connect(master);

    const bird = () => {
      if (!engineRef.current) return;
      const notes = 2 + Math.floor(Math.random() * 2);
      const startF = 1900 + Math.random() * 700;
      for (let n = 0; n < notes; n++) {
        const o = ctx.createOscillator();
        o.type = "sine";
        const g = ctx.createGain();
        g.gain.value = 0;
        o.connect(g);
        g.connect(birdBus);
        const t = ctx.currentTime + n * 0.16;
        const f = startF * (1 + n * 0.06);
        o.frequency.setValueAtTime(f, t);
        o.frequency.linearRampToValueAtTime(f * 1.12, t + 0.08);
        g.gain.linearRampToValueAtTime(0.5, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
        o.start(t);
        o.stop(t + 0.2);
      }
      timers.push(window.setTimeout(bird, 9000 + Math.random() * 14000));
    };
    timers.push(window.setTimeout(bird, 5000 + Math.random() * 4000));

    // ---- ระฆัง/ฟลุตนุ่มๆ เป็นระยะ (A pentatonic) ----
    const bellBus = ctx.createGain();
    bellBus.gain.value = 0.09;
    const bellLP = ctx.createBiquadFilter();
    bellLP.type = "lowpass";
    bellLP.frequency.value = 1300;
    bellBus.connect(bellLP);
    bellLP.connect(master);

    const scale = [220, 277.18, 329.63, 369.99, 440];
    const bell = () => {
      if (!engineRef.current) return;
      const f = scale[Math.floor(Math.random() * scale.length)] * (Math.random() < 0.25 ? 2 : 1);
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0;
      o.connect(g);
      g.connect(bellBus);
      const t = ctx.currentTime;
      g.gain.linearRampToValueAtTime(0.5, t + 0.6);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 4);
      o.start(t);
      o.stop(t + 4.2);
      timers.push(window.setTimeout(bell, 7000 + Math.random() * 9000));
    };
    timers.push(window.setTimeout(bell, 4000));

    engineRef.current = { ctx, master, sources, timers };
  }

  function stopEngine() {
    const e = engineRef.current;
    if (!e) return;
    engineRef.current = null;
    e.timers.forEach((t) => clearTimeout(t));
    const now = e.ctx.currentTime;
    try {
      e.master.gain.cancelScheduledValues(now);
      e.master.gain.setValueAtTime(e.master.gain.value, now);
      e.master.gain.linearRampToValueAtTime(0, now + 1.2);
    } catch {
      // ignore
    }
    window.setTimeout(() => {
      e.sources.forEach((s) => {
        try {
          s.stop();
        } catch {
          // already stopped
        }
      });
      e.ctx.close().catch(() => {});
    }, 1400);
  }

  async function toggle() {
    const token = ++tokenRef.current;
    if (on) {
      stopFile();
      stopEngine();
      setOn(false);
      return;
    }
    setOn(true);
    // ลองเล่นไฟล์จริงก่อน; ถ้าไม่มีไฟล์ค่อยใช้เสียงสังเคราะห์
    const playedFile = await tryPlayFile();
    if (token !== tokenRef.current) {
      // ผู้ใช้กดปิดไปแล้วระหว่างรอโหลด - ยกเลิก
      stopFile();
      return;
    }
    if (!playedFile) {
      try {
        startEngine();
      } catch {
        setOn(false);
      }
    }
  }

  useEffect(() => {
    return () => {
      if (fadeRef.current) clearInterval(fadeRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      const e = engineRef.current;
      if (e) {
        e.timers.forEach((t) => clearTimeout(t));
        e.ctx.close().catch(() => {});
        engineRef.current = null;
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      className="music-toggle no-print"
      aria-pressed={on}
      aria-label={on ? "ปิดเสียงธรรมชาติ" : "เปิดเสียงธรรมชาติคลอสบายๆ"}
      title={on ? "ปิดเสียงคลอ" : "เปิดเสียงธรรมชาติคลอสบายๆ"}
    >
      {on && <span className="music-ring" aria-hidden />}
      <span aria-hidden style={{ position: "relative", zIndex: 1 }}>
        {on ? <NoteOn /> : <NoteOff />}
      </span>
    </button>
  );
}

function NoteOn() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l10-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="16" cy="16" r="3" />
    </svg>
  );
}
function NoteOff() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l10-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="16" cy="16" r="3" />
      <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
