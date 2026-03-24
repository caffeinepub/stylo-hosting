import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  FileCode,
  ImageIcon,
  Loader2,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useAddSite } from "../hooks/useQueries";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

export function UploadModal({ open, onOpenChange }: UploadModalProps) {
  const [siteName, setSiteName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addSite = useAddSite();

  const handleClose = () => {
    if (addSite.isPending) return;
    setSiteName("");
    setFile(null);
    setProgress(0);
    setDone(false);
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleSubmit = async () => {
    if (!siteName.trim() || !file) return;
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes);
      setProgress(0);
      await addSite.mutateAsync({
        name: siteName.trim(),
        blob,
        onProgress: (p) => setProgress(p),
      });
      setDone(true);
      toast.success("Site uploaded successfully!");
      setTimeout(() => handleClose(), 1500);
    } catch {
      toast.error("Upload failed. Please try again.");
    }
  };

  const isImage = file ? isImageFile(file) : false;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="bg-card border-border max-w-md"
        data-ocid="upload.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground">
            Upload New Site
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label
              htmlFor="site-name"
              className="text-muted-foreground text-sm"
            >
              Site Name
            </Label>
            <Input
              id="site-name"
              placeholder="My Awesome Website"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="bg-secondary border-border focus:border-primary/60"
              data-ocid="upload.input"
              disabled={addSite.isPending || done}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">
              File (HTML or Image)
            </Label>
            <button
              type="button"
              className="w-full relative border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors bg-transparent"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Click to select a file"
              data-ocid="upload.dropzone"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".html,.htm,.jpg,.jpeg,.png,.gif,.webp,.svg"
                onChange={handleFileChange}
                className="hidden"
                data-ocid="upload.upload_button"
              />
              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div
                    key="file"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-2"
                  >
                    {isImage ? (
                      <ImageIcon className="w-8 h-8 text-primary" />
                    ) : (
                      <FileCode className="w-8 h-8 text-primary" />
                    )}
                    <span className="text-sm font-medium text-foreground">
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB ·{" "}
                      {isImage ? "Image" : "HTML"}
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to select a file
                    </span>
                    <span className="text-xs text-muted-foreground/60">
                      .html, .htm, .jpg, .png, .gif, .webp, .svg
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          <AnimatePresence>
            {addSite.isPending && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
                data-ocid="upload.loading_state"
              >
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Uploading...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </motion.div>
            )}
            {done && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-sm text-primary"
                data-ocid="upload.success_state"
              >
                <CheckCircle className="w-4 h-4" />
                Upload complete!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={addSite.isPending}
            className="border-border"
            data-ocid="upload.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!siteName.trim() || !file || addSite.isPending || done}
            className="bg-primary text-primary-foreground hover:opacity-90"
            data-ocid="upload.submit_button"
          >
            {addSite.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Site
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
