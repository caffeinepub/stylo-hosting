import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Loader2, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function LandingPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  const features = [
    {
      icon: Globe,
      title: "Instant Hosting",
      desc: "Upload your HTML and go live in seconds on the Internet Computer.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      desc: "Served directly from blockchain nodes with global low latency.",
    },
    {
      icon: Shield,
      title: "Decentralized",
      desc: "No servers, no downtime. Your sites live forever on-chain.",
    },
  ];

  return (
    <div className="min-h-screen bg-background grid-bg flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Globe className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            Stylo Hosting
          </span>
        </div>
        <Button
          onClick={login}
          disabled={isLoggingIn}
          size="sm"
          className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors"
          variant="outline"
          data-ocid="nav.login_button"
        >
          {isLoggingIn ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Log In"
          )}
        </Button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
            Powered by Internet Computer
          </div>

          <h1 className="font-display font-bold text-5xl md:text-7xl leading-tight tracking-tight">
            Host your websites
            <br />
            <span className="text-primary text-glow">with ease</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
            Deploy HTML sites instantly on the Internet Computer. No servers, no
            subscriptions — just upload and share.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              size="lg"
              onClick={login}
              disabled={isLoggingIn}
              className="bg-primary text-primary-foreground hover:opacity-90 glow-primary px-8 text-base font-semibold"
              data-ocid="hero.primary_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto mt-24 w-full"
        >
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-card border border-border rounded-lg p-6 text-left hover:border-primary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-base mb-2">
                {f.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-5 border-t border-border/50 text-center">
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
    </div>
  );
}
