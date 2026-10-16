import { PutObjectCommand } from "@aws-sdk/client-s3";
import { imageSize } from "image-size";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "@/lib/r2";
import { slugifyFilename } from "@/lib/slugify";

export const runtime = "nodejs";

function parsePositiveInt(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string") return null;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const DEFAULT_VIDEO_MAX_MB = 50;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 401 });

  if (!session.user || !["STUDIO", "CLIENT_ADMIN"].includes(session.user.role ?? "")) {
    return Response.json({ error: "Acesso negado" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const filenameInput = formData.get("filename");
  const allowVideo = formData.get("allowVideo") === "true";
  const maxSizeMB = parsePositiveInt(formData.get("maxSizeMB"));
  const minWidth = parsePositiveInt(formData.get("minWidth"));
  const minHeight = parsePositiveInt(formData.get("minHeight"));

  if (!(file instanceof File)) {
    return Response.json({ error: "Arquivo não enviado" }, { status: 400 });
  }

  const isVideo = VIDEO_TYPES.includes(file.type);
  const isImage = file.type.startsWith("image/");

  if (!isImage && !(allowVideo && isVideo)) {
    return Response.json({ error: allowVideo ? "O arquivo deve ser uma imagem ou vídeo (MP4, WebM, MOV)." : "O arquivo deve ser uma imagem" }, { status: 400 });
  }

  const effectiveMaxMB = isVideo ? (maxSizeMB ?? DEFAULT_VIDEO_MAX_MB) : maxSizeMB;
  if (effectiveMaxMB && file.size > effectiveMaxMB * 1024 * 1024) {
    return Response.json({ error: `O arquivo deve ter no máximo ${effectiveMaxMB}MB (enviado: ${(file.size / (1024 * 1024)).toFixed(1)}MB).` }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // SVG, vetores e video nao tem dimensao de pixel confiavel/aplicavel; a checagem so se aplica a raster de imagem.
  if ((minWidth || minHeight) && isImage && file.type !== "image/svg+xml") {
    try {
      const { width, height } = imageSize(buffer);
      if ((minWidth && width < minWidth) || (minHeight && height < minHeight)) {
        return Response.json({ error: `A imagem precisa ter no mínimo ${minWidth ?? "-"}×${minHeight ?? "-"}px (enviada: ${width}×${height}px).` }, { status: 400 });
      }
    } catch {
      return Response.json({ error: "Não foi possível ler as dimensões da imagem. Verifique se o arquivo não está corrompido." }, { status: 400 });
    }
  }

  if (!R2_BUCKET || !R2_PUBLIC_URL) {
    return Response.json({ error: "Storage não configurado" }, { status: 500 });
  }

  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const slug = slugifyFilename(typeof filenameInput === "string" && filenameInput.trim() ? filenameInput : file.name);
  const key = `uploads/${slug}-${Date.now()}.${extension}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }),
  );

  const url = `${R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
  return Response.json({ url }, { status: 201 });
}
