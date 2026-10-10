# NET Gestor

Aplicação para controlhe de provedor

## Como Rodar

### Pré-requisitos

- Docker e Docker Compose instalados.

### Passo a Passo

Na pasta do projeto, execute:

```bash
docker build -t net-gestor .
```

Depois, no PowerShell do Windows:

```bash
docker run -it --rm --name node-dev -p 3000:3000 -v "${PWD}:/app" net-gestor
```

Verificação 

```bash
node -v
npm -v
```