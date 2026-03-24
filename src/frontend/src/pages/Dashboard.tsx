import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Code2,
  ExternalLink,
  FileCode,
  Globe,
  ImageIcon,
  LayoutGrid,
  LayoutTemplate,
  Loader2,
  LogOut,
  Plus,
  Trash2,
  Wand2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { HTMLEditor } from "../components/HTMLEditor";
import { TemplateBuilder } from "../components/TemplateBuilder";
import { TemplatesGallery } from "../components/TemplatesGallery";
import { UploadModal } from "../components/UploadModal";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  type SiteWithId,
  useDeleteSite,
  useGetAllSites,
} from "../hooks/useQueries";

function getFileType(name: string): "html" | "image" {
  const lower = name.toLowerCase();
  if (lower.endsWith(".html") || lower.endsWith(".htm")) return "html";
  if (
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".png") ||
    lower.endsWith(".gif") ||
    lower.endsWith(".webp") ||
    lower.endsWith(".svg")
  )
    return "image";
  return "html"; // default assume html
}

export function Dashboard() {
  const { identity, clear } = useInternetIdentity();
  const { data: sites, isLoading, isError } = useGetAllSites();
  const deleteSite = useDeleteSite();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SiteWithId | null>(null);

  const principal = identity?.getPrincipal().toString() ?? "";
  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-4)}`
    : "";

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSite.mutateAsync(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" deleted.`);
    } catch {
      toast.error("Failed to delete site.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleView = (site: SiteWithId) => {
    const url = site.blobId.getDirectURL();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border/60 flex items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Globe className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            Stylo Hosting
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary border border-border text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {shortPrincipal}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clear}
            className="border-border text-muted-foreground hover:text-foreground text-xs gap-1.5"
            data-ocid="nav.secondary_button"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log Out
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full">
        <Tabs defaultValue="sites">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <TabsList
              className="bg-secondary border border-border"
              data-ocid="dashboard.tab"
            >
              <TabsTrigger
                value="sites"
                className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Globe className="w-3.5 h-3.5" />
                My Sites
              </TabsTrigger>
              <TabsTrigger
                value="templates"
                className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <LayoutTemplate className="w-3.5 h-3.5" />
                Templates
              </TabsTrigger>
              <TabsTrigger
                value="editor"
                className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Code2 className="w-3.5 h-3.5" />
                Editor
              </TabsTrigger>
              <TabsTrigger
                value="builder"
                className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Wand2 className="w-3.5 h-3.5" />
                Builder
              </TabsTrigger>
            </TabsList>

            <Button
              onClick={() => setUploadOpen(true)}
              className="bg-primary text-primary-foreground hover:opacity-90 gap-2 text-xs"
              data-ocid="dashboard.primary_button"
            >
              <Plus className="w-4 h-4" />
              Upload New Site
            </Button>
          </div>

          {/* My Sites Tab */}
          <TabsContent value="sites">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-2xl md:text-3xl">
                  My Sites
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {isLoading
                    ? "Loading..."
                    : `${sites?.length ?? 0} site${
                        sites?.length === 1 ? "" : "s"
                      } hosted`}
                </p>
              </div>
            </div>

            {/* Loading */}
            {isLoading && (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                data-ocid="dashboard.loading_state"
              >
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-36 rounded-lg bg-secondary" />
                ))}
              </div>
            )}

            {/* Error */}
            {isError && !isLoading && (
              <div
                className="flex flex-col items-center justify-center py-16 text-center"
                data-ocid="dashboard.error_state"
              >
                <AlertTriangle className="w-10 h-10 text-destructive mb-3" />
                <p className="text-muted-foreground">Failed to load sites.</p>
              </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && sites?.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center"
                data-ocid="dashboard.empty_state"
              >
                <div className="w-16 h-16 rounded-xl bg-secondary border border-border flex items-center justify-center mb-5">
                  <LayoutGrid className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">
                  No sites yet
                </h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                  Upload your first HTML site or deploy a template to get
                  started.
                </p>
                <Button
                  onClick={() => setUploadOpen(true)}
                  className="bg-primary text-primary-foreground hover:opacity-90 gap-2"
                  data-ocid="dashboard.empty_state.primary_button"
                >
                  <Plus className="w-4 h-4" />
                  Upload Your First Site
                </Button>
              </motion.div>
            )}

            {/* Sites Grid */}
            {!isLoading && !isError && sites && sites.length > 0 && (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                data-ocid="dashboard.list"
              >
                <AnimatePresence>
                  {sites.map((site, index) => {
                    const fileType = getFileType(site.name);
                    const isImage = fileType === "image";

                    return (
                      <motion.div
                        key={site.id.toString()}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.07 }}
                        className="site-card bg-card border border-border rounded-lg p-5 flex flex-col gap-4"
                        data-ocid={`dashboard.item.${index + 1}`}
                      >
                        {/* Image preview or icon */}
                        {isImage ? (
                          <img
                            src={site.blobId.getDirectURL()}
                            alt={site.name}
                            className="w-full h-24 object-cover rounded mb-2"
                          />
                        ) : (
                          <div className="flex items-start justify-between">
                            <div className="w-10 h-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                              <FileCode className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border">
                              Live
                            </span>
                          </div>
                        )}

                        {isImage && (
                          <div className="flex items-center justify-between -mt-2">
                            <div className="flex items-center gap-1.5">
                              <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                Image
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border">
                              Live
                            </span>
                          </div>
                        )}

                        <div className="flex-1">
                          <h3 className="font-display font-semibold text-base leading-tight">
                            {site.name}
                          </h3>
                          <p className="text-muted-foreground text-xs mt-1 font-mono truncate">
                            ID: {site.id.toString()}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-border text-muted-foreground hover:text-foreground text-xs gap-1.5"
                            onClick={() => handleView(site)}
                            data-ocid={`dashboard.item.${index + 1}.secondary_button`}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/60"
                            onClick={() => setDeleteTarget(site)}
                            disabled={deleteSite.isPending}
                            data-ocid={`dashboard.delete_button.${index + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates">
            <TemplatesGallery />
          </TabsContent>

          {/* Editor Tab */}
          <TabsContent value="editor">
            <HTMLEditor />
          </TabsContent>

          {/* Builder Tab */}
          <TabsContent value="builder">
            <TemplateBuilder />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-border/50 text-center mt-auto">
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()}. Built with ♥ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary/70 hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      <UploadModal open={uploadOpen} onOpenChange={setUploadOpen} />

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent
          className="bg-card border-border"
          data-ocid="dashboard.dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete &ldquo;{deleteTarget?.name}&rdquo;?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will permanently remove the site. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-border"
              data-ocid="dashboard.cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:opacity-90"
              data-ocid="dashboard.confirm_button"
            >
              {deleteSite.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete Site"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
