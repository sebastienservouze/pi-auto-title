# @nerisma/pi-auto-title

Extension [Pi](https://www.npmjs.com/package/@earendil-works/pi-coding-agent) qui renomme automatiquement une session depuis le premier prompt utilisateur.

Quand vous démarrez une session avec un message, l'extension génère un titre court (3 à 8 mots, en français) via le modèle le moins coûteux disponible, sans bloquer le démarrage de la session.

## Install

```bash
pi install npm:@nerisma/pi-auto-title
```

Rechargez Pi après l'installation :

```text
/reload
```

## Usage

Aucune configuration ni commande nécessaire. Lancez simplement une session avec un premier prompt. Le titre apparaît dès que le modèle répond, sans ralentir votre flux.

Une notification vous informe du résultat :

> Session renommée : « Réviser le pipeline CI » (Claude 3 Haiku, 1.2s)

### Sélection du modèle

L'extension choisit automatiquement le modèle le moins coûteux disponible parmi ceux que Pi a chargés (`modelRegistry.getAvailable()`). Le classement est le suivant :

1. **Coût de sortie** (`cost.output`) — le modèle le moins cher à l'output est préféré.
2. **Coût d'entrée** (`cost.input`) — en cas d'égalité, le moins cher à l'input.
3. **Non-raisonnement** — les modèles sans *reasoning* sont favorisés, car ils consomment moins de tokens cachés.

Si aucun modèle n'est disponible (aucun fournisseur configuré), le titre n'est pas généré — la session reste sans titre.

La session de titrage est isolée de votre session principale :

- `thinkingLevel: "off"` — pas de raisonnement coûteux.
- `noTools: "all"` — aucun outil n'est chargé, la requête part directement au LLM.
- `SessionManager.inMemory()` — aucune persistance, la session de titrage est jetable.
- `void generateTitle(...)` — le titrage est lancé en tâche de fond, sans `await` ni blocage.

### Prompt personnalisé

Vous pouvez surcharger le prompt utilisé pour générer le titre via la variable d'environnement `PI_AUTO_TITLE_PROMPT` :

```bash
export PI_AUTO_TITLE_PROMPT="Reply with a short title in English, max 5 words."
```

Le prompt par défaut demande un titre français de 3 à 8 mots, sans ponctuation, guillemets ni explication.

## Philosophie

Cette extension est délibérément minimale :

- **Pas de configuration** — zéro fichier de config, zéro commande à retenir, zéro option.
- **Pas de build** — les sources `.ts` sont livrées brutes. Pi les charge directement via jiti.
- **Pas de dépendance runtime** — juste une devDependency sur TypeScript pour le type checking.
- **Pas de blocage** — le titrage part en tâche de fond, `void` pour ne jamais ralentir votre session.
- **Pas de persistance** — la session de titrage est `inMemory()`, créée et jetée sans laisser de trace.
- **Pas d'abstraction** — `pickCheapestAvailableModel` fait 10 lignes, `normalizeSessionTitle` fait 15 lignes. Pas de classe, pas de stratégie interchangeable, pas de configuration superflue.

Un avertissement, une notification, un titre : c'est tout ce que fait l'extension. Si vous avez besoin de plus, vous avez peut-être besoin d'autre chose.

## Développement

```bash
npm test
npm run typecheck
```

## License

MIT
