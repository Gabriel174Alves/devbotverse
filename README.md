# Dev Bot Verse

Landing page da **Dev Bot Verse** — Agentes de IA para WhatsApp que atendem clientes e agendam horários automaticamente no Google Calendar, além de automação de processos (RPA).

🌐 Site: [devbotverse.com.br](https://devbotverse.com.br/)
🔗 Instagram: [@devbotverse](https://instagram.com/devbotverse)
💬 WhatsApp: [wa.me/5511974729278](https://wa.me/5511974729278)

## Sobre o projeto

Site institucional (landing page única) apresentando o produto principal — o Agente de IA para WhatsApp — e os serviços de automação de processos, voltado para negócios que vivem de agendamento (clínicas estéticas, consultórios odontológicos, petshops, salões, academias e outros).

Principais seções:

- Hero com mockup animado de uma conversa de WhatsApp
- A dor do cliente (demora no atendimento)
- Como funciona o agente
- Integração com Google Calendar (mockup animado do agendamento automático)
- Serviços (Agente de IA + RPA)
- Para quem é (nichos atendidos)
- Números/benefícios
- Perguntas frequentes
- Chamadas para ação que abrem o WhatsApp diretamente

## Stack

Site estático, sem build step:

- HTML5
- CSS3 (variáveis CSS, Grid e Flexbox, tema dark com acento verde/ciano neon)
- JavaScript vanilla (scroll suave, menu mobile, animações on-scroll)
- [Three.js](https://threejs.org/) via CDN (campo de estrelas animado no fundo)

## Estrutura

```
index.html      # marcação e conteúdo de todas as seções
css/style.css    # identidade visual e responsividade
js/script.js     # interatividade (menu, header, animações)
js/universe.js   # fundo de estrelas com Three.js
assets/logo.png  # logo da marca
```

## Rodando localmente

Não há dependências nem build. Basta servir os arquivos estáticos, por exemplo:

```bash
python -m http.server 8090
```

Depois acesse `http://localhost:8090` no navegador.

## Deploy

Por ser um site estático, pode ser hospedado em qualquer serviço de hospedagem estática (Vercel, Netlify, GitHub Pages, Cloudflare Pages etc.) apontando para a raiz do projeto. Hoje está hospedado na Netlify (deploy automático a partir da branch `main`), servido no domínio próprio [devbotverse.com.br](https://devbotverse.com.br/).
