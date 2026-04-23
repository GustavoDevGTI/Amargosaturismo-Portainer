# Deploy no Portainer

## Porta usada

Este projeto publica apenas uma porta:

- host: `13013`
- container: `80`

## Como subir

1. Abra o Portainer.
2. Vá em `Stacks`.
3. Clique em `Add stack`.
4. Escolha a opção de repositório Git.
5. Aponte para este repositório.
6. Use o arquivo `docker-compose.yml`.
7. Faça o deploy.

## Teste local no servidor

Depois do deploy, valide:

- `http://localhost:13013/`
- `http://localhost:13013/health`

O endpoint `/health` deve responder `ok`.

## Cloudflare Tunnel

Como o túnel `cloudflare-gti` já existe, basta apontar o hostname público para este serviço.

### Se o cloudflared roda na mesma máquina do Portainer

Use como serviço de origem:

- `http://localhost:13013`

### Se o cloudflared roda em outra máquina da rede

Use como serviço de origem:

- `http://IP_PRIVADO_DO_SERVIDOR:13013`

## Exemplo de ingress

```yaml
ingress:
  - hostname: turismo.seudominio.com
    service: http://localhost:13013
  - service: http_status:404
```

## Observações

- Não foi incluído um container `cloudflared` neste stack porque o túnel `cloudflare-gti` já está configurado por você.
- O site continua sendo estático, então a stack necessária é somente a do `nginx`.
