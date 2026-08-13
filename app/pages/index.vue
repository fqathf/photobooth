<template>
  <div v-if="!isStudioActive" class="min-h-screen text-black relative flex flex-col p-4 md:p-8 justify-center"
       style="background-image: url('/bg.webp'); background-size: cover; background-position: center;">
    
    <!-- Header Section -->
    <header class="text-center mb-8 md:mb-12 flex flex-col items-center pt-4">
      <h2 class="font-serif text-lg md:text-xl tracking-widest uppercase border-b-2 border-black pb-1 mb-4 inline-block">Photobooth Event</h2>
      <h1 class="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.85] uppercase tracking-wider">Gabriela Abigail's<br/>20th Birthday</h1>
    </header>

    <!-- Main Content -->
    <main class="flex-1 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-8">
      
      <!-- Left Column (Visuals) -->
      <div class="flex justify-center relative">
        <!-- Photostrip container -->
        <div class="relative bg-black p-3 pb-16 rotate-[-3deg] shadow-2xl w-64 max-w-[70vw] transition-transform hover:rotate-0 duration-500" 
             style="border-image: radial-gradient(white 4px, transparent 5px) 10 stretch; border-width: 10px; border-style: solid;">
          <!-- Polka dot bg -->
          <div class="absolute inset-0 pointer-events-none opacity-20" 
               style="background-image: radial-gradient(white 2px, transparent 2px); background-size: 16px 16px;"></div>
          
          <!-- Photo frames -->
          <div class="space-y-3 relative z-10">
            <div class="bg-[#d0c8b6] aspect-[4/3] w-full shadow-inner flex items-center justify-center overflow-hidden">
               <img src="/ref-1.jpeg" class="w-full h-full object-cover opacity-80 mix-blend-multiply filter grayscale contrast-125" alt="Ella" />
            </div>
            <div class="bg-[#d0c8b6] aspect-[4/3] w-full shadow-inner flex items-center justify-center overflow-hidden">
               <img src="/ref-1.jpeg" class="w-full h-full object-cover opacity-80 mix-blend-multiply filter grayscale contrast-125" alt="Ella" />
            </div>
            <div class="bg-[#d0c8b6] aspect-[4/3] w-full shadow-inner flex items-center justify-center overflow-hidden">
               <img src="/ref-1.jpeg" class="w-full h-full object-cover opacity-80 mix-blend-multiply filter grayscale contrast-125" alt="Ella" />
            </div>
          </div>
          
          <div class="absolute bottom-4 left-0 right-0 text-center text-white font-serif tracking-[0.3em] text-sm">
            ARC 20
          </div>
          
          <!-- Floating badge -->
          <div class="absolute -top-8 -right-8 w-24 h-24 bg-black rounded-full flex flex-col items-center justify-center text-white font-display shadow-xl transform rotate-12 border-[6px] border-white z-20">
            <span class="text-4xl leading-none mt-1">20</span>
            <span class="text-[10px] font-serif uppercase tracking-widest leading-none mt-1">Years</span>
          </div>
        </div>
      </div>

      <!-- Right Column (Start Button) -->
      <div class="flex justify-center lg:justify-start">
        <button @click="startStudio" 
                class="group bg-black text-[#f9f6f0] py-6 px-8 hover:bg-gray-800 transition-all transform hover:scale-[1.02] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none flex flex-col items-center border-4 border-black text-center w-full max-w-sm">
          <span class="font-display text-4xl md:text-5xl leading-[0.9]">START<br/>PHOTOBOOTH</span>
          <span class="text-sm md:text-base font-serif mt-6 font-bold tracking-[0.2em] uppercase border-t border-white/30 pt-4 w-full group-hover:text-yellow-300 transition-colors">Click Here to Begin &rarr;</span>
        </button>
      </div>

    </main>
  </div>

  <!-- Studio View -->
  <div v-else class="min-h-screen w-full relative flex flex-col p-4 md:p-8"
       style="background-image: url('/bg.webp'); background-size: cover; background-position: center; background-attachment: fixed;">
    <div class="absolute top-4 left-4 z-50">
      <button @click="isStudioActive = false" class="bg-black text-[#f9f6f0] border-[3px] border-black font-serif px-4 py-2 font-bold hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)] flex items-center gap-2 transition-all uppercase tracking-widest text-sm">
        <span>&larr;</span> Back to Home
      </button>
    </div>
    <div class="flex-1 flex items-center justify-center pt-16">
      <PhotoboothStudio />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PhotoboothStudio from '~/components/PhotoboothStudio.vue';

const isStudioActive = ref(false);

const startStudio = () => {
  isStudioActive.value = true;
};
</script>
