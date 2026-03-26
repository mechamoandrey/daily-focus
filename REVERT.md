# Voltar ao visual anterior

O estado **antes** deste redesign está guardado no Git:

```bash
git checkout before-redesign
```

Isso coloca o repositório em **detached HEAD** no commit da tag. Para trabalhar de novo em `master` com o código antigo:

```bash
git checkout master
git reset --hard before-redesign
```

Para **manter o redesign** e só inspecionar o antigo:

```bash
git show before-redesign:src/app/globals.css
```

Ou crie um branch de backup do atual antes de qualquer reset:

```bash
git branch backup-redesign-atual
```
