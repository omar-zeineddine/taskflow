import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py=12">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:gap-4">
            {/* Main Content */}
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <p className="text-sm leading-relaxed text-muted-foreground max-w-md">
                source code is available on
                {" "}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </p>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-8">
              <p className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                TaskFlow - v1.0.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
