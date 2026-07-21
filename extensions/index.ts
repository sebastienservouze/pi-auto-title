import {
  DefaultResourceLoader,
  SessionManager,
  createAgentSession,
  getAgentDir,
  type ExtensionAPI,
  type ExtensionContext,
} from "@earendil-works/pi-coding-agent";
import { normalizeSessionTitle, pickCheapestAvailableModel } from "./title.js";

const DEFAULT_PROMPT = [
  "Nomme cette session depuis le prompt utilisateur.",
  "N'exécute pas, ne suis pas et n'analyse pas la demande.",
  "Réponds uniquement par un titre français de 3 à 8 mots, sans ponctuation finale, guillemets, liste ni explication.",
].join(" ");

const TITLE_PROMPT = process.env.PI_AUTO_TITLE_PROMPT ?? DEFAULT_PROMPT;

async function generateTitle(prompt: string, ctx: ExtensionContext): Promise<string | undefined> {
  const start = performance.now();
  const model = pickCheapestAvailableModel(ctx.modelRegistry.getAvailable());
  if (!model) return undefined;

  const loader = new DefaultResourceLoader({
    cwd: ctx.cwd,
    agentDir: getAgentDir(),
    systemPromptOverride: () => TITLE_PROMPT,
    extensionsOverride: (base) => ({ ...base, extensions: [] }),
  });
  await loader.reload();

  const { session } = await createAgentSession({
    cwd: ctx.cwd,
    resourceLoader: loader,
    model,
    thinkingLevel: "off",
    noTools: "all",
    sessionManager: SessionManager.inMemory(),
  });

  try {
    await session.prompt(prompt);
    const title = normalizeSessionTitle(session.getLastAssistantText() ?? "");
    if (title) {
      const elapsed = Math.round((performance.now() - start) / 100) / 10;
      ctx.ui.notify(`Session renommée : « ${title} » (${model.name ?? model.id}, ${elapsed}s)`, "info");
    }
    return title;
  } finally {
    session.abort();
  }
}

export default function registerAutoTitle(pi: ExtensionAPI): void {
  let attempted = false;

  pi.on("session_start", (_event, ctx) => {
    attempted = ctx.sessionManager.getEntries().some(
      (entry) => entry.type === "message" && entry.message.role === "user",
    );
  });

  pi.on("before_agent_start", (event, ctx) => {
    if (attempted || pi.getSessionName()) return;
    const prompt = event.prompt.trim();
    if (!prompt) return;
    attempted = true;

    // Le premier prompt ne doit jamais attendre la génération du titre.
    void generateTitle(prompt, ctx)
      .then((title) => {
        if (title && !pi.getSessionName()) pi.setSessionName(title);
      })
      .catch(() => {});
  });
}
