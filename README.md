# Amargosaturismo-Portainer

Clone do projeto `Amargosaturismo` preparado para deploy em servidor via Portainer.

## Objetivo

Este repositório foi ajustado para subir o site em container com `nginx` e publicar somente a porta `13013`, que será consumida externamente pelo seu túnel Cloudflare `cloudflare-gti`.

## Stack

- imagem base: `nginx:1.27-alpine`
- porta publicada no host: `13013`
- porta interna do container: `80`
- healthcheck: `GET /health`

## Arquivos principais

- `Dockerfile`: empacota apenas os arquivos públicos do site
- `docker-compose.yml`: stack pronta para Portainer usando a porta `13013`
- `nginx.conf`: entrega o site estático e expõe `/health`
- `PORTAINER.md`: passo a passo de deploy com Portainer e Cloudflare Tunnel

## Deploy rápido

1. No Portainer, crie um novo stack apontando para este repositório.
2. Use o arquivo `docker-compose.yml`.
3. Faça o deploy.
4. Valide localmente em `http://SEU_SERVIDOR:13013/`.
5. Aponte o túnel `cloudflare-gti` para `http://SEU_SERVIDOR:13013`.

## Observação

Se precisar trocar a porta no futuro, use outra livre entre `13014` e `13020`, mas esta cópia foi deixada pronta usando somente a `13013`.
