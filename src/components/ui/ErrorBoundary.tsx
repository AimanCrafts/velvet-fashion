import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorId: "",
  };

  public static getDerivedStateFromError(): State {
    const errorId = `VF-ERR-${Math.floor(100000 + Math.random() * 900000)}`;
    return { hasError: true, errorId };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("[Velvet Fashion ErrorBoundary]", error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorId: "" });
    window.location.hash = "/";
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6 text-stone-900">
          <div className="max-w-md w-full bg-white rounded-2xl border border-[#ECE4D4] p-8 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#3E0713]/10 border border-[#3E0713]/20 flex items-center justify-center mx-auto text-[#3E0713]">
              <span className="font-['Cinzel'] text-2xl font-bold">V</span>
            </div>

            <div className="space-y-2">
              <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#24030B]">
                Something Went Wrong
              </h1>
              <p className="text-sm font-['Hind_Siliguri'] text-stone-600">
                দুঃখিত, একটি প্রযুক্তিগত ত্রুটি ঘটেছে। আপনার কোনো তথ্য বা অর্ডার ব্যাহত হয়নি।
              </p>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed">
              We encountered an unexpected presentation error. Our team has been notified.
              Please reload or return to the main collections.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-6 py-3 rounded-full bg-[#3E0713] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider hover:bg-[#520B1C] transition shadow-md"
              >
                Reload Application / পুনরায় লোড
              </button>
            </div>

            <div className="text-[10px] text-stone-400 font-mono pt-4 border-t border-stone-100">
              Reference: {this.state.errorId}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
