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

## Développement

```bash
npm test
npm run typecheck
```

## License

MIT
