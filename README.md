# 🚀 API de Utilitários Node.js

Uma API REST simples e prática construída com Node.js puro, sem dependências externas. Oferece 4 endpoints úteis para cálculos e conversões do dia a dia.

## 🔧 Requisitos

- Node.js versão 12 ou superior

## 📦 Instalação

1. Clone ou baixe o arquivo `api.js`
2. Não é necessário instalar dependências!

## 🚀 Como Usar

1. Execute o servidor:
```bash
node api.js
```

2. A API estará disponível em:
```
http://localhost:3000
```

3. Acesse a documentação:
```
http://localhost:3000/api
```

## 📡 Endpoints

### 1. Calculadora de IMC

Calcula o Índice de Massa Corporal e retorna a classificação.

**Endpoint:** `GET /api/imc`

**Parâmetros:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `peso` | number | Sim | Peso em quilogramas (0 < peso ≤ 1000) |
| `altura` | number | Sim | Altura em metros (0 < altura ≤ 3) |

**Exemplo de requisição:**
```
GET http://localhost:3000/api/imc?peso=70&altura=1.75
```

**Classificações:**
- Abaixo do peso: IMC < 18.5
- Peso normal: 18.5 ≤ IMC < 25
- Sobrepeso: 25 ≤ IMC < 30
- Obesidade Grau I: 30 ≤ IMC < 35
- Obesidade Grau II: 35 ≤ IMC < 40
- Obesidade Grau III: IMC ≥ 40

**Validações:**
- Peso e altura devem ser maiores que zero
- Altura não pode ser zero
- Peso máximo: 1000kg
- Altura máxima: 3m

---

### 2. Gerador de Senhas

Gera senhas aleatórias com configurações personalizáveis.

**Endpoint:** `GET /api/senha`

**Parâmetros:**
| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|-----------|------|-------------|--------|-----------|
| `tamanho` | number | Não | 12 | Tamanho da senha (4-50) |
| `especiais` | boolean | Não | true | Incluir caracteres especiais |

**Exemplo de requisição:**
```
GET http://localhost:3000/api/senha?tamanho=16&especiais=true
```

**Caracteres disponíveis:**
- Letras: a-z, A-Z
- Números: 0-9
- Especiais: !@#$%&*()_+-=[]{}|;:,.<>?

**Validações:**
- Tamanho deve ser um número inteiro entre 4 e 50

---

### 3. Analisador de Números

Ordena uma lista de números e fornece estatísticas.

**Endpoint:** `GET /api/numeros`

**Parâmetros:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `lista` | string | Sim | Números separados por vírgula (máx: 1000 números) |

**Exemplo de requisição:**
```
GET http://localhost:3000/api/numeros?lista=5,2,8,1,9,3
```

**Retorna:**
- Lista ordenada (crescente e decrescente)
- Quantidade de números
- Soma total
- Média
- Maior valor
- Menor valor

**Validações:**
- Entrada deve ser um array válido
- Máximo de 1000 números permitidos
- Números devem ser finitos e válidos
- Proteção contra overflow na soma

---

### 4. Conversor de Temperatura

Converte temperaturas entre Celsius, Fahrenheit e Kelvin.

**Endpoint:** `GET /api/temperatura`

**Parâmetros:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `valor` | number | Sim | Valor da temperatura |
| `de` | string | Sim | Escala de origem (C, F ou K) |
| `para` | string | Sim | Escala de destino (C, F ou K) |

**Exemplo de requisição:**
```
GET http://localhost:3000/api/temperatura?valor=25&de=C&para=F
```

**Escalas suportadas:**
- `C` - Celsius
- `F` - Fahrenheit
- `K` - Kelvin

**Validações:**
- Temperatura em Kelvin não pode ser negativa
- Temperatura não pode ser menor que zero absoluto (-273.15°C)
- Escalas devem ser C, F ou K
- Valor deve ser um número finito e válido

## 📊 Exemplos de Resposta

### Sucesso - IMC
```json
{
  "imc": "22.86",
  "classificacao": "Peso normal",
  "peso": 70,
  "altura": 1.75
}
```

### Sucesso - Senha
```json
{
  "senha": "aB3#xK9@mP2$qR5&",
  "tamanho": 16,
  "incluiEspeciais": true
}
```

### Sucesso - Análise de Números
```json
{
  "numerosOriginais": [5, 2, 8, 1, 9, 3],
  "ordenadoCrescente": [1, 2, 3, 5, 8, 9],
  "ordenadoDecrescente": [9, 8, 5, 3, 2, 1],
  "estatisticas": {
    "quantidade": 6,
    "soma": "28.00",
    "media": "4.67",
    "maior": 9,
    "menor": 1
  }
}
```

