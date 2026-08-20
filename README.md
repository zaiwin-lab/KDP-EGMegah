# KODC — Koperasi One-Stop Development Centre

> **Maturity:** Interactive front-end concept · home-development journey and financing exploration

KODC is a static product concept for organising a cooperative member’s path from land and project registration through house-package exploration, contractor comparison, budget planning and consultation.

**Live demonstration:** [kodc-platform.netlify.app](https://kodc-platform.netlify.app/)

## Business problem

A home-development journey can be fragmented across land information, design choices, contractor discovery, financing estimates and follow-up appointments. KODC explores how these steps could be presented as one guided experience with a consistent decision path.

## Intended users

- Cooperative members exploring a build-on-own-land journey
- Housing or property-development advisers
- Cooperative programme and operations teams
- Portfolio reviewers assessing service design and front-end product thinking

## Demonstrated capabilities

- Guided register → build → finance experience
- Responsive house-package and contractor-comparison interfaces
- Loan-eligibility, monthly-instalment and construction-budget calculators
- Consultation-booking and project-registration interaction demonstrations
- Four-language interface switching: English, Bahasa Melayu, Chinese and Tamil
- Scripted “Koperasi Assistant” chat experience
- Visual administrative dashboard for presenting a possible operating view

## Strategic value

The prototype converts a complex multi-party journey into an understandable sequence. It can support stakeholder workshops, requirements discovery and usability testing before investment in identity, workflow, document, partner and financing integrations.

## What is actually implemented

The repository contains a single HTML application with embedded CSS and JavaScript. Calculators run locally in the browser using fixed assumptions. Registration, appointment, chat and dashboard interactions are simulations: they do not connect to a database, send applications, verify members, upload documents, authenticate administrators or contact financial institutions.

The on-page assistant cycles through scripted responses; it is not a connected AI advisory system.

## Technology

- HTML5
- Embedded CSS with responsive layouts
- Vanilla JavaScript for navigation, calculators, localisation, modals and simulations
- Static Netlify delivery
- No build system, backend, persistence, authentication or external API

## Delivery role

**Ts. Zaiwin Kassim** provided product framing, rapid-prototype direction, delivery coordination and responsible-use documentation with the **KOBIS AI Prodigy Team**. This portfolio record describes the demonstrable interface and does not claim a production deployment, participating members or institutional adoption.

## Responsible-use boundaries

- Financing results are illustrative estimates, not eligibility decisions, quotations, approvals or financial advice.
- Interest rates, schemes, packages, contractors, prices and service timelines shown in the interface must be treated as sample content until independently verified and formally approved.
- Names or descriptions resembling banks, government schemes, cooperatives or partners do not establish affiliation, endorsement or availability.
- The registration and appointment confirmations are visual simulations; no request is transmitted or stored.
- The visual admin area is not access-controlled and must not be used as a real administrative system.
- Users must not submit identity, land-title, financial or other sensitive information through this prototype.
- Production use would require legal review, consent handling, security controls, verified provider data, audit logging and human decision oversight.

## Current limitations

- No secure registration, document upload, workflow, messaging or appointment service
- No verified contractor or financing-partner directory
- No live rates, credit checks or underwriting rules
- Calculator assumptions are simplified and should be validated by qualified professionals
- Dashboard totals and operational records are presentation data
- No automated tests or production monitoring are evidenced in this repository

## Run locally

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Portfolio evidence

KODC demonstrates journey mapping, multilingual interface delivery, calculator prototyping, service-orchestration thinking and the ability to turn a complex property process into a reviewable product concept.
