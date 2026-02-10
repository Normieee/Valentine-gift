import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Clock, Heart, StickyNote, Image as ImageIcon, Settings, LogOut } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { href: "/", icon: Clock, label: "Dashboard" },
    { href: "/fridge", icon: StickyNote, label: "Fridge" },
    { href: "/memories", icon: ImageIcon, label: "Memories" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 md:top-0 md:bottom-auto w-full z-50 glass-panel md:border-b md:border-t-0 border-t border-white/10 px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary fill-primary animate-pulse" />
          <span className="font-display text-xl font-bold tracking-wide">Synced Souls</span>
        </div>

        <div className="flex items-center justify-around w-full md:w-auto md:gap-8">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className={cn(
                "flex flex-col md:flex-row items-center gap-1 p-2 rounded-lg transition-all duration-200",
                isActive 
                  ? "text-primary md:bg-white/5" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}>
                <item.icon className={cn("w-6 h-6 md:w-5 md:h-5", isActive && "fill-current/20")} />
                <span className="text-[10px] md:text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
          
          <button 
            onClick={() => logout()}
            className="hidden md:flex items-center gap-2 p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
