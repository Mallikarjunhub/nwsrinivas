/* =========================================================================
   Nammaweb AI Research Labs — Fellowship Portal
   data.js — all curriculum / programme content lives here.
   Plain ES5-safe globals so the site runs from file:// and any static host.
   ========================================================================= */

var NW = window.NW || {};

NW.brand = {
  name: 'Nammaweb AI Research Labs',
  legal: 'Nammaweb LLP',
  tagline: 'Born to Innovate. Built to Inspire.',
  dpiit: 'DIPP199820',
  iso: 'ISO 21001:2018',
  mentor: 'Mallikarjun S Nandyal',
  mentorRole: 'Director, Nammaweb AI Research Labs & Principal Systems Architect',
  candidate: 'Srinivas',
  candidateCity: 'Whitefield, Bengaluru',
  programme: 'Applied Generative AI Systems Fellowship',
  programmeCode: 'AGAI-SF',
  upiId: 'mallikarjunns007-1@oksb',
  phone: '9241527429',
  fullFee: 45000,
  phaseOneFee: 25000
};

/* ---------------------------------------------------------------- syllabus */
NW.modules = [
  {
    id: 'm1',
    phase: 1,
    title: 'Bridging the Stack',
    subtitle: 'Node / MERN to modern Python systems',
    span: 'Weeks 1–4',
    weeks: [
      {
        id: 'w1', n: 1, title: 'Runtimes, types and packaging',
        summary: 'Move from the V8 mental model to CPython without losing the habits that made you fast in Node.',
        points: [
          'CPython bytecode + GIL against the V8 event loop: where concurrency actually happens in each runtime.',
          'Python 3.12+ typing next to TypeScript — generics, protocols, <code>Literal</code>, structural vs nominal typing.',
          'Pydantic V2 against Zod: validation cost, <code>model_validate</code>, serialisation aliases, settings management.',
          '<code>uv</code> for dependency resolution, lockfiles and reproducible virtual environments.'
        ],
        deliverable: 'A typed, uv-locked Python package that mirrors an existing Express service you have written.'
      },
      {
        id: 'w2', n: 2, title: 'ASGI and modern API architecture',
        summary: 'FastAPI as the production surface for model serving, with real-time token delivery.',
        points: [
          'ASGI lifecycle, dependency injection, background tasks and lifespan events.',
          'FastAPI against Express.js: routing, middleware, validation, OpenAPI generation.',
          'Server-Sent Events for token streaming; when WebSockets are the correct trade and when they are not.',
          'Backpressure, client disconnects and graceful shutdown during a long generation.'
        ],
        deliverable: 'A streaming <code>/chat</code> endpoint that emits tokens over SSE and survives a mid-stream disconnect.'
      },
      {
        id: 'w3', n: 3, title: 'The mathematics of embeddings',
        summary: 'Retrieval quality is decided here, long before a model is chosen.',
        points: [
          'Vector spaces, dimensionality and why normalised vectors make cosine similarity a dot product.',
          'Cosine similarity against Euclidean distance: what each one rewards and where each one misleads.',
          'Recursive character chunking against semantic chunking; overlap, parent-document retrieval.',
          'Embedding model selection and the cost of re-indexing a corpus.'
        ],
        deliverable: 'A chunking benchmark comparing three strategies on the same 200-page corpus.'
      },
      {
        id: 'w4', n: 4, title: 'Milestone — retrieval microservice',
        milestone: true,
        summary: 'First production artefact: a FastAPI microservice backed by MongoDB Atlas Vector Search.',
        points: [
          'Atlas vector index definition, filters and pre-filtering on tenant metadata.',
          'Connection pooling, async Motor driver, health and readiness probes.',
          'Latency budget: sub-50 ms p95 query time measured with a repeatable load script.',
          'Structured logging and a <code>/metrics</code> endpoint from day one.'
        ],
        deliverable: 'Repo + benchmark report showing p95 query latency under 50 ms.'
      }
    ]
  },
  {
    id: 'm2',
    phase: 1,
    title: 'Sovereign Edge Models & Deterministic RAG',
    subtitle: 'Running capable models on hardware you own',
    span: 'Weeks 5–8',
    weeks: [
      {
        id: 'w5', n: 5, title: 'Quantization physics',
        summary: 'What is actually lost when weights are compressed, and how to measure it rather than guess.',
        points: [
          'GGUF and AWQ formats; K-quants, importance matrices and calibration data.',
          '4-bit against 8-bit precision: memory, throughput and perplexity trade-offs.',
          'Ollama and llama.cpp on CPU-only hardware — threads, context length, KV cache sizing.',
          'Measuring tokens/second and first-token latency on a laptop-class machine.'
        ],
        deliverable: 'A quantization comparison table for one model family across three precisions.'
      },
      {
        id: 'w6', n: 6, title: 'Hybrid retrieval',
        summary: 'Dense vectors miss exact terms. Sparse search misses meaning. Fuse both.',
        points: [
          'BM25 scoring: term frequency saturation, document length normalisation.',
          'Reciprocal Rank Fusion — why rank fusion beats score normalisation across engines.',
          'Cross-encoder reranking and when the added latency earns its place.',
          'HNSW parameters: <code>M</code>, <code>efConstruction</code>, <code>efSearch</code> and the recall/latency curve.'
        ],
        deliverable: 'A hybrid retriever with an RRF layer and a recall@k report against a dense-only baseline.'
      },
      {
        id: 'w7', n: 7, title: 'Hallucination prevention',
        summary: 'Constrain the output space so invalid answers cannot be produced in the first place.',
        points: [
          'Grammar-constrained decoding (GBNF) for guaranteed well-formed JSON.',
          'NeMo Guardrails: topical rails, input/output rails, execution rails.',
          'The Ragas evaluation triad — faithfulness, answer relevancy, context precision.',
          'Citation enforcement and refusal behaviour when retrieval returns nothing useful.'
        ],
        deliverable: 'An evaluation harness scoring your retriever on the Ragas triad across 50 questions.'
      },
      {
        id: 'w8', n: 8, title: 'Milestone — air-gapped RAG engine',
        milestone: true,
        summary: 'A search engine that works with the network cable pulled out.',
        points: [
          'Local embedding model + local LLM + local vector store, no outbound calls.',
          'Zero token spend: verified by running the full demo with networking disabled.',
          'Incremental indexing of a watched folder.',
          'Packaging the whole thing so a non-technical reviewer can run it.'
        ],
        deliverable: '100% offline RAG engine, demonstrated with networking switched off during review.'
      }
    ]
  },
  {
    id: 'm3',
    phase: 1,
    title: 'Agentic State Machines & Multimodal AI',
    subtitle: 'From a single call to a system that decides',
    span: 'Weeks 9–12',
    weeks: [
      {
        id: 'w9', n: 9, title: 'ReAct and cyclical graphs',
        summary: 'Tool use as a control-flow problem, not a prompt trick.',
        points: [
          'The ReAct loop: reason, act, observe — and where it fails silently.',
          'JSON schema generation for tool signatures, argument validation and repair.',
          'LangGraph state, nodes, conditional edges and cycles.',
          'Recursion limits, timeouts and deterministic replay of a failed run.'
        ],
        deliverable: 'A LangGraph agent with three tools, a retry edge and a hard recursion ceiling.'
      },
      {
        id: 'w10', n: 10, title: 'Multi-agent teams',
        summary: 'Supervisor patterns, and the discipline to know when one agent is enough.',
        points: [
          'CrewAI roles, tasks and the supervisor/worker topology.',
          'Episodic vector memory against rolling context memory; summarisation checkpoints.',
          'Hand-off contracts between agents and the cost of chatty delegation.',
          'Token budgeting and cost telemetry per agent run.'
        ],
        deliverable: 'A three-agent research crew with a cost report per completed task.'
      },
      {
        id: 'w11', n: 11, title: 'Vision-language models and document intelligence',
        summary: 'Real enterprise documents are skewed, merged-cell, multi-column and scanned.',
        points: [
          'VLM architectures and where OCR still beats an end-to-end model.',
          'Table structure recognition on distorted financial PDFs.',
          'Layout-aware chunking: headers, footnotes, spanning cells.',
          'Confidence scoring and human-in-the-loop review queues.'
        ],
        deliverable: 'A parser that extracts a clean table from three deliberately awkward financial PDFs.'
      },
      {
        id: 'w12', n: 12, title: 'Milestone — technical defence',
        milestone: true,
        summary: 'A live 45-minute defence before the Director. 80% is the gate to Phase 2.',
        points: [
          'Architecture walkthrough with justified trade-offs on every component.',
          'Live code reading — you will be asked to change something under observation.',
          'Benchmark defence: how the numbers were produced and where they are weak.',
          'Scored rubric: correctness, latency, clarity, failure handling.'
        ],
        deliverable: '45-minute defence, scored on a published rubric. 80% required to progress.'
      }
    ]
  },
  {
    id: 'm4',
    phase: 2,
    title: 'Three Live Enterprise Capstones',
    subtitle: 'Production systems, reviewed as production systems',
    span: 'Weeks 13–20',
    weeks: [
      {
        id: 'w13', n: 13, title: 'Capstone 1 — multi-tenant document intelligence (build)',
        capstone: 1,
        summary: 'B2B engine where tenant isolation is a correctness requirement, not a setting.',
        points: [
          'React 19 front end with Suspense-driven streaming and optimistic updates.',
          'FastAPI + Qdrant collections with per-tenant payload filters.',
          'Celery workers for ingestion, with idempotent task design.',
          'Mistral-7B served locally for extraction and summarisation.'
        ],
        deliverable: 'Ingestion pipeline handling 500 documents with tenant isolation tests passing.'
      },
      {
        id: 'w14', n: 14, title: 'Capstone 1 — retrieval, auth and hardening',
        capstone: 1,
        summary: 'The part that separates a demo from something a company would pay for.',
        points: [
          'JWT auth, role scopes and row-level tenancy checks at the query layer.',
          'Rate limiting, request quotas and abuse handling.',
          'Audit trail for every retrieval and every generated answer.',
          'Load test at 50 concurrent users with a published latency profile.'
        ],
        deliverable: 'Security + load report, including a documented attempt to break tenant isolation.'
      },
      {
        id: 'w15', n: 15, title: 'Capstone 1 — review and release',
        capstone: 1,
        summary: 'Ship it, document it, defend it.',
        points: [
          'README that a stranger can follow to a running system in ten minutes.',
          'Seed data, demo script and a two-minute recorded walkthrough.',
          'Known-limitations section written honestly.',
          'Director review and merge to <code>main</code>.'
        ],
        deliverable: 'Tagged v1.0 release with a reproducible demo.'
      },
      {
        id: 'w16', n: 16, title: 'Capstone 2 — Nammaweb Edge Diagnostic Appliance (build)',
        capstone: 2,
        summary: 'An offline PWA for environments with no reliable connectivity.',
        points: [
          'Service worker caching strategy for model assets and app shell.',
          'llama.cpp compiled for the target device; memory ceiling planning.',
          'IndexedDB for local records and deferred sync.',
          'Installability, offline-first UX and honest loading states.'
        ],
        deliverable: 'Installable PWA that completes a full diagnostic flow with aeroplane mode on.'
      },
      {
        id: 'w17', n: 17, title: 'Capstone 2 — Kannada language support',
        capstone: 2,
        summary: 'Local language is the whole point of an appliance built in Karnataka.',
        points: [
          'IndicTrans2 for Kannada ⇄ English translation on device.',
          'Script rendering, font subsetting and input method handling.',
          'Evaluating translation quality with native-speaker review, not BLEU alone.',
          'Fallback behaviour when translation confidence is low.'
        ],
        deliverable: 'Bilingual interface with on-device Kannada translation and a quality review sheet.'
      },
      {
        id: 'w18', n: 18, title: 'Capstone 3 — autonomous competitive intelligence (build)',
        capstone: 3,
        summary: 'An agent that goes and gets the information, then proves where it came from.',
        points: [
          'Next.js 15 app router, server actions and streamed agent traces.',
          'LangGraph plan → gather → verify → write cycle with explicit stop conditions.',
          'Playwright for resilient scraping: selectors, waits, anti-bot etiquette, robots.txt.',
          'Source provenance attached to every claim in the output.'
        ],
        deliverable: 'Agent producing a sourced competitor brief from a single company name.'
      },
      {
        id: 'w19', n: 19, title: 'Capstone 3 — reporting and scheduling',
        capstone: 3,
        summary: 'Output people forward to their boss.',
        points: [
          'WeasyPrint for typeset PDF reports with a real cover page and charts.',
          'Scheduled runs, change detection and diff-only alerts.',
          'Cost ceilings per run and a hard kill switch.',
          'Email/webhook delivery with retry semantics.'
        ],
        deliverable: 'Scheduled weekly PDF brief delivered automatically with a cost cap enforced.'
      },
      {
        id: 'w20', n: 20, title: 'Capstone portfolio review',
        capstone: 3, milestone: true,
        summary: 'All three systems, presented as one portfolio.',
        points: [
          'Portfolio site linking three running deployments.',
          'One-page architecture sheet per capstone.',
          'Recorded walkthroughs, each under three minutes.',
          'Director sign-off before placement work begins.'
        ],
        deliverable: 'Public portfolio with three live, reachable deployments.'
      }
    ]
  },
  {
    id: 'm5',
    phase: 2,
    title: 'Containerization, Cloud & Inference CI/CD',
    subtitle: 'From "works on my machine" to one command',
    span: 'Weeks 21–22',
    weeks: [
      {
        id: 'w21', n: 21, title: 'Dockerizing heterogeneous AI stacks',
        summary: 'Five services, one command, no README archaeology.',
        points: [
          'Multi-stage builds for FastAPI and React; image size discipline.',
          '<code>docker compose</code> orchestration of FastAPI, Qdrant, Ollama, Redis and the front end.',
          'Named volumes for model weights and vector data; warm-start times.',
          'Health checks, restart policies and dependency ordering.'
        ],
        deliverable: 'A stack that a reviewer brings up with <code>docker compose up</code> and nothing else.'
      },
      {
        id: 'w22', n: 22, title: 'Deployment, TLS and telemetry',
        summary: 'A public URL, a certificate, and visibility into what the model is doing.',
        points: [
          'AWS EC2 and DigitalOcean droplet sizing for CPU inference.',
          'Caddy as a reverse proxy with automatic TLS and sane security headers.',
          'Langfuse tracing: latency, token counts, cost per request, prompt versioning.',
          'Backups, log rotation and a written incident runbook.'
        ],
        deliverable: 'Live HTTPS deployment with Langfuse traces visible to the mentor.'
      }
    ]
  },
  {
    id: 'm6',
    phase: 2,
    title: 'Bengaluru Placement Acceleration',
    subtitle: 'The technical gauntlet',
    span: 'Weeks 23–24',
    weeks: [
      {
        id: 'w23', n: 23, title: 'Positioning and proof',
        summary: 'Rewrite the record so it reads in metrics, then put the work where recruiters look.',
        points: [
          'Metric-driven résumé: every line carries a number and a system.',
          'LinkedIn technical case studies published daily for two weeks.',
          'Targeted outreach list — Bengaluru AI product teams, with a reason for each.',
          'Mock screening call with recorded feedback.'
        ],
        deliverable: 'Rewritten résumé, ten published case studies, a 40-company target list.'
      },
      {
        id: 'w24', n: 24, title: 'Top 50 live coding drills',
        milestone: true,
        summary: 'Repetition under observation until the answers are automatic.',
        points: [
          'HNSW parameter reasoning and recall/latency trade-off questions.',
          'Vector maths by hand: cosine, dot product, normalisation, dimensionality.',
          'Rate limiting, caching, idempotency and queue design.',
          'System design whiteboarding: design a RAG platform for 10,000 users.'
        ],
        deliverable: '50 drills completed under timed conditions with a scored progress sheet.'
      }
    ]
  }
];

