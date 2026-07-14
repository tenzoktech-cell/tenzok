import {
  BatteryCharging,
  Binary,
  Bot,
  Braces,
  BrainCircuit,
  Bug,
  ChartNoAxesCombined,
  CircuitBoard,
  Cloud,
  Cpu,
  Database,
  Eye,
  Layers,
  MessageSquareCode,
  Network,
  RadioTower,
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
      "Churn and risk scoring, recommendation, anomaly detection, and taking an existing notebook to a served, monitored model — the model itself; the decision it feeds and the experiment that judges it sit with Data Analytics & BI.",
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
          "Staged rollout behind a flag, with the offline-to-online metric gap measured",
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
      "ETL and ELT pipelines, streaming ingestion, orchestration and freshness guarantees, physical warehouse loading, and rescuing pipelines that break every week — this is the layer that gets the data there on time and uncorrupted; what the numbers mean once it lands belongs to Data Analytics & BI.",
    stack: [
      "Python",
      "Apache Airflow",
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
        stack: ["Airflow", "SQL", "Postgres"],
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
        stack: ["Spark", "Delta Lake", "Airflow", "S3"],
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
        title: "Device Fleet Telemetry with OTA Updates",
        summary:
          "A fleet of nodes reporting into one pipeline, with signed over-the-air updates and a rollback that survives a device losing power mid-flash.",
        tier: "major",
        stack: ["ESP32", "MQTT over TLS", "Python", "TimescaleDB", "Grafana"],
        duration: "10–12 weeks",
        deliverables: [
          "Provisioning flow with per-device credentials",
          "Signed OTA update with A/B partitions and rollback",
          "Store-and-forward buffering across a simulated outage",
          "Fleet dashboard with per-device health and drift alerts",
        ],
      },
    ],
  },
  {
    slug: "js-full-stack",
    name: "JavaScript Full-Stack",
    icon: Braces,
    tagline: "TypeScript from the database to the browser, with a real server behind it.",
    intro:
      "JavaScript is the one stack where the same language runs on both sides, which is exactly why so many projects here end up as a polished React frontend bolted to a server with no validation, no session design worth the name, and no answer for what happens when two requests arrive at once. We spend the time on the server: types that actually hold at the boundary, an auth model you can explain out loud, background work moved off the request path, and tests. The React part is not the hard part.",
    forCompanies:
      "Product MVPs, Next.js web apps, Node and Express APIs, realtime features, Stripe or Razorpay payment integration, and taking a JavaScript prototype and making it something a team can still maintain a year later.",
    stack: [
      "TypeScript",
      "Node.js / Express",
      "Next.js / React",
      "PostgreSQL / Prisma",
      "MongoDB / Mongoose",
      "Zod / Auth.js",
      "Redis / BullMQ",
      "Socket.IO / Yjs",
      "S3 / Playwright",
    ],
    projects: [
      {
        title: "Applicant Tracking System for a Recruiting Agency",
        summary:
          "An internal hiring tool with candidate, recruiter, and admin roles, where resumes upload straight to object storage — which means the file has to be verified after it lands, because the server never sees the bytes on the way in.",
        tier: "mini",
        stack: ["TypeScript", "Express", "MongoDB", "Zod", "React", "S3"],
        duration: "3–4 weeks",
        deliverables: [
          "Role-based access for candidate / recruiter / admin, with the permission matrix written down and enforced in one middleware rather than scattered across routes",
          "JWT access + refresh tokens with rotation and reuse detection, documented in a short session-design note: where each token lives, what expires when, and what a stolen one gets you",
          "Direct-to-S3 resume uploads: a presigned-upload policy pinning content-type and max size, plus a post-upload verification worker (triggered by the S3 event) that sniffs magic bytes and quarantines any object whose real type does not match the type the client declared",
          "Zod schemas at every request boundary with the TypeScript types inferred from them instead of declared a second time by hand, plus a deployed URL with seeded accounts for each role",
        ],
      },
      {
        title: "Multi-Warehouse Stock & Order System",
        summary:
          "Stock across several warehouses kept as an append-only movement ledger with a materialized balance in front of it, so two orders racing for the last unit cannot both succeed.",
        tier: "mini",
        stack: ["TypeScript", "Express", "MongoDB", "Mongoose", "React", "TanStack Query"],
        duration: "4 weeks",
        deliverables: [
          "Stock modelled as an append-only movement ledger plus a materialized balance document per (SKU, warehouse). The ledger is the source of truth; the balance is a reconstructible cache that exists precisely so there is something to lock",
          "Reservation written as a single MongoDB multi-document transaction: a guarded findOneAndUpdate on the balance (onHand $gte qty) and the ledger append commit together or not at all — proven by a concurrent-order test that the naive read-then-save version fails. Note that this needs a replica set; a standalone mongod cannot run transactions",
          "Cursor-based pagination and text search over orders, so page 40 costs what page 2 costs",
          "Optimistic UI on stock adjustments with rollback when the server rejects the write (TanStack Query)",
          "Deployed URL with seed data, plus a rebuild script that replays the ledger to reconstruct every balance and a report flagging any balance that disagrees with its replay",
        ],
      },
      {
        title: "Multi-Workspace Platform with an Enforced Tenant Boundary",
        summary:
          "An org-and-workspace platform where the tenant filter is enforced by the data layer rather than by remembering it — and the hard part is keeping it enforced inside a background job, where there is no request, no session, and no context to read it from.",
        tier: "major",
        stack: ["TypeScript", "Next.js (App Router)", "Prisma", "PostgreSQL", "Auth.js", "BullMQ / Redis"],
        duration: "10–12 weeks",
        deliverables: [
          "Tenant isolation enforced by a Prisma client extension, with a test proving that a query missing its org filter is rejected rather than quietly returning another org's rows",
          "The same guard proven at all three entry points — Server Action, route handler, and BullMQ worker — with the worker case made explicit: no request and no session, so tenant context travels in the job payload and is re-validated on the way in rather than trusted",
          "End-to-end type safety across the network boundary: one schema definition, types inferred on both sides, and a deliberately breaking change that fails typecheck in CI instead of at runtime in someone's browser",
          "Per-tenant background work on BullMQ: retries with exponential backoff, and exhausted jobs routed to a separate dead-letter queue with a documented replay path — BullMQ ships a failed state, not a DLQ primitive, so that routing is code you write",
          "Invite, role, and workspace-switching flows on Auth.js sessions (owner / admin / member), plus a Prisma migration history that runs clean from an empty database",
        ],
      },
      {
        title: "Realtime Collaborative Editor",
        summary:
          "Many people editing one document live, with presence, offline reconnect, and conflict resolution that does not silently drop whoever loses a concurrent edit.",
        tier: "major",
        stack: ["TypeScript", "Next.js", "Socket.IO", "Yjs", "Redis", "Artillery"],
        duration: "12 weeks",
        deliverables: [
          "CRDT-backed document state (Yjs) benchmarked against a last-write-wins baseline, including the exact edit sequence that makes the baseline lose data",
          "Presence with live cursors and a member list that expires correctly — distinguishing a closed tab from a dropped network",
          "Reconnect and resync: a client offline for five minutes rejoins without losing its local edits",
          "Horizontal scaling across Node instances through a Redis pub/sub adapter, so two users connected to different servers still see each other",
          "Artillery load test reporting concurrent connections and message throughput at a stated p95 latency. Artillery is specified deliberately: it has a first-class socket.io engine, whereas k6 speaks raw WebSocket and would mean hand-rolling engine.io framing",
        ],
      },
      {
        title: "Commerce Storefront with Server-Verified Payments",
        summary:
          "A Next.js storefront where an order is paid only when the gateway's webhook says so — not when the browser redirects back claiming it is.",
        tier: "major",
        stack: ["TypeScript", "Next.js (App Router)", "PostgreSQL", "Prisma", "Razorpay / Stripe", "Playwright"],
        duration: "10 weeks",
        deliverables: [
          "Order state machine that permits legal transitions only — an order cannot reach shipped without a verified payment event",
          "Signature-verified payment webhooks processed idempotently, so a gateway retry of the same event changes nothing the second time",
          "Server Actions and route handlers for every mutation; the client never sends a price, it sends a cart and the server prices it",
          "Playwright end-to-end tests covering the paid, failed, and abandoned-checkout paths against the gateway's test mode",
          "Deployed URL with an admin order view and a reconciliation report for orders stuck in pending",
        ],
      },
    ],
  },
  {
    slug: "vlsi-chip-design",
    name: "VLSI & Chip Design",
    icon: CircuitBoard,
    tagline: "Synthesisable RTL, coverage-driven verification, and real timing, area and power numbers.",
    intro:
      "Hardware is not software with a different syntax: the compiler is a synthesis tool, the debugger is a waveform, and the only report that counts is timing, area and power. Student VLSI projects fail the same three ways — RTL that simulates but never synthesises, a testbench that only feeds the cases the designer already thought of, and a claim of correctness with no coverage number behind it — so we build in the opposite order: a self-checking testbench and a coverage goal first, then RTL that closes timing on a board or inside a real PDK. Two of these briefs need an FPGA board (a Basys 3 for the UART, a Nexys A7 for the RISC-V core); the multiplier, the FIFO verification environment and the Sky130 ASIC flow need nothing but a laptop, and every tool here is free — open source, or Vivado's free edition.",
    forCompanies:
      "RTL design and verification support: cocotb and UVM-style testbenches taken to coverage closure, FPGA prototyping, and blocks pushed through synthesis to timing, area and power sign-off on an open PDK.",
    stack: [
      "SystemVerilog",
      "Verilog",
      "cocotb / cocotb-coverage",
      "PyUVM",
      "Verilator",
      "Icarus Verilog",
      "Yosys / SymbiYosys",
      "AMD Vivado",
      "LibreLane + Sky130",
    ],
    projects: [
      {
        title: "UART Controller with a Self-Checking Testbench",
        summary:
          "A synthesisable UART with 16x oversampling and a cocotb bench that checks itself against a golden model — covering the framing, parity and ±2% baud-drift cases a loopback demo quietly hides. The same bench is then re-run on the Yosys netlist, where inferred latches and X-propagation surface.",
        tier: "mini",
        stack: ["Verilog", "cocotb", "Icarus Verilog", "Yosys", "AMD Vivado", "Basys 3 (Artix-7)"],
        duration: "3–4 weeks",
        deliverables: [
          "16x oversampling receiver with start-bit majority voting",
          "Two-flop synchroniser on the asynchronous RX line",
          "Self-checking cocotb testbench with randomised stimulus and scoreboard",
          "Gate-level re-run of the same bench on the Yosys netlist",
          "115200-baud loopback demo on a Basys 3 board",
        ],
      },
      {
        title: "Pipelined Booth–Wallace Multiplier and MAC Unit",
        summary:
          "A radix-4 Booth-encoded, Wallace-tree 16x16 multiplier pipelined until it meets a target clock, then benchmarked against the one line of Verilog that would have let Vivado infer a DSP48 slice for free. The comparison is the lesson.",
        tier: "mini",
        stack: ["Verilog", "Verilator", "Yosys", "AMD Vivado", "Surfer"],
        duration: "3–4 weeks",
        deliverables: [
          "Combinational baseline plus 2-stage and 4-stage pipelined variants",
          "Randomised equivalence test against a Python golden model",
          "Signed corner cases including −32768 × −32768",
          "fmax / LUT / FF / DSP table across all four builds",
          "Post-implementation critical path named in the timing report",
        ],
      },
      {
        title: "AES-128 Core Through the Open Sky130 ASIC Flow",
        summary:
          "A small iterative AES-128 core taken from RTL to a DRC-clean and LVS-clean GDS-II on the Sky130 PDK with LibreLane — no tapeout at the end, just the layout and the reports. The RTL is deliberately small so the weeks go into the flow: floorplan, utilisation, timing closure, and a power number honest about the switching activity behind it.",
        tier: "mini",
        stack: ["Verilog", "cocotb", "LibreLane (formerly OpenLane 2)", "Sky130 PDK", "OpenSTA", "Magic + Netgen"],
        duration: "4 weeks",
        deliverables: [
          "Iterative AES-128 datapath passing the FIPS-197 vectors pre-synthesis",
          "DRC-clean, LVS-clean GDS-II from a LibreLane run on Sky130",
          "Post-route setup and hold slack from OpenSTA at a stated clock",
          "Cell area and utilisation figures from the routed DEF",
          "VCD-annotated power report with its switching-activity assumptions stated",
        ],
      },
      {
        title: "RV32I_Zicsr 5-Stage Pipelined RISC-V Core on FPGA",
        summary:
          "A 5-stage RISC-V core with full forwarding, load-use stalling and branch flushing, running a GCC-compiled C program on a Nexys A7. The datapath is the easy half: the hazard logic, and the machine-mode CSRs and trap path that riscv-tests silently depends on, are the project.",
        tier: "major",
        stack: ["SystemVerilog", "Verilator", "riscv-gnu-toolchain", "Spike", "AMD Vivado", "Nexys A7"],
        duration: "10–12 weeks",
        deliverables: [
          "Five-stage pipeline with forwarding, load-use interlock and branch flush",
          "Zicsr CSR file, mtvec trap vector and ecall handling",
          "RV32I riscv-tests p-suite passing under Verilator, with a per-test list",
          "Lock-step commit trace diffed against Spike at --isa=rv32i_zicsr",
          "Nexys A7 build with memory-mapped UART, reported fmax and WNS, Dhrystone CPI",
        ],
      },
      {
        title: "Coverage-Driven Verification Environment for an Asynchronous FIFO",
        summary:
          "A PyUVM constrained-random environment for a dual-clock FIFO, taken to a stated functional coverage target and then attacked with injected bugs to prove it catches defects instead of just running green. Verilator is 2-state and zero-delay, so it cannot see metastability: the CDC evidence is a formal proof of the Gray-code pointer protocol, not the simulation, and the brief says so.",
        tier: "major",
        stack: ["SystemVerilog", "cocotb", "PyUVM", "cocotb-coverage", "Verilator", "SymbiYosys"],
        duration: "10–12 weeks",
        deliverables: [
          "Layered PyUVM environment: sequencer, driver, monitor, scoreboard",
          "Constrained-random clock-ratio stress at near-full and near-empty backpressure",
          "cocotb-coverage functional coverage model with a written closure argument",
          "SymbiYosys proof of the Gray-code pointer and full/empty invariants",
          "Mutation campaign: 10 injected RTL bugs with a caught / missed table",
        ],
      },
    ],
  },
  {
    slug: "power-electronics-ev",
    name: "Power Electronics, EV & Energy Systems",
    icon: BatteryCharging,
    tagline: "Converters, motor drives, and battery systems — proved in simulation before anything touches a bench.",
    intro:
      "This is the EEE domain, and it is simulation-first: the model comes before the breadboard and has to survive scrutiny on its own. Most projects here fail the same way — ideal switches, no dead time, no losses, no sensor noise — producing an efficiency or THD figure no hardware could reproduce. Everything is scoped to base MATLAB/Simulink plus at most one paid add-on (Simscape Electrical), with a Python path where the maths allows, because Powertrain Blockset, Motor Control Blockset and Embedded Coder are separately licensed and your college may not have them — we settle which licences you actually have in week 1, not week 8. Anything that reaches a bench does so at low voltage first, on isolated current-limited supplies, with differential probes on floating nodes: grounding a scope across a switching node is how students destroy equipment and get hurt.",
    forCompanies:
      "Converter and inverter design, motor-control firmware, battery management and state-of-charge estimation, drive-cycle and range modelling, and grid-tie compliance and power-quality work.",
    stack: [
      "MATLAB / Simulink",
      "Simscape Electrical",
      "Python (NumPy / SciPy)",
      "TI C2000 LaunchPad",
      "Code Composer Studio",
      "Arduino",
      "CAN bus / DBC tooling",
    ],
    projects: [
      {
        title: "MPPT Solar Charge Controller",
        summary:
          "A boost-converter charge controller that tracks the panel's maximum power point, comparing P&O against Incremental Conductance under a simulated irradiance ramp — the case where P&O confidently walks the wrong way.",
        tier: "mini",
        stack: ["MATLAB / Simulink", "Simscape Electrical", "Arduino", "INA226 current sensor"],
        duration: "3–4 weeks",
        deliverables: [
          "Simulink model of the PV array, boost stage (switch losses, dead time, inductor DCR — not ideal switches), and the MPPT loop",
          "P&O vs. Incremental Conductance under an irradiance step and a fast ramp, in simulation only: you cannot command an irradiance ramp on a real panel without a PV array simulator, and this brief does not pretend otherwise",
          "Tracking-efficiency table: steady-state oscillation amplitude around the MPP and time to re-track after each disturbance",
          "Conditional bench stage, only if the lab has an isolated current-limited supply and a differential probe: a low-voltage boost prototype, one measured panel I–V curve at the day's irradiance, and a switching-node trace. Without that kit the project stays simulation-only, and the report says so on page one",
        ],
      },
      {
        title: "Li-ion State-of-Charge Estimator (Coulomb Counting vs. EKF)",
        summary:
          "Estimate SoC over CALCE drive-cycle data with a deliberately corrupted current signal — the only condition under which Coulomb counting's drift, and an EKF's correction of it, are visible at all.",
        tier: "mini",
        stack: ["MATLAB / Simulink", "Python (NumPy / SciPy)", "CALCE battery datasets", "MCP2515 CAN transceiver", "SavvyCAN"],
        duration: "3–4 weeks",
        deliverables: [
          "Equivalent-circuit cell model (1RC or 2RC) fitted from pulse-discharge data, with an OCV–SoC curve extracted from a low-rate sweep rather than lifted from a paper",
          "Reference SoC defined explicitly and defended: a lab-grade Coulomb count over the clean calibrated current channel, anchored at full charge and full discharge. These datasets ship no ground-truth SoC channel, and the brief states that instead of inventing one",
          "Coulomb counting and an EKF run over the same US06/FUDS/DST cycles with a deliberately corrupted current and voltage input (bias, gain error, noise) — the comparison is meaningless on clean current, where Coulomb counting matches the reference by construction",
          "Pack state (SoC, current, voltage, fault flags) published on CAN and decoded against a hand-written DBC — a trace a BMS engineer recognises",
        ],
      },
      {
        title: "EV Powertrain Simulation on a Standard Drive Cycle",
        summary:
          "Battery pack, bidirectional DC–DC, FOC inverter, and motor simulated end to end over WLTP and the Indian Driving Cycle, producing range numbers whose energy balance you can actually defend.",
        tier: "major",
        stack: ["MATLAB / Simulink", "Simscape Electrical", "Python (NumPy / SciPy)"],
        duration: "10–12 weeks",
        deliverables: [
          "End-to-end model built in base Simulink + Simscape Electrical, with no Powertrain Blockset dependency — every block is one you built and can defend: pack with internal resistance and thermal rise, bidirectional DC–DC, three-phase inverter, FOC-controlled PMSM, and vehicle longitudinal dynamics with aero and rolling resistance",
          "Regenerative braking capped by battery charge acceptance at high SoC and low temperature — the limit a naive model omits, which is exactly why it over-reports range",
          "Range and Wh/km reported side by side for WLTP Class 3 and the Modified Indian Driving Cycle",
          "Energy balance closing to within 5% of the energy actually drawn from the pack, with the residual quantified and named (gate-drive loss, 12 V auxiliaries, gearbox and bearing losses) rather than buried in a fudge factor. A model that closes to zero is a model that is lying",
          "Sensitivity study: range vs. ambient temperature, payload, and pack ageing (SoH)",
        ],
      },
      {
        title: "FOC Drive for a PMSM, Encoder First and Sensorless Second",
        summary:
          "Field-oriented control of a PMSM on a C2000, built encoder-first so the current loops are proven before a position observer is swapped in behind them — because at zero speed a back-EMF observer has nothing to observe.",
        tier: "major",
        stack: ["MATLAB / Simulink", "TI C2000 LaunchPad", "Code Composer Studio", "BOOSTXL-DRV8305 booster pack", "PMSM with incremental encoder"],
        duration: "12 weeks",
        deliverables: [
          "Simulink FOC model — Clarke/Park, dual PI current loops, outer speed loop, SVPWM with dead time — tuned against motor parameters (Rs, Ld, Lq, flux linkage) measured on the bench, not taken from the datasheet",
          "Encoder-based FOC running on the C2000 hardware first: speed and torque steps, load-step rejection, and loop execution time proven to fit inside the PWM period with a GPIO toggle on the scope. This is the milestone the project is graded on",
          "Toolchain path fixed in week 1 and recorded: Embedded Coder codegen if the campus licence covers it, hand-written C on the free C2000Ware if it does not",
          "Sliding-mode or back-EMF observer swapped in behind the same proven current loops, with an open-loop I/F startup ramp and a tuned handover into closed loop. This is the stretch milestone, not the baseline — the handover is where commercial motor-control teams spend months, and one blown gate driver costs two weeks",
          "Phase-current scope traces showing the dead-time distortion the ideal model does not have, taken at low DC-link voltage on an isolated supply",
        ],
      },
      {
        title: "Grid-Tied Solar Microgrid with Islanding Detection",
        summary:
          "A PV inverter that synchronises to the grid with a PLL, shares load by droop control, and disconnects when the grid dies — with the non-detection zone measured rather than assumed away.",
        tier: "major",
        stack: ["MATLAB / Simulink", "Simscape Electrical", "Python (NumPy / SciPy)"],
        duration: "10–12 weeks",
        deliverables: [
          "Grid-tied inverter with SRF-PLL synchronisation, dq current control, and an LCL filter designed and damped rather than guessed — resonance placed deliberately and the damping loss budgeted",
          "Passive detection (OV/UV, OF/UF, ROCOF) with its non-detection zone plotted on the ΔP–ΔQ plane: the region where local load matches generation and nothing trips",
          "Sandia Frequency Shift added as an active method, quantifying both the NDZ it removes and the THD it costs",
          "Islanded mode: two sources sharing load by P–f / Q–V droop, riding through the grid-tied to islanded transition",
          "Power-quality report: inverter current-THD FFT against the harmonic current limits in IEEE 1547-2018 Clause 7, which is where an inverter's own limits actually live. IEEE 519 is invoked only for a claim at the point of common coupling, and only with the assumed Isc/IL bracket and table stated — its limits are not a single number. Reported at full load and at partial load, where current THD is worst",
        ],
      },
    ],
  },
  {
    slug: "signal-processing-comms",
    name: "Signal Processing & Wireless Communications",
    icon: RadioTower,
    tagline: "Signals instead of datasets — BER curves, constellation plots, and PSNR tables that hold up.",
    intro:
      "The input here is a waveform, and the answer is a curve checked against theory rather than a single accuracy number. Projects fail in two ways: a BER curve that does not sit on the analytical bound because the simulation is quietly wrong and nobody checked, or a folder of plots with no baseline to compare against. Everything on the SDR side is receive-only on public broadcast — never a radiating transmitter without a licence. Prerequisites, stated plainly: the two SDR briefs need an RTL-SDR dongle you buy, and the MATLAB briefs assume a campus-wide licence with the Communications Toolbox (the individual Student Suite does not bundle it). Projects 1 and 2 are fully doable in Python if MATLAB is unavailable; Project 4 is MATLAB-only and additionally needs the 5G Toolbox.",
    forCompanies:
      "PHY-layer simulation, SDR receiver chains, classical image-processing pipelines, and reproducing a published algorithm as code that actually runs.",
    stack: [
      "MATLAB",
      "Signal Processing Toolbox",
      "Communications Toolbox",
      "Image Processing Toolbox",
      "Python (NumPy / SciPy)",
      "GNU Radio",
      "RTL-SDR",
      "PyTorch",
    ],
    projects: [
      {
        title: "OFDM Link Simulation with BER-vs-SNR Curves",
        summary:
          "A full OFDM transmit and receive chain over AWGN, Rayleigh and Rician channels, with BER curves that land on their analytical references — and a cyclic-prefix sweep that shows exactly where they stop landing.",
        tier: "mini",
        stack: ["MATLAB", "Communications Toolbox", "Python (NumPy / SciPy)"],
        duration: "3–4 weeks",
        deliverables: [
          "BPSK / QPSK / 16-QAM / 64-QAM chain with IFFT, cyclic prefix and pilot insertion",
          "BER-vs-SNR curves over AWGN, Rayleigh and Rician, each overlaid on its reference (Rician by MGF-based numerical evaluation — no closed form exists)",
          "Cyclic-prefix sweep showing ISI once the CP is shorter than the channel delay spread",
          "Zero-forcing vs. MMSE equaliser comparison with before/after constellations",
          "Monte Carlo confidence note: bits per SNR point, minimum-error-count stopping rule, and the SNR beyond which the run has too few errors to report a BER",
        ],
      },
      {
        title: "Classical Image Enhancement and Compression Pipeline",
        summary:
          "Histogram equalisation, morphological cleanup, edge detection and a DWT/DCT codec scored against JPEG — the hard part being that a transform is not a compressor, so there is no bitrate until you build the quantizer and the entropy coder.",
        tier: "mini",
        stack: ["MATLAB", "Image Processing Toolbox", "Python (OpenCV / scikit-image)", "PyWavelets"],
        duration: "3–4 weeks",
        deliverables: [
          "Enhancement stage: global HE, CLAHE and gamma correction, each scored on the same image set",
          "Segmentation stage: Otsu thresholding plus morphological opening/closing vs. region growing",
          "DWT and DCT codecs with a deadzone quantizer and entropy coder (or an explicit first-order-entropy bit estimate, labelled as an estimate)",
          "Rate-distortion curves (PSNR and SSIM vs. bpp) against JPEG, with JPEG bpp measured from actual encoded file size",
          "2AFC perceptual test (5 raters, 20 image pairs) reporting the agreement rate where PSNR and SSIM disagree",
        ],
      },
      {
        title: "RTL-SDR FM Receiver and Spectrum Analyser",
        summary:
          "Pull real broadcast FM out of the air on a low-cost USB dongle, rebuild the whole demodulation chain from scratch in NumPy, and align it against the GNU Radio reference by cross-correlation — because two independent WBFM chains never match sample for sample.",
        tier: "mini",
        stack: ["RTL-SDR", "GNU Radio", "Python (NumPy / SciPy)", "pyrtlsdr"],
        duration: "3–4 weeks",
        deliverables: [
          "Working WBFM receiver in GNU Radio Companion, used as the reference",
          "From-scratch NumPy chain (decimating FIR, quadrature demodulator, de-emphasis IIR, resample to 48 kHz)",
          "Cross-correlation alignment against the reference: delay-compensated SNR ≥ 25 dB, max absolute deviation, and overlaid output spectra",
          "FIR designed to a written spec (passband ripple, stopband attenuation, order) — not a dropped-in default block",
          "PSD and waterfall plots at each decimation stage, including the aliasing from decimating before filtering",
          "Sample-rate sweep with measured dropped-sample counts, identifying the stable maximum rate on your host (report what you measure, not the spec sheet)",
        ],
      },
      {
        title: "Reproduce and Extend a MIMO-OFDM Channel Estimation Paper",
        summary:
          "Rebuild a recent IEEE channel-estimation paper from its text until your curves match theirs, extend it to a channel the authors never tested, and write up honestly which figures you could not reproduce.",
        tier: "major",
        stack: ["MATLAB", "Communications Toolbox", "5G Toolbox", "LaTeX (IEEEtran)"],
        duration: "12 weeks",
        deliverables: [
          "LS and MMSE estimators implemented from the paper's equations, not a toolbox one-liner",
          "MSE-vs-SNR and BER-vs-SNR curves reproduced figure-by-figure against the published plots",
          "Reproduction table: every figure marked matched / partially matched / not reproduced, each with a stated reason",
          "An extension the paper does not cover (a 3GPP TDL profile, a pilot-density sweep, or a Doppler they held fixed)",
          "IEEEtran write-up stating the extension as the contribution and the failures as failures",
        ],
      },
      {
        title: "Automatic Modulation Classification: Cumulant Baseline vs. CNN",
        summary:
          "Classify modulation from raw I/Q with a higher-order-cumulant classifier and a CNN on RadioML, then test both on the only two classes a student can legally receive off-air — WBFM and AM broadcast — because the dataset's synthetic impairments are not the ones the air puts there.",
        tier: "major",
        stack: ["Python (NumPy / SciPy)", "scikit-learn", "PyTorch", "RTL-SDR", "GNU Radio"],
        duration: "10–12 weeks",
        deliverables: [
          "Cumulant classifier on RadioML 2018.01A (C40, C42, C63 into an SVM), with the feature maths derived rather than copied — 2016.10a as the fallback if compute is short",
          "CNN over raw I/Q as the learned counterpart, on a matched train/validation/test split",
          "Accuracy-vs-SNR curves for both classifiers plus confusion matrices at fixed SNR (no single headline accuracy number)",
          "Live receive-only test scoped to WBFM and AM-DSB broadcast — the only two classes with legal off-air ground truth",
          "Domain-gap study on the remaining classes: carrier-frequency and sample-rate offset injected into the RadioML test set",
        ],
      },
    ],
  },
  {
    slug: "robotics-drones",
    name: "Robotics, Drones & Autonomous Systems",
    icon: Bot,
    tagline: "Perception, control, and autonomy — proven in simulation before it touches a floor.",
    intro:
      "Autonomy is the layer above the chassis — kinematics, control, state estimation, perception — and two failures dominate: hardware built before a behaviour is proven in simulation, and a TF tree that is silently wrong, so the robot can never localise no matter how good the LiDAR is. We build in Gazebo first, move to hardware second, and keep the logs.",
    forCompanies:
      "ROS 2 integration and Nav2 tuning, manipulator kinematics, PX4/MAVLink mission and ground-station software, simulation rigs that regression-test autonomy before it meets a real floor, and edge perception on Jetson-class hardware using a permissively licensed detector (RT-DETR) where Ultralytics YOLO's AGPL-3.0 terms do not fit a commercial build.",
    stack: [
      "ROS 2 Jazzy",
      "Gazebo Sim",
      "Nav2",
      "SLAM Toolbox",
      "URDF / TF2",
      "PX4 SITL + Pixhawk",
      "MAVSDK / MAVLink",
      "NVIDIA Jetson",
      "OpenCV / RT-DETR",
    ],
    projects: [
      {
        title: "PID Line-Follower: A Tuning Study",
        summary:
          "A differential-drive bot that holds a line at speed under a tuned PID loop, with step-response and cross-track-error plots that prove the gains instead of the bang-bang wobble most builds settle for.",
        tier: "mini",
        stack: ["ESP32", "C++", "IR reflectance array", "PID control", "Python (log analysis)"],
        duration: "3–4 weeks",
        deliverables: [
          "Differential-drive kinematics in code, not hand-guessed PWM",
          "Step-response and cross-track-error plots for three gain sets, from logged CSVs",
          "Bang-bang baseline benchmarked on the same track",
          "Anti-windup and filtered derivative, each with the failure it fixes on video",
          "Stretch goal, only once the tuning study lands: wall-following maze solve",
        ],
      },
      {
        title: "4-DOF Arm: Forward and Inverse Kinematics in Simulation",
        summary:
          "A simulated arm that reaches a commanded (x, y, z) using an inverse-kinematics solver you derived yourself — validated against your own forward model across the whole workspace, not the three poses that happen to work.",
        tier: "mini",
        stack: ["ROS 2 Jazzy", "Gazebo Sim", "URDF", "TF2", "Python", "NumPy"],
        duration: "3–4 weeks",
        deliverables: [
          "URDF with documented DH parameters, loading in Gazebo and RViz",
          "Forward-kinematics function validated against the TF poses RViz reports",
          "Analytical IK solver with reachability and singularity rejection",
          "FK(IK(pose)) error map over a sampled workspace grid, plotted",
          "Joint-trajectory pick-and-place in Gazebo, driven by your own solver",
        ],
      },
      {
        title: "Autonomous Indoor Rover (SLAM + Nav2)",
        summary:
          "A rover that maps an unseen floor, then runs a waypoint mission through it while avoiding people who step into its path — with rosbags, a defensible TF tree, and map artefacts that survive a viva.",
        tier: "major",
        stack: ["ROS 2 Jazzy", "Nav2", "SLAM Toolbox", "robot_localization (EKF)", "RPLIDAR + IMU", "Jetson Orin Nano"],
        duration: "10–12 weeks",
        deliverables: [
          "Gazebo world matching the real floor plan, every behaviour proven there first",
          "TF tree (map → odom → base_link → sensors) printed and defended, because it fails silently",
          "EKF fusing wheel odometry and IMU, drift measured against ground truth before and after",
          "SLAM Toolbox map (.pgm + .yaml) with loop closure demonstrated",
          "Nav2 mission over five waypoints with dynamic obstacle avoidance, rosbags for every run including the failures",
        ],
      },
      {
        title: "Survey Drone with Onboard Detection and Geotagged Reporting",
        summary:
          "A ready-to-fly quadcopter that runs a planned survey grid, detects and geotags targets onboard, and lands with a report — flown and broken in PX4 SITL long before the props ever spin.",
        tier: "major",
        stack: ["PX4 SITL + Pixhawk (ready-to-fly airframe)", "Gazebo Sim", "MAVSDK / MAVLink", "QGroundControl", "Jetson Orin Nano", "RT-DETR"],
        duration: "12–14 weeks",
        deliverables: [
          "Full mission in PX4 SITL + Gazebo, with injected GPS loss, RC loss and low battery, and the failsafe response to each",
          "Detector fine-tuned on a public aerial dataset, mAP reported on a held-out set of your own labelled frames",
          "Onboard inference on the companion computer at a measured FPS, with PX4 .ulg logs reviewed per flight",
          "Geotagged detections fused with MAVLink position and attitude, exported as GeoJSON and mapped",
          "Flight authorisation on file before any outdoor flight: Drone Rules 2021 Rule 22 R&D exemption via the institution, green-zone airspace inside institution-controlled premises, ≤400 ft AGL, VLOS, named faculty supervisor, DigitalSky airspace-map check, stated all-up weight and category, no flight over people — otherwise SITL plus a netted indoor cage and no outdoor flight at all",
        ],
      },
    ],
  },
  {
    slug: "data-analytics-bi",
    name: "Data Analytics & Business Intelligence",
    icon: ChartNoAxesCombined,
    tagline: "SQL, dimensional models, and dashboards where every number can be defended.",
    intro:
      "This is the consumption end of the data stack: SQL that answers a question, a model that makes the answer repeatable, and a chart only at the very end. Data engineering owns whether the data arrives — on time, uncorrupted; this domain owns what it means once it is here: the grain, the metric definition, the segment cut, the confidence interval. Everyone has a dashboard, so a project only counts if it is defensible — student work fails here by being decorative: a Power BI page built straight on a flat CSV, with no fact grain, no baseline to beat, and a conclusion the data does not actually support.",
    forCompanies:
      "Semantic and dimensional modelling in dbt, metric definitions that stop two dashboards disagreeing about revenue, BI builds and migrations in Power BI or Tableau, and classical forecasting, experiment design and readouts — the layer above ingestion, where a number has to resolve to one meaning.",
    stack: [
      "Advanced SQL",
      "PostgreSQL",
      "DuckDB",
      "BigQuery",
      "dbt",
      "Power BI",
      "Tableau",
      "statsmodels / statsforecast",
      "Metabase",
    ],
    projects: [
      {
        title: "Retail Star Schema & Power BI Report",
        summary:
          "Raw order CSVs modelled into a star schema in Postgres with a Power BI report on top — where the hard part is fixing the fact grain so measures stop double-counting across joins.",
        tier: "mini",
        stack: ["PostgreSQL", "SQL", "Power BI", "DAX"],
        duration: "3–4 weeks",
        deliverables: [
          "Star schema with the fact grain written down (one row = one order line) and conformed dimensions",
          "A real date dimension table — fiscal periods, week-of-year, holiday flag — not a raw date column",
          "Type-2 slowly-changing dimension on product price and category, with history preserved",
          "Power BI report where measures are DAX, not visual-level aggregates",
          "One-page insight memo: three findings, the SQL behind each, and a recommendation with its caveat stated",
        ],
      },
      {
        title: "A/B Test Readout on a Public Experiment Dataset",
        summary:
          "A full experiment analysis — pre-registered plan, power simulation, peeking cost, effect size with an interval — ending in a written defence of what the result does and, more importantly, does not prove.",
        tier: "mini",
        stack: ["Python", "NumPy", "scipy", "statsmodels", "SQL"],
        duration: "4 weeks",
        deliverables: [
          "Analysis plan fixed before the outcome column is opened: primary metric, minimum detectable effect, sample size and power",
          "Power simulation: an MDE curve showing the effect this sample could actually have detected, so a null result can be told apart from an underpowered one",
          "Sanity checks: sample-ratio-mismatch test and an A/A comparison on pre-experiment data",
          "Peeking cost quantified by simulation — the false-positive rate under repeated looks — with one sequential correction (alpha spending or an always-valid interval) applied to the same data",
          "Effect size with a confidence interval, never a bare p-value; one pre-specified heterogeneous-treatment-effect check with its multiple-comparisons correction; and a decision memo — ship, do not ship, or re-run — stating what the result does not prove",
        ],
      },
      {
        title: "Demand Forecast & Variance Dashboard",
        summary:
          "A monthly SKU demand forecast benchmarked against the seasonal-naive baseline it has to beat, published as a dashboard that tracks forecast error rather than just the forecast.",
        tier: "mini",
        stack: ["statsforecast", "statsmodels", "pandas", "Tableau Desktop (free student licence)", "PostgreSQL"],
        duration: "4 weeks",
        deliverables: [
          "Rolling-origin backtest — never a random train/test split on a time series",
          "AutoARIMA and AutoETS (statsforecast) reported next to a seasonal-naive baseline on identical backtest windows, so a win is a real win",
          "Error metrics per horizon: MAPE and MASE, because MAPE breaks on near-zero demand",
          "Tableau dashboard connected to the Postgres warehouse, showing forecast, prediction interval, and last period's actual-vs-forecast error",
          "A written list of the SKUs this model should not be trusted for — intermittent demand, short history, promo-driven spikes — and why",
        ],
      },
      {
        title: "Semantic Layer: Governed Marts and a Metric Catalogue",
        summary:
          "Raw sources modelled through dbt into governed dimensional marts with a metric catalogue and a BI layer on top — where the hard part is the non-additive metrics that break the moment someone sums them.",
        tier: "major",
        stack: ["dbt", "PostgreSQL", "BigQuery", "Power BI", "Metabase", "SQL"],
        duration: "10–12 weeks",
        deliverables: [
          "Dimensional model at the mart layer: conformed dimensions reused across at least three fact tables, each fact's grain stated and enforced by a uniqueness test",
          "A metric catalogue — for each of ~10 metrics: its definition in words, its exact SQL, its owner, and its known exclusions — so that 'revenue' resolves to exactly one definition across every mart and report in the project",
          "Two hard metrics modelled and defended: one non-additive (a rate or ratio that cannot be summed across rows) and one requiring a point-in-time or period-over-period comparison",
          "Reconciliation checks that catch two marts disagreeing on a shared metric, run on every model change, so a definition cannot drift in silence",
          "BI layer built only on the marts — no report reading a source table directly — with row-level security on one dimension, plus a stakeholder summary a non-technical reader can act on without a follow-up question",
        ],
      },
      {
        title: "Product Analytics Investigation: Funnel, Retention, Causal Readout",
        summary:
          "A behavioural investigation over a large public event dataset — where the funnel leaks, which cohorts come back, what a past change actually did — ending in a recommendation list ranked by estimated impact and effort.",
        tier: "major",
        stack: ["DuckDB", "SQL", "pandas", "statsmodels", "Metabase"],
        duration: "10–12 weeks",
        deliverables: [
          "Event model with the sessionisation rule defended: why a 30-minute inactivity window, and what it breaks",
          "Funnel analysis with drop-off by step and by segment, including at least one segment cut (device, channel, or geo) reported with its finding stated honestly — including if the cut shows nothing",
          "Cohort retention curves with a check that any movement is a retention change and not a cohort-mix change (Simpson's paradox)",
          "Quasi-experimental readout on a change already visible in the data — a release, a policy change, a pricing shift — using interrupted time series or difference-in-differences, with the identifying assumptions written down and stress-tested (pre-period parallel trends, one placebo test). Pick the dataset for one.",
          "An experiment design a team could actually run for the top recommendation — primary metric, MDE, sample size, run duration, guardrail metrics, pre-registered analysis plan — attached to a recommendation list ranked by estimated impact and effort, each with a stated confidence",
        ],
      },
    ],
  },
  {
    slug: "qa-test-automation",
    name: "Test Automation & SDET",
    icon: Bug,
    tagline: "Suites that catch defects, not suites that only go green.",
    intro:
      "Most student QA projects are twenty recorded happy-path scripts that pass, prove nothing, and fall apart the first time CI runs them in parallel. This domain treats testing as engineering: cases aimed where the software is most likely to break, locators and waits that survive a UI change, coverage you can point at — a matrix naming every journey as tested or explicitly not — and flake handled deliberately instead of by retrying until green. A suite is worth exactly what it catches, so every project here ends with a defect log: reproducible steps and evidence, not a screenshot of a passing run.",
    forCompanies:
      "Test strategy and automation frameworks, turning a manual regression pass into a CI gate, stabilising suites the team has learned to ignore, API and contract coverage, load tests with thresholds that fail the build, and regression gates for LLM features someone else has already built.",
    stack: [
      "Playwright",
      "TypeScript",
      "Selenium 4",
      "TestNG",
      "REST Assured",
      "Pact",
      "k6",
      "promptfoo",
      "GitHub Actions",
    ],
    projects: [
      {
        title: "Playwright E2E Suite for a Deployed Web App",
        summary:
          "A cross-browser end-to-end suite over a live app with a page-object structure — the hard part is making it pass twenty runs in a row, not once.",
        tier: "mini",
        stack: ["Playwright", "TypeScript", "GitHub Actions", "Allure"],
        duration: "3–4 weeks",
        deliverables: [
          "Page Object Model built on role and test-id locators — no structural XPath that a DOM refactor breaks",
          "Critical-journey coverage matrix: every journey listed, each one either mapped to a named test or marked untested",
          "Cross-browser run (Chromium, Firefox, WebKit) green in GitHub Actions on every push",
          "Twenty-consecutive-run stability report — every flake either fixed or quarantined with a written reason",
          "Defect log with reproducible steps, a Playwright trace, and a screenshot per finding",
        ],
      },
      {
        title: "Selenium + TestNG Regression Suite with BDD Specs",
        summary:
          "A Java regression suite a non-engineer can read and sign off: Gherkin scenarios, thread-safe parallel execution, and test data seeded over the API instead of clicked into existence.",
        tier: "mini",
        stack: ["Selenium 4", "Java", "TestNG", "Cucumber", "REST Assured", "Allure"],
        duration: "4 weeks",
        deliverables: [
          "Gherkin feature files reviewed and signed off by someone who does not write code",
          "Page Object Model with explicit waits — zero Thread.sleep anywhere in the repository",
          "Parallel TestNG execution with a ThreadLocal WebDriver; a driver shared across threads interleaves commands and produces nondeterministic failures",
          "REST Assured setup and teardown that seeds each scenario's data through the API and removes it afterwards, so no test depends on another test's leftovers",
          "Allure report with per-step detail and screenshot-on-failure, plus a defect log naming the failing scenario with reproducible steps",
        ],
      },
      {
        title: "Complete SDET Framework",
        summary:
          "One framework over an app you deploy yourself — UI, API and consumer-driven contract layers sharing a data factory, a sharded CI matrix, flake quarantine, and a k6 load test whose SLO thresholds fail the build.",
        tier: "major",
        stack: ["Playwright", "TypeScript", "Ajv", "Pact", "k6", "GitHub Actions"],
        duration: "10–12 weeks",
        deliverables: [
          "Three layers in one repo — E2E, API and contract — against an application you deploy and control (reuse the app from the Playwright mini), sharing one test-data factory that creates and tears down its own state",
          "API layer validating every response against the OpenAPI schema with Ajv rather than hand-picked field assertions, plus negative and boundary cases: auth failures, malformed payloads, pagination edges, rate limits",
          "Consumer-driven Pact contract published to a PactFlow free-tier broker (provisioning it is a week-one setup step) and verified in CI by the provider's own verification task — which you can run because you own the provider",
          "Sharded GitHub Actions matrix with merged blob reports and a per-shard timing breakdown, plus flake quarantine: retry telemetry, a quarantine lane, and pass-rate-per-test trended in an off-the-shelf tool (Allure TestOps, or Grafana over a results table) rather than a dashboard you build yourself",
          "k6 load test against your deployed environment with p95 latency and error-rate thresholds wired as a build gate, and a defect log with traces and — where identifiable — the commit that introduced each regression",
        ],
      },
      {
        title: "CI Regression Gate for an LLM Application",
        summary:
          "The app already exists — the RAG chatbot from AI & LLM Applications, or any deployed LLM app you own; building it is out of scope. This is the layer that domain does not ship: a versioned golden set, a calibrated judge, and a CI gate that blocks a prompt change that regresses quality.",
        tier: "major",
        stack: ["Python", "pytest", "promptfoo", "GitHub Actions"],
        duration: "10–12 weeks",
        deliverables: [
          "Versioned golden set of 150 prompts with reference outputs, labelled against a written rubric by you and a second annotator (a classmate), versioned in the repo alongside the prompts",
          "LLM-as-judge scored against those labels and reported with its agreement rate against the human set — an uncalibrated judge measures nothing",
          "Groundedness/hallucination and safety-refusal suites, each with a pass threshold over the whole set rather than a string match per case",
          "Measured cost and latency budget per prompt version, with the API spend capped by design: a 20-prompt smoke subset on every push, the full set on pull request only",
          "GitHub Actions gate that blocks any prompt or model change scoring below baseline, plus a defect log of the regressions it actually caught",
        ],
      },
    ],
  },
  {
    slug: "network-protocol-simulation",
    name: "Computer Networks & Protocol Simulation",
    icon: Network,
    tagline: "Routing, SDN, and vehicular protocols — measured with graphs that survive a second seed.",
    intro:
      "In networking, the result IS the measurement — which is why student projects here fail so predictably: one simulation run, a NetAnim screenshot, and a bar chart with no baseline and no error bars, which collapses the moment an examiner asks what a different seed would do. We build the opposite — parameter sweeps, a stated baseline, and confidence intervals on every curve, with the simulation environment pinned so the figures regenerate. Any attack or failure modelling stays inside the simulator, on topologies we generate ourselves, and is never pointed at a live network.",
    forCompanies:
      "Protocol evaluation and capacity what-ifs before anything touches production hardware, SDN controller applications, V2X and vehicular network modelling, and turning an internal performance claim into a measurement someone else can reproduce.",
    stack: [
      "ns-3",
      "OMNeT++ / Veins",
      "SUMO",
      "Mininet",
      "ONOS / os-ken",
      "OpenFlow",
      "Wireshark",
      "iperf3",
      "Python + matplotlib",
    ],
    projects: [
      {
        title: "MANET Routing Under Mobility: AODV vs OLSR",
        summary:
          "A controlled ns-3 sweep of AODV against OLSR across node density, mobility speed and offered load, reported with confidence intervals instead of the one lucky run.",
        tier: "mini",
        stack: ["ns-3", "C++", "Python", "matplotlib", "Wireshark"],
        duration: "3–4 weeks",
        deliverables: [
          "Sweep: 3 node densities x 4 mobility speeds x 3 offered loads, 20 seeds per cell",
          "Six metrics per configuration — PDR, throughput, end-to-end delay, jitter, routing overhead, energy — each plotted with 95% confidence intervals",
          "FlowMonitor output cross-checked against the pcap traces in Wireshark, so every headline number has two independent sources",
          "Trend comparison against published AODV/OLSR studies — direction and slope only (does PDR fall with speed at the same rate?), with an explicit statement that absolute PDR and delay figures are not comparable across different PHY, propagation, mobility and traffic setups",
          "Pinned config — ns-3 version, propagation model, mobility model, seed list — in one script that regenerates every figure",
        ],
      },
      {
        title: "SDN Load Balancer as an OpenFlow Controller App",
        summary:
          "A controller app on Mininet that spreads flows across a server pool and reroutes around a failed link, with failover time measured from packet timestamps rather than asserted.",
        tier: "mini",
        stack: ["Mininet", "os-ken", "OpenFlow 1.3", "Open vSwitch", "iperf3"],
        duration: "3–4 weeks",
        deliverables: [
          "Controller app with two policies — round-robin and load-aware flow assignment — built on os-ken (the maintained Ryu fork); Ryu itself is documented as the legacy path, not used as the default, because it is frozen upstream and its eventlet dependency fights modern Python",
          "Measured flow distribution across backends under iperf3 load, quantifying the imbalance produced by naive hashing",
          "Link-failure injection with failover time measured from packet timestamps, not from controller log lines",
          "Flow-table dumps (ovs-ofctl) proving rules are installed in the switch, not merely logged by the controller",
          "Dockerfile pinning the Python and controller versions, so week one goes into controller logic and not environment archaeology",
        ],
      },
      {
        title: "Reinforcement-Learning Routing Protocol",
        summary:
          "A routing policy that learns from link state and mobility, benchmarked against AODV on topologies it never trained on, written up as an IEEE-format paper with a harness anyone can re-run.",
        tier: "major",
        stack: ["ns-3", "ns3-ai", "Python", "PyTorch", "matplotlib"],
        duration: "10–12 weeks",
        deliverables: [
          "Pinned toolchain fixed in week 1 — a specific ns-3 release paired with the exact ns3-ai version that supports it; the bridge is version-locked and a mismatch discovered in week 3 costs weeks",
          "Tabular Q-routing running end-to-end through the ns3-ai loop by week 3, before any neural policy — this de-risks the bridge and doubles as a learned baseline",
          "The policy implemented as a real ns-3 routing module, not a script post-processing trace files after the fact, with the state, action and reward specification written down",
          "Stated and met training budget: episodes x sim-seconds, runs parallelised across seeds, wall-clock cost reported — RL over a discrete-event simulator is sample-hungry and the schedule says so up front",
          "Benchmark vs AODV on PDR, delay, routing overhead and energy including held-out topologies; IEEE-format paper naming the scenarios where the learned policy loses to AODV rather than burying them",
        ],
      },
      {
        title: "VANET Safety-Message Dissemination on a Real City Map",
        summary:
          "Emergency-braking warnings broadcast between vehicles driving a real OpenStreetMap road network, coupled closed-loop over TraCI so a car that receives a warning actually brakes — studied on 802.11p, with the post-2020 C-V2X shift stated rather than ignored.",
        tier: "major",
        stack: ["OMNeT++", "Veins", "SUMO", "IEEE 802.11p", "TraCI", "Python"],
        duration: "10–12 weeks",
        deliverables: [
          "Real road network imported from OpenStreetMap into SUMO with OSM-routed demand — the flow assumptions (randomTrips parameters or an assumed OD matrix) are documented in the report and are not called calibrated, because there are no ground-truth counts to calibrate against",
          "Closed-loop coupling: SUMO and OMNeT++ step together over TraCI under Veins, so a received warning changes the receiving vehicle's behaviour and reaction-time and near-miss metrics are legitimate — an open-loop mobility-trace replay could not support any safety claim at all",
          "Obstacle shadowing wired in from the same OSM extract (building polygons via polyconvert into the Veins obstacle model), with the LOS/NLOS split reported alongside every distance-bucketed latency number — a plain log-distance model reports clean packets at 500 m through a building block, which is fiction",
          "Contention-based broadcast suppression measured against naive flooding: delivery ratio, warning latency at 100/200/500 m, redundancy ratio and channel busy time, all against vehicle density",
          "Rush-hour and off-peak scenarios, 15 seeds each, confidence intervals on every curve, plus a report section positioning 802.11p as the studied baseline against the C-V2X / NR-V2X deployment direction the 5.9 GHz reallocation set",
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
