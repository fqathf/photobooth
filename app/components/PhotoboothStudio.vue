<template>
  <div class="flex flex-col items-center w-full">
    <!-- Show Loading Spinner while loading settings -->
    <div v-if="loadingSettings || (!activeFrame && framesList.length === 0)" class="flex flex-col items-center justify-center min-h-[400px] w-full text-center">
      <div class="w-12 h-12 rounded-full border-4 border-[var(--color-primary-light)] border-t-[var(--color-primary)] animate-spin mb-4" />
      <p class="text-sm text-[var(--text-secondary)] font-body animate-pulse">Menghubungkan ke Studio Foto...</p>
    </div>

    <!-- Show Event Inactive State if disabled by Admin -->
    <div v-else-if="settings && !settings.active" class="flex flex-col items-center justify-center text-center max-w-lg mx-auto py-12 px-6 bg-[#f9f6f0] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-12">
      <h1 class="text-3xl sm:text-4xl font-display text-black uppercase tracking-wider mb-4 border-b-4 border-black pb-2">
        Akses Ditutup
      </h1>
      <p class="text-lg text-black font-serif italic font-bold mb-8">
        {{ settings.maintenanceMessage || "Studio foto saat ini sedang dinonaktifkan sementara. Ikuti terus sosial media resmi kami untuk info event spesial berikutnya!" }}
      </p>
      <a
        href="/"
        class="bg-black text-[#f9f6f0] font-display text-xl uppercase tracking-widest py-3 px-8 border-4 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none text-center cursor-pointer"
      >
        Kembali ke Beranda
      </a>
    </div>

    <!-- Guard: no frames available at all -->
    <div v-else-if="framesList.length === 0" class="flex flex-col items-center justify-center text-center max-w-lg mx-auto py-16 px-4 gap-4">
      <div class="p-4 rounded-2xl bg-pink-50 border border-pink-200 text-pink-700 text-sm">
        <p class="font-bold mb-1">Belum Ada Template Bingkai</p>
        <p>Admin belum menambahkan template bingkai foto. Silakan tambahkan melalui <strong>Admin &gt; Photobooth &gt; Tambah Template Bingkai PNG</strong>.</p>
      </div>
      <a href="/" class="text-[var(--color-primary)] font-bold text-sm hover:underline">← Kembali ke Beranda</a>
    </div>

    <!-- Step 1 Layout: Full-Screen Template Selection Grid -->
    <div v-else-if="isSelectFrame" class="flex flex-col items-center w-full max-w-5xl mx-auto">
      <div class="text-center space-y-2 sm:space-y-4 max-w-4xl mx-auto mb-8 sm:mb-12">
        <h1 class="text-4xl sm:text-6xl font-display text-black uppercase tracking-wider leading-[1.1] sm:leading-[0.9]">
          Pilih Bingkai<br/>Foto
        </h1>
        <p class="text-base sm:text-xl text-black font-serif italic font-bold px-4">
          Pilih template bingkai eksklusif favoritmu untuk memulai sesi photobooth bertema khusus.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 w-full justify-center px-4 max-w-5xl">
        <button
          v-for="frame in framesList"
          :key="frame.id"
          @click="selectFrame(frame.id, frame.slots.length)"
          class="flex flex-col text-left bg-[#f9f6f0] border-4 border-black transition-all duration-300 w-full focus:outline-none relative group cursor-pointer max-w-[280px] sm:max-w-none mx-auto"
          :class="frame.id === state.activeFrameId ? 'shadow-none translate-y-2 translate-x-2 border-red-600 bg-[#fffbe6]' : 'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'"
        >
          <div class="w-full aspect-[4/5] bg-neutral-200 relative flex items-center justify-center p-4 sm:p-6 border-b-4 border-black overflow-hidden">
            <div class="absolute inset-0 opacity-20 bg-[radial-gradient(black_2px,transparent_2px)] [background-size:16px_16px]" />
            <div
              class="h-full relative overflow-hidden flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105 bg-white"
              :style="{ aspectRatio: `${frame.canvasWidth} / ${frame.canvasHeight}` }"
            >
              <img :src="frame.thumbnail ?? frame.src" :alt="frame.name" class="w-full h-full object-cover grayscale mix-blend-multiply opacity-90" />
            </div>
            <div class="absolute top-2 left-2 bg-black text-[#f9f6f0] text-[10px] font-display px-3 py-1 uppercase tracking-widest border-2 border-[#f9f6f0]">
              Exclusive
            </div>
          </div>
          <div class="p-4 w-full flex flex-col bg-inherit">
            <h3 class="font-display text-2xl text-black group-hover:text-red-600 transition-colors line-clamp-1 mb-1 uppercase tracking-wide">
              {{ frame.name }}
            </h3>
            <div class="flex items-center gap-2 text-sm text-black font-serif font-bold italic border-t-2 border-black/20 pt-2 mt-2">
              <span>&#9654; {{ frame.slots.length }} PHOTOS</span>
            </div>
          </div>
        </button>
      </div>

      <button
        @click="state.status = 'SELECT_INPUT_MODE'"
        class="mt-10 sm:mt-16 bg-black text-[#f9f6f0] border-4 border-black font-display uppercase tracking-widest text-xl sm:text-3xl py-3 sm:py-4 px-8 sm:px-12 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none cursor-pointer text-center group"
      >
        <span class="group-hover:text-yellow-300 transition-colors">Lanjut &rarr;</span>
      </button>
    </div>

    <!-- Step 2, 3, 4 Layout: Studio Columns -->
    <div v-else class="flex flex-col items-center w-full">
      <div class="text-center space-y-1 sm:space-y-4 max-w-4xl mx-auto mb-2 sm:mb-10 px-4 shrink-0">
        <h1 class="text-3xl sm:text-6xl font-display text-black uppercase tracking-wider leading-[0.9] border-b-2 sm:border-b-4 border-black pb-1 sm:pb-4 inline-block mt-2 sm:mt-0">
          Studio Foto
        </h1>
        <p class="hidden sm:block text-sm sm:text-xl text-black font-serif italic font-bold">
          Ambil pose ter-kece kamu dan abadikan kenangan manis ini!
        </p>
      </div>

      <div class="w-full max-w-6xl flex flex-col md:grid md:grid-cols-12 gap-4 sm:gap-8 items-center justify-center flex-1 px-2 pb-4 md:pb-0">
        
        <!-- Left Column: Camera/Upload Preview, Steps Guide, or Export Help -->
        <div :class="`md:col-span-4 hidden md:flex justify-center w-full ${leftColOrder}`">
          <div v-if="isSelectInput" class="bg-[#e8e4db] p-4 sm:p-6 border-4 border-black text-left w-full max-w-sm sm:max-w-md shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative mt-4">
            <div class="absolute -top-4 left-4 sm:left-6 bg-black text-white px-2 py-1 font-display tracking-widest uppercase text-xs sm:text-sm border-2 border-white">Panduan</div>
            <ul class="text-black font-serif text-sm sm:text-lg space-y-3 sm:space-y-4 leading-relaxed mt-2">
              <li class="flex gap-3 border-b-2 border-black/10 pb-2">
                <span class="font-display text-2xl mt-0.5">1</span>
                <span><strong>Pilih Bingkai</strong>: (Selesai)</span>
              </li>
              <li class="flex gap-3 border-b-2 border-black/10 pb-2">
                <span class="font-display text-2xl mt-0.5">2</span>
                <span><strong>Metode Foto</strong>: Hubungkan webcam atau unggah gambar.</span>
              </li>
              <li class="flex gap-3 border-b-2 border-black/10 pb-2">
                <span class="font-display text-2xl mt-0.5">3</span>
                <span><strong>Proses Cekrek</strong>: Ambil pose per slot.</span>
              </li>
              <li class="flex gap-3">
                <span class="font-display text-2xl mt-0.5">4</span>
                <span><strong>Unduh</strong>: Simpan hasil HD ke perangkat.</span>
              </li>
            </ul>
          </div>
          <UploadPanel
            v-else-if="isUploadPreview"
            :photos="state.capturedPhotos"
            @photoUploaded="onPhotoUploaded"
            @photoRemoved="onPhotoRemoved"
            class="hidden md:flex"
          />
          <WebcamPreview
            v-else-if="!isReview"
            ref="webcamPreviewRef"
            :state="state.status"
            :stream="state.stream"
            :photoIndex="state.photoIndex"
            :countdown="state.countdown"
            :capturedPhotos="state.capturedPhotos"
            class="hidden md:flex"
          />
          <div v-else class="bg-[#e8e4db] p-4 sm:p-6 border-4 border-black text-left w-full max-w-sm sm:max-w-md shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative mt-4">
            <div class="absolute -top-4 left-4 sm:left-6 bg-black text-white px-2 py-1 font-display tracking-widest uppercase text-xs sm:text-sm border-2 border-white">Panduan Ekspor</div>
            <ul class="text-black font-serif text-sm sm:text-lg space-y-3 sm:space-y-4 leading-relaxed mt-2">
              <li class="flex gap-3 border-b-2 border-black/10 pb-2">
                <span class="font-display text-2xl mt-0.5">1</span>
                <span>Klik <strong>Simpan ke Cloud & Unduh</strong> untuk menyimpan format PNG.</span>
              </li>
              <li class="flex gap-3 border-b-2 border-black/10 pb-2">
                <span class="font-display text-2xl mt-0.5">2</span>
                <span>Atau bagikan langsung via fitur <strong>Bagikan</strong> (Mobile).</span>
              </li>
              <li class="flex gap-3">
                <span class="font-display text-2xl mt-0.5">3</span>
                <span>Klik <strong>Mulai Baru</strong> untuk mengambil pose atau bingkai baru.</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Center Column: Photostrip Canvas / Placeholder -->
        <div :class="`md:col-span-4 flex justify-center w-full relative ${centerColOrder}`">
          <!-- MOBILE ONLY COMPONENT PREVIEWS (Moved from left column to main center on mobile) -->
          <div class="md:hidden flex items-center justify-center w-full mb-4">
            <UploadPanel
              v-if="isUploadPreview"
              :photos="state.capturedPhotos"
              @photoUploaded="onPhotoUploaded"
              @photoRemoved="onPhotoRemoved"
              class="w-full"
            />
            <WebcamPreview
              v-else-if="!isReview && !isSelectInput"
              ref="webcamPreviewRef"
              :state="state.status"
              :stream="state.stream"
              :photoIndex="state.photoIndex"
              :countdown="state.countdown"
              :capturedPhotos="state.capturedPhotos"
              class="w-full"
            />
          </div>

          <div v-if="isReview" class="flex flex-col items-center w-full justify-center">
            <canvas
              ref="canvasRef"
              class="w-full max-w-[260px] h-auto md:max-w-none md:max-h-[75vh] border-[6px] sm:border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] bg-white transition-transform hover:-translate-y-2 hover:-translate-x-2 duration-300 mx-auto"
              :style="{ aspectRatio: `${activeFrame?.canvasWidth} / ${activeFrame?.canvasHeight}` }"
            ></canvas>
          </div>
          <div
            v-else-if="activeFrame"
            class="relative w-full max-w-[260px] h-auto md:max-w-none md:max-h-[75vh] border-[6px] sm:border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-[#e8e4db] flex flex-col select-none transition-all duration-300 mx-auto hidden md:flex"
            :style="{ aspectRatio: `${activeFrame.canvasWidth} / ${activeFrame.canvasHeight}` }"
          >
            <div class="absolute inset-0 bg-neutral-50 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:16px_16px]" style="z-index: 1" />
            
            <img
              :src="activeFrame.src"
              :alt="activeFrame.name"
              class="absolute inset-0 w-full h-full pointer-events-none"
              style="z-index: 2"
            />

            <div class="absolute inset-0" style="z-index: 3">
              <div
                v-for="(slot, idx) in activeFrame.slots"
                :key="idx"
                @click="handleSlotClick(idx)"
                class="absolute flex items-center justify-center overflow-hidden text-xs font-bold transition-all duration-300 bg-black/10 text-black border-4 border-dashed border-black/30"
                :class="isSlotClickable(idx) ? 'cursor-pointer pointer-events-auto hover:bg-black/20' : 'pointer-events-none'"
                :style="{
                  left: `${(slot.x / activeFrame.canvasWidth) * 100}%`,
                  top: `${(slot.y / activeFrame.canvasHeight) * 100}%`,
                  width: `${(slot.width / activeFrame.canvasWidth) * 100}%`,
                  height: `${(slot.height / activeFrame.canvasHeight) * 100}%`,
                  ...(isSlotActive(idx) && isSlotClickable(idx) ? {
                    borderColor: 'black',
                    borderStyle: 'solid',
                    borderWidth: '6px',
                    boxShadow: 'inset 0 0 0 4px white'
                  } : {})
                }"
              >
                <img
                  v-if="state.capturedPhotos[idx]"
                  :src="state.capturedPhotos[idx]"
                  alt=""
                  class="w-full h-full object-cover transition-transform duration-100"
                  :style="{
                    transform: `scale(${state.photoScales[idx] || 1.0})`,
                    scale: state.inputMode === 'camera' ? '-1 1' : '1 1'
                  }"
                />
                <template v-else>
                  {{ isSlotActive(idx) && (state.status === 'COUNTDOWN' || state.status === 'CAPTURING') ? 'POSE' : (idx + 1) }}
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Context Action Controls -->
        <div :class="`md:col-span-4 flex justify-center w-full ${rightColOrder}`">
          <ControlPanel
            :state="state.status"
            :canShare="canShare"
            :uploadedCount="filledPhotosCount"
            :slotsCount="activeFrame?.slots.length || 0"
            :photoIndex="state.photoIndex"
            :isAllCaptured="isAllCaptured"
            :photoScale="currentScale"
            :showZoomSlider="showZoomSlider"
            @selectFrameNext="state.status = 'SELECT_INPUT_MODE'"
            @start="startCaptureSequence"
            @startUpload="startUploadSequence"
            @retry="retryPhoto"
            @retake="handleRetake"
            @download="handleDownload"
            @share="handleShare"
            @saveToCloud="handleSaveToCloud"
            @processUpload="state.status = 'REVIEW'"
            @cancelUpload="cancelUpload"
            @captureClick="startCountdown"
            @confirmPhoto="confirmPhoto"
            @scaleChange="updateScale"
          />
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import type { PhotoboothState, FrameConfig } from '~/utils/photobooth/types';
import { startCamera, stopCamera } from '~/utils/photobooth/camera';
import { compositePhotostrip } from '~/utils/photobooth/compositor';
import { photoboothService } from '~/services/photoboothService';
import WebcamPreview from './WebcamPreview.vue';
import ControlPanel from './ControlPanel.vue';
import UploadPanel from './UploadPanel.vue';

