"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackLabel?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * IntegrationErrorBoundary
 * Wraps integration widgets (DiscordPresence, SpotifyNowPlaying, etc.)
 * so a single widget crash doesn't break the entire profile page.
 */
export class IntegrationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[IntegrationErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={14} className="text-red-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white/60">
              {this.props.fallbackLabel || "Integration"} unavailable
            </p>
            <p className="text-[10px] text-white/30 mt-0.5 truncate">
              {this.state.error?.message || "Failed to load widget"}
            </p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="flex-shrink-0 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/40 hover:text-white"
            title="Try again"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
