<div align="center">

# Security Policy

**How to report a security issue in this project — and what happens after you do.**

</div>

---

## Supported versions

This project is deployed as a single, continuously updated site. Only the current `main` branch is supported.

| Version                           | Supported |
| --------------------------------- | --------- |
| `main` (current)                  | Yes       |
| `0.1.x` line — latest commit only | Yes       |
| Any older commit, tag, or fork    | No        |

Security fixes are applied to `main` and shipped on the next deployment. Backports to older revisions are not provided.

---

## Reporting a vulnerability

**Do not report security issues in public.** Public issues, pull requests, discussions, or social posts can expose the studio and its visitors before a fix exists.

Report privately through the studio contact channel published with this project. Start the message with **`SECURITY`** so it is triaged ahead of commercial inquiries. This is the same endpoint described in [`README.md`](README.md#contact-and-inquiry-pipeline): it validates, rate-limits, and forwards your message, and it does not store submissions.

If your report requires sharing sensitive detail — a working payload, a captured request, or a proof of concept — say so in the first message without attaching it, and you will be given a private channel to send it through.

### What to include

```text
Subject:      SECURITY — <short description>
Impact:       What an attacker could do, and to whom
Component:    Route, API endpoint, file, or dependency involved
Environment:  URL or build revision, browser, OS
Steps:        Minimal, deterministic reproduction steps
Proof:        Request/response or screenshot, redacted of real data
Prerequisites: Authentication, network position, or user interaction required
Suggested fix: Optional, if you have one
Disclosure:   Whether you intend to publish, and on what timeline
```

A report that cannot be reproduced will be asked for clarification rather than closed.

---

## What to expect

| Stage               | What happens                                                                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Acknowledgement** | Aimed within **3 business days** of a report reaching the studio.                                                                       |
| **Triage**          | An initial assessment with a severity judgement and a request for anything missing, aimed within **7 business days**.                   |
| **Fix**             | Critical and high-severity issues are prioritised and deployed as soon as a verified fix is ready. Lower-severity issues are scheduled. |
| **Updates**         | You are told when a fix is deployed, or if the studio concludes the report is not a vulnerability — with the reasoning.                 |
| **Credit**          | Offered in the fix notes with your consent. Anonymous reports stay anonymous.                                                           |

These are targets, not a contractual service level. This project is maintained by a small independent studio rather than a dedicated security team.

**No bug bounty is offered.** The studio does not currently pay for vulnerability reports and will not do so retroactively. Reports are still genuinely welcome — they protect real visitors.

---

## Scope

### In scope

- **The inquiry endpoint** (`/api/contact`): bypassing payload validation, request-size limits, content-type enforcement, the honeypot, or the rate limiter; injecting content into the outgoing email; tricking the endpoint into reporting a success for a message that was not delivered.
- **Server-side injection**: reaching a runtime, filesystem, network, or provider boundary through request data.
- **Client-side injection**: executing script or markup through content, slugs, query parameters, or metadata/structured data.
- **Security headers** configured in the repository (`next.config.ts`) regressing or being bypassed.
- **Secrets exposure**: anything that causes a server-only value such as `RESEND_API_KEY` to reach the browser or build output.
- **Dependency vulnerabilities** that are reachable in this application's runtime.
- **Privacy**: any path that stores, logs, or leaks inquiry content or personal data.

### Out of scope

The following are known, documented, or non-actionable. Please read this list before reporting.

| Item                                                                                                           | Why it is not a vulnerability                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Missing **HSTS** or **Content-Security-Policy** in the repository                                              | Documented: both are added at the production edge after the deployment domain and asset policy are confirmed.                                                                           |
| The rate limiter being process-local                                                                           | Documented limitation: it is not a distributed control. Report only if you can bypass it in a way that also defeats the documented ingress requirement that `X-Real-IP` is overwritten. |
| Volume-based denial of service, traffic flooding, or load testing                                              | Capacity concerns, not vulnerabilities. Do not run them.                                                                                                                                |
| Social engineering, phishing, pretexting, or physical attacks                                                  | Out of scope for a code repository.                                                                                                                                                     |
| Self-XSS, or issues requiring a compromised browser, extension, or device                                      | Requires an already-compromised environment.                                                                                                                                            |
| Best-practice or configuration suggestions with no demonstrated impact                                         | Useful feedback, but not a security finding.                                                                                                                                            |
| Missing security features of a product that does not exist here (accounts, sessions, roles, payments, uploads) | No such surface exists in this application.                                                                                                                                             |
| Issues in third-party providers (hosting, email delivery, DNS, CDN)                                            | Report upstream to the provider. The studio will still act on anything that affects this deployment.                                                                                    |
| Automated scanner output pasted without verification                                                           | Triaged only if it comes with a reproducible impact statement.                                                                                                                          |

### Rules of engagement

While testing, you must:

- Test only against your own accounts, data, and messages — never a third party's.
- Avoid accessing, modifying, or exfiltrating data that is not yours. Stop and report if you encounter personal data.
- Avoid destructive testing, service degradation, spam, and automated scanning that generates load.
- Not use an issue to extort, threaten, or demand payment.

---

## Safe harbour

If you make a good-faith effort to comply with this policy, the studio will:

- Consider your research authorised, and will not pursue or support legal action against you for it.
- Work with you to understand and resolve the issue promptly.
- Not require you to keep the report confidential if you would rather disclose — but coordinated disclosure is requested so visitors are protected first.

This safe harbour does not apply to activity that violates the law, breaches third-party systems, exfiltrates data, degrades the service, or breaches the terms of this project's [license](LICENSE.md).

## Coordinated disclosure

The studio asks for **90 days** from the date a report is acknowledged before public disclosure, or sooner once a fix has been deployed. If a fix will take longer, the studio will explain why and agree a date with you. Credit is given with your consent, or you may remain anonymous.

---

## Security practices in this project

For reviewers, these controls already exist and are expected to remain intact:

- **Server-side validation only is trusted.** The inquiry payload is validated against a strict Zod schema that rejects unknown keys; client-side validation is treated as convenience, never as a control.
- **Transport limits.** `application/json` only, with a 16 KB ceiling enforced on both the declared length and the streamed body.
- **Abuse controls.** A honeypot field plus a per-client rate limit with a `Retry-After` response.
- **Input constrained to known values.** Website links are restricted to HTTP/HTTPS, and team-member values must match a real discipline before they can influence an email.
- **Honest failure modes.** Distinct 4xx/5xx responses for every failure, including “delivery not configured”. The endpoint never reports success for an undelivered message.
- **No data retention.** Inquiries are validated and forwarded, never persisted, and submission contents are not logged.
- **Secrets stay server-side.** Environment variables are validated at startup, and only intentional `NEXT_PUBLIC_` values reach the browser.
- **Header baseline.** `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive `Permissions-Policy` are set in `next.config.ts`.
- **No tracking surface.** No analytics, advertising, consent, or CRM scripts — therefore no third-party cookies, fingerprinting, or data-sharing paths.
- **Static-first architecture.** All editorial routes are prerendered with no runtime data fetching, which keeps the server-side attack surface to a single API route.
- **Loader discipline.** The WebGL bundle is fetched only after a capability check, so an untrusted third-party asset never runs by default.

---

## Hardening requirements for deployments

Whoever operates a deployment of this project is responsible for:

1. Terminating TLS and adding **HSTS** plus a **nonce- or hash-based CSP** at the edge.
2. Ensuring the ingress **overwrites** `X-Real-IP`; the rate limiter trusts it and nothing else.
3. Replacing the in-memory rate limiter with a shared store if the endpoint runs on more than one instance.
4. Keeping the Resend API key, sender address, and destination inbox in server-only environment variables.
5. Building with the real `NEXT_PUBLIC_SITE_URL`, so canonical URLs and metadata endpoints cannot be pointed at an attacker-controlled origin.

---

## Dependencies

Third-party packages are pinned through the committed lockfile. Update them deliberately, review the changelog for anything security-relevant, and re-run the full check suite before deploying.

<div align="center">

**Thank you for reporting responsibly — it directly protects real visitors.**

</div>