interface State {
  status: PhotoboothState;
  stream: MediaStream | null;
  capturedPhotos: string[];
  photoScales: number[];
  photoIndex: number;
  countdown: number;
  activeFrameId: string;
  errorMsg: string;
  inputMode: "camera" | "upload" | null;
}

const state = reactive<State>({
  status: "SELECT_FRAME",
  stream: null,
  capturedPhotos: [],
  photoScales: [],
  photoIndex: 0,
  countdown: 0,
  activeFrameId: "",
  errorMsg: "",
  inputMode: null
});

const framesList = ref<FrameConfig[]>([]);
const canShare = ref(false);
const settings = ref<{ active: boolean; maintenanceMessage: string } | null>(null);
const loadingSettings = ref(true);

const webcamPreviewRef = ref<any>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const activeFrame = computed(() => {
  return framesList.value.find((f) => f.id === state.activeFrameId) || framesList.value[0] || null;
});

const filledPhotosCount = computed(() => state.capturedPhotos.filter(p => p !== "").length);
const isAllCaptured = computed(() => activeFrame.value ? filledPhotosCount.value === activeFrame.value.slots.length : false);

const isSelectFrame = computed(() => state.status === "SELECT_FRAME");
const isSelectInput = computed(() => state.status === "SELECT_INPUT_MODE");
const isUploadPreview = computed(() => state.status === "UPLOAD_PREVIEW");
const isReview = computed(() => state.status === "REVIEW");

