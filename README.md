# 📂 CRI 2.0
### Sistema de Gerenciamento de Documentos do Cartório de Registro de Imóveis

CRI 2.0 é uma aplicação web desenvolvida para facilitar o cadastro, localização, organização e acompanhamento de documentos internos do cartório.

O sistema utiliza Firebase Realtime Database para armazenamento dos dados em tempo real e foi desenvolvido utilizando HTML, CSS e JavaScript puro (Vanilla JS), priorizando simplicidade, organização e facilidade de manutenção.

---

# ✨ Funcionalidades

- Cadastro de documentos
- Edição de documentos
- Exclusão com confirmação
- Histórico completo de alterações
- Pesquisa instantânea
- Filtros por categoria
- Filtros por localização
- Paginação automática
- Estatísticas em tempo real
- Exportação para JSON
- Exportação para CSV
- Importação de backups
- Toasts de notificação
- Indicador de conexão Firebase
- Tela de carregamento
- Atalhos de teclado
- Validação em tempo real
- Identificador inteligente
- Migração automática de versões anteriores

---

# 🗂 Estrutura do Projeto

```
CRI 2.0
│
├── index.html
├── styles.css
│
├── assets/
│   ├── favicon/
│   ├── icons/
│   └── images/
│
├── css/
│   ├── variaveis.css
│   ├── base.css
│   ├── layout.css
│   ├── formulario.css
│   ├── cards.css
│   ├── modal.css
│   ├── loading.css
│   ├── stats.css
│   ├── toast.css
│   ├── conexao.css
│   ├── atalhos.css
│   ├── componentes.css
│   └── responsivo.css
│
└── js/
    ├── atalhos.js
    ├── cadastro.js
    ├── conexao.js
    ├── confirm.js
    ├── dom.js
    ├── editar.js
    ├── exportar.js
    ├── filtro.js
    ├── firebase.js
    ├── historico.js
    ├── id.js
    ├── importar.js
    ├── loading.js
    ├── main.js
    ├── migrar.js
    ├── paginacao.js
    ├── render.js
    ├── state.js
    ├── stats.js
    ├── toast.js
    ├── utils.js
    └── validacao.js
```

---

# 🛠 Tecnologias

- HTML5
- CSS3
- JavaScript ES Modules
- Firebase Realtime Database
- Firebase Hosting (opcional)

---

# 🔥 Firebase

O sistema utiliza o Firebase Realtime Database para armazenar:

- documentos
- histórico
- contador automático
- metadados

Todos os registros são sincronizados em tempo real.

---

# 📄 Estrutura dos Documentos

```json
{
  "key": 25,
  "tipoId": "Processo",
  "id": "125/2026",
  "tipo": "Registro",
  "descricao": "Lote 12 Quadra B",
  "local": "Arquivo",
  "horario": "...",
  "historico": []
}
```

---

# ⌨ Atalhos

| Atalho | Função |
|---------|--------|
| Enter | Registrar documento |
| Esc | Fechar modal |
| Ctrl + F | Pesquisa |
| Ctrl + N | Novo cadastro |
| Ctrl + S | Salvar edição |
| Ctrl + E | Exportar Backup |
| Ctrl + I | Importar Backup |
| Ctrl + P | Exportar CSV |

---

# 📦 Backup

O sistema permite:

- Exportar JSON completo
- Importar JSON
- Exportar CSV filtrado

---

# 🎨 Interface

A interface foi construída utilizando:

- CSS modularizado
- Variáveis globais
- Responsividade
- Glassmorphism
- Toasts
- Skeleton Loading

---

# 🚀 Próximas melhorias

- Login Autenticada
- Tema escuro
- Dashboard
- Estatísticas avançadas
- Busca avançada
- Etiquetas
- Favoritos
- Configurações
- Logs administrativos

---

# 👨‍💻 Autor

Marcivânio Izidio de Souza

Projeto desenvolvido para organização documental do Cartório de Registro de Imóveis.