"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";

import { services } from "@/content/content";
import type { TeamMember } from "@/content/content";

type SubmitState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
  fields?: Record<string, string[]>;
};

const initialState: SubmitState = { status: "idle", message: "" };

export function ContactForm({
  initialService = "",
  initialMember,
}: {
  initialService?: string;
  initialMember?: Pick<TeamMember, "slug" | "name">;
}) {
  const [state, setState] = useState<SubmitState>(initialState);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.status === "submitting") return;
    setState({ status: "submitting", message: "" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const selectedServices = formData.getAll("services").map(String);
    if (selectedServices.length === 0) {
      setState({
        status: "error",
        message:
          "Please choose at least one service so we can route your inquiry.",
        fields: { services: ["Choose at least one service."] },
      });
      return;
    }
    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      company: String(formData.get("company") ?? ""),
      website: String(formData.get("website") ?? ""),
      services: selectedServices,
      ...(initialMember
        ? { teamMember: String(formData.get("teamMember") ?? "") }
        : {}),
      budget: String(formData.get("budget") ?? ""),
      timeline: String(formData.get("timeline") ?? ""),
      details: String(formData.get("details") ?? ""),
      faxNumber: String(formData.get("faxNumber") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15_000),
      });
      const result = (await response.json()) as {
        message?: string;
        fieldErrors?: Record<string, string[]>;
      };
      if (!response.ok) {
        setState({
          status: "error",
          message:
            result.message ??
            "We could not submit your inquiry. Please review the form and try again.",
          fields: result.fieldErrors,
        });
        return;
      }
      setState({
        status: "success",
        message: result.message ?? "Your inquiry was delivered successfully.",
      });
      form.reset();
    } catch {
      setState({
        status: "error",
        message:
          "We could not confirm whether your inquiry was sent. Please contact us before submitting again.",
      });
    }
  }

  function fieldError(field: string) {
    return state.fields?.[field]?.[0];
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate={false}>
      {initialMember && (
        <>
          <input name="teamMember" type="hidden" value={initialMember.slug} />
          <p className="profile-inquiry-context">
            You selected {initialMember.name}. This inquiry goes to the
            studio&apos;s configured contact inbox, not directly to the team
            member.
          </p>
        </>
      )}
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="fullName">
            Full name <span aria-hidden="true">*</span>
          </label>
          <input
            autoComplete="name"
            id="fullName"
            name="fullName"
            required
            maxLength={120}
            aria-invalid={Boolean(fieldError("fullName"))}
            aria-describedby={
              fieldError("fullName") ? "fullName-error" : undefined
            }
          />
          {fieldError("fullName") && (
            <p className="field-error" id="fullName-error">
              {fieldError("fullName")}
            </p>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="email">
            Business email <span aria-hidden="true">*</span>
          </label>
          <input
            autoComplete="email"
            id="email"
            name="email"
            type="email"
            required
            maxLength={254}
            aria-invalid={Boolean(fieldError("email"))}
            aria-describedby={fieldError("email") ? "email-error" : undefined}
          />
          {fieldError("email") && (
            <p className="field-error" id="email-error">
              {fieldError("email")}
            </p>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="company">
            Company or brand <span className="optional-label">(optional)</span>
          </label>
          <input
            autoComplete="organization"
            id="company"
            name="company"
            maxLength={160}
            aria-invalid={Boolean(fieldError("company"))}
            aria-describedby={
              fieldError("company") ? "company-error" : undefined
            }
          />
          {fieldError("company") && (
            <p className="field-error" id="company-error">
              {fieldError("company")}
            </p>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="website">
            Website <span className="optional-label">(optional)</span>
          </label>
          <input
            autoComplete="url"
            id="website"
            name="website"
            type="url"
            placeholder="https://"
            maxLength={2048}
            aria-invalid={Boolean(fieldError("website"))}
            aria-describedby={
              fieldError("website") ? "website-error" : undefined
            }
          />
          {fieldError("website") && (
            <p className="field-error" id="website-error">
              {fieldError("website")}
            </p>
          )}
        </div>
      </div>

      <fieldset
        className="form-field service-checkboxes"
        aria-invalid={Boolean(fieldError("services"))}
        aria-describedby={fieldError("services") ? "services-error" : undefined}
      >
        <legend>
          What would you like help with? <span aria-hidden="true">*</span>{" "}
          <span className="optional-label">(choose at least one)</span>
        </legend>
        <div className="checkbox-grid">
          {services.map((service) => (
            <label key={service.slug} className="checkbox-label">
              <input
                type="checkbox"
                name="services"
                value={service.slug}
                defaultChecked={initialService === service.slug}
              />
              <span>{service.title}</span>
            </label>
          ))}
        </div>
        {fieldError("services") && (
          <p className="field-error" id="services-error">
            {fieldError("services")}
          </p>
        )}
      </fieldset>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="budget">
            Indicative budget in USD{" "}
            <span className="optional-label">(optional)</span>
          </label>
          <select id="budget" name="budget" defaultValue="">
            <option value="">Select a range</option>
            <option value="under-5k">Under USD 5,000</option>
            <option value="5k-15k">USD 5,000–15,000</option>
            <option value="15k-50k">USD 15,000–50,000</option>
            <option value="50k-plus">USD 50,000+</option>
            <option value="not-sure">Not sure yet</option>
          </select>
          {fieldError("budget") && (
            <p className="field-error">{fieldError("budget")}</p>
          )}
        </div>
        <div className="form-field">
          <label htmlFor="timeline">
            When are you looking to start?{" "}
            <span className="optional-label">(optional)</span>
          </label>
          <select id="timeline" name="timeline" defaultValue="">
            <option value="">Select a timeline</option>
            <option value="asap">As soon as possible</option>
            <option value="1-3-months">Within 1–3 months</option>
            <option value="3-6-months">Within 3–6 months</option>
            <option value="exploring">Just exploring</option>
          </select>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="details">
          Tell us a little about the project <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="details"
          name="details"
          rows={6}
          required
          minLength={20}
          maxLength={5000}
          placeholder="What are you hoping to change, and what would be useful for us to know?"
          aria-invalid={Boolean(fieldError("details"))}
          aria-describedby={
            fieldError("details") ? "details-error" : "details-hint"
          }
        />
        <span className="field-hint" id="details-hint">
          Please share at least a little context. Avoid including sensitive
          personal information.
        </span>
        {fieldError("details") && (
          <p className="field-error" id="details-error">
            {fieldError("details")}
          </p>
        )}
      </div>

      <div className="honeypot" aria-hidden="true">
        <label htmlFor="faxNumber">Leave this field empty</label>
        <input
          id="faxNumber"
          name="faxNumber"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="form-submit-row">
        <button
          className="button button-dark"
          type="submit"
          disabled={state.status === "submitting"}
        >
          {state.status === "submitting" ? (
            <>
              <LoaderCircle className="spin" aria-hidden="true" size={17} />
              Sending…
            </>
          ) : (
            <>
              Send inquiry <ArrowUpRight aria-hidden="true" size={16} />
            </>
          )}
        </button>
        <p>
          We use your details only to respond to this inquiry. See our{" "}
          <a href="/privacy">privacy notice</a>.
        </p>
      </div>
      {state.message && (
        <p
          className={`form-message form-message-${state.status}`}
          role={state.status === "error" ? "alert" : "status"}
          aria-live={state.status === "error" ? "assertive" : "polite"}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
