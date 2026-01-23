import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Mail, 
  Heart,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/ui/Logo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FooterProps {
  className?: string;
}

const footerLinks = {
  company: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" }
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" }
  ]
};

const CONTACT_EMAIL = "team@rimbun.co";

export const Footer = ({ className }: FooterProps) => {
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSendEmail = () => {
    const subject = encodeURIComponent(emailSubject || "Contact from Rimbun");
    const body = encodeURIComponent(emailBody || "");
    const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    setIsDialogOpen(false);
    setEmailSubject("");
    setEmailBody("");
  };

  return (
    <footer className={cn("bg-muted/30 border-t border-border/40", className)}>
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div 
            className="lg:col-span-2 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative group-hover:scale-105 transition-all duration-300">
                <Logo size="lg" variant="footer" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Rimbun
                </span>
                <span className="text-xs text-muted-foreground -mt-1">AI-Powered Financial Education</span>
              </div>
            </Link>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering investors with personalized education and AI-driven insights to build confidence and achieve financial goals.
            </p>

            {/* Email Contact */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <motion.button
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="h-4 w-4" />
                  <span className="text-sm font-medium">Contact Us</span>
                </motion.button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Send us an email</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to send an email to {CONTACT_EMAIL}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="email-subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input
                      id="email-subject"
                      placeholder="What is this regarding?"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email-body" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="email-body"
                      placeholder="Type your message here..."
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      rows={6}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setEmailSubject("");
                        setEmailBody("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSendEmail}>
                      <Mail className="h-4 w-4 mr-2" />
                      Open Email Client
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Company Links */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-foreground">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          className="border-t border-border/40 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>© 2024 Rimbun. All rights reserved.</span>
            <div className="flex items-center space-x-2">
              <Shield className="h-3 w-3" />
              <span>Privacy focused</span>
            </div>
          </div>

        </motion.div>

        {/* Made with love */}
        <motion.div 
          className="text-center mt-8 pt-8 border-t border-border/40"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-muted-foreground">
            Made with <Heart className="inline h-3 w-3 text-red-500" /> to help you build financial confidence
          </p>
        </motion.div>
      </div>
    </footer>
  );
}; 