/* ------------------------------------------------------- job horizon data */
NW.roles = [
  { title: 'Generative AI Engineer', range: '₹18 – 32 LPA', focus: 'RAG platforms, agent orchestration, evaluation pipelines', demand: 'Very high' },
  { title: 'AI Platform / Backend Engineer', range: '₹16 – 28 LPA', focus: 'FastAPI services, vector databases, inference infrastructure', demand: 'High' },
  { title: 'Applied ML Systems Engineer', range: '₹20 – 35 LPA', focus: 'Model serving, quantization, latency and cost engineering', demand: 'High' },
  { title: 'Full-Stack AI Product Engineer', range: '₹14 – 26 LPA', focus: 'React 19 front ends over streaming model APIs', demand: 'Very high' },
  { title: 'Edge / On-Device AI Engineer', range: '₹18 – 30 LPA', focus: 'llama.cpp, GGUF, offline appliances, regulated deployments', demand: 'Emerging' },
  { title: 'AI Solutions Architect', range: '₹28 – 45 LPA', focus: 'Enterprise architecture, tenancy, governance, cost modelling', demand: 'High' }
];

/* --------------------------------------------------- 1:1 class scheduling */
NW.schedule = [
  { day: 'Monday', time: '8:00 – 9:30 PM IST', kind: 'Concept session', detail: 'Theory, derivations and whiteboard reasoning' },
  { day: 'Wednesday', time: '8:00 – 9:30 PM IST', kind: 'Build session', detail: 'Pair programming on the current week\'s deliverable' },
  { day: 'Friday', time: '8:00 – 9:00 PM IST', kind: 'Code review', detail: 'Line-by-line review of the submitted repository' },
  { day: 'Saturday', time: '10:00 AM – 12:30 PM IST', kind: 'Lab', detail: 'Long-form capstone work with the mentor on call' },
  { day: 'Sunday', time: 'Async', kind: 'Written feedback', detail: 'Benchmarks reviewed, notes posted to the command centre' }
];

