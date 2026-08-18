# Agent Skill Convention

## Skill Activation Rule (AD-15)

Every agent session that activates a skill **must** prepend the following tag to its first response:

```
🕶️ !! {skill-name}
```

Replace `{skill-name}` with the name of the activated skill.

### Applicable Skills

- `figma-generate-design`
- `vercel-react-best-practices`
- `bmad-quick-dev`
- `bmad-dev-story`
- `modern-web-guidance`
- `bmad-prd`
- `bmad-create-epics-and-stories`

This rule is enforced from the first commit per Architecture Decision AD-15.

## Documentation

Look up EmDash documentation via the `emdash-docs` MCP server when you need to
verify an API, hook, config option, or pattern. Prefer the docs MCP over
assumptions from training data -- the docs reflect the current published
behaviour.