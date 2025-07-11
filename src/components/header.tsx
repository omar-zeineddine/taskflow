"use client";

import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { ChatNotification } from "@/components/chat-notification";
import { OnlineUsersHeader } from "@/components/online-users-header";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";

import { ModeToggle } from "./toggle";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">TaskFlow</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8 ml-8">
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium transition-colors hover:text-foreground text-foreground/80"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/tasks"
                    className="text-sm font-medium transition-colors hover:text-foreground text-foreground/80"
                  >
                    Tasks
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <OnlineUsersHeader />
                <ChatNotification />
              </>
            )}
            <ModeToggle />
            {user
              ? (
                  <Button onClick={signOut} variant="outline" size="sm" className="cursor-pointer">
                    Sign Out
                  </Button>
                )
              : (
                  <div className="flex items-center space-x-4 px-2">
                    <Link
                      to="/auth/login"
                      className="text-sm font-medium transition-colors hover:text-foreground text-foreground/80"
                    >
                      Login
                    </Link>
                    <Link to="/auth/register">
                      <Button size="sm" className="cursor-pointer">Register</Button>
                    </Link>
                  </div>
                )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground/60 hover:text-foreground hover:bg-accent transition-colors"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-t bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex flex-col space-y-4 py-4 px-2">
              <Link
                to="/"
                className="text-base font-medium transition-colors hover:text-foreground hover:bg-accent text-foreground/80 py-2 px-2 rounded-md -mx-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-base font-medium transition-colors hover:text-foreground hover:bg-accent text-foreground/80 py-2 px-2 rounded-md -mx-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  className="text-base font-medium transition-colors hover:text-foreground hover:bg-accent text-foreground/80 py-2 px-2 rounded-md -mx-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <div className="flex flex-col space-y-3 pt-4 border-t px-2">
                {user
                  ? (
                      <button
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                        className="text-base font-medium transition-colors hover:text-foreground hover:bg-accent text-foreground/80 py-2 px-2 rounded-md -mx-2 text-left cursor-pointer"
                      >
                        Sign Out
                      </button>
                    )
                  : (
                      <div className="flex flex-col space-y-3">
                        <Link
                          to="/auth/login"
                          className="text-base font-medium transition-colors hover:text-foreground hover:bg-accent text-foreground/80 py-2 px-2 rounded-md -mx-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Login
                        </Link>
                        <Link
                          to="/auth/register"
                          className="text-base font-medium transition-colors hover:text-foreground hover:bg-accent text-foreground/80 py-2 px-2 rounded-md -mx-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Register
                        </Link>
                      </div>
                    )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
