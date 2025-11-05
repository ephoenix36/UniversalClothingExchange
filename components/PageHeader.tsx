import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  backLink?: string;
  backLabel?: string;
  actions?: ReactNode;
  stats?: { label: string; value: string | number }[];
  gradient?: boolean;
  showHomeButton?: boolean;
}

export default function PageHeader({
  title,
  description,
  backLink,
  backLabel = "Back",
  actions,
  stats,
  gradient = true,
  showHomeButton = true,
}: PageHeaderProps) {
  return (
    <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-lg border-b border-[#dcd6cc] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back Button */}
        {backLink && (
          <Link href={backLink} className="inline-block mb-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {backLabel}
            </Button>
          </Link>
        )}

        {/* Header Content */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1
              className={cn(
                "text-4xl md:text-5xl font-bold mb-2",
                gradient
                  ? "bg-gradient-to-r from-[#4a8a62] to-[#d98960] bg-clip-text text-transparent"
                  : "text-foreground"
              )}
            >
              {title}
            </h1>
            {description && (
              <p className="text-lg text-muted-foreground">{description}</p>
            )}
          </div>

          {/* Actions */}
          {(actions || showHomeButton) && (
            <div className="flex flex-wrap items-center gap-3">
              {showHomeButton && (
                <Link href="/">
                  <Button variant="outline" size="default">
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                </Link>
              )}
              {actions}
            </div>
          )}
        </div>

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-card rounded-xl p-4 border border-border">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
