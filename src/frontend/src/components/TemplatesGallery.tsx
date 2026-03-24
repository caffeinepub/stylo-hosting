import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Eye, Loader2, Rocket } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useAddSite } from "../hooks/useQueries";

interface Template {
  id: string;
  name: string;
  description: string;
  previewBg: string;
  accentColor: string;
  html: string;
}

const TEMPLATES: Template[] = [
  {
    id: "portfolio",
    name: "Personal Portfolio",
    description: "Showcase your work with style",
    previewBg: "from-slate-800 to-slate-900",
    accentColor: "#6366f1",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Portfolio</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;background:#0f0f0f;color:#fff}header{padding:2rem 4rem;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #222}.logo{font-size:1.5rem;font-weight:700;color:#6366f1}nav a{color:#aaa;text-decoration:none;margin-left:2rem;transition:.2s}nav a:hover{color:#fff}.hero{padding:6rem 4rem;max-width:800px}.hero h1{font-size:3.5rem;font-weight:800;line-height:1.1;margin-bottom:1rem}.hero h1 span{color:#6366f1}.hero p{color:#aaa;font-size:1.2rem;line-height:1.7;margin-bottom:2rem}.btn{display:inline-block;background:#6366f1;color:#fff;padding:.8rem 2rem;border-radius:8px;text-decoration:none;font-weight:600;transition:.2s}.btn:hover{opacity:.85}.projects{padding:4rem;background:#111}.projects h2{font-size:2rem;font-weight:700;margin-bottom:2rem}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem}.card{background:#1a1a1a;border-radius:12px;padding:1.5rem;border:1px solid #222}.card h3{font-size:1.1rem;font-weight:600;margin-bottom:.5rem}.card p{color:#888;font-size:.9rem}</style></head>
<body><header><div class="logo">Alex.dev</div><nav><a href="#">Work</a><a href="#">About</a><a href="#">Contact</a></nav></header><section class="hero"><h1>Crafting <span>digital</span> experiences</h1><p>Full-stack developer & designer specializing in modern web applications, user interfaces, and scalable backends.</p><a class="btn" href="#">View My Work</a></section><section class="projects"><h2>Selected Work</h2><div class="grid"><div class="card"><h3>E-Commerce Platform</h3><p>React + Node.js marketplace with real-time inventory management</p></div><div class="card"><h3>Design System</h3><p>Component library used by 50+ developers across 3 product teams</p></div><div class="card"><h3>Analytics Dashboard</h3><p>Real-time data visualization for SaaS metrics and KPIs</p></div></div></section></body></html>`,
  },
  {
    id: "business",
    name: "Business Landing",
    description: "Professional landing page for your business",
    previewBg: "from-blue-900 to-indigo-900",
    accentColor: "#0ea5e9",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Business</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;color:#1e293b}header{background:#0f172a;padding:1.2rem 4rem;display:flex;justify-content:space-between;align-items:center}.logo{color:#fff;font-weight:700;font-size:1.4rem}nav a{color:#94a3b8;text-decoration:none;margin-left:2rem;transition:.2s}nav a:hover{color:#fff}.cta-btn{background:#0ea5e9;color:#fff;padding:.6rem 1.4rem;border-radius:6px;font-weight:600;text-decoration:none}.hero{background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);color:#fff;padding:7rem 4rem;text-align:center}.hero h1{font-size:3rem;font-weight:800;margin-bottom:1.5rem;line-height:1.2}.hero p{color:#94a3b8;font-size:1.15rem;max-width:600px;margin:0 auto 2.5rem}.features{padding:5rem 4rem;background:#f8fafc}.features h2{text-align:center;font-size:2rem;font-weight:700;margin-bottom:3rem}.feat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:2rem}.feat{background:#fff;border-radius:12px;padding:2rem;box-shadow:0 2px 12px rgba(0,0,0,.06)}.feat h3{font-weight:700;margin-bottom:.8rem;color:#0f172a}.feat p{color:#64748b;font-size:.95rem;line-height:1.6}footer{background:#0f172a;color:#64748b;text-align:center;padding:2rem;font-size:.9rem}</style></head>
<body><header><div class="logo">Nexus Co.</div><nav><a href="#">Services</a><a href="#">Pricing</a><a href="#">About</a><a class="cta-btn" href="#">Get Started</a></nav></header><section class="hero"><h1>Grow Your Business<br>With Confidence</h1><p>We deliver enterprise-grade solutions with startup agility. Transform your digital presence today.</p><a class="cta-btn" href="#" style="font-size:1.1rem;padding:.9rem 2.5rem">Start Free Trial</a></section><section class="features"><h2>Why Choose Us</h2><div class="feat-grid"><div class="feat"><h3>⚡ Lightning Fast</h3><p>99.9% uptime SLA with global CDN distribution across 50+ edge locations worldwide.</p></div><div class="feat"><h3>🔒 Enterprise Security</h3><p>SOC 2 Type II certified with end-to-end encryption and advanced threat protection.</p></div><div class="feat"><h3>📊 Deep Analytics</h3><p>Real-time insights into your business performance with actionable recommendations.</p></div></div></section><footer><p>© 2026 Nexus Co. All rights reserved.</p></footer></body></html>`,
  },
  {
    id: "card",
    name: "Business Card",
    description: "Minimalist digital business card",
    previewBg: "from-emerald-900 to-teal-900",
    accentColor: "#10b981",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Business Card</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;background:#ecfdf5;min-height:100vh;display:flex;align-items:center;justify-content:center}.card{background:#fff;border-radius:20px;padding:3rem;max-width:480px;width:90%;box-shadow:0 20px 60px rgba(16,185,129,.15);text-align:center;border:1px solid #d1fae5}.avatar{width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);margin:0 auto 1.5rem;display:flex;align-items:center;justify-content:center;font-size:2.5rem;font-weight:800;color:#fff}.name{font-size:2rem;font-weight:700;color:#064e3b;margin-bottom:.5rem}.title{color:#10b981;font-weight:600;margin-bottom:.5rem}.company{color:#6b7280;margin-bottom:2rem}.divider{height:1px;background:#d1fae5;margin:1.5rem 0}.links{display:flex;flex-wrap:wrap;gap:.75rem;justify-content:center}a.link{display:inline-flex;align-items:center;gap:.5rem;background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;padding:.5rem 1rem;border-radius:8px;text-decoration:none;font-size:.9rem;font-weight:500;transition:.2s}a.link:hover{background:#10b981;color:#fff;border-color:#10b981}</style></head>
<body><div class="card"><div class="avatar">SJ</div><div class="name">Sarah Johnson</div><div class="title">Senior Product Designer</div><div class="company">Figma · Previously Airbnb</div><div class="divider"></div><div class="links"><a class="link" href="#">✉ sarah@design.co</a><a class="link" href="#">🌐 sarahdesigns.io</a><a class="link" href="#">💼 LinkedIn</a><a class="link" href="#">🐦 Twitter</a></div></div></body></html>`,
  },
  {
    id: "blog",
    name: "Blog",
    description: "Clean blog layout with featured posts",
    previewBg: "from-amber-900 to-orange-900",
    accentColor: "#f59e0b",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Blog</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;background:#fffbf0;color:#1c1917}header{background:#fff;border-bottom:3px solid #f59e0b;padding:1.5rem 4rem;display:flex;justify-content:space-between;align-items:center}.logo{font-size:1.6rem;font-weight:700;color:#1c1917}.logo span{color:#f59e0b}nav a{color:#57534e;text-decoration:none;margin-left:2rem;font-family:'Segoe UI',sans-serif;font-size:.95rem}nav a:hover{color:#f59e0b}.hero-post{padding:4rem;max-width:900px;margin:0 auto}.tag{display:inline-block;background:#fef3c7;color:#b45309;padding:.3rem .8rem;border-radius:4px;font-size:.8rem;font-family:'Segoe UI',sans-serif;font-weight:600;margin-bottom:1rem}.hero-post h1{font-size:2.8rem;line-height:1.25;margin-bottom:1rem;color:#1c1917}.meta{color:#78716c;font-family:'Segoe UI',sans-serif;font-size:.9rem;margin-bottom:1.5rem}.excerpt{font-size:1.15rem;line-height:1.8;color:#44403c;margin-bottom:2rem}.read-more{font-family:'Segoe UI',sans-serif;background:#f59e0b;color:#fff;padding:.7rem 1.8rem;border-radius:6px;text-decoration:none;font-weight:600}.posts{padding:2rem 4rem 4rem;max-width:900px;margin:0 auto}.posts h2{font-size:1.5rem;margin-bottom:2rem;padding-bottom:.75rem;border-bottom:2px solid #fef3c7}.post-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.5rem}.post{background:#fff;border-radius:8px;padding:1.5rem;border:1px solid #fef3c7}.post h3{margin-bottom:.5rem;font-size:1.1rem}.post p{color:#78716c;font-size:.9rem;line-height:1.6;font-family:'Segoe UI',sans-serif}</style></head>
<body><header><div class="logo">The<span>Write</span>Up</div><nav><a href="#">Articles</a><a href="#">Topics</a><a href="#">About</a></nav></header><section class="hero-post"><div class="tag">FEATURED</div><h1>The Future of Web Design in the Age of AI</h1><div class="meta">March 24, 2026 · 8 min read · by Jordan Lee</div><p class="excerpt">As artificial intelligence reshapes every industry, web designers find themselves at an exciting crossroads. The tools are changing, but the fundamentals of great design remain timeless...</p><a class="read-more" href="#">Read Article →</a></section><section class="posts"><h2>Recent Articles</h2><div class="post-grid"><div class="post"><h3>10 CSS Tricks That Will Change How You Code</h3><p>March 20 · 5 min · Design tips that every frontend developer should know in 2026.</p></div><div class="post"><h3>Building Accessible UIs from Scratch</h3><p>March 18 · 7 min · A practical guide to WCAG 2.2 compliance without sacrificing aesthetics.</p></div><div class="post"><h3>Why Minimalism Still Wins</h3><p>March 15 · 4 min · Less noise, more signal. How simplicity drives better conversion.</p></div></div></section></body></html>`,
  },
  {
    id: "resume",
    name: "Resume",
    description: "Professional online resume / CV",
    previewBg: "from-violet-900 to-purple-900",
    accentColor: "#8b5cf6",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Resume</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;background:#fafafa;color:#1a1a2e;line-height:1.6}.container{max-width:800px;margin:2rem auto;background:#fff;box-shadow:0 4px 24px rgba(0,0,0,.1);border-radius:12px;overflow:hidden}.sidebar{background:#1a1a2e;color:#fff;padding:2.5rem;width:280px;float:left;min-height:600px}.sidebar .name{font-size:1.6rem;font-weight:700;margin-bottom:.3rem}.sidebar .role{color:#8b5cf6;font-size:1rem;margin-bottom:1.5rem}.sidebar .section{margin-bottom:2rem}.sidebar h3{font-size:.75rem;text-transform:uppercase;letter-spacing:.1em;color:#8b5cf6;margin-bottom.75rem;border-bottom:1px solid #2d2d44;padding-bottom:.5rem;margin-bottom:.8rem}.sidebar p,.sidebar li{font-size:.9rem;color:#94a3b8;margin-bottom:.4rem;list-style:none}.skill-bar{background:#2d2d44;border-radius:4px;height:4px;margin:.3rem 0 .6rem}.skill-fill{background:#8b5cf6;height:100%;border-radius:4px}.main{margin-left:280px;padding:2.5rem}.main h2{font-size:1.1rem;font-weight:700;color:#1a1a2e;border-left:3px solid #8b5cf6;padding-left:.75rem;margin-bottom:1.5rem;margin-top:1.5rem}.main h2:first-child{margin-top:0}.exp{margin-bottom:1.25rem}.exp h3{font-weight:600;font-size:1rem}.exp .company{color:#8b5cf6;font-size:.9rem}.exp .period{color:#94a3b8;font-size:.85rem}.exp p{color:#64748b;font-size:.9rem;margin-top:.4rem}</style></head>
<body><div class="container"><div class="sidebar"><div class="name">Marcus Chen</div><div class="role">Software Engineer</div><div class="section"><h3>Contact</h3><p>📧 marcus@email.com</p><p>📱 +1 (555) 0192</p><p>🌐 marcuschen.dev</p><p>📍 San Francisco, CA</p></div><div class="section"><h3>Skills</h3><p>React / TypeScript</p><div class="skill-bar"><div class="skill-fill" style="width:95%"></div></div><p>Node.js / Python</p><div class="skill-bar"><div class="skill-fill" style="width:88%"></div></div><p>AWS / Cloud</p><div class="skill-bar"><div class="skill-fill" style="width:82%"></div></div><p>UI/UX Design</p><div class="skill-bar"><div class="skill-fill" style="width:75%"></div></div></div></div><div class="main"><h2>Experience</h2><div class="exp"><h3>Senior Frontend Engineer</h3><div class="company">Stripe Inc.</div><div class="period">2023 – Present</div><p>Led development of the Dashboard redesign, improving user retention by 24%. Mentored 3 junior engineers.</p></div><div class="exp"><h3>Software Engineer</h3><div class="company">Airbnb</div><div class="period">2020 – 2023</div><p>Built core features for the search and discovery platform. Reduced page load time by 40%.</p></div><h2>Education</h2><div class="exp"><h3>B.S. Computer Science</h3><div class="company">UC Berkeley</div><div class="period">2016 – 2020</div></div></div></div></body></html>`,
  },
  {
    id: "coming-soon",
    name: "Coming Soon",
    description: "Launch countdown page",
    previewBg: "from-rose-900 to-pink-900",
    accentColor: "#f43f5e",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Coming Soon</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;background:#0a0a0a;color:#fff;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;overflow:hidden}.bg{position:fixed;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(244,63,94,.15) 0%,transparent 70%)}.content{position:relative;z-index:1;padding:2rem}.badge{display:inline-block;background:rgba(244,63,94,.15);border:1px solid rgba(244,63,94,.3);color:#f43f5e;padding:.4rem 1.2rem;border-radius:99px;font-size:.85rem;font-weight:600;letter-spacing:.05em;margin-bottom:2rem}h1{font-size:clamp(2.5rem,8vw,5rem);font-weight:800;line-height:1.1;margin-bottom:1.5rem}.hl{color:#f43f5e}p{color:#6b7280;font-size:1.1rem;max-width:500px;margin:0 auto 3rem;line-height:1.7}.form{display:flex;gap:.75rem;flex-wrap:wrap;justify-content:center}input{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#fff;padding:.8rem 1.5rem;border-radius:8px;font-size:1rem;min-width:280px;outline:none;transition:.2s}input::placeholder{color:#4b5563}input:focus{border-color:#f43f5e}button{background:#f43f5e;color:#fff;border:none;padding:.8rem 2rem;border-radius:8px;font-size:1rem;font-weight:600;cursor:pointer;transition:.2s}button:hover{opacity:.85}.countdown{display:flex;gap:2rem;justify-content:center;margin-bottom:3rem}.count-item{display:flex;flex-direction:column;align-items:center}.count-num{font-size:3rem;font-weight:800;color:#f43f5e;line-height:1}.count-label{font-size:.75rem;color:#6b7280;text-transform:uppercase;letter-spacing:.1em;margin-top:.3rem}</style></head>
<body><div class="bg"></div><div class="content"><div class="badge">🚀 LAUNCHING SOON</div><h1>Something <span class="hl">Amazing</span><br>Is Coming</h1><div class="countdown"><div class="count-item"><div class="count-num">14</div><div class="count-label">Days</div></div><div class="count-item"><div class="count-num">06</div><div class="count-label">Hours</div></div><div class="count-item"><div class="count-num">42</div><div class="count-label">Minutes</div></div></div><p>We're working hard to bring you something extraordinary. Be the first to know when we launch.</p><div class="form"><input type="email" placeholder="Enter your email address"><button>Notify Me</button></div></div></body></html>`,
  },
];

