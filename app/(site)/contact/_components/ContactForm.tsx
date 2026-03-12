"use client";

// React client component for the contact form
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Zod schema describing and validating the form fields
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// TypeScript type inferred from the Zod schema
type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  // Track submit button loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Track whether the last submit succeeded or failed
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  // Initialize react-hook-form with Zod validation
  const {
    register, // used to connect inputs to react-hook-form
    handleSubmit, // wraps our onSubmit handler with validation
    formState: { errors }, // holds validation error messages for each field
    reset, // resets the form back to its initial state
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema), // use Zod schema as the validation resolver
  });

  // Form submit handler (simulates sending the message to a server)
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null); // clear any previous status

    try {
      // Simulate a network request delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitStatus("success");
      reset(); // clear form inputs on success
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shared Tailwind classes for all form inputs
  const inputClasses =
    "w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted/20 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors text-sm";

  return (
    // handleSubmit applies validation before calling onSubmit
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name field */}
      <div>
        <label htmlFor="name" className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">
          Name
        </label>
        {/* register connects this input to react-hook-form under the "name" key */}
        <input {...register("name")} type="text" id="name" placeholder="Your name" className={inputClasses} />
        {/* Only show the error message if there is a validation error for name */}
        {errors.name && <p className="mt-1.5 text-xs text-error">{errors.name.message}</p>}
      </div>

      {/* Email field */}
      <div>
        <label htmlFor="email" className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">
          Email
        </label>
        <input {...register("email")} type="email" id="email" placeholder="your.email@example.com" className={inputClasses} />
        {errors.email && <p className="mt-1.5 text-xs text-error">{errors.email.message}</p>}
      </div>

      {/* Subject field */}
      <div>
        <label htmlFor="subject" className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">
          Subject
        </label>
        <input {...register("subject")} type="text" id="subject" placeholder="What is this about?" className={inputClasses} />
        {errors.subject && <p className="mt-1.5 text-xs text-error">{errors.subject.message}</p>}
      </div>

      {/* Message field */}
      <div>
        <label htmlFor="message" className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">
          Message
        </label>
        <textarea
          {...register("message")}
          id="message"
          rows={5}
          placeholder="Your message..."
          className={`${inputClasses} resize-none`}
        />
        {errors.message && <p className="mt-1.5 text-xs text-error">{errors.message.message}</p>}
      </div>

      {/* Submit button with loading/disabled state */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>

      {/* Success message */}
      {submitStatus === "success" && (
        <div className="p-4 rounded-lg bg-success/10 border border-success/20 text-success text-sm">
          Message sent successfully! I&apos;ll get back to you soon.
        </div>
      )}

      {/* Error message */}
      {submitStatus === "error" && (
        <div className="p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
          Something went wrong. Please try again or email me directly.
        </div>
      )}
    </form>
  );
}
