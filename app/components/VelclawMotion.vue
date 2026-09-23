<template>
  <section class="velclaw-motion" aria-label="Velclaw animated overview">
    <div class="velclaw-motion-glow" aria-hidden="true" />
    <div class="velclaw-motion-grid" aria-hidden="true" />
    <div class="velclaw-motion-card">
      <div class="velclaw-motion-topline">
        <span class="velclaw-motion-dot" />
        <span>VELCLAW / RUNTIME</span>
        <span class="velclaw-motion-status">ONLINE</span>
      </div>

      <div class="velclaw-motion-stage" aria-hidden="true">
        <svg viewBox="0 0 720 360" role="presentation">
          <defs>
            <linearGradient id="velclawMotionStroke" x1="0" x2="1">
              <stop offset="0" stop-color="#a855f7" />
              <stop offset="1" stop-color="#67e8f9" />
            </linearGradient>
            <radialGradient id="velclawMotionSmoke">
              <stop offset="0" stop-color="#a855f7" stop-opacity=".3" />
              <stop offset=".55" stop-color="#67e8f9" stop-opacity=".08" />
              <stop offset="1" stop-color="#000" stop-opacity="0" />
            </radialGradient>
            <filter id="velclawMotionBlur">
              <feGaussianBlur stdDeviation="24" />
            </filter>
          </defs>

          <ellipse class="velclaw-motion-smoke smoke-a" cx="210" cy="190" rx="180" ry="95" fill="url(#velclawMotionSmoke)" filter="url(#velclawMotionBlur)" />
          <ellipse class="velclaw-motion-smoke smoke-b" cx="520" cy="145" rx="160" ry="90" fill="url(#velclawMotionSmoke)" filter="url(#velclawMotionBlur)" />

          <path class="velclaw-motion-orbit orbit-a" d="M80 250 C180 30 540 25 650 215" fill="none" stroke="url(#velclawMotionStroke)" stroke-width="1.5" stroke-dasharray="4 12" />
          <path class="velclaw-motion-orbit orbit-b" d="M110 110 C280 330 505 320 625 90" fill="none" stroke="url(#velclawMotionStroke)" stroke-width="1" stroke-opacity=".45" stroke-dasharray="2 16" />

          <g class="velclaw-motion-v">
            <path d="M250 92 L360 268 L470 92" fill="none" stroke="url(#velclawMotionStroke)" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M250 92 L360 268 L470 92" fill="none" stroke="white" stroke-opacity=".7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 20" />
          </g>

          <circle class="velclaw-motion-node node-a" cx="250" cy="92" r="5" fill="#c084fc" />
          <circle class="velclaw-motion-node node-b" cx="360" cy="268" r="6" fill="#67e8f9" />
          <circle class="velclaw-motion-node node-c" cx="470" cy="92" r="5" fill="#c084fc" />
        </svg>
      </div>

      <div class="velclaw-motion-code" aria-hidden="true">
        <span>agent</span><b> → </b><span>runtime</span><b> → </b><span>docs</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.velclaw-motion {
  position: relative;
  width: 100%;
  max-width: 980px;
  margin: clamp(1.25rem, 4vw, 3rem) auto clamp(2rem, 6vw, 4.5rem);
  min-width: 0;
  overflow: hidden;
  border-radius: clamp(1rem, 2.5vw, 1.5rem);
  isolation: isolate;
  contain: layout paint;
  background: #08070d;
  border: 1px solid color-mix(in srgb, #a855f7 22%, transparent);
  box-shadow:
    0 30px 100px color-mix(in srgb, #a855f7 14%, transparent),
    inset 0 1px 0 rgb(255 255 255 / 7%);
}

.velclaw-motion::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgb(255 255 255 / 4%), transparent 30%, rgb(0 0 0 / 24%));
  z-index: 3;
}

.velclaw-motion-glow {
  position: absolute;
  width: 65%;
  aspect-ratio: 1;
  left: 17%;
  top: 12%;
  border-radius: 999px;
  background: radial-gradient(circle, rgb(168 85 247 / 18%), transparent 68%);
  filter: blur(18px);
  animation: velclaw-motion-breathe 7s ease-in-out infinite alternate;
  pointer-events: none;
}

