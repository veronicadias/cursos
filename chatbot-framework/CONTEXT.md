# Chatbot Framework - Context

## Objetivo

Construir un framework de chatbots desacoplado, extensible y multicanal.

Debe permitir cambiar fácilmente:

- Proveedor de IA
- Canal de comunicación
- Base de datos
- Logger

sin modificar la lógica de negocio.

---

# Stack

- Node.js 22+
- Express
- PostgreSQL
- Prisma
- Docker
- Socket.io
- LangChain
- Ollama
- Winston
- Zod
- Vitest

---

# Arquitectura

Se utiliza una arquitectura basada en capas.

```
src
│
├── application
│   ├── services
│   └── usecases
│
├── config
│
├── container
│
├── domain
│   ├── ai
│   ├── entities
│   ├── logger
│   ├── repositories
│   └── value-objects
│
├── infrastructure
│   ├── ai
│   ├── database
│   ├── logger
│   └── repositories
│
├── interfaces
│   ├── http
│   ├── websocket
│   ├── whatsapp
│   └── telegram
│
└── shared
```

---

# Principios

## Dependency Injection

Las dependencias se crean únicamente desde el Container.

Nunca utilizar:

new Repository()

dentro de un UseCase o Service.

---

## Repository Pattern

Todo acceso a datos pasa por un Repository.

Nunca utilizar Prisma directamente desde:

- Controllers
- UseCases
- Services

---

## Controllers

Los controllers:

- reciben la request
- llaman al caso de uso
- devuelven la respuesta

No contienen lógica de negocio.

---

## Use Cases

Contienen una única responsabilidad.

Ejemplo:

CreateUserUseCase

FindUserUseCase

---

## Services

Orquestan varios casos de uso o repositorios.

Ejemplo:

ConversationOrchestrator

ConversationService

PromptService

---

## Domain

El dominio nunca conoce:

- Express
- Prisma
- Winston
- Socket.io
- LangChain

---

## Infrastructure

Implementa las interfaces del dominio.

Ejemplo

IUserRepository

↓

PrismaUserRepository

---

# Logging

Todo el proyecto utiliza ILogger.

Implementación actual:

WinstonLogger

Los logs utilizan:

- context
- event
- metadata

Ejemplo

```javascript
logger.info({

    event: EventNames.USER_CREATED,

    metadata:{

        userId

    }

});
```

---

# Validaciones

Todas las entradas deben validarse con Zod.

Nunca validar manualmente en Controllers.

---

# Errores

Todos los errores heredan de AppError.

Los controllers nunca utilizan try/catch.

Se utiliza:

asyncHandler

+

errorHandler

---

# Base de datos

ORM:

Prisma

Nunca utilizar consultas SQL directamente salvo casos especiales.

---

# IA

Toda IA implementa:

IAIProvider

Implementaciones futuras:

- OllamaProvider
- OpenAIProvider
- ClaudeProvider
- GrokProvider

Los servicios nunca conocen la implementación concreta.

---

# Chatbot

El corazón del framework será:

ConversationOrchestrator

Responsabilidades:

- buscar usuario
- crear usuario
- buscar conversación
- crear conversación
- guardar mensajes
- obtener prompt
- llamar a la IA
- guardar respuesta
- responder al canal

Los canales nunca llaman directamente a la IA.

---

# Canales

Todos implementarán el mismo flujo.

Ejemplo

WhatsApp

↓

ConversationOrchestrator

↓

Respuesta

Lo mismo para:

- Telegram
- WebSocket
- REST
- Web

---

# Convenciones

ES Modules

Nunca CommonJS.

---

Nombres de clases

PascalCase

Ejemplo

CreateUserUseCase

---

Archivos

camelCase para utilidades

PascalCase para clases

---

Nunca utilizar

console.log

Utilizar ILogger.

---

Nunca acceder directamente a process.env.

Utilizar ConfigService.

---

# Estado actual

Implementado

- Express
- ConfigService
- Docker
- PostgreSQL
- Prisma
- User
- Repository Pattern
- Dependency Injection
- Controllers
- UseCases
- Logger
- Validation
- ErrorHandler
- AsyncHandler

Pendiente

- Conversation
- Message
- Prompt
- AI Providers
- ConversationOrchestrator
- Socket.io
- WhatsApp
- Telegram
- Summary Service
- Memory