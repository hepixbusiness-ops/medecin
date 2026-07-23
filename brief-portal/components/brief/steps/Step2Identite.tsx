"use client";

import { StepShell } from "../StepShell";
import { TextArea } from "../ui/TextArea";
import { FileUpload } from "../ui/FileUpload";
import { ColorPicker } from "../ui/ColorPicker";
import { ACCEPTED_LOGO_TYPES, ACCEPTED_PHOTO_TYPES, MAX_PHOTOS } from "@/lib/config";
import type { BriefFormData } from "@/lib/types";

interface Step2Props {
  data: BriefFormData;
  onChange: <K extends keyof BriefFormData>(key: K, value: BriefFormData[K]) => void;
  onLogoSelected: (files: File[]) => void;
  onLogoRemove: () => void;
  onPhotosSelected: (files: File[]) => void;
  onPhotoRemove: (id: string) => void;
  onColorAdd: (hex: string) => void;
  onColorChange: (id: string, hex: string) => void;
  onColorRemove: (id: string) => void;
}

export function Step2Identite({
  data,
  onChange,
  onLogoSelected,
  onLogoRemove,
  onPhotosSelected,
  onPhotoRemove,
  onColorAdd,
  onColorChange,
  onColorRemove,
}: Step2Props) {
  return (
    <StepShell
      stepNumber={2}
      eyebrow="Identité"
      title="Votre identité visuelle"
      subtitle="Logo, couleurs et visuels : tout ce qui aide l'équipe créative à rester fidèle à votre image."
    >
      <FileUpload
        label="Logo"
        hint="Image, PDF ou SVG"
        accept={ACCEPTED_LOGO_TYPES.join(",")}
        maxFiles={1}
        files={data.logo ? [data.logo] : []}
        onFilesSelected={onLogoSelected}
        onRemove={onLogoRemove}
      />

      <ColorPicker
        colors={data.brandColors}
        onAdd={onColorAdd}
        onChange={onColorChange}
        onRemove={onColorRemove}
      />

      <FileUpload
        label="Photos et visuels"
        hint={`Jusqu'à ${MAX_PHOTOS} images`}
        accept={ACCEPTED_PHOTO_TYPES.join(",")}
        multiple
        maxFiles={MAX_PHOTOS}
        files={data.photos}
        onFilesSelected={onPhotosSelected}
        onRemove={onPhotoRemove}
      />

      <TextArea
        label="Sites qui vous inspirent"
        hint="un lien par ligne"
        placeholder={"https://exemple.com\nhttps://autre-site.com"}
        rows={3}
        value={data.inspirationLinks}
        onChange={(e) => onChange("inspirationLinks", e.target.value)}
      />
    </StepShell>
  );
}
