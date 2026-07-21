Arcus 2.5
Especificação Funcional
Módulo Guarda Temporária

Versão: 2.0

1. Objetivo

O módulo Guarda Temporária tem como finalidade controlar documentos físicos que estejam temporariamente sob responsabilidade da serventia, garantindo rastreabilidade desde sua entrada até sua devolução.

O módulo não substitui o Controle de Documentos.

Seu papel é complementar esse módulo, registrando apenas informações referentes à guarda física do documento.

2. Princípios

O módulo deverá seguir os princípios arquiteturais do Arcus.

Reutilização

Sempre que um dado já existir em outro módulo, ele deverá ser reutilizado.

O sistema evitará duplicidade de informações.

Rastreabilidade

Toda ação realizada deverá gerar um histórico permanente.

Nenhuma movimentação importante poderá ocorrer sem registro.

Simplicidade

O usuário deverá preencher apenas informações que ainda não existam no sistema.

Auditoria

O histórico de uma Guarda nunca deverá ser perdido, mesmo após a devolução do documento.

3. Fluxo da Guarda
Documento cadastrado

↓

Documento entregue ao cartório

↓

Cadastro da Guarda Temporária

↓

Documento permanece sob responsabilidade da serventia

↓

Consultas

↓

Edição (quando necessário)

↓

Reimpressão da etiqueta (quando necessário)

↓

Devolução ao responsável

↓

Histórico permanente
4. Identificação

Cada Guarda receberá um identificador único.

Exemplo

GT1

GT2

GT3

A sequência será contínua.

Os identificadores nunca serão reutilizados.

5. Relação com Documentos

Uma Guarda sempre pertence a um Documento.

Documento

↓

Guarda

Nunca o contrário.

Um documento poderá possuir apenas uma Guarda ativa por vez.

6. Tipos de Guarda

Tipos disponíveis:

Escritura Original
Sobra de Documentos
Outros
Escritura Original

Documento original pertencente ao cliente que permanecerá sob responsabilidade da serventia até sua devolução.

Sobra de Documentos

Documentação remanescente vinculada a um protocolo.

Outros

Documentos físicos que permaneçam temporariamente na serventia, mas não pertençam a um protocolo formal.

Exemplos:

Pedido de Laudo Técnico;
Minutas;
Documentação administrativa.
7. Dados da Guarda
Importados automaticamente

Obtidos do módulo Documentos.

Documento
Processo
Protocolo
Tipo documental
Identificador
Data de cadastro

Esses campos não poderão ser alterados.

Informados pelo usuário
Tipo da Guarda
Observações
8. Estados

Uma Guarda poderá possuir apenas um estado.

Em Guarda

Documento permanece sob responsabilidade da serventia.

Devolvido

Documento entregue ao responsável.

O registro continuará existindo apenas para consulta e auditoria.

9. Cadastro

Fluxo.

Novo Registro

↓

Buscar Documento

↓

Documento localizado

↓

Dados carregados automaticamente

↓

Selecionar Tipo

↓

Observações

↓

Gerar etiqueta

↓

Salvar
10. Busca

Será possível localizar um documento por:

Processo
Protocolo
Documento
Identificador

O sistema detectará automaticamente o formato informado.

11. Etiqueta

A etiqueta será gerada automaticamente após o cadastro da Guarda Temporária e terá como finalidade facilitar a identificação e localização do documento físico.

Ela conterá as seguintes informações:

Código da Guarda (GT);
Código de Barras (Code 128);
Nome do responsável pelo documento;
Telefone do responsável;
Documento;
Processo ou Protocolo;
Tipo da Guarda.
Observações
O e-mail do responsável será armazenado no sistema, mas não será impresso na etiqueta, evitando a exposição desnecessária de dados pessoais.
O layout da etiqueta deverá ser simples, legível e adequado para impressão em etiquetas adesivas.
O QR Code ficará reservado para versões futuras (Arcus 3.0).

QR Code ficará reservado para versões futuras.

12. Histórico

Toda ação gerará um evento.

Exemplos:

Guarda criada
Guarda editada
Etiqueta reimpressa
Documento devolvido
Arquivo anexado

Cada evento armazenará:

data;
horário;
usuário (quando existir controle de usuários);
descrição da ação.
13. Devolução

Ao devolver um documento o sistema deverá:

alterar o status para Devolvido;
registrar data e hora;
registrar quem realizou a entrega;
registrar o recebedor (quando informado);
gerar um evento no histórico.

O registro nunca será apagado automaticamente.

14. Termo de Recebimento

O sistema permitirá anexar um Termo de Recebimento do Documento.

Esse termo poderá conter:

identificação da Guarda;
documento relacionado;
nome do recebedor;
data;
assinatura;
observações.

Arquivos aceitos:

PDF
JPG
PNG
WEBP

O arquivo permanecerá vinculado permanentemente ao registro.

15. Anexos

Cada Guarda poderá possuir anexos.

Exemplos:

Termo de Recebimento;
Foto do Documento;
Digitalização;
Documento Complementar.

Os anexos farão parte do histórico.

16. Estatísticas

Indicadores principais:

Total de Guardas
Em Guarda
Devolvidos
Escrituras Originais
Sobras de Documentos
Outros
17. Estrutura de Dados
Firebase Realtime Database
guardaTemporaria

    GT15

        documentoKey

        documentoId

        tipoGuarda

        status

        observacoes

        criadoEm

        devolvidoEm

        historico

        anexos
Firebase Storage
guardaTemporaria/

    GT15/

        termo-recebimento.pdf

        assinatura.jpg

        documento.jpg
18. Funcionalidades da versão 2.5
Núcleo
Cadastro
Consulta
Edição
Busca
Paginação
Filtros
Controle
Histórico
Reimpressão de etiquetas
Registro de devolução
Evidências
Upload de anexos
Termo de Recebimento
Fotos
Digitalizações
19. Roadmap
Fase 1 - Estrutura
Banco de dados
Geração do código GT
Cadastro
Listagem
Busca
Fase 2 - Operação
Edição
Filtros
Paginação
Etiquetas
Histórico
Fase 3 - Evidências
Upload de arquivos
Firebase Storage
Termo de Recebimento
Fotos
Visualizador de anexos
Fase 4 - Auditoria
Registro completo de ações
Controle de devolução
Linha do tempo do documento
Logs
Fase 5 - Arcus 3.0
QR Code
Scanner por câmera
Assinatura digital
Controle de usuários e permissões
Dashboard analítico
Pesquisa por código de barras
Relatórios em PDF
Integração entre módulos
Módulo de Evidências compartilhado entre todo o sistema