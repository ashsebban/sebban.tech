import { Metadata } from "next";
import ContactForm from "@/components/forms/ContactForm";
import { SOCIAL_LINKS } from "@/lib/constants";
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with me",
};

const iconMap: Record<string, React.ReactNode> = {
  FaGithub: <FaGithub size={24} />,
  FaLinkedin: <FaLinkedin size={24} />,
  FaTwitter: <FaTwitter size={24} />,
  FaEnvelope: <FaEnvelope size={24} />,
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Have a question or want to work together? I'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Connect With Me</h2>
              <div className="space-y-4">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="text-primary-600 dark:text-primary-400">
                      {iconMap[social.icon]}
                    </div>
                    <div>
                      <p className="font-medium">{social.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {social.name === "Email"
                          ? social.href.replace("mailto:", "")
                          : social.name === "GitHub"
                          ? "github.com/ashersebban"
                          : social.name === "LinkedIn"
                          ? "linkedin.com/in/asher-sebban"
                          : "Connect with me"}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-primary-50 dark:bg-primary-900 rounded-lg p-8">
              <h3 className="text-xl font-bold mb-4">Response Time</h3>
              <p className="text-gray-700 dark:text-gray-300">
                I typically respond within 24-48 hours. For urgent matters, feel free to reach
                out via email or social media.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
