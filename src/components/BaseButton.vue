<script setup>
const props = defineProps({
  type: { type: String, default: 'button' },      // "button" | "submit" | "reset"
  disabled: { type: Boolean, default: false },
  variant: { type: String, default: 'liquid' }    // "liquid" | "solid"
})
</script>

<template>
  <!-- SOLID (fallback/simple) -->
  <button
    v-if="props.variant === 'solid'"
    :type="props.type"
    :disabled="props.disabled"
    :aria-disabled="props.disabled ? 'true' : 'false'"
    class="inline-flex items-center justify-center rounded-md px-8 py-4
           font-title font-semibold uppercase tracking-wide
           bg-teal text-text transition duration-200
           hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal
           disabled:opacity-60 disabled:pointer-events-none"
  >
    <slot>Button</slot>
  </button>
  <!-- LIQUID (fancy) -->
   <button
   v-else
    :type="props.type"
    :disabled="props.disabled"
    :aria-disabled="props.disabled ? 'true' : 'false'"
    class="class=buttonLiquid group relative inline-flex overflow-hidden rounded-md
           bg-black/20 px-8 py-4 uppercase font-title text-on-brand-text tracking-wide
           transition-all duration-300 active:scale-[0.98] hover:bg-white/10"
  >
    <span class="text relative z-20 transition-all duration-300
                 group-hover:text-text">
      <slot>Liquid</slot>
    </span>

    <!-- Liquid blob -->
    <div
      class="liquid absolute -top-20 left-0 h-[200px] w-[200px] bg-teal
             shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]
             transition-[top] duration-500 ease-in-out group-hover:top-[-120px]
             before:content-[''] after:content-[''] before:absolute after:absolute
             before:w-[200%] before:h-[200%] after:w-[200%] after:h-[200%]
             before:top-0 before:left-1/2 after:top-0 after:left-1/2
             before:animate-[rotate_5s_linear_infinite] after:animate-[rotate_10s_linear_infinite]
             before:rounded-[45%] after:rounded-[40%]
             before:bg-[rgba(20,20,20,0.8)] after:bg-[rgba(20,20,20,0.3)]"
    >
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
    </div>
  </button>
</template>


<style scoped>
/* text */
/* .text { transition: all .3s ease; text-shadow: 0 1px 2px rgba(0,0,0,.7); } */
.buttonLiquid:hover .text { text-shadow: 0 1px 2px rgba(0,0,0,.3); }

/* glow using brand color (#3E66E0) */
@keyframes glow {
  0%,100% { box-shadow: 0 0 5px rgba(62,102,224,.7); }
  50%     { box-shadow: 0 0 20px rgba(62,102,224,.9); }
}
.buttonLiquid:hover { animation: glow 1.5s ease-in-out infinite; }

/* rotating inner shapes */
.liquid::before,
.liquid::after {
  content: "";
  position: absolute;
  width: 200%;
  height: 200%;
  top: 0;
  left: 50%;
  transform: translate(-50%, -75%);
}
.liquid::before { border-radius: 45%; background: rgba(20,20,20,.8); animation: rotate 5s linear infinite; }
.liquid::after  { border-radius: 40%; background: rgba(20,20,20,.3); animation: rotate 10s linear infinite; }

@keyframes rotate {
  0%   { transform: translate(-50%, -75%) rotate(0deg); }
  100% { transform: translate(-50%, -75%) rotate(360deg); }
}

/* bubbles */
.bubble {
  position: absolute;
  bottom: -20px;
  border-radius: 50%;
  opacity: 0;
  animation: rise var(--rise-duration) ease-in infinite var(--rise-delay);
}
.bubble::before {
  content: "";
  position: absolute; inset: 0;
  background: radial-gradient(circle at 75% 25%,
    rgba(255,255,255,.6) 5%,
    rgba(255,255,255,.2) 40%,
    rgba(255,255,255,0) 60%);
  border-radius: 50%;
}

/* positions, sizes, timings */
.bubble:nth-child(1){ left:10%; width:20px; height:20px; --rise-duration:4s;  --rise-delay:0s; }
.bubble:nth-child(2){ left:25%; width:15px; height:15px; --rise-duration:3.5s; --rise-delay:.5s; }
.bubble:nth-child(3){ left:40%; width:10px; height:10px; --rise-duration:3s;  --rise-delay:1s; }
.bubble:nth-child(4){ left:55%; width:22px; height:22px; --rise-duration:4.5s; --rise-delay:1.5s; }
.bubble:nth-child(5){ left:70%; width:18px; height:18px; --rise-duration:3.8s; --rise-delay:2s; }
.bubble:nth-child(6){ left:85%; width:12px; height:12px; --rise-duration:3.2s; --rise-delay:2.5s; }

@keyframes rise {
  0%   { bottom:-20px; opacity:0; }
  5%   { opacity:.8; }
  95%  { opacity:.8; }
  100% { bottom:120%; opacity:0; }
}
</style>
