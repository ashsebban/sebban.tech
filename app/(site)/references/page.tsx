"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Modal from "@/components/ui/Modal";
import { REFERENCE_GROUP_LOGOS, REFERENCES_PAGE } from "@/lib/constants";

type WizardStep = 1 | 2;
type LinkedInInputMode = "url" | "username";

interface RequestFormState {
  linkedin: string;
  linkedinUsername: string;
  company: string;
  roleToFill: string;
  jobDescriptionUrl: string;
  message: string;
}

export default function ReferencesPage() {
  const maxRequests = 3;
  const references = REFERENCES_PAGE.references ?? [];
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<WizardStep>(1);
  const [linkedinInputMode, setLinkedinInputMode] = useState<LinkedInInputMode>("url");
  const [formErrors, setFormErrors] = useState<Partial<RequestFormState>>({});
  const [emailSent, setEmailSent] = useState(false);
  const [form, setForm] = useState<RequestFormState>({
    linkedin: "",
    linkedinUsername: "",
    company: "",
    roleToFill: "",
    jobDescriptionUrl: "",
    message: "",
  });

  const selectedReferences = useMemo(
    () => references.filter((r) => selectedKeys.includes(`${r.group}:${r.name}`)),
    [references, selectedKeys],
  );

  const groupedReferences = references.reduce<Record<string, typeof references>>(
    (acc, reference) => {
      if (!acc[reference.group]) acc[reference.group] = [];
      acc[reference.group].push(reference);
      return acc;
    },
    {},
  );

  const computedLinkedin = useMemo(() => {
    if (linkedinInputMode === "url") return form.linkedin.trim();
    const username = form.linkedinUsername
      .trim()
      .replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, "")
      .replace(/\s+/g, "-")
      .replace(/^\/+|\/+$/g, "");
    return username ? `https://www.linkedin.com/in/${username}` : "";
  }, [form.linkedin, form.linkedinUsername, linkedinInputMode]);

  const submitHref = useMemo(() => {
    const subject = `Reference request - ${form.company || "Company"}`;
    const lines = selectedReferences.map(
      (r, i) => `${i + 1}. ${r.name} - ${r.role} (${r.group})`,
    );
    const body = [
      "Hi Asher,",
      "",
      "I am requesting references for the following people:",
      ...lines,
      "",
      "Request details:",
      `- Recruiter LinkedIn: ${computedLinkedin || "Not provided"}`,
      `- Company: ${form.company}`,
      `- Role: ${form.roleToFill}`,
      `- Job description: ${form.jobDescriptionUrl || "Not provided"}`,
      "",
      "Additional context:",
      form.message || "None provided",
      "",
      "Thanks,",
    ].join("\n");
    return `mailto:ashersamuelsebban@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [computedLinkedin, form.company, form.jobDescriptionUrl, form.message, form.roleToFill, selectedReferences]);

  const toggleReference = (key: string) => {
    setSelectedKeys((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= maxRequests) return prev;
      return [...prev, key];
    });
  };

  const handleFormChange = (field: keyof RequestFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const isValidUrl = (value: string) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const validateStepOne = () => {
    const nextErrors: Partial<RequestFormState> = {};
    if (!computedLinkedin) {
      nextErrors.linkedin =
        linkedinInputMode === "url"
          ? "LinkedIn URL is required."
          : "LinkedIn username is required.";
    } else if (!/linkedin\.com\/in\//i.test(computedLinkedin)) {
      nextErrors.linkedin = "Please enter a valid LinkedIn profile URL.";
    }
    if (!form.company.trim()) nextErrors.company = "Company is required.";
    if (!form.roleToFill.trim()) nextErrors.roleToFill = "Role is required.";
    if (form.jobDescriptionUrl.trim() && !isValidUrl(form.jobDescriptionUrl.trim())) {
      nextErrors.jobDescriptionUrl = "Please enter a valid URL.";
    }
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const openWizard = () => {
    if (selectedReferences.length === 0) return;
    setWizardStep(1);
    setEmailSent(false);
    setIsWizardOpen(true);
  };

  const closeWizard = () => {
    setIsWizardOpen(false);
    setWizardStep(1);
    setFormErrors({});
    setEmailSent(false);
  };

  return (
    <section className="px-6 py-12">
      <div className={`max-w-4xl mx-auto ${selectedKeys.length > 0 ? "pb-24" : ""}`}>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {REFERENCES_PAGE.title}
        </h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          {REFERENCES_PAGE.intro}
        </p>
        <p className="mt-2 text-sm text-muted">
          Select up to {maxRequests} and submit a request.
        </p>

        <div className="mt-5 space-y-3">
          {Object.entries(groupedReferences).map(([group, items]) => {
            const groupSelectedCount = items.filter((item) =>
              selectedKeys.includes(`${item.group}:${item.name}`),
            ).length;

            return (
              <div key={group} className="rounded-xl border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    {REFERENCE_GROUP_LOGOS[group] ? (
                      <Image
                        src={REFERENCE_GROUP_LOGOS[group]}
                        alt={group}
                        width={20}
                        height={20}
                        className="rounded object-contain"
                      />
                    ) : null}
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
                      {group}
                    </h2>
                  </div>
                  {groupSelectedCount > 0 && (
                    <span className="text-xs font-medium text-accent">
                      {groupSelectedCount} selected
                    </span>
                  )}
                </div>
                <ul className="divide-y divide-border">
                  {items.map((item) => {
                    const key = `${item.group}:${item.name}`;
                    const isSelected = selectedKeys.includes(key);
                    const isDisabled = selectedKeys.length >= maxRequests && !isSelected;

                    return (
                      <li
                        key={key}
                        className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
                      >
                        <div>
                          <span className="text-sm font-medium text-foreground">
                            {item.name}
                          </span>
                          <span className="text-sm text-muted"> · {item.role}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleReference(key)}
                          disabled={isDisabled}
                          className={`ml-4 shrink-0 inline-flex items-center px-3 py-2 rounded-md border text-xs font-medium transition-colors ${
                            isSelected
                              ? "border-accent bg-accent/10 text-accent"
                              : "border-border text-muted hover:border-accent hover:text-accent"
                          } ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
                        >
                          {isSelected ? "Remove" : "Add"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {selectedKeys.length === 0 && (
          <p className="mt-6 text-sm text-muted text-center">
            Select references above to submit a request.
          </p>
        )}
      </div>

      {selectedKeys.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-sm font-medium text-foreground whitespace-nowrap shrink-0">
                {selectedKeys.length}/{maxRequests} selected
              </span>
              <span className="text-sm text-muted truncate hidden sm:block">
                {selectedReferences.map((r) => r.name).join(", ")}
              </span>
            </div>
            <button
              type="button"
              onClick={openWizard}
              className="shrink-0 inline-flex px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
            >
              Submit Request →
            </button>
          </div>
        </div>
      )}

      {isWizardOpen && (
        <Modal title="Reference Request" onClose={closeWizard} size="md">
          <div className="max-h-[80vh] overflow-y-auto px-6 py-5">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-5">
              {([1, 2] as WizardStep[]).map((step) => (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                      wizardStep >= step ? "bg-accent text-white" : "bg-card-hover text-muted"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 2 && (
                    <div
                      className={`h-px w-8 transition-colors ${
                        wizardStep > 1 ? "bg-accent" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
              <span className="ml-1 text-xs text-muted">
                {wizardStep === 1 ? "Request details" : "Review & send"}
              </span>
            </div>

            {wizardStep === 1 ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-card-hover px-4 py-3">
                  <p className="text-xs text-muted font-medium uppercase tracking-wide mb-1">
                    Requesting references for
                  </p>
                  <p className="text-sm text-foreground">
                    {selectedReferences.map((r) => r.name).join(", ")}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">
                    Your LinkedIn *
                  </label>
                  <p className="text-xs text-muted mt-0.5 mb-2">
                    So I can verify who&apos;s reaching out
                  </p>
                  <div className="inline-flex rounded-md border border-border p-1 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLinkedinInputMode("url");
                        setFormErrors((prev) => ({ ...prev, linkedin: undefined }));
                      }}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        linkedinInputMode === "url"
                          ? "bg-accent text-white"
                          : "text-muted hover:text-foreground"
                      }`}
                    >
                      URL
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLinkedinInputMode("username");
                        setFormErrors((prev) => ({ ...prev, linkedin: undefined }));
                      }}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        linkedinInputMode === "username"
                          ? "bg-accent text-white"
                          : "text-muted hover:text-foreground"
                      }`}
                    >
                      Username
                    </button>
                  </div>

                  {linkedinInputMode === "url" ? (
                    <input
                      id="linkedin"
                      type="url"
                      value={form.linkedin}
                      onChange={(e) => handleFormChange("linkedin", e.target.value)}
                      placeholder="https://linkedin.com/in/your-name"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                    />
                  ) : (
                    <div className="flex w-full rounded-md border border-border bg-background">
                      <span className="inline-flex items-center border-r border-border px-3 text-xs text-muted shrink-0">
                        linkedin.com/in/
                      </span>
                      <input
                        id="linkedinUsername"
                        type="text"
                        value={form.linkedinUsername}
                        onChange={(e) => handleFormChange("linkedinUsername", e.target.value)}
                        placeholder="your-name"
                        className="w-full bg-transparent px-3 py-2 text-sm text-foreground outline-none"
                      />
                    </div>
                  )}
                  {formErrors.linkedin && (
                    <p className="mt-1 text-xs text-error">{formErrors.linkedin}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="company" className="text-sm font-medium text-foreground">
                      Company *
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={form.company}
                      onChange={(e) => handleFormChange("company", e.target.value)}
                      placeholder="e.g. Acme Corp"
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                    />
                    {formErrors.company && (
                      <p className="mt-1 text-xs text-error">{formErrors.company}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="roleToFill" className="text-sm font-medium text-foreground">
                      Role *
                    </label>
                    <input
                      id="roleToFill"
                      type="text"
                      value={form.roleToFill}
                      onChange={(e) => handleFormChange("roleToFill", e.target.value)}
                      placeholder="e.g. Product Manager"
                      className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                    />
                    {formErrors.roleToFill && (
                      <p className="mt-1 text-xs text-error">{formErrors.roleToFill}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="jobDescriptionUrl" className="text-sm font-medium text-foreground">
                    Job Description URL{" "}
                    <span className="text-muted font-normal">(optional)</span>
                  </label>
                  <input
                    id="jobDescriptionUrl"
                    type="url"
                    value={form.jobDescriptionUrl}
                    onChange={(e) => handleFormChange("jobDescriptionUrl", e.target.value)}
                    placeholder="https://company.com/jobs/..."
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                  {formErrors.jobDescriptionUrl && (
                    <p className="mt-1 text-xs text-error">{formErrors.jobDescriptionUrl}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Additional Context{" "}
                    <span className="text-muted font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => handleFormChange("message", e.target.value)}
                    rows={3}
                    placeholder="Anything else I should know..."
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted">
                  Review the draft below — clicking the button will open it in your email app.
                </p>
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-sm">
                    <span className="font-medium text-foreground">To:</span>{" "}
                    <span className="text-muted">ashersamuelsebban@gmail.com</span>
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium text-foreground">Subject:</span>{" "}
                    <span className="text-muted">{`Reference request - ${form.company || "Company"}`}</span>
                  </p>
                  <pre className="mt-4 whitespace-pre-wrap text-sm text-muted leading-relaxed border-t border-border pt-4">
{`Hi Asher,

I am requesting references for the following people:
${selectedReferences.map((r, i) => `${i + 1}. ${r.name} - ${r.role} (${r.group})`).join("\n")}

Request details:
- Recruiter LinkedIn: ${computedLinkedin || "Not provided"}
- Company: ${form.company}
- Role: ${form.roleToFill}
- Job description: ${form.jobDescriptionUrl || "Not provided"}

Additional context:
${form.message || "None provided"}

Thanks,`}
                  </pre>
                </div>
                {emailSent && (
                  <p className="text-sm text-accent font-medium">
                    Draft opened — check your email app.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-border px-6 py-4 flex items-center justify-between">
            <button
              type="button"
              onClick={closeWizard}
              className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>

            {wizardStep === 1 ? (
              <button
                type="button"
                onClick={() => {
                  if (validateStepOne()) setWizardStep(2);
                }}
                className="px-5 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
              >
                Continue →
              </button>
            ) : emailSent ? (
              <button
                type="button"
                onClick={closeWizard}
                className="px-5 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
              >
                Done
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:border-accent hover:text-accent transition-colors"
                >
                  Back
                </button>
                <a
                  href={submitHref}
                  onClick={() => setEmailSent(true)}
                  className="px-5 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
                >
                  Open Email Draft
                </a>
              </div>
            )}
          </div>
        </Modal>
      )}
    </section>
  );
}
