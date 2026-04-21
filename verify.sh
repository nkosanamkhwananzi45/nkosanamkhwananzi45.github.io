#!/usr/bin/env bash
# verify.sh — run after fix-lint.mjs to confirm clean lint

echo "Running ESLint..."
bun run lint

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ 0 errors, 0 warnings. Ready to commit!"
else
  echo ""
  echo "❌ Some issues remain. Check the output above."
  echo "   Common causes:"
  echo "   - TypeScript now flags 'unknown' where you previously accessed .property on 'any'"
  echo "     → add: (value as ExpectedType).property  OR  use a type guard"
  echo "   - A new import may conflict — check tailwind.config.ts top-level imports"
fi