### Sucesso - Conversão de Temperatura
```json
{
  "valorOriginal": 25,
  "escalaOrigem": "C",
  "valorConvertido": "77.00",
  "escalaDestino": "F"
}
```

## ⚠️ Tratamento de Erros

A API retorna erros com códigos HTTP apropriados e mensagens descritivas:

### 400 - Bad Request

#### Erros de IMC
```json
{
  "erro": "Parâmetros peso e altura são obrigatórios"
}
```
```json
{
  "erro": "Peso e altura devem ser números válidos"
}
```
```json
{
  "erro": "Peso e altura devem ser maiores que zero"
}
```
```json
{
  "erro": "Altura não pode ser zero"
}
```
```json
{
  "erro": "Valores fora do intervalo realista (peso máx: 1000kg, altura máx: 3m)"
}
```
```json
{
  "erro": "Não foi possível calcular o IMC com os valores fornecidos"
}
```

#### Erros de Senha
```json
{
  "erro": "Tamanho deve ser um número válido"
}
```
```json
{
  "erro": "Tamanho deve estar entre 4 e 50 caracteres"
}
```
```json
{
  "erro": "Tamanho deve ser um número inteiro entre 4 e 50"
}
```

#### Erros de Análise de Números
```json
{
  "erro": "Forneça uma lista de números separados por vírgula"
}
```
```json
{
  "erro": "Lista deve ser uma string de números separados por vírgula"
}
```
```json
{
  "erro": "Entrada deve ser um array"
}
```
```json
{
  "erro": "Lista muito grande. Máximo de 1000 números permitidos"
}
```
```json
{
  "erro": "Nenhum número válido fornecido"
}
```
```json
{
  "erro": "Soma dos números resultou em overflow"
}
```

#### Erros de Conversão de Temperatura
```json
{
  "erro": "Forneça valor, escala de origem (de) e escala de destino (para)",
  "exemplo": "/api/temperatura?valor=25&de=C&para=F"
}
```
```json
{
  "erro": "Valor de temperatura inválido"
}
```
```json
{
  "erro": "Escalas de origem e destino são obrigatórias"
}
```
```json
{
  "erro": "Escala de origem inválida. Use C, F ou K"
}
```
```json
{
  "erro": "Escala de destino inválida. Use C, F ou K"
}
```
```json
{
  "erro": "Temperatura em Kelvin não pode ser negativa"
}
```
```json
{
  "erro": "Temperatura abaixo do zero absoluto (-273.15°C)"
}
```
```json
{
  "erro": "Resultado da conversão inválido"
}
```

### 404 - Not Found
```json
{
  "erro": "Endpoint não encontrado",
  "rotas_disponiveis": [
    "/",
    "/api/imc",
    "/api/senha",
    "/api/numeros",
    "/api/temperatura"
  ]
}
```

### 414 - URI Too Long
```json
{
  "erro": "URL muito longa"
}
```

### 500 - Internal Server Error
```json
{
  "erro": "Erro interno do servidor",
  "mensagem": "Ocorreu um erro inesperado ao processar sua requisição"
}
```
```json
{
  "erro": "Erro interno ao processar resposta"
}
```

## 🧪 Testando a API

Você pode testar a API usando:

### Navegador
Simplesmente cole as URLs no navegador:
```
http://localhost:3000/api/imc?peso=70&altura=1.75
```

### cURL
```bash
curl "http://localhost:3000/api/imc?peso=70&altura=1.75"
```

### Postman ou Insomnia
Importe as URLs e faça requisições GET.

### JavaScript (Fetch)
```javascript
fetch('http://localhost:3000/api/imc?peso=70&altura=1.75')
  .then(response => response.json())
  .then(data => console.log(data));
```

## 🔄 Alterando a Porta

Por padrão, a API roda na porta 3000. Para alterar, modifique a constante no código:

```javascript
const PORT = 3000; // Altere para a porta desejada
```

## 🛡️ Recursos de Segurança

A API implementa diversas proteções e validações:

- ✅ Validação de tipos de dados
- ✅ Proteção contra valores infinitos e NaN
- ✅ Limites de tamanho para prevenir overflow
- ✅ Proteção contra URLs muito longas (máx: 2048 caracteres)
- ✅ Tratamento global de exceções não capturadas
- ✅ Validação de ranges realistas para valores físicos
- ✅ Proteção contra divisão por zero

## 📝 Licença

Este projeto é de código aberto e está disponível para uso livre.