import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { contactApi } from "@/lib/api/contactApi";

const CONTACT_EMAIL = "team@rimbun.co";

const fieldClass =
  "h-12 rounded-xl border-border bg-card text-[15px] shadow-none focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:ring-offset-0";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await contactApi.sendContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || "Contact from Rimbun",
        message: formData.message,
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
      toast.success("Message sent. We’ll get back to you soon.");
    } catch (error: unknown) {
      console.error("Failed to send message:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again later.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-6 pt-20 pb-24 md:pt-28 md:pb-32">
      <div className="mx-auto max-w-[560px]">
        <h1 className="text-[40px] font-semibold leading-[1.07] tracking-tight text-foreground md:text-[56px]">
          Talk to us
        </h1>
        <p className="mt-5 text-[19px] leading-relaxed text-muted-foreground">
          If you’re trying to understand what customers need, how they use your
          products, or what to do next, we’d like to hear about it.
        </p>
        <p className="mt-4 text-[17px] text-muted-foreground">
          Or email{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-primary hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>

        <form onSubmit={handleSubmit} className="mt-12 grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label
                htmlFor="name"
                className="text-[13px] font-medium text-muted-foreground"
              >
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Your name"
                required
                className={fieldClass}
              />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="email"
                className="text-[13px] font-medium text-muted-foreground"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Work email"
                required
                className={fieldClass}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="subject"
              className="text-[13px] font-medium text-muted-foreground"
            >
              Subject
            </Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              placeholder="Optional"
              className={fieldClass}
            />
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="message"
              className="text-[13px] font-medium text-muted-foreground"
            >
              Message
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="What are you trying to do?"
              rows={6}
              required
              className="min-h-[160px] rounded-xl border-border bg-card text-[15px] shadow-none focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:ring-offset-0"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-foreground px-7 text-[17px] font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-50 sm:w-auto"
          >
            {isSubmitting ? "Sending…" : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
