import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Code2, Eye, Loader2, Rocket } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useAddSite } from "../hooks/useQueries";

const STARTER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Site</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
    }
    h1 { font-size: 3rem; font-weight: 800; margin-bottom: 1rem; }
    h1 span { color: #6366f1; }
    p { color: #94a3b8; font-size: 1.1rem; max-width: 500px; margin: 0 auto 2rem; }
    .btn {
      display: inline-block;
      background: #6366f1;
      color: #fff;
      padding: 0.75rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div>
    <h1>Hello, <span>World!</span></h1>
    <p>Welcome to my site. Edit this HTML to make it your own.</p>
    <a class="btn" href="#">Get Started</a>
  </div>
</body>
</html>`;

export function HTMLEditor() {
  const [code, setCode] = useState(STARTER_HTML);
  const [siteName, setSiteName] = useState("");
  const [progress, setProgress] = useState(0);
  const [deployed, setDeployed] = useState(false);
  const addSite = useAddSite();

  const handleDeploy = async () => {
    if (!siteName.trim() || !code.trim()) return;
    try {
      const bytes = new TextEncoder().encode(code);
      const blob = ExternalBlob.fromBytes(new Uint8Array(bytes));
      setProgress(0);
      setDeployed(false);
      await addSite.mutateAsync({
        name: siteName.trim(),
        blob,
        onProgress: (p) => setProgress(p),
      });
      setDeployed(true);
      toast.success(`"${siteName}" deployed!`);
      setTimeout(() => {
        setDeployed(false);
        setSiteName("");
      }, 2000);
    } catch {
      toast.error("Deploy failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-display font-bold text-xl mb-1">
          HTML Code Editor
        </h2>
        <p className="text-muted-foreground text-sm">
          Write or paste HTML, preview it live, then deploy in one click.
        </p>
      </div>

      <Tabs defaultValue="code" className="flex flex-col flex-1">
        <TabsList
          className="bg-secondary border border-border w-fit"
          data-ocid="editor.tab"
        >
          <TabsTrigger
            value="code"
            className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Code2 className="w-3.5 h-3.5" />
            Code
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="mt-3 flex-1">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-96 font-mono text-sm bg-[#0d1117] text-[#e6edf3] border border-border rounded-lg p-4 resize-none focus:outline-none focus:border-primary/60 leading-relaxed"
            spellCheck={false}
            data-ocid="editor.editor"
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-3">
          <div className="h-96 rounded-lg overflow-hidden border border-border bg-white">
            <iframe
              srcDoc={code}
              className="w-full h-full"
              title="HTML Preview"
              sandbox="allow-scripts"
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Deploy bar */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border">
        <div className="flex-1 space-y-1">
          <Label className="text-xs text-muted-foreground">Site Name</Label>
          <Input
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="my-awesome-site"
            className="bg-secondary border-border text-sm"
            disabled={addSite.isPending}
            data-ocid="editor.input"
          />
        </div>
        <div className="flex items-end">
          <Button
            onClick={handleDeploy}
            disabled={!siteName.trim() || !code.trim() || addSite.isPending}
            className="bg-primary text-primary-foreground hover:opacity-90 gap-2"
            data-ocid="editor.submit_button"
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1"
            data-ocid="editor.loading_state"
          >
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Uploading...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