/* ------------------------------------------------------ reference library */
NW.library = [
  {
    title: 'Vector maths and HNSW internals',
    note: 'Graph construction, the role of M and efSearch, and why recall falls off a cliff at low ef.',
    q: 'HNSW algorithm explained vector database internals'
  },
  {
    title: 'Ollama and quantization mechanics',
    note: 'GGUF K-quants, memory maths and measuring tokens/second on CPU.',
    q: 'GGUF quantization llama.cpp explained K-quants'
  },
  {
    title: 'LangGraph deterministic cycles',
    note: 'State graphs, conditional edges, recursion limits and replayable runs.',
    q: 'LangGraph state machine agents tutorial'
  },
  {
    title: 'FastAPI token streaming over SSE',
    note: 'StreamingResponse, event framing, disconnect handling and proxy buffering traps.',
    q: 'FastAPI server sent events streaming LLM tokens'
  }
];

/* ------------------------------------------- mentorship notes (seed data) */
NW.notes = [
  { week: 'Week 1', date: 'Session 01', body: 'Srinivas is fluent in Express middleware chains. Use that directly — map FastAPI dependencies onto middleware he has already written rather than teaching DI from scratch.' },
  { week: 'Week 2', date: 'Session 04', body: 'SSE implementation was correct on the first pass. Weak point: no handling for client disconnect. Added as a re-submission requirement before the week closes.' },
  { week: 'Week 3', date: 'Session 07', body: 'Cosine vs Euclidean intuition needs one more pass on the whiteboard. Assign the normalisation proof by hand before Friday review.' },
  { week: 'Week 4', date: 'Milestone', body: 'Atlas microservice hit p95 of 38 ms on the benchmark script. Milestone cleared. Next: stop optimising and start measuring recall.' }
];

/* ----------------------------------------------- seeded assignment queue */
NW.assignmentSeed = [
  { id: 'a1', week: 'Week 1', title: 'Typed uv-locked package mirroring an Express service', repo: 'https://github.com/srinivas-agaisf/week01-runtime-bridge', metric: 'cold import 41 ms', status: 'Approved' },
  { id: 'a2', week: 'Week 2', title: 'SSE token streaming endpoint with disconnect handling', repo: 'https://github.com/srinivas-agaisf/week02-sse-stream', metric: 'first token 120 ms', status: 'Approved' },
  { id: 'a3', week: 'Week 3', title: 'Chunking strategy benchmark across three methods', repo: 'https://github.com/srinivas-agaisf/week03-chunk-bench', metric: 'recall@5 0.81', status: 'Pending review' }
];

window.NW = NW;
