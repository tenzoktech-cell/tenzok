import {
  Binary,
  BrainCircuit,
  Cloud,
  Cpu,
  Database,
  Eye,
  Layers,
  MessageSquareCode,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

/**
 * The Tenzok project catalog.
 *
 * It serves two readers at once:
 *  - a student choosing a mini project (a semester) or a major project (a capstone)
 *  - a company checking whether we have actually built in their domain
 *
 * Every project here is a brief we scope and build — not a claim that it has
 * already shipped for a named client. Keep it that way until there are real
 * case studies to point at.
 */

export type Tier = "mini" | "major";

export interface ProjectBrief {
  title: string;
  /** One line a student could put on a resume. */
  summary: string;
  tier: Tier;
  stack: string[];
  /** Realistic guided build time. */
  duration: string;
  /** What exists at the end. This is what makes it defensible in a viva. */
  deliverables: string[];
}

export interface ProjectDomain {
  slug: string;
  name: string;
  icon: LucideIcon;
  /** The one-line pitch used on cards. */
  tagline: string;
  /** Longer intro used on the domain page. */
  intro: string;
  /** What a company hires us for in this domain. */
  forCompanies: string;
  /** The tools we actually work in. */
  stack: string[];
  projects: ProjectBrief[];
}

export const DOMAINS: ProjectDomain[] = [
  {
    slug: "python-full-stack",
    name: "Python Full-Stack",
    icon: Layers,
    tagline: "Django and FastAPI backends with a real frontend on top.",
    intro:
      "The workhorse stack for most academic and startup builds: a Python backend with a proper data model, an API you can document, and a frontend that talks to it. You learn where the logic belongs and why — not just how to make the page render.",
    forCompanies:
      "Internal tools, admin portals, REST and GraphQL APIs, dashboards, and Python services that need to be maintainable after we leave.",
    stack: [
      "Python",
      "Django",
      "FastAPI",
      "PostgreSQL",
      "Celery",
      "Redis",
      "React",
      "Next.js",
      "Docker",
    ],
    projects: [
      {
        title: "Campus Complaint & Grievance Portal",
        summary:
          "A ticketing system with role-based access for students, staff, and admins, plus SLA timers and an escalation chain.",
        tier: "mini",
        stack: ["Django", "PostgreSQL", "Bootstrap"],
        duration: "3–4 weeks",
        deliverables: [
          "Role-based auth with three user types",
          "Ticket lifecycle with status history",
          "Admin dashboard with SLA breach alerts",
          "Deployed URL + ER diagram",
        ],
      },
      {
        title: "Inventory & Billing System for a Small Business",
        summary:
          "Stock, suppliers, invoices, and GST-style tax handling with printable bills and a low-stock reorder report.",
        tier: "mini",
        stack: ["FastAPI", "PostgreSQL", "React"],
        duration: "4 weeks",
        deliverables: [
          "Normalised schema with migrations",
          "Invoice PDF generation",
          "Reorder-point reporting",
          "Seed data + API docs (OpenAPI)",
        ],
      },
      {
        title: "Multi-Tenant SaaS Starter",
        summary:
          "A subscription product with tenant isolation, billing webhooks, background jobs, and an audit log — the architecture real SaaS runs on.",
        tier: "major",
        stack: ["FastAPI", "PostgreSQL", "Celery", "Redis", "Next.js", "Stripe"],
        duration: "10–12 weeks",
        deliverables: [
          "Tenant isolation at the query layer",
          "Payment webhooks with idempotency keys",
          "Background job queue with retries",
          "Audit log + admin impersonation",
          "CI/CD pipeline and load-test report",
        ],
      },
      {
        title: "Hospital Management System",
        summary:
          "Appointments, patient records, prescriptions, pharmacy stock, and billing — the classic major project, built like production software.",
        tier: "major",
        stack: ["Django", "PostgreSQL", "Celery", "React"],
        duration: "10 weeks",
        deliverables: [
          "Appointment scheduling with conflict detection",
          "Patient record access control and audit trail",
          "Automated appointment reminders",
          "Reporting module + deployed demo",
        ],
      },
    ],
  },
  {
    slug: "java-enterprise",
    name: "Java & Enterprise",
    icon: Binary,
    tagline: "Spring Boot services built the way enterprises actually run them.",
    intro:
      "Java is still what most large organisations run on, and it is what a huge share of campus placements test. We build Spring Boot services with layered architecture, real persistence, security, and tests — so the code survives a code review, not just a demo.",
    forCompanies:
      "Spring Boot microservices, REST APIs, legacy modernisation, JVM performance work, and integration with existing enterprise systems.",
    stack: [
      "Java 21",
      "Spring Boot",
      "Spring Security",
      "Hibernate / JPA",
      "MySQL",
      "PostgreSQL",
      "Maven",
      "JUnit",
      "Kafka",
    ],
    projects: [
      {
        title: "Library Management REST API",
        summary:
          "Catalogue, members, issue and return flows, and fine calculation — with JWT auth and a full test suite.",
        tier: "mini",
        stack: ["Spring Boot", "JPA", "MySQL", "JUnit"],
        duration: "3 weeks",
        deliverables: [
          "Layered architecture (controller / service / repository)",
          "JWT authentication and role guards",
          "Fine calculation with edge-case tests",
          "Swagger docs + Postman collection",
        ],
      },
      {
        title: "Online Examination Platform",
        summary:
          "Timed tests, question banks, auto-grading, and tamper-resistant submission handling.",
        tier: "mini",
        stack: ["Spring Boot", "PostgreSQL", "React"],
        duration: "4 weeks",
        deliverables: [
          "Server-authoritative timer (client clock never trusted)",
          "Randomised question selection",
          "Auto-grading + result analytics",
          "Deployed demo with seeded exams",
        ],
      },
      {
        title: "Microservices Banking Simulator",
        summary:
          "Accounts, transactions, and notifications as separate services communicating over Kafka, with distributed tracing and a saga for transfers.",
        tier: "major",
        stack: ["Spring Boot", "Kafka", "PostgreSQL", "Docker", "Spring Cloud"],
        duration: "12 weeks",
        deliverables: [
          "Three independently deployable services",
          "Saga pattern for cross-service transfers",
          "Idempotent consumers and a dead-letter queue",
          "Distributed tracing dashboard",
          "Architecture decision record (ADR) set",
        ],
      },
      {
        title: "Enterprise HRMS",
        summary:
          "Employee lifecycle, leave and payroll workflows, and approval chains with a rules engine — the kind of system real HR departments run.",
        tier: "major",
        stack: ["Spring Boot", "Spring Security", "MySQL", "React"],
        duration: "10–12 weeks",
        deliverables: [
          "Configurable multi-level approval workflow",
          "Payroll calculation with a rules engine",
          "Role and permission matrix",
          "Reporting exports + deployed demo",
        ],
      },
    ],
  },
  {
    slug: "ai-agents",
    name: "AI & LLM Applications",
    icon: BrainCircuit,
    tagline: "RAG, agents, and LLM features that survive contact with real users.",
    intro:
      "Calling an LLM API is the easy part. The engineering is everything around it: chunking and retrieval that actually finds the right passage, evaluation so you can prove it improved, guardrails, cost control, and a fallback for when the model is wrong. That is what we teach and what we build.",
    forCompanies:
      "RAG over your own documents, support copilots, document extraction pipelines, agentic workflows, and evaluation harnesses so you can measure quality instead of guessing.",
    stack: [
      "Python",
      "LangChain",
      "LlamaIndex",
      "OpenAI / Anthropic APIs",
      "pgvector",
      "FAISS",
      "FastAPI",
      "Next.js",
    ],
    projects: [
      {
        title: "RAG Chatbot Over Your Own Documents",
        summary:
          "Upload a corpus, ask questions, get answers with citations — and a retrieval evaluation report that proves it works.",
        tier: "mini",
        stack: ["Python", "LangChain", "pgvector", "FastAPI"],
        duration: "3–4 weeks",
        deliverables: [
          "Chunking + embedding pipeline",
          "Answers with source citations",
          "Retrieval eval set (precision@k)",
          "Hallucination guardrail + refusal path",
        ],
      },
      {
        title: "Resume Screener with Explainability",
        summary:
          "Rank candidates against a job description and, crucially, show why — with a bias audit on the output.",
        tier: "mini",
        stack: ["Python", "LLM API", "Streamlit"],
        duration: "3 weeks",
        deliverables: [
          "Structured extraction from PDF resumes",
          "Scoring with per-criterion justification",
          "Bias audit across a test set",
          "Human-in-the-loop review screen",
        ],
      },
      {
        title: "Multi-Agent Research Assistant",
        summary:
          "Planner, researcher, and critic agents that decompose a question, search, and adversarially verify each other before answering.",
        tier: "major",
        stack: ["Python", "LangGraph", "Vector DB", "FastAPI", "Next.js"],
        duration: "10–12 weeks",
        deliverables: [
          "Agent graph with tool calling",
          "Adversarial verification pass",
          "Token + cost budgeting per run",
          "Trace viewer for every agent step",
          "Evaluation harness with a scored benchmark",
        ],
      },
      {
        title: "Voice-Enabled Support Copilot",
        summary:
          "Speech in, grounded answer out, with escalation to a human when confidence drops below a threshold.",
        tier: "major",
        stack: ["Python", "Whisper", "LLM API", "WebSockets", "React"],
        duration: "10 weeks",
        deliverables: [
          "Streaming speech-to-text",
          "Grounded retrieval + confidence scoring",
          "Human escalation handoff",
          "Latency budget and p95 report",
        ],
      },
    ],
  },
  {
    slug: "machine-learning",
    name: "Machine Learning",
    icon: Cpu,
    tagline: "Models that are trained, evaluated honestly, and actually served.",
    intro:
      "A notebook with 98% accuracy is not a project — it is usually a leak. We teach the full loop: framing the problem, building an honest validation split, feature engineering, error analysis, and then serving the model behind an API where it can be monitored.",
    forCompanies:
      "Forecasting, churn and risk scoring, recommendation, anomaly detection, and taking an existing notebook to a served, monitored model.",
    stack: [
      "Python",
      "scikit-learn",
      "XGBoost",
      "pandas",
      "MLflow",
      "FastAPI",
      "Docker",
    ],
    projects: [
      {
        title: "Customer Churn Prediction",
        summary:
          "Predict who leaves and why, with feature importance a business person can read and a threshold tuned to the cost of a false negative.",
        tier: "mini",
        stack: ["scikit-learn", "XGBoost", "pandas"],
        duration: "3 weeks",
        deliverables: [
          "Leak-free train/validation/test split",
          "Baseline model before the fancy one",
          "SHAP feature-importance report",
          "Threshold tuned to business cost",
        ],
      },
      {
        title: "Credit Risk Scoring",
        summary:
          "A scorecard model with calibration curves and a fairness check across demographic slices.",
        tier: "mini",
        stack: ["scikit-learn", "pandas", "matplotlib"],
        duration: "3–4 weeks",
        deliverables: [
          "Calibrated probability outputs",
          "ROC / PR curves with confidence intervals",
          "Slice-based fairness evaluation",
          "Model card documenting limits",
        ],
      },
      {
        title: "End-to-End MLOps Pipeline",
        summary:
          "Train, track, register, deploy, and monitor a model — with drift detection that triggers a retrain.",
        tier: "major",
        stack: ["MLflow", "FastAPI", "Docker", "GitHub Actions", "Evidently"],
        duration: "10–12 weeks",
        deliverables: [
          "Experiment tracking + model registry",
          "Automated retraining pipeline",
          "Data-drift and prediction-drift monitors",
          "Rollback path to the previous model",
          "Load-tested inference API",
        ],
      },
      {
        title: "Recommendation Engine",
        summary:
          "Collaborative filtering plus content-based fallback, evaluated offline and then online with an A/B split.",
        tier: "major",
        stack: ["Python", "Implicit", "FastAPI", "Redis"],
        duration: "10 weeks",
        deliverables: [
          "Cold-start handling strategy",
          "Offline eval (NDCG, recall@k)",
          "A/B test design and readout",
          "Sub-100ms served recommendations",
        ],
      },
    ],
  },
  {
    slug: "deep-learning",
    name: "Deep Learning",
    icon: Eye,
    tagline: "CNNs, transformers, and the training discipline behind them.",
    intro:
      "Deep learning projects fail for boring reasons: a bad split, an untracked experiment, a metric that flatters the model. We build with proper experiment tracking, augmentation, and a held-out set nobody touches — so the number you report is the number a reviewer can reproduce.",
    forCompanies:
      "Computer vision for inspection and quality control, OCR and document understanding, audio models, and fine-tuning open-weight models on your own data.",
    stack: [
      "PyTorch",
      "TensorFlow",
      "Keras",
      "Hugging Face",
      "OpenCV",
      "ONNX",
      "CUDA",
    ],
    projects: [
      {
        title: "Medical Image Classifier",
        summary:
          "Classify scans with augmentation, class-imbalance handling, and Grad-CAM heatmaps that show what the model looked at.",
        tier: "mini",
        stack: ["PyTorch", "torchvision", "Grad-CAM"],
        duration: "4 weeks",
        deliverables: [
          "Patient-level split (never image-level — that leaks)",
          "Class-imbalance strategy with ablation",
          "Grad-CAM explainability overlays",
          "Confusion matrix + per-class recall",
        ],
      },
      {
        title: "Real-Time Object Detection",
        summary:
          "A YOLO-based detector running live on a webcam feed, quantised so it holds frame rate on ordinary hardware.",
        tier: "mini",
        stack: ["PyTorch", "YOLO", "OpenCV", "ONNX"],
        duration: "4 weeks",
        deliverables: [
          "Custom-labelled dataset",
          "mAP evaluation at multiple IoU thresholds",
          "Quantised export (ONNX) with an FPS benchmark",
          "Live demo rig",
        ],
      },
      {
        title: "Fine-Tuned Domain LLM",
        summary:
          "LoRA fine-tuning of an open-weight model on a specialist corpus, benchmarked against the base model and a RAG baseline.",
        tier: "major",
        stack: ["Hugging Face", "PEFT / LoRA", "PyTorch", "vLLM"],
        duration: "12 weeks",
        deliverables: [
          "Instruction dataset construction",
          "LoRA training with tracked runs",
          "Benchmark vs. base model AND vs. RAG",
          "Served inference endpoint",
          "Honest write-up of where it still fails",
        ],
      },
      {
        title: "Video Action Recognition",
        summary:
          "Temporal models over video for activity or anomaly detection, with an alerting path for the flagged frames.",
        tier: "major",
        stack: ["PyTorch", "3D CNN / Transformer", "OpenCV", "FastAPI"],
        duration: "10–12 weeks",
        deliverables: [
          "Temporal augmentation pipeline",
          "Frame-level and clip-level metrics",
          "Alerting with a tuned false-positive budget",
          "Deployed streaming inference demo",
        ],
      },
    ],
  },
  {
    slug: "data-engineering",
    name: "Data Engineering",
    icon: Database,
    tagline: "Pipelines and warehouses instead of a cron job and a prayer.",
    intro:
      "The unglamorous layer everything else stands on. We build pipelines with idempotent jobs, schema contracts, data-quality tests, and backfills that do not corrupt history — the things that separate a data engineer from someone who wrote a script.",
    forCompanies:
      "ETL and ELT pipelines, warehouse modelling, streaming ingestion, BI-ready marts, and rescuing pipelines that break every week.",
    stack: [
      "Python",
      "Apache Airflow",
      "dbt",
      "Kafka",
      "Spark",
      "Snowflake",
      "ClickHouse",
      "Postgres",
    ],
    projects: [
      {
        title: "Batch ETL Pipeline with Data Quality Gates",
        summary:
          "Ingest, transform, and load on a schedule — with tests that halt the pipeline instead of publishing bad data.",
        tier: "mini",
        stack: ["Airflow", "dbt", "Postgres"],
        duration: "3–4 weeks",
        deliverables: [
          "Idempotent, re-runnable DAG",
          "Data-quality tests as a blocking gate",
          "Backfill strategy that preserves history",
          "Lineage diagram",
        ],
      },
      {
        title: "Real-Time Analytics Dashboard",
        summary:
          "Stream events through Kafka into a columnar store and serve sub-second dashboards over live data.",
        tier: "mini",
        stack: ["Kafka", "ClickHouse", "React"],
        duration: "4 weeks",
        deliverables: [
          "Event schema with a compatibility contract",
          "Exactly-once-ish consumer semantics",
          "Sub-second aggregate queries",
          "Live dashboard demo",
        ],
      },
      {
        title: "Lakehouse Platform",
        summary:
          "A full medallion architecture — raw, cleaned, and business layers — with orchestration, cataloguing, and cost controls.",
        tier: "major",
        stack: ["Spark", "Delta Lake", "Airflow", "dbt", "S3"],
        duration: "12 weeks",
        deliverables: [
          "Bronze / silver / gold layering",
          "Schema evolution handling",
          "Partitioning and compaction strategy",
          "Cost-per-query analysis",
          "Data catalogue + ownership model",
        ],
      },
      {
        title: "Change-Data-Capture Sync",
        summary:
          "Mirror a production database into a warehouse in near real time without touching the source's performance.",
        tier: "major",
        stack: ["Debezium", "Kafka", "Snowflake", "Airflow"],
        duration: "10 weeks",
        deliverables: [
          "CDC connector with a snapshot + stream phase",
          "Out-of-order and late-arrival handling",
          "Replication-lag monitoring",
          "Failure-recovery runbook",
        ],
      },
    ],
  },
  {
    slug: "mobile",
    name: "Mobile Apps",
    icon: Smartphone,
    tagline: "Cross-platform apps that reach an actual store listing.",
    intro:
      "Most student apps die on an emulator. Ours go to a store — which forces the parts everyone skips: offline behaviour, permissions, push notifications, store assets, and a privacy policy that has to be true.",
    forCompanies:
      "Cross-platform product apps, internal field apps, store releases, and taking an existing app through review and launch.",
    stack: [
      "Flutter",
      "React Native",
      "Kotlin",
      "Swift",
      "Firebase",
      "Supabase",
    ],
    projects: [
      {
        title: "Expense Tracker with Offline Sync",
        summary:
          "Works with no signal, then reconciles cleanly when the network returns — the hard part of every mobile app.",
        tier: "mini",
        stack: ["Flutter", "SQLite", "Firebase"],
        duration: "3–4 weeks",
        deliverables: [
          "Offline-first local store",
          "Conflict resolution on reconnect",
          "Charts and monthly summaries",
          "Signed APK / TestFlight build",
        ],
      },
      {
        title: "Campus Companion App",
        summary:
          "Timetable, attendance, notices, and push notifications, built around a real permissions model.",
        tier: "mini",
        stack: ["React Native", "Supabase", "Expo"],
        duration: "4 weeks",
        deliverables: [
          "Push notification pipeline",
          "Role-based content (student / faculty)",
          "Deep links into notices",
          "Store-ready screenshots and listing copy",
        ],
      },
      {
        title: "On-Demand Services Marketplace",
        summary:
          "Two-sided app with live tracking, in-app payments, ratings, and a provider dispatch algorithm.",
        tier: "major",
        stack: ["Flutter", "Node.js", "PostgreSQL", "Maps SDK", "Payments"],
        duration: "12 weeks",
        deliverables: [
          "Two apps (customer + provider) from one codebase",
          "Live location tracking with battery budget",
          "Payment flow with refunds",
          "Dispatch/matching algorithm",
          "Full store submission",
        ],
      },
      {
        title: "Health & Fitness Tracker with On-Device ML",
        summary:
          "Sensor fusion plus a quantised on-device model, so activity recognition works without shipping data to a server.",
        tier: "major",
        stack: ["Flutter", "TensorFlow Lite", "HealthKit / Google Fit"],
        duration: "10 weeks",
        deliverables: [
          "On-device inference (no data leaves the phone)",
          "Sensor fusion pipeline",
          "Battery-impact measurement",
          "Privacy policy that matches the code",
        ],
      },
    ],
  },
  {
    slug: "cloud-devops",
    name: "Cloud & DevOps",
    icon: Cloud,
    tagline: "Infrastructure as code, pipelines, and things that page you before users do.",
    intro:
      "The layer that decides whether a product survives its first real traffic. We build with infrastructure as code, real CI/CD, observability, and a deliberate answer to the question every interviewer asks: what happens when this falls over at 2am?",
    forCompanies:
      "Cloud migration, Kubernetes, CI/CD, cost optimisation, observability, and incident-response readiness.",
    stack: [
      "AWS",
      "Docker",
      "Kubernetes",
      "Terraform",
      "GitHub Actions",
      "Prometheus",
      "Grafana",
    ],
    projects: [
      {
        title: "CI/CD Pipeline with Zero-Downtime Deploys",
        summary:
          "Build, test, scan, and deploy on every merge — with a rollback that actually works under pressure.",
        tier: "mini",
        stack: ["GitHub Actions", "Docker", "AWS"],
        duration: "3 weeks",
        deliverables: [
          "Blue-green or rolling deploy",
          "Automated rollback on health-check failure",
          "Container vulnerability scanning",
          "Deployment runbook",
        ],
      },
      {
        title: "Kubernetes Microservices Deployment",
        summary:
          "Deploy a multi-service app to Kubernetes with autoscaling, secrets management, and a service mesh.",
        tier: "mini",
        stack: ["Kubernetes", "Helm", "Docker"],
        duration: "4 weeks",
        deliverables: [
          "Helm charts per service",
          "Horizontal pod autoscaling under load",
          "Secrets handled outside the repo",
          "Load-test report",
        ],
      },
      {
        title: "Full Observability Platform",
        summary:
          "Metrics, logs, and traces unified, with alerts tuned so they mean something and an on-call runbook behind each one.",
        tier: "major",
        stack: ["Prometheus", "Grafana", "OpenTelemetry", "Loki"],
        duration: "10 weeks",
        deliverables: [
          "Distributed tracing across services",
          "SLOs with error budgets",
          "Alerts tuned against a false-positive budget",
          "Runbook per alert",
          "A game-day incident simulation",
        ],
      },
      {
        title: "Multi-Environment Infrastructure as Code",
        summary:
          "Dev, staging, and prod from one Terraform codebase, with drift detection and a cost report per environment.",
        tier: "major",
        stack: ["Terraform", "AWS", "GitHub Actions"],
        duration: "10–12 weeks",
        deliverables: [
          "Reusable Terraform modules",
          "Remote state with locking",
          "Drift detection in CI",
          "Per-environment cost breakdown",
        ],
      },
    ],
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    icon: ShieldCheck,
    tagline: "Defensive security, done in a lab you are allowed to break.",
    intro:
      "Security projects are the easiest to do badly and the most impressive when done right. Everything here runs in an isolated lab against targets we own — detection engineering, secure design, and hardening, never anything pointed at a system you do not have permission to test.",
    forCompanies:
      "Secure code review, threat modelling, authentication and authorisation design, dependency and supply-chain audits, and security hardening before an audit.",
    stack: [
      "Python",
      "Wireshark",
      "OWASP ZAP",
      "Suricata",
      "Docker",
      "ELK Stack",
    ],
    projects: [
      {
        title: "Network Intrusion Detection with ML",
        summary:
          "Train a detector on labelled traffic and tune it against the metric that matters: alerts a human can actually triage.",
        tier: "mini",
        stack: ["Python", "scikit-learn", "Suricata"],
        duration: "4 weeks",
        deliverables: [
          "Feature extraction from packet captures",
          "False-positive budget analysis",
          "Comparison against a rules-only baseline",
          "Isolated lab environment (no live networks)",
        ],
      },
      {
        title: "Secure Authentication Service",
        summary:
          "Password hashing, MFA, session handling, rate limiting, and account recovery done to current standards.",
        tier: "mini",
        stack: ["FastAPI", "Argon2", "TOTP", "Redis"],
        duration: "3–4 weeks",
        deliverables: [
          "Argon2id hashing with tuned parameters",
          "TOTP multi-factor enrolment",
          "Rate limiting and lockout policy",
          "Threat model document",
        ],
      },
      {
        title: "SIEM & Detection Engineering Lab",
        summary:
          "Ingest logs, write detection rules, and prove them against simulated attacks in a lab you control end to end.",
        tier: "major",
        stack: ["ELK Stack", "Sigma rules", "Docker", "Atomic Red Team"],
        duration: "10–12 weeks",
        deliverables: [
          "Log ingestion from multiple sources",
          "Detection rules mapped to MITRE ATT&CK",
          "Simulated attacks in an isolated lab",
          "Detection coverage report with gaps named",
        ],
      },
      {
        title: "Application Security Audit Pipeline",
        summary:
          "Automated SAST, dependency scanning, and secret detection wired into CI, with triage that suppresses the noise.",
        tier: "major",
        stack: ["GitHub Actions", "Semgrep", "Trivy", "OWASP ZAP"],
        duration: "10 weeks",
        deliverables: [
          "SAST + dependency + secret scanning in CI",
          "Triage workflow for false positives",
          "Remediation report against OWASP Top 10",
          "Security policy documentation",
        ],
      },
    ],
  },
  {
    slug: "iot-embedded",
    name: "IoT & Embedded",
    icon: MessageSquareCode,
    tagline: "Hardware that talks to the cloud and keeps working when it cannot.",
    intro:
      "Physical projects are the ones that make a demo memorable — and they punish sloppiness, because the network really does drop and the sensor really does drift. We build with buffering, calibration, and a device that degrades gracefully rather than dying.",
    forCompanies:
      "Telemetry pipelines, device fleet management, industrial monitoring, and edge inference where the cloud round-trip is too slow.",
    stack: [
      "ESP32",
      "Raspberry Pi",
      "Arduino",
      "MQTT",
      "InfluxDB",
      "Grafana",
      "C++",
    ],
    projects: [
      {
        title: "Smart Environment Monitor",
        summary:
          "Sensors to dashboard over MQTT, with local buffering so a network drop does not lose readings.",
        tier: "mini",
        stack: ["ESP32", "MQTT", "InfluxDB", "Grafana"],
        duration: "3–4 weeks",
        deliverables: [
          "Sensor calibration procedure",
          "Local buffer + replay on reconnect",
          "Time-series dashboard",
          "Working hardware demo rig",
        ],
      },
      {
        title: "Smart Attendance with Face Recognition",
        summary:
          "Edge inference on a Raspberry Pi with a liveness check, so a photo on a phone does not fool it.",
        tier: "mini",
        stack: ["Raspberry Pi", "OpenCV", "TensorFlow Lite"],
        duration: "4 weeks",
        deliverables: [
          "On-device inference (no cloud round-trip)",
          "Anti-spoofing / liveness check",
          "Offline queue for attendance records",
          "Accuracy report under varied lighting",
        ],
      },
      {
        title: "Predictive Maintenance System",
        summary:
          "Vibration and thermal sensing on a machine, with an ML model that flags failure before it happens.",
        tier: "major",
        stack: ["ESP32", "Python", "scikit-learn", "MQTT", "Grafana"],
        duration: "10–12 weeks",
        deliverables: [
          "Multi-sensor fusion pipeline",
          "Anomaly model with a lead-time analysis",
          "Alerting with an escalation path",
          "Hardware rig + failure simulation",
        ],
      },
      {
        title: "Autonomous Delivery Rover",
        summary:
          "Navigation, obstacle avoidance, and remote telemetry — a robotics capstone with a live demo that holds up.",
        tier: "major",
        stack: ["ROS 2", "Raspberry Pi", "LiDAR", "Python"],
        duration: "12 weeks",
        deliverables: [
          "SLAM mapping and path planning",
          "Obstacle avoidance with a safety stop",
          "Remote telemetry and teleop fallback",
          "Field-test video + failure analysis",
        ],
      },
    ],
  },
];

export function getDomain(slug: string): ProjectDomain | undefined {
  return DOMAINS.find((domain) => domain.slug === slug);
}

export const TOTAL_PROJECTS = DOMAINS.reduce(
  (sum, domain) => sum + domain.projects.length,
  0,
);

export const TIER_LABEL: Record<Tier, string> = {
  mini: "Mini project",
  major: "Major project",
};
