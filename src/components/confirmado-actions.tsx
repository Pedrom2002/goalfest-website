"use client";

export default function ConfirmadoActions({
  qrDataUrl,
  token,
  name,
}: {
  qrDataUrl: string;
  token: string;
  name: string;
}) {
  const safeName = name.replace(/[^a-z0-9\-]+/gi, "-").toLowerCase();

  async function downloadCard() {
    const W = 800;
    const H = 1080;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    await document.fonts.load('700 40px "DM Sans"');

    // Background
    ctx.fillStyle = "#0d1a0d";
    ctx.fillRect(0, 0, W, H);

    // Subtle green radial glow
    const glow = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, H * 0.7);
    glow.addColorStop(0, "rgba(94,166,59,0.18)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Border
    ctx.strokeStyle = "rgba(94,166,59,0.4)";
    ctx.lineWidth = 2;
    roundRect(ctx, 24, 24, W - 48, H - 48, 24);
    ctx.stroke();

    // Logo text
    ctx.textAlign = "center";
    ctx.fillStyle = "#5ea63b";
    ctx.font = '900 72px "DM Sans", sans-serif';
    ctx.fillText("GOALFEST", W / 2, 120);

    ctx.fillStyle = "rgba(247,255,247,0.45)";
    ctx.font = '400 14px "DM Sans", sans-serif';
    ctx.fillText("FANZONE OFICIAL · MUNDIAL 2026", W / 2, 152);

    // Divider
    ctx.strokeStyle = "rgba(94,166,59,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 120, 172);
    ctx.lineTo(W / 2 + 120, 172);
    ctx.stroke();

    // QR box
    const qrSize = 480;
    const pad = 24;
    const boxX = (W - qrSize - pad * 2) / 2;
    const boxY = 192;

    ctx.fillStyle = "#ffffff";
    roundRect(ctx, boxX, boxY, qrSize + pad * 2, qrSize + pad * 2, 20);
    ctx.fill();

    const qrImg = new Image();
    qrImg.src = qrDataUrl;
    await new Promise<void>((res) => { qrImg.onload = () => res(); });
    ctx.drawImage(qrImg, boxX + pad, boxY + pad, qrSize, qrSize);

    // Name
    const infoY = boxY + qrSize + pad * 2 + 52;
    ctx.fillStyle = "#f7fff7";
    ctx.font = '700 36px "DM Sans", sans-serif';
    ctx.fillText(name, W / 2, infoY);

    ctx.fillStyle = "rgba(247,255,247,0.35)";
    ctx.font = '400 12px "DM Sans", sans-serif';
    ctx.fillText("C O N V I T E   P E S S O A L   ·   I N T R A N S M I S S Í V E L", W / 2, infoY + 30);

    ctx.strokeStyle = "rgba(94,166,59,0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 80, infoY + 50);
    ctx.lineTo(W / 2 + 80, infoY + 50);
    ctx.stroke();

    ctx.fillStyle = "#5ea63b";
    ctx.font = '700 15px "DM Sans", sans-serif';
    ctx.fillText("11 JUN – 19 JUL 2026", W / 2, infoY + 82);

    ctx.fillStyle = "rgba(247,255,247,0.4)";
    ctx.font = '400 13px "DM Sans", sans-serif';
    ctx.fillText("Vale do Silêncio · Lisboa", W / 2, infoY + 106);

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `goalfest-convite-${safeName}.png`;
    a.click();
  }

  return (
    <div className="mt-3">
      <button
        onClick={() => void downloadCard()}
        className="w-full rounded-full px-3 py-2 font-black tracking-[.14em] text-[11px] uppercase transition cursor-pointer text-bg-primary hover:brightness-110"
        style={{ background: "#5ea63b" }}
      >
        Guardar QR
      </button>
    </div>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
