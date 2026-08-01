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
