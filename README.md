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
| `peso` | number | Sim | Peso em quilogramas |
| `altura` | number | Sim | Altura em metros |

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

---

### 3. Analisador de Números

Ordena uma lista de números e fornece estatísticas.

**Endpoint:** `GET /api/numeros`

**Parâmetros:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `lista` | string | Sim | Números separados por vírgula |

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

A API retorna erros com códigos HTTP apropriados:

### 400 - Bad Request
```json
{
  "erro": "Parâmetros inválidos. Forneça peso e altura válidos."
}
```

### 404 - Not Found
```json
{
  "erro": "Endpoint não encontrado"
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

## 📝 Licença

Este projeto é de código aberto e está disponível para uso livre.