const leftColOrder = "order-3 md:order-none";
const centerColOrder = "order-1 md:order-none";
const rightColOrder = "order-2 md:order-none";

onMounted(async () => {
  try {
    const [data, framesData] = await Promise.all([
      photoboothService.getSettings(),
      photoboothService.getFrames()
    ]);
    settings.value = data;
    if (framesData && framesData.length > 0) {
      framesList.value = framesData;
    }
  } catch (err) {
    console.error("Gagal memuat pengaturan photobooth:", err);
    settings.value = { active: true, maintenanceMessage: "" };
  } finally {
    loadingSettings.value = false;
  }

  if (typeof window !== "undefined" && navigator.share) {
    canShare.value = true;
  }
});

onUnmounted(() => {
  if (state.stream) {
    stopCamera(state.stream);
  }
});

watch(() => state.status, (newStatus) => {
  const cameraStates = ["REQUESTING_CAMERA", "LIVE_PREVIEW", "COUNTDOWN", "CAPTURING", "CONFIRM_CAPTURE"];
  if (!cameraStates.includes(newStatus) && state.stream) {
    stopCamera(state.stream);
    state.stream = null;
  }

  if (newStatus === "REVIEW" && activeFrame.value && isAllCaptured.value) {
    const mirrorPhotos = state.inputMode === "camera";
    nextTick(() => {
      if (canvasRef.value) {
        compositePhotostrip(canvasRef.value, [...state.capturedPhotos], activeFrame.value!, mirrorPhotos, [...state.photoScales]);
      }
    });
  }
});

