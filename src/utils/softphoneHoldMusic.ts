/** Public looped hold-music bed (Twilio sample). */
export const HOLD_MUSIC_URL =
  "https://com.twilio.sounds.music.s3.amazonaws.com/MARKOVICHIMP-Loop.mp3";

let holdAudio: HTMLAudioElement | null = null;

export function startHoldMusic() {
  try {
    if (!holdAudio) {
      holdAudio = new Audio(HOLD_MUSIC_URL);
      holdAudio.loop = true;
      holdAudio.preload = "auto";
      holdAudio.volume = 0.55;
    }
    void holdAudio.play().catch(() => {
      /* autoplay may be blocked until a gesture — ignore */
    });
  } catch {
    /* ignore */
  }
}

export function stopHoldMusic() {
  try {
    if (!holdAudio) return;
    holdAudio.pause();
    holdAudio.currentTime = 0;
  } catch {
    /* ignore */
  }
}
