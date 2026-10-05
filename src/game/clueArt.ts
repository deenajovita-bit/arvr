import * as THREE from "three";

function canvas(w: number, h: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("canvas");
  draw(ctx, w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export function makeNoteMap() {
  return canvas(768, 480, (ctx, w, h) => {
    ctx.fillStyle = "#e4d2ae";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#cbb892";
    for (let i = 0; i < 40; i++) {
      ctx.globalAlpha = 0.12;
      ctx.fillRect(Math.random() * w, Math.random() * h, 40, 8);
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#8a6a3a";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(12, 8);
    ctx.lineTo(w - 18, 18);
    ctx.lineTo(w - 8, h - 22);
    ctx.lineTo(28, h - 10);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "#2a1810";
    ctx.font = "italic 36px Georgia, serif";
    ctx.fillText("8:20 — behind the old books", 48, 150);
    ctx.font = "italic 28px Georgia, serif";
    ctx.fillText("Do not use the door.", 48, 210);
    ctx.font = "italic 32px Georgia, serif";
    ctx.fillText("C.W.", 560, 390);
    ctx.font = "22px Georgia, serif";
    ctx.fillStyle = "#5a3a22";
    ctx.fillText("2 · 4 · 8 · 16 · ?", 48, 300);
  });
}

export function makeWatchFace() {
  return canvas(512, 512, (ctx, w, h) => {
    const cx = w / 2;
    const cy = h / 2;
    const g = ctx.createRadialGradient(cx, cy, 20, cx, cy, 240);
    g.addColorStop(0, "#f4eee0");
    g.addColorStop(1, "#c9b48a");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, 240, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#3a2a14";
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.fillStyle = "#1a120c";
    ctx.font = "bold 36px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 1; i <= 12; i++) {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
      ctx.fillText(String(i), cx + Math.cos(a) * 175, cy + Math.sin(a) * 175);
    }
    // 8:22
    ctx.strokeStyle = "#1a120c";
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    const hour = ((8 + 22 / 60) / 12) * Math.PI * 2 - Math.PI / 2;
    const min = (22 / 60) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(hour) * 90, cy + Math.sin(hour) * 90);
    ctx.stroke();
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(min) * 140, cy + Math.sin(min) * 140);
    ctx.stroke();
    ctx.fillStyle = "#6a1c18";
    ctx.font = "italic 28px Georgia, serif";
    ctx.fillText("C.W.", cx, cy + 70);
    ctx.fillStyle = "#1a120c";
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function makeCamLog() {
  return canvas(512, 320, (ctx, w, h) => {
    ctx.fillStyle = "#0c1210";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#7ad0c4";
    ctx.font = "20px ui-monospace, monospace";
    ctx.fillText("CAM 02  STUDY", 24, 48);
    ctx.fillText("20:17  FEED DISABLED", 24, 92);
    ctx.fillStyle = "#c9a56a";
    ctx.fillText("20:18  RESTART FAIL", 24, 136);
    ctx.fillText("20:19  RESTART FAIL", 24, 176);
    ctx.fillStyle = "#9aa090";
    ctx.fillText("operator: V.STONE", 24, 240);
    ctx.fillStyle = "#88c8c0";
    ctx.fillText("STATUS: OFFLINE", 24, 284);
  });
}