const selectFrame = (frameId: string, slotsCount: number) => {
  state.activeFrameId = frameId;
  state.capturedPhotos = Array(slotsCount).fill("");
  state.photoScales = Array(slotsCount).fill(1.0);
  state.photoIndex = 0;
};

const startCaptureSequence = async () => {
  const slotsCount = activeFrame.value ? activeFrame.value.slots.length : 4;
  state.status = "REQUESTING_CAMERA";
  state.inputMode = "camera";
  state.errorMsg = "";
  state.capturedPhotos = Array(slotsCount).fill("");
  state.photoScales = Array(slotsCount).fill(1.0);
  state.photoIndex = 0;
  state.countdown = 0;

  try {
    const cameraStream = await startCamera();
    state.stream = cameraStream;
    state.status = "LIVE_PREVIEW";
  } catch (err: any) {
    console.error(err);
    state.errorMsg = err.message || "Gagal mengakses kamera.";
    state.status = "CAMERA_ERROR";
    state.inputMode = null;
  }
};

const startUploadSequence = () => {
  const slotsCount = activeFrame.value ? activeFrame.value.slots.length : 4;
  state.status = "UPLOAD_PREVIEW";
  state.inputMode = "upload";
  state.capturedPhotos = Array(slotsCount).fill("");
  state.photoScales = Array(slotsCount).fill(1.0);
  state.photoIndex = 0;
  state.countdown = 0;
  state.errorMsg = "";
};

