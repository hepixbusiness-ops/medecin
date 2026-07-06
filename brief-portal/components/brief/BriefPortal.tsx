"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, PaperPlaneTilt } from "@phosphor-icons/react";
import { DossierRail } from "./DossierRail";
import { StepBar } from "./StepBar";
import { Step1Entreprise } from "./steps/Step1Entreprise";
import { Step2Identite } from "./steps/Step2Identite";
import { Step3Site } from "./steps/Step3Site";
import { Step4Cadre } from "./steps/Step4Cadre";
import { SuccessScreen } from "./SuccessScreen";
import { Button } from "./ui/Button";
import { validateStep } from "@/lib/validation";
import { TOTAL_STEPS } from "@/lib/config";
import {
  createEmptyBriefForm,
  type BrandColor,
  type BriefFormData,
  type FieldErrors,
  type SubmissionStatus,
  type UploadedFile,
} from "@/lib/types";

function toUploadedFile(file: File): UploadedFile {
  return {
    id: crypto.randomUUID(),
    file,
    previewUrl: URL.createObjectURL(file),
  };
}

export function BriefPortal() {
  const [data, setData] = useState<BriefFormData>(createEmptyBriefForm);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const objectUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const trackUrl = (url: string) => {
    objectUrlsRef.current.add(url);
    return url;
  };

  const updateField = useCallback(
    <K extends keyof BriefFormData>(key: K, value: BriefFormData[K]) => {
      setData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const toggleListValue = useCallback((key: "pages" | "features", value: string) => {
    setData((prev) => {
      const list = prev[key];
      const next = list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];
      return { ...prev, [key]: next };
    });
  }, []);

  const handleLogoSelected = useCallback((files: File[]) => {
    const [file] = files;
    if (!file) return;
    const uploaded = toUploadedFile(file);
    trackUrl(uploaded.previewUrl);
    setData((prev) => ({ ...prev, logo: uploaded }));
  }, []);

  const handleLogoRemove = useCallback(() => {
    setData((prev) => {
      if (prev.logo) URL.revokeObjectURL(prev.logo.previewUrl);
      return { ...prev, logo: null };
    });
  }, []);

  const handlePhotosSelected = useCallback((files: File[]) => {
    const uploaded = files.map((file) => {
      const item = toUploadedFile(file);
      trackUrl(item.previewUrl);
      return item;
    });
    setData((prev) => ({ ...prev, photos: [...prev.photos, ...uploaded] }));
  }, []);

  const handlePhotoRemove = useCallback((id: string) => {
    setData((prev) => {
      const target = prev.photos.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return { ...prev, photos: prev.photos.filter((p) => p.id !== id) };
    });
  }, []);

  const handleColorAdd = useCallback((hex: string) => {
    setData((prev) => {
      const color: BrandColor = { id: crypto.randomUUID(), hex };
      return { ...prev, brandColors: [...prev.brandColors, color] };
    });
  }, []);

  const handleColorChange = useCallback((id: string, hex: string) => {
    setData((prev) => ({
      ...prev,
      brandColors: prev.brandColors.map((c) => (c.id === id ? { ...c, hex } : c)),
    }));
  }, []);

  const handleColorRemove = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      brandColors: prev.brandColors.filter((c) => c.id !== id),
    }));
  }, []);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goNext = () => {
    const stepErrors = validateStep(step, data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    scrollToTop();
  };

  const goPrev = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
    scrollToTop();
  };

  const goToStep = (target: number) => {
    setErrors({});
    setStep(target);
    scrollToTop();
  };

  const handleSubmit = async () => {
    const step1Errors = validateStep(1, data);
    const step3Errors = validateStep(3, data);
    const combined = { ...step1Errors, ...step3Errors };
    if (Object.keys(combined).length > 0) {
      setErrors(combined);
      setStep(Object.keys(step1Errors).length > 0 ? 1 : 3);
      scrollToTop();
      return;
    }

    setStatus("loading");
    setSubmissionError(null);

    try {
      const formData = new FormData();
      formData.set("companyName", data.companyName.trim());
      formData.set("sector", data.sector);
      formData.set("city", data.city);
      formData.set("activity", data.activity.trim());
      formData.set("email", data.email.trim());
      formData.set("whatsapp", data.whatsapp.trim());
      formData.set("brandColors", JSON.stringify(data.brandColors.map((c) => c.hex)));
      formData.set("inspirationLinks", data.inspirationLinks.trim());
      formData.set("siteType", data.siteType);
      formData.set("pages", JSON.stringify(data.pages));
      formData.set("features", JSON.stringify(data.features));
      formData.set("goal", data.goal.trim());
      formData.set("timeline", data.timeline);
      formData.set("budget", data.budget);
      formData.set("message", data.message.trim());

      if (data.logo) formData.set("logo", data.logo.file, data.logo.file.name);
      data.photos.forEach((photo) => {
        formData.append("photos", photo.file, photo.file.name);
      });

      const response = await fetch("/api/submit-brief", {
        method: "POST",
        body: formData,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.ok) {
        throw new Error(
          result?.error ??
            "L'envoi n'a pas abouti. Vérifiez votre connexion puis réessayez."
        );
      }

      setReference(result.reference);
      setStatus("success");
      scrollToTop();
    } catch (error) {
      setStatus("error");
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "Une erreur inattendue est survenue. Merci de réessayer."
      );
    }
  };

  const isSuccess = status === "success";

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col lg:flex-row">
      {!isSuccess && <DossierRail data={data} currentStep={step} />}

      <div className="flex min-h-[100dvh] flex-1 flex-col">
        {!isSuccess && <StepBar currentStep={step} data={data} />}

        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 py-10 lg:px-16 lg:py-16">
          <div ref={topRef} />

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <SuccessScreen
                key="success"
                companyName={data.companyName}
                reference={reference ?? "—"}
              />
            ) : step === 1 ? (
              <Step1Entreprise data={data} errors={errors} onChange={updateField} />
            ) : step === 2 ? (
              <Step2Identite
                data={data}
                onChange={updateField}
                onLogoSelected={handleLogoSelected}
                onLogoRemove={handleLogoRemove}
                onPhotosSelected={handlePhotosSelected}
                onPhotoRemove={handlePhotoRemove}
                onColorAdd={handleColorAdd}
                onColorChange={handleColorChange}
                onColorRemove={handleColorRemove}
              />
            ) : step === 3 ? (
              <Step3Site
                data={data}
                errors={errors}
                onChange={updateField}
                onToggleList={toggleListValue}
              />
            ) : (
              <Step4Cadre data={data} onChange={updateField} onEditStep={goToStep} />
            )}
          </AnimatePresence>

          {!isSuccess && (
            <div className="mt-10 flex flex-col gap-3">
              {status === "error" && submissionError && (
                <p role="alert" className="text-sm leading-snug text-danger">
                  {submissionError}
                </p>
              )}
              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="ghost"
                  onClick={goPrev}
                  disabled={step === 1 || status === "loading"}
                  icon={<ArrowLeft weight="bold" size={16} />}
                  iconPosition="left"
                >
                  Précédent
                </Button>

                {step < TOTAL_STEPS ? (
                  <Button
                    onClick={goNext}
                    icon={<ArrowRight weight="bold" size={16} />}
                  >
                    Suivant
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    loading={status === "loading"}
                    icon={<PaperPlaneTilt weight="bold" size={16} />}
                  >
                    Envoyer le dossier
                  </Button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
