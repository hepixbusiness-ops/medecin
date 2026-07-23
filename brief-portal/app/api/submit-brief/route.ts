import { NextResponse } from "next/server";
import { createServiceClient, BRIEFS_BUCKET, BRIEFS_TABLE } from "@/lib/supabase/server";
import { MAX_FILE_SIZE_MB } from "@/lib/config";

export const runtime = "nodejs";

const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 jours, le temps que n8n récupère les fichiers

function parseJsonArray(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string" || !value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120);
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Le formulaire envoyé est illisible. Merci de réessayer." },
      { status: 400 }
    );
  }

  const companyName = String(formData.get("companyName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const siteType = String(formData.get("siteType") ?? "").trim();

  if (!companyName || !email || !whatsapp || !siteType) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Il manque des informations essentielles (entreprise, email, WhatsApp ou type de site).",
      },
      { status: 400 }
    );
  }

  const sector = String(formData.get("sector") ?? "");
  const city = String(formData.get("city") ?? "");
  const activity = String(formData.get("activity") ?? "");
  const inspirationLinks = String(formData.get("inspirationLinks") ?? "");
  const goal = String(formData.get("goal") ?? "");
  const timeline = String(formData.get("timeline") ?? "");
  const budget = String(formData.get("budget") ?? "");
  const message = String(formData.get("message") ?? "");

  const brandColors = parseJsonArray(formData.get("brandColors"));
  const pages = parseJsonArray(formData.get("pages"));
  const features = parseJsonArray(formData.get("features"));

  const logo = formData.get("logo");
  const photos = formData.getAll("photos").filter((item): item is File => item instanceof File);

  const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
  const oversized = [
    ...(logo instanceof File ? [logo] : []),
    ...photos,
  ].find((file) => file.size > maxBytes);

  if (oversized) {
    return NextResponse.json(
      {
        ok: false,
        error: `Le fichier "${oversized.name}" dépasse ${MAX_FILE_SIZE_MB} Mo — merci de le compresser ou d'en choisir un autre.`,
      },
      { status: 400 }
    );
  }

  const submissionId = crypto.randomUUID();
  const reference = `BR-${submissionId.slice(0, 8).toUpperCase()}`;

  let supabase;
  try {
    supabase = createServiceClient();
  } catch (error) {
    console.error("Supabase non configuré :", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Le service de réception des dossiers n'est pas encore configuré. Merci de contacter l'agence directement.",
      },
      { status: 500 }
    );
  }

  try {
    let logoPath: string | null = null;
    if (logo instanceof File) {
      const path = `${submissionId}/logo-${sanitizeFileName(logo.name)}`;
      const { error } = await supabase.storage
        .from(BRIEFS_BUCKET)
        .upload(path, logo, { contentType: logo.type, upsert: false });
      if (error) throw new Error(`Envoi du logo impossible : ${error.message}`);
      logoPath = path;
    }

    const photoPaths: string[] = [];
    for (const [index, photo] of photos.entries()) {
      const path = `${submissionId}/photos/${index}-${sanitizeFileName(photo.name)}`;
      const { error } = await supabase.storage
        .from(BRIEFS_BUCKET)
        .upload(path, photo, { contentType: photo.type, upsert: false });
      if (error) throw new Error(`Envoi d'une photo impossible : ${error.message}`);
      photoPaths.push(path);
    }

    const signedUrl = async (path: string) => {
      const { data, error } = await supabase.storage
        .from(BRIEFS_BUCKET)
        .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);
      if (error || !data) return null;
      return data.signedUrl;
    };

    const logoUrl = logoPath ? await signedUrl(logoPath) : null;
    const photoUrls = (
      await Promise.all(photoPaths.map((path) => signedUrl(path)))
    ).filter((url): url is string => Boolean(url));

    const briefRow = {
      id: submissionId,
      reference,
      status: "nouveau",
      company_name: companyName,
      sector,
      city,
      activity,
      email,
      whatsapp,
      logo_path: logoPath,
      brand_colors: brandColors,
      photo_paths: photoPaths,
      inspiration_links: inspirationLinks,
      site_type: siteType,
      pages,
      features,
      goal,
      timeline,
      budget,
      message,
      n8n_notified: false,
    };

    const { error: insertError } = await supabase.from(BRIEFS_TABLE).insert(briefRow);
    if (insertError) {
      throw new Error(`Enregistrement du dossier impossible : ${insertError.message}`);
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reference,
            submissionId,
            submittedAt: new Date().toISOString(),
            companyName,
            sector,
            city,
            activity,
            email,
            whatsapp,
            brandColors,
            inspirationLinks,
            siteType,
            pages,
            features,
            goal,
            timeline,
            budget,
            message,
            logoUrl,
            photoUrls,
          }),
        });

        if (webhookResponse.ok) {
          await supabase
            .from(BRIEFS_TABLE)
            .update({ n8n_notified: true })
            .eq("id", submissionId);
        } else {
          console.error("Webhook n8n en échec :", webhookResponse.status);
        }
      } catch (webhookError) {
        console.error("Webhook n8n injoignable :", webhookError);
      }
    }

    return NextResponse.json({ ok: true, reference });
  } catch (error) {
    console.error("Erreur de soumission du brief :", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "L'envoi n'a pas abouti. Merci de réessayer dans un instant.",
      },
      { status: 500 }
    );
  }
}