const onPhotoUploaded = (index: number, dataUrl: string) => {
  state.capturedPhotos[index] = dataUrl;
};

const onPhotoRemoved = (index: number) => {
  state.capturedPhotos[index] = "";
  state.photoScales[index] = 1.0;
  if (state.status === "CONFIRM_CAPTURE") {
    state.status = "LIVE_PREVIEW";
  }
};

const cancelUpload = () => {
  const slotsCount = activeFrame.value ? activeFrame.value.slots.length : 4;
  if (state.status === "SELECT_INPUT_MODE") {
    state.status = "SELECT_FRAME";
    state.inputMode = null;
    state.capturedPhotos = [];
    state.photoScales = Array(slotsCount).fill(1.0);
  } else {
    state.status = "SELECT_INPUT_MODE";
    state.inputMode = null;
    state.capturedPhotos = [];
    state.photoScales = Array(slotsCount).fill(1.0);
  }
};

let countdownTimer: NodeJS.Timeout | null = null;
const startCountdown = () => {
  state.status = "COUNTDOWN";
  state.countdown = 3;

  const tick = () => {
    if (state.countdown > 0) {
      state.countdown--;
      countdownTimer = setTimeout(tick, 1000);
    } else {
      capturePhoto();
    }
  };
  countdownTimer = setTimeout(tick, 1000);
};