export function TemplatesGallery() {
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [siteName, setSiteName] = useState("");
  const [progress, setProgress] = useState(0);
  const [deployed, setDeployed] = useState(false);
  const addSite = useAddSite();

  const openPreview = (tpl: Template) => {
    setPreviewTemplate(tpl);
    setSiteName(tpl.name);
    setProgress(0);
    setDeployed(false);
  };

  const closePreview = () => {
    if (addSite.isPending) return;
    setPreviewTemplate(null);
    setSiteName("");
    setDeployed(false);
    setProgress(0);
  };

  const handleDeploy = async () => {
    if (!previewTemplate || !siteName.trim()) return;
    try {
      const bytes = new TextEncoder().encode(previewTemplate.html);
      const blob = ExternalBlob.fromBytes(new Uint8Array(bytes));
      await addSite.mutateAsync({
        name: siteName.trim(),
        blob,
        onProgress: (p) => setProgress(p),
      });
      setDeployed(true);
      toast.success(`"${siteName}" deployed!`);
      setTimeout(() => closePreview(), 1500);
    } catch {
      toast.error("Deployment failed. Try again.");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl mb-1">
          Template Gallery
        </h2>
        <p className="text-muted-foreground text-sm">
          Choose a template, preview it, and deploy in one click.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TEMPLATES.map((tpl, i) => (
          <motion.div
            key={tpl.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors"
            data-ocid={`templates.item.${i + 1}`}
          >
            {/* Visual preview */}
            <div
              className={`h-28 bg-gradient-to-br ${tpl.previewBg} flex items-end p-3 relative overflow-hidden`}
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: `radial-gradient(circle at 70% 30%, ${tpl.accentColor}66, transparent 60%)`,
                }}
              />
              <div className="relative flex gap-1">
                <div className="w-2 h-2 rounded-full bg-white/30" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
              </div>
              <div
                className="absolute right-3 top-3 text-xs font-mono"
                style={{ color: tpl.accentColor }}
              >
                &lt;/&gt;
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-display font-semibold text-base mb-1">
                {tpl.name}
              </h3>
              <p className="text-muted-foreground text-xs mb-4">
                {tpl.description}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="w-full border-border hover:border-primary/60 gap-1.5 text-xs"
                onClick={() => openPreview(tpl)}
                data-ocid={`templates.item.${i + 1}.open_modal_button`}
              >
                <Eye className="w-3.5 h-3.5" />
                Preview & Deploy
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Preview Modal */}
      <Dialog
        open={!!previewTemplate}
        onOpenChange={(o) => !o && closePreview()}
      >
        <DialogContent
          className="bg-card border-border max-w-4xl w-[95vw] max-h-[90vh] flex flex-col"
          data-ocid="templates.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-lg">
              {previewTemplate?.name}
            </DialogTitle>
          </DialogHeader>

          {/* iframe preview */}
          <div
            className="flex-1 min-h-0 rounded-md overflow-hidden border border-border bg-white"
            style={{ height: "400px" }}
          >
            {previewTemplate && (
              <iframe
                srcDoc={previewTemplate.html}
                className="w-full h-full"
                title={`Preview of ${previewTemplate.name}`}
                sandbox="allow-scripts"
              />
            )}
          </div>

          {/* Deploy section */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-muted-foreground">Site Name</Label>
              <Input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="my-portfolio"
                className="bg-secondary border-border text-sm"
                disabled={addSite.isPending || deployed}
                data-ocid="templates.input"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleDeploy}
                disabled={!siteName.trim() || addSite.isPending || deployed}
                className="bg-primary text-primary-foreground hover:opacity-90 gap-2"
                data-ocid="templates.submit_button"
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
                    Deploy
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
                className="space-y-1"
                data-ocid="templates.loading_state"
              >
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Uploading template...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1" />
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}
