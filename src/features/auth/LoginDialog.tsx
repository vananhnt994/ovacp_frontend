import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export function LoginDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      await login(formData.email, formData.password);
      toast.success("Erfolgreich angemeldet!");
      setOpen(false);
      setFormData({ email: "", password: "" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Anmeldung fehlgeschlagen";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Anmeldung</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Anmelden</DialogTitle>
          <DialogDescription>
            Melden Sie sich bei Ihrem OVACP-Konto an
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">E-Mail</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="max@beispiel.de"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Passwort</Label>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Passwort vergessen?
            </a>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Melde an..." : "Anmelden"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