.velclaw-motion-grid {
  position: absolute;
  inset: 0;
  opacity: .22;
  background-image:
    linear-gradient(rgb(255 255 255 / 4%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(255 255 255 / 4%) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: linear-gradient(to bottom, transparent, black 22%, black 78%, transparent);
}

.velclaw-motion-card {
  position: relative;
  z-index: 2;
}

.velclaw-motion-topline {
  display: flex;
  align-items: center;
  gap: .55rem;
  min-width: 0;
  padding: .8rem .9rem;
  color: rgb(255 255 255 / 58%);
  font: 600 .68rem/1.2 ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: .12em;
  text-transform: uppercase;
  border-bottom: 1px solid rgb(255 255 255 / 7%);
}

.velclaw-motion-dot {
  width: .45rem;
  height: .45rem;
  flex: 0 0 .45rem;
  border-radius: 999px;
  background: #67e8f9;
  box-shadow: 0 0 16px rgb(103 232 249 / 75%);
  animation: velclaw-motion-pulse 2.4s ease-in-out infinite;
}

.velclaw-motion-status {
  margin-inline-start: auto;
  color: rgb(103 232 249 / 75%);
  white-space: nowrap;
}

.velclaw-motion-stage {
  width: 100%;
  aspect-ratio: 2 / 1;
  min-height: 220px;
  max-height: 520px;
}

.velclaw-motion-stage svg {
  display: block;
  width: 100%;
  height: 100%;
}

.velclaw-motion-v {
  transform-origin: 360px 180px;
  animation: velclaw-motion-float 5.5s ease-in-out infinite;
}

.velclaw-motion-orbit {
  transform-box: fill-box;
  transform-origin: center;
}

.orbit-a { animation: velclaw-motion-orbit 13s linear infinite; }
.orbit-b { animation: velclaw-motion-orbit-reverse 17s linear infinite; }

.velclaw-motion-smoke {
  transform-box: fill-box;
  transform-origin: center;
}

.smoke-a { animation: velclaw-motion-smoke-a 8s ease-in-out infinite alternate; }
.smoke-b { animation: velclaw-motion-smoke-b 10s ease-in-out infinite alternate; }

.velclaw-motion-node {
  animation: velclaw-motion-node 2.8s ease-in-out infinite;
}

.node-b { animation-delay: .7s; }
.node-c { animation-delay: 1.4s; }

.velclaw-motion-code {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: .4rem;
  padding: .9rem 1rem 1.1rem;
  color: rgb(255 255 255 / 58%);
  font: 600 clamp(.68rem, 1.6vw, .8rem)/1.3 ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: .04em;
}

.velclaw-motion-code span {
  color: rgb(255 255 255 / 82%);
}

.velclaw-motion-code b {
  color: #a855f7;
}

@keyframes velclaw-motion-float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-5px) scale(1.015); }
}

@keyframes velclaw-motion-breathe {
  from { transform: scale(.88); opacity: .45; }
  to { transform: scale(1.12); opacity: .9; }
}

@keyframes velclaw-motion-orbit {
  to { transform: rotate(360deg); }
}

@keyframes velclaw-motion-orbit-reverse {
  to { transform: rotate(-360deg); }
}

@keyframes velclaw-motion-smoke-a {
  from { transform: translate3d(-4%, 2%, 0) scale(.86); opacity: .35; }
  to { transform: translate3d(7%, -4%, 0) scale(1.12); opacity: .9; }
}

@keyframes velclaw-motion-smoke-b {
  from { transform: translate3d(5%, -3%, 0) scale(1.08); opacity: .28; }
  to { transform: translate3d(-7%, 5%, 0) scale(.82); opacity: .75; }
}

@keyframes velclaw-motion-node {
  0%, 100% { transform: scale(.75); opacity: .55; }
  50% { transform: scale(1.45); opacity: 1; }
}

@media (max-width: 560px) {
  .velclaw-motion {
    border-radius: 1rem;
    margin-inline: 0;
  }

  .velclaw-motion-topline {
    padding: .7rem .75rem;
    font-size: .6rem;
  }

  .velclaw-motion-stage {
    aspect-ratio: 9 / 16;
    min-height: 0;
    max-height: none;
  }

  .velclaw-motion-code {
    padding-bottom: .9rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .velclaw-motion *,
  .velclaw-motion::before,
  .velclaw-motion::after {
    animation: none !important;
  }
}
</style>
