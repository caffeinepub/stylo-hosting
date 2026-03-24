import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Rocket,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useAddSite } from "../hooks/useQueries";

const LAYOUTS = [
  {
    id: "minimal",
    name: "Minimal",
    desc: "Clean, content-first layout",
    preview: "bg-gradient-to-br from-gray-100 to-gray-200",
  },
  {
    id: "bold",
    name: "Bold Hero",
    desc: "Full-screen hero with strong typography",
    preview: "bg-gradient-to-br from-slate-800 to-slate-900",
  },
  {
    id: "creative",
    name: "Creative Grid",
    desc: "Asymmetric grid with vibrant accents",
    preview: "bg-gradient-to-br from-violet-900 to-indigo-900",
  },
];

const COLOR_THEMES = [
  { id: "indigo", label: "Indigo", primary: "#6366f1", bg: "#0f0f23" },
  { id: "emerald", label: "Emerald", primary: "#10b981", bg: "#021a13" },
  { id: "rose", label: "Rose", primary: "#f43f5e", bg: "#1a0009" },
  { id: "amber", label: "Amber", primary: "#f59e0b", bg: "#1a1000" },
  { id: "sky", label: "Sky", primary: "#0ea5e9", bg: "#00101a" },
];

function generateHTML(
  layout: string,
  title: string,
  tagline: string,
  description: string,
  theme: { primary: string; bg: string },
): string {
  if (layout === "minimal") {
    return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;background:#fff;color:#111;min-height:100vh}header{padding:2rem 4rem;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center}.logo{font-weight:800;font-size:1.3rem;color:${theme.primary}}.hero{padding:6rem 4rem;max-width:700px}.hero h1{font-size:3rem;font-weight:800;line-height:1.15;margin-bottom:1rem}.hero p{color:#666;font-size:1.1rem;line-height:1.75;margin-bottom:2rem}.btn{display:inline-block;background:${theme.primary};color:#fff;padding:.75rem 2rem;border-radius:8px;text-decoration:none;font-weight:600}footer{border-top:1px solid #eee;padding:2rem 4rem;color:#999;font-size:.9rem}</style></head>
<body><header><div class="logo">${title}</div><nav></nav></header><section class="hero"><h1>${title}</h1><p>${tagline}</p><p style="margin-bottom:2rem;color:#888">${description}</p><a class="btn" href="#">Get Started</a></section><footer><p>© ${new Date().getFullYear()} ${title}</p></footer></body></html>`;
  }

  if (layout === "bold") {
    return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;background:${theme.bg};color:#fff;min-height:100vh}header{padding:1.5rem 4rem;display:flex;justify-content:space-between;align-items:center}.logo{font-weight:800;font-size:1.4rem;color:${theme.primary}}.hero{min-height:85vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:4rem 2rem;position:relative}.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at center,${theme.primary}22 0%,transparent 70%)}.hero h1{font-size:clamp(2.5rem,8vw,5.5rem);font-weight:900;line-height:1.05;margin-bottom:1.5rem;position:relative}.hl{color:${theme.primary}}.hero p{color:rgba(255,255,255,.65);font-size:1.2rem;max-width:600px;margin:0 auto 2.5rem;line-height:1.7;position:relative}.btn{display:inline-block;background:${theme.primary};color:#fff;padding:1rem 2.5rem;border-radius:10px;text-decoration:none;font-weight:700;font-size:1.1rem;position:relative}footer{border-top:1px solid rgba(255,255,255,.08);padding:2rem 4rem;color:rgba(255,255,255,.4);text-align:center;font-size:.9rem}</style></head>
<body><header><div class="logo">${title}</div></header><section class="hero"><h1><span class="hl">${title}</span></h1><p>${tagline}</p><p style="margin-bottom:2.5rem">${description}</p><a class="btn" href="#">Get Started →</a></section><footer><p>© ${new Date().getFullYear()} ${title}</p></footer></body></html>`;
  }

  // creative grid
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;background:${theme.bg};color:#fff;min-height:100vh}.grid{display:grid;grid-template-columns:1fr 1fr;min-height:100vh}@media(max-width:768px){.grid{grid-template-columns:1fr}}.left{padding:3rem;display:flex;flex-direction:column;justify-content:space-between;border-right:1px solid rgba(255,255,255,.07)}.right{padding:3rem;display:flex;flex-direction:column;justify-content:center}.accent{color:${theme.primary}}.logo{font-size:1.1rem;font-weight:800;letter-spacing:-.02em}.tagline{font-size:clamp(2rem,5vw,3.5rem);font-weight:900;line-height:1.1;margin:2rem 0 1rem}.desc{color:rgba(255,255,255,.6);line-height:1.7;font-size:1.05rem;margin-bottom:2rem}.btn{display:inline-block;background:${theme.primary};color:#fff;padding:.75rem 2rem;border-radius:8px;text-decoration:none;font-weight:700}.card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:2rem;margin-bottom:1rem}.card h3{color:${theme.primary};font-size:1rem;font-weight:700;margin-bottom:.5rem}.card p{color:rgba(255,255,255,.6);font-size:.9rem;line-height:1.6}footer{grid-column:1/-1;border-top:1px solid rgba(255,255,255,.06);padding:1.5rem 3rem;color:rgba(255,255,255,.3);font-size:.85rem;text-align:center}</style></head>
<body><div class="grid"><div class="left"><div class="logo"><span class="accent">${title.charAt(0)}</span>${title.slice(1)}</div><div><div class="tagline">${tagline}</div><p class="desc">${description}</p><a class="btn" href="#">Explore →</a></div><div style="color:rgba(255,255,255,.3);font-size:.85rem">© ${new Date().getFullYear()}</div></div><div class="right"><div class="card"><h3>✦ Feature One</h3><p>World-class performance optimized for modern workflows and lightning-fast delivery.</p></div><div class="card"><h3>✦ Feature Two</h3><p>Beautiful, accessible interface designed for real humans. Simple and intuitive.</p></div><div class="card"><h3>✦ Feature Three</h3><p>Reliable and secure. Built on a rock-solid foundation you can trust every day.</p></div></div></div></body></html>`;
}

export function TemplateBuilder() {
  const [step, setStep] = useState(1);
  const [layout, setLayout] = useState("bold");
  const [siteTitle, setSiteTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [colorTheme, setColorTheme] = useState(COLOR_THEMES[0]);
  const [siteName, setSiteName] = useState("");
  const [progress, setProgress] = useState(0);
  const [deployed, setDeployed] = useState(false);
  const addSite = useAddSite();

  const generatedHTML = generateHTML(
    layout,
    siteTitle || "My Site",
    tagline || "A great tagline",
    description || "Describe your site here.",
    colorTheme,
  );

  const handleDeploy = async () => {
    if (!siteName.trim()) return;
    try {
      const bytes = new TextEncoder().encode(generatedHTML);
      const blob = ExternalBlob.fromBytes(new Uint8Array(bytes));
      setProgress(0);
      await addSite.mutateAsync({
        name: siteName.trim(),
        blob,
        onProgress: (p) => setProgress(p),
      });
      setDeployed(true);
      toast.success(`"${siteName}" deployed!`);
    } catch {
      toast.error("Deploy failed.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display font-bold text-xl mb-1">
          Template Builder
        </h2>
        <p className="text-muted-foreground text-sm">
          Build a custom site in 3 steps.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= s
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground border border-border"
              }`}
            >
              {s}
            </div>
            <span
              className={`text-xs ${step >= s ? "text-foreground" : "text-muted-foreground"}`}
            >
              {s === 1 ? "Layout" : s === 2 ? "Details" : "Deploy"}
            </span>
            {s < 3 && (
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Layout */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            data-ocid="builder.panel"
          >
            {LAYOUTS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLayout(l.id)}
                className={`rounded-xl overflow-hidden border-2 transition-all text-left ${
                  layout === l.id
                    ? "border-primary"
                    : "border-border hover:border-primary/50"
                }`}
                data-ocid={"builder.toggle"}
              >
                <div className={`h-24 ${l.preview} relative`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-1 rounded bg-white/30 mb-1" />
                  </div>
                  {layout === l.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-3 bg-card">
                  <div className="font-semibold text-sm">{l.name}</div>
                  <div className="text-muted-foreground text-xs mt-0.5">
                    {l.desc}
                  </div>
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
            data-ocid="builder.panel"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Site Title
                </Label>
                <Input
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  placeholder="Awesome Portfolio"
                  className="bg-secondary border-border"
                  data-ocid="builder.input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Tagline</Label>
                <Input
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Creating awesome things"
                  className="bg-secondary border-border"
                  data-ocid="builder.input"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Description
              </Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell visitors what this site is about..."
                className="bg-secondary border-border"
                data-ocid="builder.input"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Color Theme
              </Label>
              <div className="flex gap-3 flex-wrap">
                {COLOR_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setColorTheme(theme)}
                    title={theme.label}
                    className={`w-9 h-9 rounded-full border-2 transition-transform hover:scale-110 ${
                      colorTheme.id === theme.id
                        ? "border-white scale-110"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: theme.primary }}
                    data-ocid="builder.toggle"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Preview & Deploy */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
            data-ocid="builder.panel"
          >
            <div className="h-80 rounded-lg overflow-hidden border border-border bg-white">
              <iframe
                srcDoc={generatedHTML}
                className="w-full h-full"
                title="Generated Preview"
                sandbox="allow-scripts"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Site Name (URL slug)
                </Label>
                <Input
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="my-built-site"
                  className="bg-secondary border-border"
                  disabled={addSite.isPending || deployed}
                  data-ocid="builder.input"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleDeploy}
                  disabled={!siteName.trim() || addSite.isPending || deployed}
                  className="bg-primary text-primary-foreground hover:opacity-90 gap-2"
                  data-ocid="builder.submit_button"
                >
                  {addSite.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deploying...
                    </>
                  ) : deployed ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Deployed!
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4" />
                      Deploy Site
                    </>
                  )}
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {addSite.isPending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  data-ocid="builder.loading_state"
                >
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Deploying...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-1" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-2 border-t border-border">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="border-border gap-1.5"
          data-ocid="builder.secondary_button"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        {step < 3 && (
          <Button
            onClick={() => setStep((s) => Math.min(3, s + 1))}
            className="bg-primary text-primary-foreground hover:opacity-90 gap-1.5"
            data-ocid="builder.primary_button"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