const capturePhoto = () => {
  state.status = "CAPTURING";

  setTimeout(() => {
    if (webcamPreviewRef.value?.videoRef) {
      const video = webcamPreviewRef.value.videoRef;
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = video.videoWidth || 640;
      tempCanvas.height = video.videoHeight || 480;
      const tempCtx = tempCanvas.getContext("2d");

      if (tempCtx) {
        tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
        const dataUrl = tempCanvas.toDataURL("image/png");
        state.capturedPhotos[state.photoIndex] = dataUrl;
        state.status = "CONFIRM_CAPTURE";
      }
    }
  }, 250);
};

const confirmPhoto = () => {
  const slotsCount = activeFrame.value ? activeFrame.value.slots.length : 4;
  if (state.photoIndex < slotsCount - 1) {
    state.photoIndex++;
  }
  state.status = "LIVE_PREVIEW";
};

const retryPhoto = () => {
  state.capturedPhotos[state.photoIndex] = "";
  state.photoScales[state.photoIndex] = 1.0;
  state.status = "LIVE_PREVIEW";
};

const handleRetake = () => {
  if (state.stream) {
    stopCamera(state.stream);
    state.stream = null;
  }
  state.status = "SELECT_FRAME";
  state.capturedPhotos = [];
  state.photoScales = [];
  state.photoIndex = 0;
  state.countdown = 0;
  state.inputMode = null;
};

const handleDownload = () => {
  if (!canvasRef.value) return;
  state.status = "EXPORTING";

  canvasRef.value.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `iris-photostrip-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    state.status = "REVIEW";
  }, "image/png");
};

const handleSaveToCloud = async () => {
  if (!canvasRef.value) return;
  state.status = "EXPORTING";

  canvasRef.value.toBlob(async (blob) => {
    if (!blob) {
      state.status = "REVIEW";
      return;
    }

    // Always download locally first
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `photobooth-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Then try cloud upload (best-effort)
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        try {
          const base64data = reader.result as string;
          await $fetch('/api/upload', {
            method: 'POST',
            body: { imageBase64: base64data }
          });
        } catch (err) {
          console.warn("Cloud upload skipped (bindings may not be configured):", err);
        } finally {
          state.status = "REVIEW";
        }
      };
    } catch (error) {
      console.warn("Cloud upload prep failed:", error);
      state.status = "REVIEW";
    }
  }, "image/png");
};

const handleShare = async () => {
  if (!canvasRef.value) return;
  state.status = "EXPORTING";

  canvasRef.value.toBlob(async (blob) => {
    if (blob) {
      const file = new File([blob], `iris-photostrip-${Date.now()}.png`, { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "Studio Foto Online",
            text: "Lihat photostrip kerenku!"
          });
        } catch (err) {
          console.error("Gagal share:", err);
        }
      }
    }
    state.status = "REVIEW";
  }, "image/png");
};

const isSlotActive = (idx: number) => {
  return state.photoIndex === idx && (state.status === "LIVE_PREVIEW" || state.status === "CONFIRM_CAPTURE" || state.status === "COUNTDOWN" || state.status === "CAPTURING" || state.status === "UPLOAD_PREVIEW");
};

const isSlotClickable = (idx: number) => {
  return state.status === "LIVE_PREVIEW" || state.status === "CONFIRM_CAPTURE" || state.status === "UPLOAD_PREVIEW";
};

const handleSlotClick = (idx: number) => {
  if (isSlotClickable(idx)) {
    state.photoIndex = idx;
    const hasPhoto = state.capturedPhotos[idx] && state.capturedPhotos[idx] !== "";
    state.status = hasPhoto ? "CONFIRM_CAPTURE" : (state.inputMode === "upload" ? "UPLOAD_PREVIEW" : "LIVE_PREVIEW");
  }
};

const currentSlotHasPhoto = computed(() => state.capturedPhotos[state.photoIndex] && state.capturedPhotos[state.photoIndex] !== "");
const showZoomSlider = computed(() => state.status === "CONFIRM_CAPTURE" || (state.status === "UPLOAD_PREVIEW" && currentSlotHasPhoto.value));
const currentScale = computed(() => state.photoScales[state.photoIndex] || 1.0);

const updateScale = (scale: number) => {
  state.photoScales[state.photoIndex] = scale;
};
</script>
