import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Mail, Phone, MessageSquare } from 'lucide-react';
import { ReactNode } from 'react';

interface ContactUsModalProps {
  children: ReactNode;
}

export function ContactUsModal({ children }: ContactUsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageSquare className="h-5 w-5 text-primary" />
            Contact Us
          </DialogTitle>
          <DialogDescription>
            We'd love to hear from you. Reach out through any channel below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <a
            href="mailto:dbpixelpirates@gmail.com"
            className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-muted/30 hover:bg-primary/5 hover:border-primary/30 transition-all group"
          >
            <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">dbpixelpirates@gmail.com</p>
            </div>
          </a>

          <a
            href="tel:9173439177"
            className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-muted/30 hover:bg-primary/5 hover:border-primary/30 transition-all group"
          >
            <div className="p-3 rounded-xl bg-success/10 group-hover:bg-success/20 transition-colors">
              <Phone className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium">Mobile</p>
              <p className="text-sm text-muted-foreground">9173439177</p>
            </div>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
