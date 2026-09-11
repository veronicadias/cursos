## Objetivos

Al finalizar tendrás un proyecto capaz de:

✅ Funcionar con Ollama completamente local y gratuito.
✅ Cambiar a OpenAI, Grok o cualquier otro modelo sin tocar la lógica del bot.
✅ Soportar WhatsApp, Telegram y WebChat.
✅ Persistir conversaciones.
✅ Recordar contexto mediante resúmenes.
✅ Ejecutar herramientas (crear turnos, consultar clientes, etc.).
✅ Tener prompts almacenados en la base de datos.
✅ Cambiar de base de datos mediante Repository Pattern.
✅ Estar preparado para Docker y Kubernetes.

## Fase 1 - Base del proyecto

chatbot-framework/

│
├── src/
│
├── application/
│   ├── services/
│   ├── usecases/
│   └── dto/
│
├── domain/
│   ├── entities/
│   ├── repositories/
│   ├── interfaces/
│   └── valueobjects/
│
├── infrastructure/
│   ├── database/
│   ├── repositories/
│   ├── ai/
│   │      ├── ollama/
│   │      ├── openai/
│   │      └── grok/
│   ├── whatsapp/
│   ├── telegram/
│   └── webchat/
│
├── prompt/
│
├── tools/
│
├── facade/
│
├── config/
│
├── routes/
│
├── tests/
│
├── app.js
│
└── package.json

## Fase 2 - Tecnologías

Yo usaría:

Node 22 LTS

Express

LangChain

Ollama

PostgreSQL

Prisma

JWT

Socket.io

Winston

Jest

Docker

Todo excepto OpenAI es gratuito.

## Fase 3 - Arquitectura

WhatsApp

↓

Webhook

↓

ChannelAdapter

↓

ConversationService

↓

LLMFacade

↓

ToolExecutor

↓

Repository

↓

Base de datos

## Capas
Presentation

↓

Application

↓

Domain

↓

Infrastructure

Nunca mezclaremos SQL con lógica del bot.

## Repository Pattern
ConversationRepository

save()

find()

update()

delete()

Implementaciones

PostgresConversationRepository

SqliteConversationRepository

MysqlConversationRepository

## IA
AIProvider

chat()

summary()

embeddings()

Implementaciones

OllamaProvider

OpenAIProvider

GrokProvider

Luego

AIFacade.chat()

y listo.

## Base de datos
### users
id

external_id

channel

name

created_at
### conversations
id

user_id

summary

status

created_at

updated_at
### messages
id

conversation_id

role

content

tokens

created_at
### prompts
id

name

content

model

temperature

active
### tools
id

name

description

enabled
### bot_config
id

default_model

max_tokens

temperature

summary_limit

## Flujo
Usuario

↓

WhatsApp

↓

ConversationService

↓

buscar conversación

↓

guardar mensaje

↓

cargar summary

↓

cargar últimos mensajes

↓

LLM

↓

Tool Calling

↓

Repository

↓

DB

↓

Respuesta

↓

guardar respuesta

↓

WhatsApp

## Memoria

En lugar de enviar 300 mensajes al modelo:

Summary

+

últimos 20 mensajes

El resumen se actualiza automáticamente.

## Prompt

En vez de escribir

const SYSTEM = "...";

Se obtiene desde la base:

PromptRepository.getSystemPrompt()

Así cambiar la personalidad es simplemente actualizar un registro.

## Herramientas

Cada herramienta será una clase.

CreateAppointmentTool

CancelAppointmentTool

FindClientTool

WeatherTool

Todas implementan

execute()

## Adaptadores

-Cada canal implementa la misma interfaz.

Channel

sendMessage()

receiveMessage()

typing()

media()

-Implementaciones

WhatsAppChannel

TelegramChannel

WebSocketChannel

## Configuración
.env
AI_PROVIDER=OLLAMA

OLLAMA_MODEL=qwen3

DB=postgres

SUMMARY_LIMIT=5000

Cambiar a OpenAI sería solo:

AI_PROVIDER=OPENAI

Nada más.

## Objetivo final
                +--------------------+
                | WhatsApp           |
                +--------------------+

                +--------------------+
                | Telegram           |
                +--------------------+

                +--------------------+
                | Web Chat           |
                +--------------------+

                         │
               Channel Adapter Layer
                         │
               Conversation Service
                         │
                  AI Facade Pattern
                         │
      ┌──────────────┬───────────────┐
      │              │               │
   Ollama        OpenAI           Grok
                         │
                 Tool Executor
                         │
      ┌──────────────┬───────────────┐
      │              │               │
 CreateTurno   BuscarCliente   ConsultarStock
                         │
                 Repository Layer
                         │
      ┌──────────────┬───────────────┐
      │              │               │
 PostgreSQL      MySQL         SQLite

## Cómo lo desarrollaría

En lugar de intentar construir todo de una vez, lo haría en iteraciones. En unas 10–12 etapas tendríamos un framework bastante completo:

Crear la estructura del proyecto.
Configurar Express, Prisma y PostgreSQL.
Implementar Repository Pattern.
Implementar la fachada de IA (Ollama primero).
Integrar LangChain.
Agregar memoria y resúmenes.
Implementar Tool Calling.
Agregar Telegram.
Agregar WhatsApp.
Incorporar autenticación, logs, pruebas y Docker.

Creo que esta forma de trabajar dará como resultado un proyecto mantenible y realmente reutilizable, no un ejemplo de demostración.

## Instalar
npm install express dotenv pg @prisma/client jsonwebtoken socket.io winston uuid cors helmet compression express-rate-limit zod
npm install langchain @langchain/core @langchain/community @langchain/ollama

### ¿Qué instala cada una?
Paquete	              Uso
express	              API REST
langchain	            Framework de IA
@langchain/core	      Componentes base de LangChain
<!-- @langchain/community	Integraciones adicionales NO SE INSTALA POR ERRORES-->
@langchain/ollama	    Conector para Ollama
dotenv	              Variables de entorno
pg	                  Cliente de PostgreSQL
@prisma/client	      Cliente generado por Prisma
jsonwebtoken	        JWT
socket.io	            Comunicación en tiempo real
winston	              Logging
uuid	                IDs únicos
cors	                Configuración CORS
helmet	              Cabeceras de seguridad
compression	          Compresión HTTP
express-rate-limit	  Limitación de solicitudes
zod	                  Validación de datos

## Paso 3 - Instalar dependencias de desarrollo
npm install -D prisma vitest supertest nodemon eslint prettier eslint-config-prettier eslint-plugin-import
### ¿Para qué sirven?
Paquete	                Uso
prisma	                CLI de Prisma
vitest	                Pruebas unitarias
supertest	              Pruebas de API
nodemon	                Recarga automática en desarrollo
eslint	                Análisis estático del código
prettier	              Formateo del código
eslint-config-prettier	Evita conflictos entre ESLint y Prettier
eslint-plugin-import	  Reglas para imports

## Paso 4 - Crear el archivo .env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/chatbot"
JWT_SECRET=TuSuperClave
AI_PROVIDER=OLLAMA
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen3
SUMMARY_LIMIT=5000

## Paso 5 - Inicializar Prisma
npx prisma init

Se crearán:

prisma/
    schema.prisma

.env

## Paso 6 - Configurar schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

Todavía no definiremos los modelos; primero dejaremos funcionando la infraestructura.

## Paso 7 - Scripts en package.json
{
  "scripts": {
    "dev": "nodemon src/app.js",
    "start": "node src/app.js",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "lint": "eslint src",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}

## Paso 8 - Crear src/app.js
import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "OK",
        message: "Chatbot Framework iniciado"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});

## Paso 9 - Configurar ESM

Como vamos a usar import/export, en package.json agrega:

{
  "type": "module"
}

Esto evitará mezclar CommonJS con ESM desde el principio.

## Paso 10 - Instalar Docker

Crea un archivo docker-compose.yml en la raíz:

services:
  postgres:
    image: postgres:17

    container_name: chatbot-postgres

    restart: always

    environment:
      POSTGRES_DB: chatbot
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres

    ports:
      - "5432:5432"

    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:

Levántalo con:

docker compose up -d

## Paso 11 - Instalar Ollama

Si aún no lo tienes:

Instala Ollama. Desde el sitio oficial.
Verificar que este funcionando, 1ero reiniciar visual studio code: 
ollama --version 
<!-- se ve ollama version 0.x.x -->
ollama list
Descarga un modelo, por ejemplo:
ollama pull qwen3:4b <!-- este es un modelo que usa 8 GB de ram y es recomendable para este proyecto-->
ollama pull llama3.2:3b

Verifica que responda:
ollama run qwen3:4b

.env
CHAT_MODEL=qwen3:4b
SUMMARY_MODEL=llama3.2:3b

De esta forma:
qwen3:4b atiende al usuario.
llama3.2:3b genera resúmenes de conversaciones de forma rápida y con menor consumo.

Esto reduce el tiempo de procesamiento cuando hay muchas conversaciones.

Organización que te recomiendo
Modelos instalados
✓ qwen3:4b        → Chat principal
✓ llama3.2:3b     → Resúmenes

Más adelante, cuando agreguemos la fachada de IA, podremos hacer algo como:

const chatProvider = AIFacade.getChatModel();
const summaryProvider = AIFacade.getSummaryModel();

Y ambos podrán ser Ollama, OpenAI, Grok o cualquier otro proveedor, sin cambiar el resto del código.

Próximo paso
Una vez que tengas descargado qwen3:4b, el siguiente paso será crear el primer módulo del framework:

Configuración (config/)
Servidor Express
Conexión a Ollama
Primera prueba con LangChain
Patrón Facade para que el chatbot ya no dependa directamente de Ollama desde el primer día.

Así empezaremos a construir la base sobre la que luego integraremos PostgreSQL, Prisma, memoria, herramientas y los distintos canales de comunicación.

## Mi recomendación

Ya que estamos empezando desde cero, te propondría añadir dos herramientas más desde el inicio:

pino (o pino-http) para logs de alto rendimiento. Si tu requisito es Winston, podemos mantener Winston y más adelante incorporar Pino si lo necesitas.
tsx para ejecutar el proyecto durante el desarrollo. Es más rápido y sencillo que Nodemon para proyectos ESM con Node.js modernos.

En el siguiente paso construiríamos la infraestructura base:

Configuración centralizada (config/).
Winston con rotación de archivos.
Cliente de Prisma.
Patrón Repository.
Fachada para Ollama.
Sistema de inyección de dependencias.

A partir de ahí, empezaríamos a implementar la lógica del chatbot sobre una base bien estructurada.

## Mi propuesta (más profesional)

Yo daría un paso más y usaría una clase ConfigService.

config/
<!-- al agregarse este archivo no es necesario los .config que estan en providers -->
ConfigService.js 

Toda la aplicación accedería a la configuración así:

ConfigService.get("database.url")

ConfigService.get("ai.provider")

ConfigService.get("jwt.secret")

Eso nos da varias ventajas:

Validar que las variables obligatorias existan al iniciar la aplicación.
Centralizar valores por defecto.
Facilitar pruebas unitarias (podemos simular configuraciones).
Cambiar el origen de la configuración (variables de entorno, archivos JSON, Vault, etc.) sin tocar el resto del código.
Mi recomendación

En lugar de seguir con archivos de configuración "planos", construiría desde ahora un ConfigService. Es un poco más de trabajo al principio, pero el framework quedará mucho más limpio y escalable. Es el enfoque que suele utilizarse en proyectos empresariales y encaja muy bien con la arquitectura que estamos diseñando.

## Seguimos con Prisma + PostgreSQL.
Perfecto. A partir de este punto empezamos a construir la capa de persistencia. Voy a hacer una pequeña diferencia respecto a cómo suele hacerse con Prisma, porque queremos un framework, no una aplicación.

La idea es que Prisma quede encapsulado. El resto del proyecto nunca debería importar PrismaClient directamente.

### Paso 1 - Instalar Prisma (hecho) 
Dependencias:
npm install @prisma/client
npm install -D prisma

### Paso 2 - Inicializar Prisma (hecho)
npx prisma init
Se crea:
prisma/
    schema.prisma

### Paso 3 - schema.prisma (hecho)
De momento solo configuramos la conexión.

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

### Paso 4 - Crear los modelos
Yo empezaría con cinco entidades.

User
model User {
  id          String   @id @default(uuid())
  externalId  String
  channel     String
  name        String?
  conversations Conversation[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

}

Conversation
model Conversation {
  id String @id @default(uuid())
  userId String
  summary String?
  status String @default("ACTIVE")
  user User @relation(fields: [userId], references: [id])
  messages Message[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

Message
model Message {
  id String @id @default(uuid())
  conversationId String
  role String
  content String
  tokens Int?
  conversation Conversation @relation(fields:[conversationId],references:[id])
  createdAt DateTime @default(now())
}

Prompt
model Prompt {
  id String @id @default(uuid())
  name String @unique
  content String
  active Boolean @default(true)
  createdAt DateTime @default(now())
}

BotConfig
model BotConfig {
  id String @id @default(uuid())
  defaultModel String
  temperature Float
  summaryLimit Int
}

### Paso 5 - Primera migración
npx prisma migrate dev --name init

Prisma va a:

Crear las tablas.
Generar el cliente.

### Paso 6 - Prisma Studio
npx prisma studio

Te abrirá un navegador.

Más adelante administraremos prompts desde ahí.

### Paso 7 - Crear la infraestructura

Aquí es donde quiero hacer algo distinto a los ejemplos de Prisma.

No quiero esto:

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;

Porque cualquier archivo podría usar Prisma directamente.

Yo haría esto.

src/

infrastructure/

    database/

        PrismaClient.js

PrismaClient.js
import { PrismaClient } from "@prisma/client";

class Database {

    constructor(){

        this.client = new PrismaClient();

    }

    getClient(){

        return this.client;

    }

}

export default new Database();

Luego los repositorios harán:

import database from "../database/PrismaClient.js";

const prisma = database.getClient();

Así, si un día decides cambiar Prisma por otro ORM, solo tendrás que modificar esta capa.

Lo que haría aún mejor

Aquí es donde empezaría a aplicar Dependency Injection.

En lugar de que los repositorios creen o importen el cliente directamente, lo recibirán por el constructor.

Por ejemplo:

class UserRepository {

    constructor(database){

        this.db = database;

    }

}

Así mañana podríamos tener:

Prisma.
TypeORM.
Sequelize.
MongoDB.

Sin cambiar los casos de uso.

### Mi recomendación
Antes de escribir un solo repositorio, construyamos una infraestructura de base de datos desacoplada. Nos llevará unos minutos más ahora, pero hará que todo el framework (Repository Pattern, Tool Calling y servicios) quede realmente independiente de Prisma, que era uno de tus objetivos iniciales.


Excelente, eso me confirma que estás usando Prisma 7, que cambió bastante respecto a Prisma 5 y 6.

Las guías que encuentras por Internet (y las que te di inicialmente) son para Prisma 5/6. En Prisma 7 la configuración cambió y ahora se usa prisma.config.ts.

Mi recomendación

No usaría Prisma 7 para este proyecto.

No porque sea malo, sino porque:

Está recién salido.
Muchísimas guías y ejemplos todavía usan Prisma 5/6.
Vamos a integrar LangChain, Repository Pattern, Docker, PostgreSQL, etc., y no quiero que estemos peleando con cambios de una versión tan nueva.

Para un proyecto serio prefiero una versión muy estable.

Lo que haría

Desinstalar Prisma 7:

npm uninstall prisma @prisma/client

Instalar una versión estable (la última de la rama 6):

npm install @prisma/client@6
npm install -D prisma@6

Luego:

npx prisma init

Y volverás a tener el esquema clásico:

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

que funciona perfectamente y tiene una enorme cantidad de documentación.

¿Por qué te recomiendo esto?

Vamos a construir:

Repository Pattern
Facade
Tool Calling
Memoria
Resúmenes
WhatsApp
Telegram
Docker
PostgreSQL

No quiero que además tengamos que adaptar cada paso a los cambios recientes de Prisma 7.

Mi propuesta para todo el stack

Aprovechando que recién empezamos, dejaría versiones estables y bien soportadas:

Tecnología	Versión recomendada
Node	22 LTS ✅
Express	5.x
Prisma	6.x
PostgreSQL	17
LangChain	1.x
Ollama	Última estable
Vitest	Última estable
tsx	Última estable

Con esta combinación tendremos una base mucho más predecible para seguir desarrollando el framework.

Mi consejo es que hagamos ese cambio ahora, antes de crear migraciones o escribir repositorios. Nos evitará muchos dolores de cabeza durante el resto del proyecto.

Antes de crear los modelos

Aquí quiero hacer una pausa de diseño (porque todavía estamos a tiempo de hacerlo bien).

En vez de empezar con User, Conversation y Message, prefiero diseñar primero el modelo de dominio del chatbot.

Entidades que creo que necesitaremos
User
│
├── Conversation
│      │
│      └── Message
│
├── Channel
│
├── Prompt
│
├── Tool
│
├── BotConfiguration
│
└── ModelConfiguration

¿Por qué agregar Channel y ModelConfiguration desde el principio?

Porque uno de tus requisitos fue:

WhatsApp
Telegram
WebChat
Cambiar entre Ollama, OpenAI, Grok sin afectar al bot

Si modelamos eso desde el inicio, después no tendremos que modificar la estructura de la base.

Mi propuesta

En lugar de crear las tablas una por una, diseñemos el esquema completo del framework.

Tendríamos aproximadamente 7 u 8 modelos, y una vez que estemos conformes ejecutaremos una sola migración inicial (init).

Eso nos dará una base de datos mucho más limpia y evitará hacer varias migraciones seguidas mientras seguimos desarrollando.

Creo que es el mejor momento para invertir un poco en el diseño, ya que todavía no hay datos ni código que dependan del esquema.

# Este es uno de los pasos más importantes del proyecto. Si diseñamos bien la base de datos ahora, después todo (LangChain, Repository Pattern, memoria, WhatsApp, Telegram, etc.) será mucho más sencillo.

# ¿Qué queremos almacenar?

Según tus requisitos, el chatbot debe poder:

Reconocer usuarios.
Mantener conversaciones.
Guardar mensajes.
Tener múltiples canales (WhatsApp, Telegram, etc.).
Cambiar de modelo de IA.
Guardar prompts en la base.
Crear registros (ej. turnos) mediante herramientas.
Resumir conversaciones.
Cambiar la personalidad del bot.

Con eso en mente, propondría este modelo.

## Modelo de datos
Channel
    │
    └──── User
              │
              └──── Conversation
                         │
                         ├──── Message
                         │
                         └──── Summary

y además

BotConfiguration

Prompt

AIModel

Tool
1. Channel

No queremos guardar simplemente "whatsapp" en un string.

model Channel {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  users User[]
  createdAt DateTime @default(now())

}

Ejemplos:

id	name
1	WHATSAPP
2	TELEGRAM
3	WEBCHAT
2. User
model User {
  id String @id @default(uuid())
  externalId String
  name String?
  channelId String
  channel Channel @relation(fields:[channelId], references:[id])
  conversations Conversation[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@unique([externalId, channelId])
}

¿Por qué la restricción @@unique?

Porque un mismo número de teléfono puede existir en distintos canales, pero no repetirse dentro del mismo canal.

3. Conversation
model Conversation {
  id String @id @default(uuid())
  userId String
  status ConversationStatus @default(ACTIVE)
  summary String?
  lastSummaryAt DateTime?
  user User @relation(fields:[userId], references:[id])
  messages Message[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

4. Message
model Message {
  id String @id @default(uuid())
  conversationId String
  role MessageRole
  content String
  tokens Int?
  conversation Conversation @relation(fields:[conversationId], references:[id])
  createdAt DateTime @default(now())
}

5. Prompt

Aquí guardaremos la personalidad.

model Prompt {
  id String @id @default(uuid())
  name String @unique
  description String?
  content String
  active Boolean @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

Ejemplos:

name
SYSTEM
SUMMARY
TOOLS
6. AIModel

Como quieres poder cambiar entre Ollama, OpenAI y Grok.

model AIModel {
  id String @id @default(uuid())
  provider String
  model String
  temperature Float
  active Boolean @default(true)
}

Ejemplos

provider	model
OLLAMA	qwen3:4b
OPENAI	gpt-5
GROK	grok-4
7. BotConfiguration

Configuración general.

model BotConfiguration {
  id String @id @default(uuid())
  summaryLimit Int
  defaultPromptId String?
  defaultModelId String?
}

8. Tool

Para registrar las herramientas.

model Tool {
  id String @id @default(uuid())
  name String @unique
  description String
  enabled Boolean @default(true)
}

Enums

En vez de usar strings para los estados y roles, usaría enums.

enum ConversationStatus {
  ACTIVE
  CLOSED
  ARCHIVED
}

enum MessageRole {
  SYSTEM
  USER
  ASSISTANT
  TOOL
}

¿Y los turnos?
No los pondría en el framework.
¿Por qué?
Porque el framework debe ser genérico.
Hoy será:
Turno
Mañana puede ser:
Factura o Pedido o Reserva

Los turnos pertenecen a la aplicación que use el framework, no al framework en sí.

Arquitectura final
Framework

├── Usuarios
├── Canales
├── Conversaciones
├── Mensajes
├── Prompts
├── IA
├── Herramientas
└── Configuración

La aplicación del cliente agrega:

Hospital
Turnos
Pacientes
Médicos
o
Empresa
Clientes
Facturas
Pedidos
sin modificar el framework.

Un cambio que haría

Hay un aspecto que cambiaría respecto a la propuesta inicial: no almacenaría el resumen (summary) directamente en Conversation.

Crearía una entidad independiente:

model ConversationSummary {
  id             String   @id @default(uuid())
  conversationId String   @unique
  content        String
  model          String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  conversation Conversation @relation(fields: [conversationId], references: [id])
}
¿Por qué?
Permite guardar metadatos (modelo utilizado, fecha de actualización, versión del resumen).
Si mañana quieres cambiar la estrategia de resumen o almacenar más información, no tendrás que modificar Conversation.
Mantiene una separación clara de responsabilidades.

Creo que esta estructura es más flexible y encaja mejor con un framework pensado para crecer y soportar distintos casos de uso.

# Docker
Al no tener una base de datos postgresql No tiene sentido seguir con Prisma hasta tener la base de datos funcionando.

Mi recomendación: usar Docker

Como este proyecto va a ser un framework y además vas a usar:

PostgreSQL
Ollama
(posiblemente Redis más adelante)
Docker

te recomiendo usar PostgreSQL dentro de Docker, no instalarlo en Windows.

Ventajas:

✅ No ensucia Windows.
✅ Puedes borrar y recrear la base cuando quieras.
✅ Todo el equipo tendrá el mismo entorno.
✅ En producción también usarás contenedores.

## Paso 1 - Verificar Docker
Ejecuta:
docker --version
y
docker compose version

Si ambos funcionan, seguimos.

# Paso 2 - Crear docker-compose.yml
En la raíz del proyecto (junto a package.json):

chatbot-framework/
│
├── docker-compose.yml
├── package.json
├── .env
└── src/

Contenido:

services:
  postgres:
    image: postgres:17

    container_name: chatbot-postgres

    restart: unless-stopped

    environment:
      POSTGRES_USER: chatbot
      POSTGRES_PASSWORD: chatbot123
      POSTGRES_DB: chatbot_db

    ports:
      - "5432:5432"

    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:

## Paso 3 - Levantar PostgreSQL
docker compose up -d

Verifica:

docker ps

Deberías ver un contenedor llamado:

chatbot-postgres

## Paso 4 - Configurar .env
DATABASE_URL="postgresql://chatbot:chatbot123@localhost:5432/chatbot_db"

DB_PROVIDER=postgres

PORT=3000

NODE_ENV=development

JWT_SECRET=MiClaveSuperSegura

AI_PROVIDER=OLLAMA

OLLAMA_URL=http://localhost:11434

OLLAMA_MODEL=qwen3:4b

SUMMARY_LIMIT=5000

LOG_LEVEL=info

## Paso 5 - Crear las tablas

Ahora sí:

npx prisma migrate dev --name init
Mi propuesta para el proyecto

Aprovechando que vamos a usar Docker, yo no levantaría solo PostgreSQL.

Prepararía el docker-compose.yml para crecer con el proyecto:

Docker

├── PostgreSQL
├── pgAdmin
├── Redis (más adelante)
└── Ollama (opcional más adelante)

Con pgAdmin tendrás una interfaz web para ver las tablas, ejecutar consultas SQL y administrar la base sin instalar herramientas adicionales.

Lo haría desde el principio así:
┌─────────────────────┐
│ Chatbot Framework   │
└──────────┬──────────┘
           │
     localhost:3000
           │
    ┌──────┴──────┐
    │             │
 PostgreSQL    Ollama
    │
 pgAdmin

Creo que esa será una base mucho más cómoda para el resto del desarrollo.

Antes de seguir

¿Ya tienes Docker Desktop instalado y funcionando? Si me dices que sí, armamos un docker-compose.yml completo con PostgreSQL + pgAdmin y en menos de 5 minutos tendrás la base lista para trabajar.

## Paso siguiente: verificar que están corriendo

Ejecuta:
docker ps

Deberías ver algo como:

chatbot-postgres
chatbot-pgadmin

## Paso siguiente: probar acceso
1. PostgreSQL está listo en:
localhost:5432

Con:

user: chatbot
password: chatbot123
database: chatbot_db

2. pgAdmin
Abrí en el navegador:
http://localhost:5050

Login:

admin@chatbot.com
admin123
### Error 
FATAL: invalid value for parameter "TimeZone": "America/Buenos_Aires"
Solución 1: Modificar el archivo dbeaver.ini (La más efectiva)Esta solución obliga a la aplicación completa a usar el formato compatible.Cierra DBeaver por completo.Ve a la carpeta donde está instalado DBeaver en tu computadora:Windows: C:\Program Files\DBeaver\ (o C:\Users\TU_USUARIO\AppData\Local\DBeaver\)Mac: Haz clic derecho sobre la app de DBeaver en Aplicaciones -> Mostrar contenido del paquete -> Contents/Eclipse/Linux: /usr/share/dbeaver/ o la ruta de tu paquete.Abre el archivo dbeaver.ini con un editor de texto (como Bloc de notas en modo administrador).Ve al final del archivo, busca la sección que empieza con -vmargs y añade la siguiente línea justo debajo:text-Duser.timezone=America/Argentina/Buenos_Aires
Usa el código con precaución.Guarda el archivo y vuelve a abrir DBeaver
C:\Program Files\DBeaver
(Si tu Windows está en español estricto, puede figurar como C:\Archivos de programa\DBeaver).  
Busca el archivo dbeaver.ini (a veces se ve solo como dbeaver y su tipo dice Opciones de configuración o tiene el ícono de una tuerca/bloc de notas).  
⚠️ Muy Importante: Cómo pegarlo para que funcioneUna vez que lo encuentres y lo abras con el Bloc de notas, no lo pegues en cualquier lado. Los comandos en DBeaver tienen un orden estricto:
Busca una línea que dice -vmargs. 
Agrega la instrucción justo abajo de -vmargs (en un renglón limpio).  
Para asegurar la compatibilidad con PostgreSQL, escribe esto exactamente:  
-Duser.timezone=America/Argentina/Buenos_Aires
(Nota: Ponemos /Argentina/ en el medio. PostgreSQL eliminó el alias corto en actualizaciones recientes, por lo que si le envías solo America/Buenos_Aires, te va a seguir tirando el error FATAL. Con el nombre largo se soluciona).  Guarda el archivo, cierra DBeaver por completo (asegúrate de que no quede minimizado en la barra de tareas) y vuélvelo a abrir. ¡Con esto tiene que conectar sí o sí!

## Paso siguiente: conectar Prisma

Ahora sí ejecutamos la migración:

npx prisma migrate dev --name init

Esto va a:

Crear todas las tablas del modelo que definimos
Generar el Prisma Client
Conectar a PostgreSQL dentro de Docker
Si todo sale bien verás:
✔ Created database
✔ Migration applied
✔ Generated Prisma Client
Importante (muy buena noticia)

Ya tenés listo el stack base del framework:

Node.js 22
Express
Prisma 6
PostgreSQL en Docker
pgAdmin
WSL2
Ollama (ya lo tenías)

Esto ya es una arquitectura profesional lista para escalar.

Siguiente paso (cuando migre bien)

Vamos a construir:

🧱 Infrastructure Layer
Repository Pattern (UserRepository, ConversationRepository)
BaseRepository genérico
Prisma encapsulado
Inyección de dependencias
🤖 AI Layer
Facade (Ollama / OpenAI / Grok)
LangChain integrado
Prompt manager desde DB
Antes de seguir

Ejecuta esto y pégame el resultado:

docker ps

y después:

npx prisma migrate dev --name init
#### Error
npx prisma migrate dev --name init 
Loaded Prisma config from prisma.config.ts. Prisma config detected, skipping environment variable loading. Prisma schema loaded from prisma\schema.prisma Datasource "db": PostgreSQL database "postgres", schema "public" at "localhost:51213" Error: P1001 Can't reach database server at localhost:51214 Please make sure your database server is running at localhost:51214


¡Bien! Este error ya no tiene nada que ver con DBeaver. Ahora estamos con Prisma.

Hay un detalle muy importante en el mensaje:

Datasource "db": PostgreSQL database "postgres", schema "public" at "localhost:51213"

y luego:

Can't reach database server at `localhost:51214`

😕 Está intentando usar dos puertos distintos (51213 y 51214). Eso no debería ocurrir.

Lo primero que quiero revisar
1. Muéstrame tu archivo .env

Solo la parte de la conexión (puedes ocultar la contraseña si quieres):

DATABASE_URL=...
2. Muéstrame tu prisma.config.ts

Ese archivo es muy importante. En Prisma 6 normalmente no es necesario, así que quiero ver si está sobrescribiendo la conexión.

3. Ejecuta:
docker ps

Quiero ver qué puerto está exponiendo realmente PostgreSQL.

Debería verse algo como:

0.0.0.0:5432->5432/tcp

Si aparece 51213->5432 o 51214->5432, eso explica el problema.

4. Ejecuta también:
docker compose ps
Mi sospecha

Como antes usabas Prisma 7, es muy posible que haya quedado un prisma.config.ts generado por esa versión y esté interfiriendo con Prisma 6.

En Prisma 6 no deberías necesitar un prisma.config.ts para un proyecto normal.

Pásame estos cuatro elementos:
📄 prisma.config.ts
📄 La línea DATABASE_URL de tu .env
📋 Salida de docker ps
📋 Salida de docker compose ps

Con eso encontramos el problema rápidamente.

pedido 1

DATABASE_URL="prisma+postgres://localhost:51213/?api_key= 

pedido 2

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});

pedido 3 
docker ps
CONTAINER ID   IMAGE            COMMAND                  CREATED             STATUS                       PORTS                                         NAMES
ad966ca4fe7c   dpage/pgadmin4   "/entrypoint.sh"         About an hour ago   Up About an hour             0.0.0.0:5050->80/tcp, [::]:5050->80/tcp       chatbot-pgadmin
b8e356ace7ce   postgres:17      "docker-entrypoint.s…"   About an hour ago   Up About an hour (healthy)   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp   chatbot-postgres

pedido 4
docker compose ps
NAME               IMAGE            COMMAND                  SERVICE    CREATED             STATUS                       PORTS
chatbot-pgadmin    dpage/pgadmin4   "/entrypoint.sh"         pgadmin    About an hour ago   Up About an hour             0.0.0.0:5050->80/tcp, [::]:5050->80/tcp
chatbot-postgres   postgres:17      "docker-entrypoint.s…"   postgres   About an hour ago   Up About an hour (healthy)   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp

¡Ya encontré el problema! 🎯

El error no está en Docker, ni en PostgreSQL, ni en Prisma.

Está en tu .env.

Tú tienes:

DATABASE_URL="prisma+postgres://localhost:51213/?api_key=...

Esa NO es una cadena de conexión a PostgreSQL. Es una URL de Prisma Postgres (el servicio en la nube de Prisma), que utiliza puertos aleatorios como 51213 y 51214.

Pero tú estás usando PostgreSQL local en Docker, cuya conexión correcta es la del contenedor:

localhost:5432
Solución

Reemplaza completamente esa línea por:

DATABASE_URL="postgresql://chatbot:chatbot123@localhost:5432/chatbot_db?schema=public"

donde:

Usuario: chatbot
Contraseña: chatbot123
Host: localhost
Puerto: 5432
Base de datos: chatbot_db

(Asumiendo que son los mismos valores que pusimos en docker-compose.yml.)

Segundo paso

Tu prisma.config.ts está bien:

datasource: {
  url: env("DATABASE_URL"),
}

No hace falta cambiarlo.

Tercer paso

Después de guardar el .env, ejecuta:

npx prisma validate

Debería decir:

The schema at prisma/schema.prisma is valid

Luego:

npx prisma migrate dev --name init
Si vuelve a fallar

Ejecuta:

docker exec -it chatbot-postgres psql -U chatbot -d chatbot_db

Si entra al cliente psql, la base está funcionando y el problema será únicamente de configuración.

💡 Una observación importante: esa URL prisma+postgres://... no aparece por casualidad. Seguramente al principio inicializaste el proyecto con Prisma 7 o usando Prisma Postgres, y quedó esa configuración en el .env. Como luego bajamos a Prisma 6 y estamos usando PostgreSQL en Docker, esa URL ya no sirve y hay que reemplazarla por la conexión estándar postgresql://....

Haz ese cambio y vuelve a ejecutar npx prisma migrate dev --name init. Si aparece otro error, pégamelo completo y lo resolvemos.

# Arquitectura que vamos a implementar

Quiero que usemos una mezcla de Clean Architecture + Hexagonal + DDD ligero.

src/
│
├── application/          # Casos de uso
│
├── config/
│
├── domain/
│   ├── entities/
│   ├── repositories/
│   └── services/
│
├── infrastructure/
│   ├── ai/
│   ├── database/
│   ├── logger/
│   └── repositories/
│
├── interfaces/
│   ├── http/
│   ├── socket/
│   └── channels/
│
└── shared/
¿Por qué así?

La regla será:

Domain
   ↑
Application
   ↑
Infrastructure
   ↑
Interfaces

Nunca al revés.

Por ejemplo:

Express
     ↓
Controller
     ↓
UseCase
     ↓
Repository Interface
     ↓
Prisma Repository
     ↓
PostgreSQL

El dominio nunca conocerá Prisma.

## Paso 1

Dentro de src/infrastructure crea:

database/

Database.js

PrismaDatabase.js
Database.js

Será una interfaz abstracta.

export default class Database {

    connect() {
        throw new Error("connect() not implemented");
    }

    disconnect() {
        throw new Error("disconnect() not implemented");
    }

    getClient() {
        throw new Error("getClient() not implemented");
    }

}
PrismaDatabase.js
import { PrismaClient } from "@prisma/client";
import Database from "./Database.js";

class PrismaDatabase extends Database {

    constructor() {
        super();

        this.client = new PrismaClient();
    }

    async connect() {
        await this.client.$connect();
    }

    async disconnect() {
        await this.client.$disconnect();
    }

    getClient() {
        return this.client;
    }

}

export default new PrismaDatabase();
## Paso 2

En bootstrap.js

import database from "./infrastructure/database/PrismaDatabase.js";

export default async function bootstrap() {

    await database.connect();

    console.log("✅ PostgreSQL conectado");

}

En app.js

import express from "express";
import bootstrap from "./bootstrap.js";
import config from "./config/index.js";

await bootstrap();

const app = express();

app.listen(config.server.port, () => {

    console.log(`Servidor iniciado en ${config.server.port}`);

});
¿Por qué un bootstrap?

Porque mañana también conectaremos:

PostgreSQL
Ollama
Redis
RabbitMQ
Socket.IO
Scheduler

Todo en un solo lugar.

## Paso 3

Ahora empieza el Repository Pattern.

Crea:

src/

domain/

repositories/

Y dentro:

IUserRepository.js

IConversationRepository.js

IMessageRepository.js

Sí.

Con I.

Aunque JavaScript no tenga interfaces.

IUserRepository
export default class IUserRepository {

    findById() {
        throw new Error("Not implemented");
    }

    findByExternalId() {
        throw new Error("Not implemented");
    }

    create() {
        throw new Error("Not implemented");
    }

    update() {
        throw new Error("Not implemented");
    }

}

¿Por qué?

Porque la aplicación dependerá de esta interfaz.

Nunca de Prisma.

Paso 4

Ahora sí.

Creamos:

src/

infrastructure/

repositories/

Prisma/

Dentro:

PrismaUserRepository.js
PrismaUserRepository
import IUserRepository from "../../../domain/repositories/IUserRepository.js";
import database from "../../database/PrismaDatabase.js";

class PrismaUserRepository extends IUserRepository {

    constructor() {
        super();
        this.prisma = database.getClient();
    }

    async findById(id) {
        return this.prisma.user.findUnique({
            where: { id }
        });
    }

    async findByExternalId(externalId, channelId) {

        return this.prisma.user.findFirst({

            where: {

                externalId,

                channelId

            }

        });

    }

    async create(data) {

        return this.prisma.user.create({

            data

        });

    }

    async update(id, data) {

        return this.prisma.user.update({

            where: { id },

            data

        });

    }

}

export default PrismaUserRepository;
¿Por qué no exportar una instancia?

Porque después usaremos Dependency Injection.

Queremos hacer:

const repository = new PrismaUserRepository(database);

No:

import repository from ...
Lo que haría aún mejor

Aquí introduciría un BaseRepository.

Porque todos los repositorios tendrán métodos como:

findById
findAll
create
update
delete

En lugar de repetir ese código en UserRepository, ConversationRepository, PromptRepository, etc., crearemos un repositorio genérico y los específicos solo implementarán la lógica propia de cada entidad.

Mi propuesta

En el siguiente paso construiremos este núcleo:

BaseRepository
        ▲
        │
PrismaBaseRepository
        ▲
        │
UserRepository
ConversationRepository
MessageRepository
PromptRepository

Con esa estructura eliminaremos muchísimo código duplicado y el framework quedará preparado para soportar otros motores de base de datos en el futuro sin cambiar la lógica de negocio.

Muy buena observación. De hecho, aquí es donde conviene pensar como si estuviéramos construyendo un framework, no una aplicación puntual.

Mi recomendación es no implementarlos todavía. Vamos a definir primero las interfaces y solo implementaremos los repositorios cuando los necesitemos. Así evitamos crear código que luego cambie.

1. IConversationRepository.js

La conversación es el eje central del chatbot, así que su interfaz podría ser:

export default class IConversationRepository {

    async findById(id) {
        throw new Error("Not implemented");
    }

    async findActiveByUser(userId) {
        throw new Error("Not implemented");
    }

    async create(data) {
        throw new Error("Not implemented");
    }

    async update(id, data) {
        throw new Error("Not implemented");
    }

    async updateSummary(id, summary) {
        throw new Error("Not implemented");
    }

    async close(id) {
        throw new Error("Not implemented");
    }

}

Observa que updateSummary() está pensado para el resumidor que implementaremos más adelante.

2. IMessageRepository.js

Los mensajes tienen necesidades diferentes:

export default class IMessageRepository {

    async findByConversation(conversationId) {
        throw new Error("Not implemented");
    }

    async create(data) {
        throw new Error("Not implemented");
    }

    async findLastMessages(conversationId, limit = 20) {
        throw new Error("Not implemented");
    }

    async deleteByConversation(conversationId) {
        throw new Error("Not implemented");
    }

}

Aquí ya aparece findLastMessages(), que será muy útil para enviar el contexto al LLM sin cargar toda la conversación.

Pero hay algo que cambiaría en la arquitectura

Después de hacer muchos proyectos con Repository Pattern, aprendí que no me gusta tener una interfaz por repositorio si el 90 % de los métodos son iguales.

Yo haría esto:

domain/
    repositories/
        IRepository.js
        IUserRepository.js
        IConversationRepository.js
        IMessageRepository.js

Donde IRepository define el CRUD común:

findById()

findAll()

create()

update()

delete()

Y cada repositorio especializado solo agrega sus métodos propios.

Por ejemplo:

export default class IUserRepository extends IRepository {

    async findByExternalId() {
        throw new Error("Not implemented");
    }

}

Y IConversationRepository:

export default class IConversationRepository extends IRepository {

    async findActiveByUser() {
        throw new Error("Not implemented");
    }

    async updateSummary() {
        throw new Error("Not implemented");
    }

}

Así evitas repetir cinco métodos en cada interfaz.

Incluso iría un paso más allá

Como este proyecto pretende ser un framework, implementaría una jerarquía así:

IRepository
        ▲
        │
PrismaRepository
        ▲
        │
UserRepository
ConversationRepository
MessageRepository
PromptRepository
ChannelRepository
AppointmentRepository

De esta forma, cuando agregues otra entidad (por ejemplo Appointment para turnos), probablemente solo tengas que escribir los métodos específicos de esa entidad y reutilizar el resto.

Mi sugerencia

Antes de crear más repositorios, dedicaría un poco de tiempo a diseñar bien un BaseRepository y un IRepository. Ese será el corazón de toda la capa de persistencia y hará que el framework sea mucho más mantenible a medida que crezca.



# construir una arquitectura que realmente valga la pena. 
A partir de este punto quiero que pensemos como si estuviéramos desarrollando un framework reutilizable.

## Objetivo

No queremos escribir esto 8 veces:

findById()
findAll()
create()
update()
delete()

Queremos escribirlo una sola vez.

## Paso 1 - Crear IRepository

Crea:

src/
└── domain/
    └── repositories/
        └── IRepository.js
export default class IRepository {

    async findById(id) {
        throw new Error("Method not implemented.");
    }

    async findAll() {
        throw new Error("Method not implemented.");
    }

    async create(data) {
        throw new Error("Method not implemented.");
    }

    async update(id, data) {
        throw new Error("Method not implemented.");
    }

    async delete(id) {
        throw new Error("Method not implemented.");
    }

}

## Paso 2 - IUserRepository

Ahora sí heredamos.

import IRepository from "./IRepository.js";

export default class IUserRepository extends IRepository {

    async findByExternalId(externalId, channelId) {
        throw new Error("Method not implemented.");
    }

}

## Paso 3 - IConversationRepository
import IRepository from "./IRepository.js";

export default class IConversationRepository extends IRepository {

    async findActiveByUser(userId) {
        throw new Error("Method not implemented.");
    }

    async updateSummary(id, summary) {
        throw new Error("Method not implemented.");
    }

    async close(id) {
        throw new Error("Method not implemented.");
    }

}

## Paso 4 - IMessageRepository
import IRepository from "./IRepository.js";

export default class IMessageRepository extends IRepository {

    async findByConversation(conversationId) {
        throw new Error("Method not implemented.");
    }

    async findLastMessages(conversationId, limit = 20) {
        throw new Error("Method not implemented.");
    }

}

Hasta aquí solo definimos el contrato.

## Paso 5 - BaseRepository

Ahora empieza lo interesante.

Crea:

src/
└── infrastructure/
    └── repositories/
        └── BaseRepository.js
export default class BaseRepository {
    constructor(prisma, model) {
        this.prisma = prisma;
        this.model = model;
    }

    async findById(id) {
        return this.model.findUnique({
            where: { id }
        });
    }

    async findAll() {
        return this.model.findMany();
    }

    async create(data) {
        return this.model.create({
            data
        });
    }

    async update(id, data) {
        return this.model.update({
            where: { id },
            data
        });
    }

    async delete(id) {
        return this.model.delete({
            where: { id }
        });
    }
}

Fíjate que BaseRepository no sabe qué entidad maneja.

Solo recibe:

model

que puede ser:

prisma.user

prisma.conversation

prisma.message

prisma.prompt

prisma.channel

## Paso 6 - UserRepository
import IUserRepository from "../../../domain/repositories/IUserRepository.js";
import BaseRepository from "../BaseRepository.js";

class PrismaUserRepository extends BaseRepository {

    constructor(prisma) {

        super(prisma, prisma.user);

    }

    async findByExternalId(externalId, channelId) {

        return this.model.findFirst({

            where: {

                externalId,

                channelId

            }

        });

    }

}

Object.assign(PrismaUserRepository.prototype, IUserRepository.prototype);

export default PrismaUserRepository;

Nota: En JavaScript no podemos heredar de dos clases (BaseRepository e IUserRepository) a la vez. Por eso usamos Object.assign solo como ayuda, pero más adelante veremos una forma más elegante. Si en algún momento migramos a TypeScript, esto se resuelve con implements IUserRepository.

¿Por qué me gusta esta solución?

Porque mañana podrás crear otro repositorio en 20 segundos.

Por ejemplo:

class PrismaPromptRepository extends BaseRepository {

    constructor(prisma){

        super(prisma, prisma.prompt);

    }

}

No tendrás que volver a escribir:

findById
findAll
create
update
delete
Hay algo que cambiaría

En lugar de que BaseRepository reciba prisma.user, haría que reciba el nombre del modelo y resuelva internamente la referencia.

Por ejemplo:

super(prisma, "user");

Y dentro de BaseRepository:

this.model = prisma[model];

Así desacoplamos todavía más los repositorios de Prisma y el código queda más legible:

class PrismaConversationRepository extends BaseRepository {

    constructor(prisma) {
        super(prisma, "conversation");
    }

}
Mi propuesta

Hagamos ese pequeño ajuste desde el principio. Es más limpio, más expresivo y facilitará incluso crear repositorios de forma dinámica si más adelante queremos soportar otros ORMs o generar repositorios automáticamente.

# donde ubico UserRepository

Muy buena pregunta. Aquí es donde empieza a notarse la diferencia entre una aplicación y un framework.

Yo lo ubicaría así:

src/
│
├── application/
│
├── config/
│
├── domain/
│   ├── entities/
│   ├── repositories/
│   │   ├── IRepository.js
│   │   ├── IUserRepository.js
│   │   ├── IConversationRepository.js
│   │   └── IMessageRepository.js
│   └── services/
│
├── infrastructure/
│   ├── ai/
│   ├── database/
│   │   ├── Database.js
│   │   └── PrismaDatabase.js
│   │
│   ├── repositories/
│   │   ├── BaseRepository.js
│   │   │
│   │   └── prisma/
│   │       ├── UserRepository.js
│   │       ├── ConversationRepository.js
│   │       ├── MessageRepository.js
│   │       ├── PromptRepository.js
│   │       └── ChannelRepository.js
│   │
│   └── logger/
│
├── interfaces/
│
└── shared/
¿Por qué dentro de prisma?

Porque en el futuro quieres soportar varios motores de persistencia. Por ejemplo:

repositories/
│
├── prisma/
│   ├── UserRepository.js
│   └── ConversationRepository.js
│
├── mongodb/
│   ├── UserRepository.js
│   └── ConversationRepository.js
│
└── mysql/
    ├── UserRepository.js
    └── ConversationRepository.js

La aplicación nunca sabrá cuál está usando. Solo conocerá la interfaz IUserRepository.

Más adelante

Cuando implementemos el Patrón Factory, podremos hacer algo como:

const userRepository = RepositoryFactory.create("user");

Y según la configuración:

DB_PROVIDER=postgres

devolverá:

new PrismaUserRepository(prisma);

Si cambias a:

DB_PROVIDER=mongodb

automáticamente devolverá:

new MongoUserRepository();

Sin tocar una línea del resto del código.

Incluso cambiaría el nombre

En lugar de:

UserRepository.js

yo lo llamaría:

PrismaUserRepository.js

Porque cuando tengas:

MongoUserRepository.js
MysqlUserRepository.js
RedisUserRepository.js

será mucho más claro cuál implementación estás utilizando.

Mi propuesta para el proyecto

Como queremos construir un framework reutilizable, usaría esta convención desde el principio:

src/
└── infrastructure/
    └── repositories/
        ├── BaseRepository.js
        └── prisma/
            ├── PrismaUserRepository.js
            ├── PrismaConversationRepository.js
            ├── PrismaMessageRepository.js
            ├── PrismaPromptRepository.js
            └── PrismaChannelRepository.js

Así, cuando implementemos el RepositoryFactory, simplemente elegirá la implementación adecuada según DB_PROVIDER.

El siguiente paso

Una vez que tengamos PrismaUserRepository, lo siguiente que haría es crear un RepositoryFactory. Será el punto único desde el que el resto de la aplicación obtendrá repositorios, lo que permitirá cambiar de Prisma a otro motor de base de datos sin modificar los casos de uso ni los controladores. Esa es una de las piezas clave para que el framework sea realmente desacoplado y extensible.
listo, ya lo hice, sigamos

# Excelente. Ahora empieza una de las partes más importantes del proyecto: la inversión de dependencias.

Hasta ahora tenemos algo así:

Controller
      │
      ▼
UserRepository ❌

Eso está acoplado.

Lo que queremos es esto:

Controller
      │
      ▼
UseCase
      │
      ▼
IUserRepository
      │
      ▼
RepositoryFactory
      │
      ▼
PrismaUserRepository

Y mañana podrá ser:

MongoUserRepository

sin tocar absolutamente nada más.

## Paso 1 - Crear RepositoryFactory

Crea:

src/
└── infrastructure/
    └── repositories/
        └── RepositoryFactory.js
RepositoryFactory.js
import database from "../database/PrismaDatabase.js";

import PrismaUserRepository from "./prisma/PrismaUserRepository.js";
import PrismaConversationRepository from "./prisma/PrismaConversationRepository.js";
import PrismaMessageRepository from "./prisma/PrismaMessageRepository.js";

class RepositoryFactory {

    constructor() {

        this.prisma = database.getClient();

    }

    user() {

        return new PrismaUserRepository(this.prisma);

    }

    conversation() {

        return new PrismaConversationRepository(this.prisma);

    }

    message() {

        return new PrismaMessageRepository(this.prisma);

    }

}

export default new RepositoryFactory();

¿Por qué no usar métodos estáticos?

Muchos ejemplos hacen:

RepositoryFactory.user()

Yo prefiero una instancia porque después podremos inyectarle:

Logger
Cache
Métricas
Transacciones

## Paso 2

Ahora viene algo interesante.

Queremos que ningún controlador conozca Prisma.

Entonces creamos los Use Cases.

src/
└── application/
    └── use-cases/
        ├── users/
        │      CreateUserUseCase.js
        │      FindUserUseCase.js
        │
        └── conversations/
CreateUserUseCase
export default class CreateUserUseCase {

    constructor(userRepository) {

        this.userRepository = userRepository;

    }

    async execute(data) {

        return this.userRepository.create(data);

    }

}
FindUserUseCase
export default class FindUserUseCase {

    constructor(userRepository) {

        this.userRepository = userRepository;

    }

    async execute(id) {

        return this.userRepository.findById(id);

    }

}
¿Por qué?

Porque mañana el caso de uso será mucho más complejo:

Buscar usuario

↓

¿Existe?

↓

NO

↓

Crear usuario

↓

Crear conversación

↓

Guardar primer mensaje

↓

Responder IA

↓

Enviar WhatsApp

Eso no pertenece al repositorio.

Pertenece al caso de uso.

## Paso 3

Ahora necesitamos un contenedor para crear todo automáticamente.

Crea:

src/
└── container/
       container.js
container.js
import RepositoryFactory from "../infrastructure/repositories/RepositoryFactory.js";

import CreateUserUseCase from "../application/use-cases/users/CreateUserUseCase.js";
import FindUserUseCase from "../application/use-cases/users/FindUserUseCase.js";

class Container {

    constructor() {

        const userRepository = RepositoryFactory.user();

        this.createUserUseCase = new CreateUserUseCase(userRepository);

        this.findUserUseCase = new FindUserUseCase(userRepository);

    }

}

export default new Container();

¿Por qué crear un contenedor?

Porque cuando tengas:

25 repositorios
40 casos de uso
6 proveedores de IA
3 canales (WhatsApp, Telegram, WebSocket)
Redis
Scheduler

No vas a querer instanciar todo manualmente.

La siguiente evolución: ServiceFactory

Cuando lleguemos a la capa de IA, construiremos algo similar:

AIProviderFactory

↓

OllamaService

OpenAIService

GrokService

ClaudeService

Y el código hará simplemente:

const ai = AIProviderFactory.create();

Según:

AI_PROVIDER=OLLAMA

o

AI_PROVIDER=OPENAI

sin cambiar el resto del código.

Antes de seguir, quiero proponerte un cambio importante

Hasta ahora estamos usando clases "abstractas" (IRepository, IUserRepository, etc.) para simular interfaces. En JavaScript eso funciona, pero es algo limitado.

Para un framework en JavaScript moderno con ESM, yo usaría este enfoque:

Las interfaces (IUserRepository, IConversationRepository) representan el contrato y sirven como documentación y guía.
BaseRepository concentra toda la lógica CRUD reutilizable.
Los casos de uso validan que el repositorio recibido implemente los métodos necesarios (duck typing), sin depender de herencia artificial.

Es un diseño más idiomático para JavaScript y además hará que una futura migración a TypeScript sea mucho más sencilla si decides dar ese paso. Ese cambio también simplificará bastante la implementación del AI Facade y del resto de proveedores.

----------------------------------------------------------------------------------------
Perfecto. Ahora viene una parte que considero el corazón del framework: la capa de IA.

Hasta ahora desacoplamos la base de datos. Ahora vamos a hacer exactamente lo mismo con los modelos de IA.

Queremos que el resto de la aplicación nunca sepa si está usando:

Ollama
OpenAI
Grok
Claude
Gemini
LM Studio

Solo deberá hacer:

const response = await ai.chat(messages);

Nada más.

# Arquitectura
src/

infrastructure/
│
├── ai/
│   │
│   ├── providers/
│   │     OllamaProvider.js
│   │     OpenAIProvider.js
│   │     GrokProvider.js
│   │
│   ├── AIProvider.js
│   ├── AIProviderFactory.js
│   └── AIService.js
## Paso 1

Creamos el contrato.

AIProvider.js
export default class AIProvider {

    async chat(messages, options = {}) {
        throw new Error("chat() not implemented");
    }

    async summarize(text) {
        throw new Error("summarize() not implemented");
    }

    async embeddings(text) {
        throw new Error("embeddings() not implemented");
    }

}

Observa que ya estamos pensando en el futuro.

No solamente chat.

También:

embeddings
resumen
clasificación
etc.

## Paso 2
OllamaProvider
import { ChatOllama } from "@langchain/ollama";
import AIProvider from "../AIProvider.js";

export default class OllamaProvider extends AIProvider {

    constructor(config) {

        super();

        this.model = new ChatOllama({

            baseUrl: config.ollama.baseUrl,

            model: config.ollama.model,

            temperature: config.ollama.temperature

        });

    }

    async chat(messages) {

        const response = await this.model.invoke(messages);

        return response.content;

    }

}

Fíjate que aquí LangChain queda encapsulado.

El resto del sistema nunca importará ChatOllama.

## Paso 3
OpenAIProvider

Por ahora solamente un stub.

import AIProvider from "../AIProvider.js";

export default class OpenAIProvider extends AIProvider {

    async chat() {

        throw new Error("Not implemented");

    }

}

## Paso 4
GrokProvider

Igual.

import AIProvider from "../AIProvider.js";

export default class GrokProvider extends AIProvider {

    async chat() {

        throw new Error("Not implemented");

    }

}

## Paso 5
AIProviderFactory

Aquí empieza la magia.

import config from "../../config/index.js";

import OllamaProvider from "./providers/OllamaProvider.js";
import OpenAIProvider from "./providers/OpenAIProvider.js";
import GrokProvider from "./providers/GrokProvider.js";

class AIProviderFactory {

    create() {

        switch (config.ai.provider) {

            case "OLLAMA":
                return new OllamaProvider(config.ai);

            case "OPENAI":
                return new OpenAIProvider(config.ai);

            case "GROK":
                return new GrokProvider(config.ai);

            default:
                throw new Error("Proveedor IA no soportado.");

        }

    }

}

export default new AIProviderFactory();

Ahora viene algo MUY importante

No quiero que los casos de uso hagan esto:

const ai = AIProviderFactory.create();

Porque cada caso de uso estaría creando una instancia nueva.

## Creamos AIService
import AIProviderFactory from "./AIProviderFactory.js";

class AIService {

    constructor() {

        this.provider = AIProviderFactory.create();

    }

    async chat(messages) {

        return this.provider.chat(messages);

    }

    async summarize(text) {

        return this.provider.summarize(text);

    }

}

export default new AIService();

Ahora cualquier parte del sistema hace simplemente:

import ai from "../infrastructure/ai/AIService.js";

const response = await ai.chat(messages);

Y nunca sabrá si responde:

Ollama
GPT-5
Grok
Claude
Pero yo cambiaría una cosa

No me gusta que AIService tenga métodos fijos (chat, summarize, etc.). Si mañana agregamos funciones como:

extracción de entidades,
traducción,
clasificación,
generación de embeddings,

tendremos que seguir ampliando esa clase.

En su lugar, prefiero que AIService sea un orquestador con una única responsabilidad: delegar al proveedor activo y encargarse de aspectos transversales (logs, métricas, reintentos, caché, etc.).

Por ejemplo:

const response = await ai.execute("chat", messages);

const summary = await ai.execute("summarize", text);

O incluso:

await ai.execute({
    task: "chat",
    messages,
    options: {
        temperature: 0.2
    }
});

Eso hará que el framework sea mucho más extensible.

Mi propuesta

Antes de integrar LangChain más a fondo, el siguiente paso debería ser construir un PromptService. Será el encargado de leer desde la base de datos la personalidad del bot (por ejemplo, "Eres un asistente de consultas"), componer el prompt del sistema y entregarlo al AIService. De esa manera cumpliremos uno de tus requisitos más importantes: persistir la personalidad del bot en la base de datos y poder modificarla sin cambiar el código.

--------------------------------------------------------------------------------

# Excelente. Ahora vamos a llegar a una de las características que hará que tu proyecto se diferencie de la mayoría de los chatbots.

Uno de tus requisitos era:

Persistir en base la personalidad del bot ("Eres un asistente...") y poder cambiarla sin tocar el código.

Yo iría un paso más allá.

En lugar de guardar solo un prompt...

Guardaría Prompt Templates.

Por ejemplo:

id	nombre	tipo	contenido	activo
1	Asistente General	SYSTEM	Eres un asistente amable...	✅
2	Resumidor	SUMMARY	Eres un resumidor experto...	✅
3	Clasificador	CLASSIFIER	Clasifica el mensaje...	✅
4	Extracción	EXTRACTION	Extrae entidades...	❌

Así el framework no queda limitado a un único prompt.

Modifiquemos el modelo de Prisma

En schema.prisma agregaría algo como:

model Prompt {

  id          String   @id @default(cuid())

  name        String

  type        String

  content     String   @db.Text

  active      Boolean  @default(true)

  createdAt   DateTime @default(now())

  updatedAt   DateTime @updatedAt

}
Después
npx prisma migrate dev --name add_prompt_table
Ahora la arquitectura
AIService

        │

        ▼

PromptService

        │

        ▼

PromptRepository

        │

        ▼

PostgreSQL
PromptRepository

Creamos otra interfaz.

domain/repositories/IPromptRepository.js
import IRepository from "./IRepository.js";

export default class IPromptRepository extends IRepository {

    async findActiveByType(type){

        throw new Error("Not implemented");

    }

}

Luego:

PrismaPromptRepository.js
import BaseRepository from "../BaseRepository.js";

export default class PrismaPromptRepository extends BaseRepository{

    constructor(prisma){

        super(prisma,"prompt");

    }

    async findActiveByType(type){

        return this.model.findFirst({

            where:{

                type,

                active:true

            }

        });

    }

}

Fíjate que ya casi no escribimos código.

BaseRepository hace todo.

Ahora viene la magia
PromptService
src/

application/

services/

PromptService.js
export default class PromptService{

    constructor(promptRepository){

        this.promptRepository = promptRepository;

    }

    async getSystemPrompt(){

        const prompt = await this.promptRepository.findActiveByType("SYSTEM");

        return prompt?.content ?? "";

    }

    async getSummaryPrompt(){

        const prompt = await this.promptRepository.findActiveByType("SUMMARY");

        return prompt?.content ?? "";

    }

}
Ahora AIService cambia

En lugar de:

ai.chat(messages)

hará:

const systemPrompt = await promptService.getSystemPrompt();

Luego construirá:

[
    {
        role:"system",
        content:systemPrompt
    },

    ...

messages
]

Y recién ahí llamará a Ollama.

¿Qué conseguimos?

Mañana alguien entra a la base.

Modifica:

"Eres un asistente médico."

por

"Eres un abogado."

Y el bot cambia completamente.

Sin deploy.

Sin reiniciar.

Sin tocar código.

Pero todavía podemos hacerlo mucho mejor

Aquí aparece un patrón muy usado en frameworks modernos: Prompt Pipeline.

En lugar de un único prompt, componemos varios.

Por ejemplo:

SYSTEM
        │
        ▼
PERSONALIDAD
        │
        ▼
REGLAS
        │
        ▼
CONTEXTO
        │
        ▼
SUMMARY
        │
        ▼
MENSAJES

Al final, el AIService envía al modelo algo así:

[
    { role: "system", content: "...personalidad..." },
    { role: "system", content: "...reglas..." },
    { role: "system", content: "...contexto del canal..." },
    { role: "system", content: "...resumen..." },
    ...mensajes
]

Esto tiene muchas ventajas:

Puedes tener reglas distintas para WhatsApp y Telegram.
Puedes agregar un prompt de seguridad sin modificar el código.
Puedes activar o desactivar prompts desde la base.
Puedes versionar prompts.
Puedes probar distintos prompts en producción.
Mi propuesta para el framework

En lugar de guardar una sola personalidad, construiría un Prompt Pipeline desde el principio.

Así, la arquitectura quedaría:

Controller
      │
      ▼
UseCase
      │
      ▼
ConversationService
      │
      ▼
PromptPipeline
      │
      ├── SystemPrompt
      ├── PersonalityPrompt
      ├── RulesPrompt
      ├── ChannelPrompt
      ├── ConversationSummary
      └── UserMessages
              │
              ▼
AIService
              │
              ▼
Ollama/OpenAI/Grok

Con este diseño, tu framework será mucho más flexible y permitirá cambiar el comportamiento del bot desde la base de datos, sin depender de cambios en el código ni del proveedor de IA. Además, encaja perfectamente con el resumidor automático y con el soporte para múltiples canales que definiste al inicio del proyecto.

----------------------------------------
Perfecto. Ahora entramos en la parte que considero el núcleo del framework: Conversation Orchestrator.

Hasta ahora tenemos piezas independientes:

✅ Repository Pattern
✅ AI Provider Factory
✅ Prompt Pipeline
✅ Prisma
✅ Configuración centralizada

Pero todavía no tenemos quien coordine todo.

El flujo que queremos lograr

Cuando llegue un mensaje desde cualquier canal (WhatsApp, Telegram, WebSocket, etc.), el flujo será:

Mensaje recibido
       │
       ▼
Channel Adapter
       │
       ▼
ConversationOrchestrator
       │
       ├──────── Buscar usuario
       │
       ├──────── Crear usuario si no existe
       │
       ├──────── Buscar conversación activa
       │
       ├──────── Crear conversación si no existe
       │
       ├──────── Guardar mensaje usuario
       │
       ├──────── Obtener Summary
       │
       ├──────── Construir Prompt Pipeline
       │
       ├──────── Llamar AIService
       │
       ├──────── Guardar respuesta IA
       │
       └──────── Devolver respuesta al canal

Ese será el único lugar donde se orquesta la conversación.

## Paso 1

Creemos:

src/
└── application/
    └── services/
        ConversationOrchestrator.js

No será un UseCase.

¿Por qué?

Porque involucra:

múltiples repositorios
IA
Prompt Pipeline
canales
resumen

Es demasiado grande para un caso de uso simple.

Constructor
export default class ConversationOrchestrator {

    constructor({

        userRepository,

        conversationRepository,

        messageRepository,

        promptService,

        aiService

    }) {

        this.userRepository = userRepository;

        this.conversationRepository = conversationRepository;

        this.messageRepository = messageRepository;

        this.promptService = promptService;

        this.aiService = aiService;

    }

}

Observa que recibe todo por inyección de dependencias.

Nunca hace:

new PrismaUserRepository()

Eso queda prohibido.

## Paso 2

Ahora agregamos el método principal.

async process(input){

}

donde input será algo como:

{

    channel: "WHATSAPP",

    externalUserId: "5491123456789",

    text: "Hola"

}

Ese objeto será igual para Telegram.

Igual para Socket.io.

Igual para Discord.

Igual para Messenger.

Todos los canales hablarán el mismo idioma.

## Paso 3

Dentro:

let user = await this.userRepository.findByExternalId(

    input.externalUserId,

    input.channel

);

Si no existe:

user = await this.userRepository.create({

    externalId: input.externalUserId,

    channel: input.channel

});

## Paso 4

Buscar conversación.

let conversation = await this.conversationRepository.findActiveByUser(

    user.id

);

Si no existe:

conversation = await this.conversationRepository.create({

    userId: user.id

});

## Paso 5

Guardar mensaje usuario.

await this.messageRepository.create({

    conversationId: conversation.id,

    role: "user",

    content: input.text

});

## Paso 6

Leer historial.

Aquí cambiaremos un poco MessageRepository.

Agregaremos:

findLastMessages(conversationId,20)

Porque nunca enviaremos toda la conversación.

Solo:

últimos mensajes
summary

## Paso 7

Prompt Pipeline.

const messages = await this.promptService.buildMessages({

    conversation,

    history

});

Aquí ya tendremos:

SYSTEM

PERSONALIDAD

SUMMARY

HISTORY

USER MESSAGE

## Paso 8

IA

const response = await this.aiService.chat(messages);

## Paso 9

Guardar respuesta

await this.messageRepository.create({

    conversationId: conversation.id,

    role: "assistant",

    content: response

});

## Paso 10

Responder

return response;

¿Por qué este diseño?

Porque mañana un canal solo tendrá que hacer:

const response = await orchestrator.process({

    channel: "WHATSAPP",

    externalUserId: phone,

    text: body

});

Y listo.

No sabrá nada de:

Prisma
Ollama
GPT
Prompts
Resumen
Usuarios
Conversaciones
Hay una mejora importante que propondría ahora

En lugar de que process() reciba un objeto genérico, definiría un ConversationContext.

Por ejemplo:

{
    channel,
    externalUserId,
    messageId,
    conversationId,
    metadata,
    text,
    attachments,
    timestamp
}

Así, cuando agregues WhatsApp o Telegram, podrás incluir:

ubicación,
imágenes,
audios,
documentos,
IDs del proveedor,

sin modificar la firma del método.

Lo siguiente que construiría

Ya tenemos la base para procesar conversaciones. El siguiente componente que desarrollaría es el Channel Adapter.

La idea es que cada canal (WhatsApp, Telegram, WebSocket, API REST) convierta su mensaje nativo a un ConversationContext común y llame al ConversationOrchestrator.

La arquitectura quedaría así:

WhatsApp Adapter ─┐
Telegram Adapter ─┤
WebSocket Adapter ├──► ConversationOrchestrator
REST Adapter ─────┘
                          │
                          ▼
                     AIService

Con eso cumplirás uno de tus objetivos principales: agregar un nuevo canal de comunicación sin cambiar la lógica del chatbot. Esa es una de las características que realmente hacen que este proyecto funcione como un framework y no como un bot específico.

-------------------------------------------------------------------------------------------------------------

¡Excelente!! 🎉 Este es un hito importante.

Ya tienes funcionando un flujo completo:

POST /users
      │
      ▼
Express Route
      │
      ▼
UserController
      │
      ▼
CreateUserUseCase
      │
      ▼
PrismaUserRepository
      │
      ▼
Prisma
      │
      ▼
PostgreSQL

Y lo más importante: la arquitectura está funcionando, no solo el código.

Antes de seguir

Quiero hacer un pequeño refactor para dejar la base mucho más limpia. Si seguimos agregando módulos sin esto, después costará más.

Actualmente tenemos algo así
Controller
    ↓
UseCase
    ↓
Repository
    ↓
Prisma

Pero en un chatbot real casi nunca alcanza con un solo caso de uso.

Por ejemplo, cuando llegue un mensaje de WhatsApp tendremos que:

Buscar usuario
Crear usuario si no existe
Buscar conversación
Crear conversación
Guardar mensaje
Consultar IA
Guardar respuesta
Enviar respuesta

Eso no es un UseCase simple.

Por eso vamos a introducir una capa de Services.

## La arquitectura que propongo
HTTP
│
├── Controllers
│
├── UseCases
│
├── Services
│
├── Repositories
│
└── Infrastructure

Diferencia entre UseCase y Service
UseCase

Hace una única acción de negocio.

Ejemplo:

CreateUser
FindUser
UpdateUser
Service

Coordina varios UseCases y Repositories.

Ejemplo:

ProcessIncomingMessageService

↓

Buscar usuario

↓

Crear usuario

↓

Buscar conversación

↓

Guardar mensaje

↓

Consultar IA

↓

Guardar respuesta

Ahí es donde vivirá la lógica del chatbot.

Lo siguiente que haría

No iría todavía a Conversation.

Primero crearía un módulo que luego usaremos en todo el proyecto:

src/
│
├── shared/
│   ├── errors/
│   │      AppError.js
│   │      NotFoundError.js
│   │      ValidationError.js
│   │
│   ├── middleware/
│   │      errorHandler.js
│   │
│   └── response/
│          ApiResponse.js

¿Por qué?

Porque ahora mismo, si Prisma falla, Express devuelve una excepción sin formato.

Queremos respuestas consistentes como:

{
  "success": true,
  "data": {
    "id": "...",
    "name": "Veronica"
  }
}

Y cuando hay un error:

{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "Usuario no encontrado"
  }
}

No queremos que cada controlador tenga que construir estas respuestas manualmente.

Además agregaría validación

Ya instalamos Zod, así que antes de entrar al controlador:

POST /users

↓

ValidateRequest (Zod)

↓

Controller

↓

UseCase

Si alguien envía:

{
  "externalId": 123
}

La petición ni siquiera llegará al controlador.

Mi recomendación para el siguiente paso

En lugar de seguir creando entidades (Conversation, Message, etc.), dedicaría un rato a construir la infraestructura transversal del framework:

✅ Manejo centralizado de errores (AppError, errorHandler)
✅ Validación con Zod
✅ Respuestas estándar (ApiResponse)
✅ Logger con Winston
✅ Middleware de request ID

Esa base la reutilizarán todos los módulos (Users, Conversations, IA, WhatsApp, Telegram). Cuando empecemos a integrar Ollama y múltiples canales, vas a agradecer tener esta infraestructura ya preparada. Creo que es el momento ideal para hacerlo antes de que el proyecto crezca demasiado.

----------------------------------------------------------------------------------------------

Perfecto. Esta es una de esas partes que casi nadie hace al principio y después termina con try/catch por todos lados. Si construimos esto bien ahora, el resto del framework será mucho más limpio.

## Objetivo

Queremos pasar de esto:

async create(req, res) {
    const user = await this.createUserUseCase.execute(req.body);
    res.status(201).json(user);
}

a esto:

async create(req, res, next) {
    try {
        const user = await this.createUserUseCase.execute(req.body);

        res.status(201).json(ApiResponse.success(user));

    } catch (error) {
        next(error);
    }
}

Y que un único middleware se encargue de responder todos los errores.

## Paso 1 - Crear la carpeta
src/
│
└── shared/
    ├── errors/
    ├── middleware/
    └── response/

## Paso 2 - AppError

src/shared/errors/AppError.js

export default class AppError extends Error {

    constructor(message, statusCode = 500, code = "INTERNAL_ERROR") {

        super(message);

        this.name = this.constructor.name;

        this.statusCode = statusCode;

        this.code = code;

        Error.captureStackTrace(this, this.constructor);

    }

}

Será la clase base para todos los errores.

## Paso 3 - NotFoundError

NotFoundError.js

import AppError from "./AppError.js";

export default class NotFoundError extends AppError {

    constructor(message = "Recurso no encontrado") {

        super(message, 404, "NOT_FOUND");

    }

}

## Paso 4 - ValidationError
import AppError from "./AppError.js";

export default class ValidationError extends AppError {

    constructor(message = "Datos inválidos") {

        super(message, 400, "VALIDATION_ERROR");

    }

}

## Paso 5 - ConflictError

Lo vamos a necesitar cuando exista un usuario.

import AppError from "./AppError.js";

export default class ConflictError extends AppError {

    constructor(message = "Conflicto") {

        super(message,409,"CONFLICT");

    }

}

## Paso 6 - ApiResponse

shared/response/ApiResponse.js

export default class ApiResponse {

    static success(data, message = "OK") {

        return {

            success: true,

            message,

            data

        };

    }

    static error(error) {

        return {

            success: false,

            error

        };

    }

}

Así todas las respuestas tendrán el mismo formato.

## Paso 7 - Error Middleware

shared/middleware/errorHandler.js

import ApiResponse from "../response/ApiResponse.js";
import AppError from "../errors/AppError.js";

export default function errorHandler(err, req, res, next) {

    if (err instanceof AppError) {

        return res
            .status(err.statusCode)
            .json(
                ApiResponse.error({

                    code: err.code,

                    message: err.message

                })
            );

    }

    console.error(err);

    return res
        .status(500)
        .json(
            ApiResponse.error({

                code: "INTERNAL_ERROR",

                message: "Ha ocurrido un error inesperado."

            })
        );

}

## Paso 8 - Registrar el middleware

En app.js, siempre al final:

import errorHandler from "./shared/middleware/errorHandler.js";

...

app.use(errorHandler);

Debe ir después de todas las rutas.

## Paso 9 - Modificar el controlador

En lugar de:

async create(req, res) {

    const user = await this.createUserUseCase.execute(req.body);

    res.status(201).json(user);

}

Haz:

import ApiResponse from "../../../shared/response/ApiResponse.js";

async create(req, res, next) {

    try {

        const user = await this.createUserUseCase.execute(req.body);

        res.status(201).json(
            ApiResponse.success(user, "Usuario creado correctamente")
        );

    } catch (error) {

        next(error);

    }

}

Y lo mismo para find().

## Paso 10 - Empezar a usar AppError

Por ejemplo, en FindUserUseCase:

import NotFoundError from "../../../shared/errors/NotFoundError.js";

async execute(id) {

    const user = await this.userRepository.findById(id);

    if (!user) {
        throw new NotFoundError("Usuario no encontrado");
    }

    return user;

}

Ahora, si consultas un ID inexistente:

GET /users/123

obtendrás:

{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Usuario no encontrado"
  }
}

Sin escribir un solo res.status(404) en el controlador.

Una mejora que añadiría

Hay un patrón muy útil para evitar escribir try/catch en todos los controladores: un asyncHandler.

Por ejemplo:

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

Entonces las rutas quedan así:

router.post("/", asyncHandler(controller.create.bind(controller)));
router.get("/:id", asyncHandler(controller.find.bind(controller)));

Y el controlador vuelve a ser muy limpio:

async create(req, res) {
    const user = await this.createUserUseCase.execute(req.body);

    res.status(201).json(
        ApiResponse.success(user)
    );
}

No necesitas try/catch en cada método.

Mi recomendación

Implementemos primero los archivos (AppError, ApiResponse, errorHandler) y comprobemos que funcionan. Luego añadiremos el asyncHandler, porque es una mejora pequeña que simplifica todos los controladores del framework. Es el enfoque que seguiría para mantener el código limpio a medida que crezca el proyecto.

--------------------------------------------------------------------------------------------------

Buena pregunta. Yo lo pondría en shared, porque no pertenece a HTTP, ni a usuarios, ni a IA. Es una utilidad reutilizable.

La estructura quedaría así:

src/
│
├── application/
├── domain/
├── infrastructure/
├── interfaces/
│
└── shared/
    ├── errors/
    │   ├── AppError.js
    │   ├── ConflictError.js
    │   ├── NotFoundError.js
    │   └── ValidationError.js
    │
    ├── middleware/
    │   ├── asyncHandler.js    ← aquí
    │   └── errorHandler.js
    │
    └── response/
        └── ApiResponse.js

asyncHandler.js
export default function asyncHandler(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        } catch (error) {
            next(error);
        }
    };
}
Luego en user.routes.js

En lugar de:

router.post("/", controller.create.bind(controller));
router.get("/:id", controller.find.bind(controller));

harás:

import { Router } from "express";
import asyncHandler from "../../../shared/middleware/asyncHandler.js";

const router = Router();

router.post(
    "/",
    asyncHandler(controller.create.bind(controller))
);

router.get(
    "/:id",
    asyncHandler(controller.find.bind(controller))
);

export default router;
Ahora el controlador queda muy limpio

Ya no necesita try/catch:

import ApiResponse from "../../../shared/response/ApiResponse.js";

export default class UserController {

    constructor(createUserUseCase, findUserUseCase) {
        this.createUserUseCase = createUserUseCase;
        this.findUserUseCase = findUserUseCase;
    }

    async create(req, res) {
        const user = await this.createUserUseCase.execute(req.body);

        res.status(201).json(
            ApiResponse.success(user, "Usuario creado correctamente")
        );
    }

    async find(req, res) {
        const user = await this.findUserUseCase.execute(req.params.id);

        res.json(ApiResponse.success(user));
    }

}
¿Por qué este enfoque?

Cada controlador queda enfocado únicamente en su responsabilidad:

Recibir la petición.
Llamar al caso de uso.
Devolver la respuesta.

Toda la gestión de errores queda centralizada en errorHandler, que es mucho más fácil de mantener.

Un paso más que haría

Como este framework va a exponer una API para varios canales (WhatsApp, Telegram, WebSocket, etc.), el siguiente middleware que incorporaría es un Request Logger con Winston.

La idea sería registrar automáticamente información como:

2026-07-03 18:30:15 INFO
POST /users
Status: 201
Tiempo: 24 ms
IP: 192.168.1.10

Eso te va a ayudar muchísimo cuando empecemos a depurar conversaciones del chatbot o a investigar errores en producción.

-----------------------------------------------------------------------------------------------

¡Excelente! Ya empezamos a tener una arquitectura sólida. 🎉

Lo que ya tenemos
✅ Express
✅ Config
✅ Prisma + PostgreSQL
✅ Repository Pattern
✅ Use Cases
✅ Controllers
✅ Routes
✅ Dependency Container
✅ ApiResponse
✅ AppError
✅ ErrorHandler
✅ AsyncHandler

Ya tienes una base que muchos proyectos no llegan a tener.

Ahora sí: Validaciones con Zod

Antes de seguir con Conversation o IA, agregaría validaciones. Es una pieza fundamental para una API.

El flujo quedará:

HTTP Request
      │
      ▼
Zod Validation
      │
      ▼
Controller
      │
      ▼
UseCase

Así evitamos que datos inválidos lleguen a la lógica de negocio.

# Paso 1

Crea una carpeta nueva

src/
│
├── shared/
│
└── interfaces/
    └── http/
        └── validators/

## Paso 2
user.validator.js
import { z } from "zod";

export const createUserSchema = z.object({

    externalId: z
        .string()
        .min(1),

    name: z
        .string()
        .min(2)
        .max(100),

    channel: z
        .string()
        .min(1)

});

## Paso 3

Creamos un middleware reutilizable.

shared/middleware/
validateRequest.js
import ValidationError from "../errors/ValidationError.js";

export default function validateRequest(schema) {

    return (req, res, next) => {

        const result = schema.safeParse(req.body);

        if (!result.success) {

            return next(
                new ValidationError(
                    result.error.issues
                        .map(issue => issue.message)
                        .join(", ")
                )
            );

        }

        req.body = result.data;

        next();

    };

}

Observa que no responde.

Lanza un error.

Nuestro errorHandler hará el resto.

## Paso 4

En las rutas.

import validateRequest from "../../../shared/middleware/validateRequest.js";
import { createUserSchema } from "../validators/user.validator.js";

y

router.post(

    "/",

    validateRequest(createUserSchema),

    asyncHandler(controller.create.bind(controller))

);

Listo.

Si alguien envía
{
    "externalId": "",
    "name": "A"
}

Obtendrá automáticamente:

{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Too small: expected string to have >=1 characters, Too small: expected string to have >=2 characters, Invalid input: expected string, received undefined"
  }
}

Sin tocar el controlador.

Pero podemos hacerlo mucho mejor

No me gusta devolver los mensajes originales de Zod.

Prefiero algo como:

{
    "success":false,
    "error":{

        "code":"VALIDATION_ERROR",

        "fields":[

            {

                "field":"externalId",

                "message":"externalId es obligatorio"

            },

            {

                "field":"name",

                "message":"El nombre debe tener al menos 2 caracteres"

            }

        ]

    }

}

Mucho más amigable para cualquier frontend o canal.

Después de esto

El orden que seguiría sería:

✅ Validaciones

⬜ Logger (Winston)

⬜ Conversation

⬜ Message

⬜ Prompt

⬜ AI Providers

⬜ ConversationService

⬜ WhatsApp Adapter

⬜ Telegram Adapter
Una pequeña mejora antes de continuar

Quisiera introducir un cambio de nomenclatura que suele usarse en proyectos grandes:

application/use-cases/ → mantener para operaciones simples (CreateUser, FindUser).
application/services/ → para procesos complejos (ConversationService, PromptService, SummaryService).

Eso nos permitirá mantener una separación clara cuando empecemos con la lógica del chatbot, que ya involucrará múltiples repositorios, IA y reglas de negocio. Creo que es el momento adecuado para establecer esa convención antes de que el proyecto crezca.

------------------------------------------------------------------------------------------------------

Me parece una muy buena idea. Zod es mucho más que validar si un campo existe. Si lo aprovechamos bien, será la base para validar todas las entradas del chatbot (API, WhatsApp, Telegram, WebSocket, etc.).

Yo dedicaría un rato a dejar una infraestructura de validación robusta.

## Nivel 1 - Validaciones básicas (ya lo hicimos)
const createUserSchema = z.object({
    externalId: z.string().min(1),
    name: z.string().min(2),
    channel: z.string().min(1)
});

## Nivel 2 - Mensajes personalizados

No me gustan los mensajes por defecto de Zod.

En lugar de:

Too small: expected string...

Prefiero:

import { z } from "zod";

export const createUserSchema = z.object({

    externalId: z.string({
        error: "El externalId es obligatorio"
    }).min(1),

    name: z.string({
        error: "El nombre es obligatorio"
    })
    .min(2, {
        error: "El nombre debe tener al menos 2 caracteres"
    })
    .max(100),

    channel: z.string({
        error: "El canal es obligatorio"
    })

});

Ya queda mucho más amigable.

## Nivel 3 - Enum

No quiero que cualquiera pueda enviar cualquier canal.

En lugar de:

channel: z.string()

haría:

const ChannelEnum = z.enum([
    "WEB",
    "WHATSAPP",
    "TELEGRAM"
]);

channel: ChannelEnum

Si mañana agregas Discord:

const ChannelEnum = z.enum([
    "WEB",
    "WHATSAPP",
    "TELEGRAM",
    "DISCORD"
]);

Y listo.

## Nivel 4 - Schemas reutilizables

No queremos repetir reglas.

Creamos:

shared/
    validation/
        commonSchemas.js
import { z } from "zod";

export const UUIDSchema = z.uuid({
    error: "UUID inválido"
});

export const ExternalIdSchema = z.string()
    .min(1)
    .max(100);

export const NameSchema = z.string()
    .min(2)
    .max(100);

Luego:

import {
    ExternalIdSchema,
    NameSchema
} from "../../../shared/validation/commonSchemas.js";

export const createUserSchema = z.object({

    externalId: ExternalIdSchema,

    name: NameSchema,

    channel: ChannelEnum

});

Ahora todas las validaciones usan las mismas reglas.

## Nivel 5 - Validar parámetros

No solo el body.

Por ejemplo:

GET /users/:id

También debe validarse.

export const findUserSchema = z.object({

    id: z.uuid()

});

Pero nuestro middleware hoy solo valida req.body.

Hagámoslo genérico
export default function validate(schema, property = "body") {

    return (req, res, next) => {

        const result = schema.safeParse(req[property]);

        if (!result.success) {

            return next(

                new ValidationError(result.error)

            );

        }

        req[property] = result.data;

        next();

    };

}

Ahora sirve para:

validate(createUserSchema)

o

validate(findUserSchema, "params")

o

validate(querySchema, "query")

Muchísimo más flexible.

## Nivel 6 - Separar Create y Update

Nunca reutilizaría el mismo schema.

CreateUserSchema
UpdateUserSchema

Porque en Update normalmente:

todos los campos son opcionales

Mientras que Create:

son obligatorios.

## Nivel 7 - DTO

Aquí empieza a parecerse a un framework profesional.

En lugar de pasar:

req.body

Pasamos un DTO validado.

CreateUserDTO
const dto = createUserSchema.parse(req.body);

await createUserUseCase.execute(dto);

Ya nunca llega información inválida al UseCase.

## Nivel 8 - Validaciones de negocio

Zod valida la estructura.

Pero no valida reglas del negocio.

Por ejemplo:

externalId

No puede repetirse.

Eso pertenece al UseCase.

const exists = await repository.findByExternalId(...);

if (exists)

    throw new ConflictError(
        "El usuario ya existe"
    );

Esa validación no debe ir en Zod.

Una mejora muy útil: centralizar los esquemas

Yo no dejaría los z.enum repartidos por el proyecto. Crearía una carpeta específica:

src/
└── shared/
    └── validation/
        ├── commonSchemas.js
        ├── enums.js
        ├── user.schemas.js
        ├── conversation.schemas.js
        └── message.schemas.js

Por ejemplo, enums.js:

import { z } from "zod";

export const ChannelEnum = z.enum([
    "WEB",
    "WHATSAPP",
    "TELEGRAM"
]);

export const MessageRoleEnum = z.enum([
    "USER",
    "ASSISTANT",
    "SYSTEM"
]);

export const ConversationStatusEnum = z.enum([
    "ACTIVE",
    "CLOSED",
    "ARCHIVED"
]);

Así, cuando empecemos con Conversation, Message y los adaptadores de WhatsApp y Telegram, reutilizaremos exactamente los mismos esquemas y evitaremos inconsistencias en toda la aplicación. Ese tipo de organización marca una gran diferencia cuando el proyecto empieza a crecer.

-------------------------------------------------------------------------------------------------

Perfecto. Ya tenemos una base muy sólida.

Hasta ahora construimos la infraestructura transversal:

✅ Config
✅ Docker
✅ PostgreSQL
✅ Prisma
✅ Repository Pattern
✅ Controllers
✅ Use Cases
✅ Error Handler
✅ AsyncHandler
✅ ApiResponse
✅ Zod

A partir de ahora empezamos a construir el framework del chatbot.

Antes de seguir quiero agregar una última pieza transversal
Winston (Logger)

¿Por qué ahora?

Porque absolutamente todo el framework va a necesitar logs:

Requests HTTP
Errores
Ollama
OpenAI
WhatsApp
Telegram
Cronjobs
Resumidor
Socket.io

Si esperamos más, después tendremos console.log() por todos lados.

Estructura
src/
│
├── shared/
│   ├── logger/
│   │      logger.js
│   │      requestLogger.js
│   │      loggerMiddleware.js
│   │
│   ├── errors/
│   ├── middleware/
│   └── validation/
logger.js

Instala primero:

npm install winston

Luego:

import winston from "winston";

const logger = winston.createLogger({

    level: "info",

    format: winston.format.combine(

        winston.format.timestamp(),

        winston.format.errors({ stack: true }),

        winston.format.printf(({ timestamp, level, message }) => {

            return `${timestamp} [${level}] ${message}`;

        })

    ),

    transports: [

        new winston.transports.Console(),

        new winston.transports.File({

            filename: "logs/error.log",

            level: "error"

        }),

        new winston.transports.File({

            filename: "logs/app.log"

        })

    ]

});

export default logger;
loggerMiddleware.js
import logger from "./logger.js";

export default function loggerMiddleware(req, res, next) {

    const start = Date.now();

    res.on("finish", () => {

        const ms = Date.now() - start;

        logger.info(

            `${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`

        );

    });

    next();

}
app.js

Antes de las rutas

app.use(loggerMiddleware);
errorHandler

En lugar de

console.error(error);

hacemos

logger.error(error);

o incluso

logger.error({

    message:error.message,

    stack:error.stack

});
Ahora tendremos
2026-07-03T21:00:15 info
POST /users 201 18ms

y

2026-07-03T21:00:21 error

Usuario no encontrado

stack...
Pero podemos hacer algo mucho mejor

Como este proyecto será un framework, yo no dejaría el logger como una instancia global.

Haría una interfaz.

ILogger

Luego

WinstonLogger

Mañana podrías usar

Winston
Pino
Datadog
Elastic
CloudWatch

sin tocar el resto del sistema.

La arquitectura quedaría:

Application

↓

ILogger

↓

WinstonLogger

↓

Console/File

Eso sigue el mismo principio que ya usamos para:

Repository
AI Provider
Después del logger

Aquí es donde empieza realmente el chatbot.

Yo seguiría exactamente este orden:

✅ Logger

↓

Conversation

↓

Message

↓

Prompt

↓

AI Provider

↓

ConversationService

↓

ConversationOrchestrator

↓

Summary Service

↓

WhatsApp Adapter

↓

Telegram Adapter
Mi recomendación

No implementaría todavía WhatsApp ni Ollama. Primero construiría el módulo Conversation completo (igual que hicimos con User). Cuando Conversation y Message estén listos, conectar la IA será muy sencillo, porque ya tendrás dónde persistir el historial y el resumen de las conversaciones. Esa secuencia hará que cada nueva pieza encaje de forma natural con la arquitectura que ya construiste.

--------------------------------------------------------------------------------------------------

Perfecto. Llegamos a la parte más interesante. 😊

Hasta ahora construimos la infraestructura. 
## A partir de ahora construiremos el motor del chatbot, pensando desde el primer día en soportar:

✅ WhatsApp
✅ Telegram
✅ Web
✅ Socket.io
✅ Ollama
✅ OpenAI
✅ Grok
✅ Claude
✅ Memoria de conversaciones
✅ Resumen automático
✅ Cambio de modelo de IA sin modificar el resto del código

Primero pensemos la arquitectura

En lugar de ir directamente a Conversation, quiero mostrarte cómo veo el flujo completo.

                           Mensaje Entrante
                                   │
                                   ▼
                        Channel Adapter (WhatsApp, Telegram, Web)
                                   │
                                   ▼
                     ConversationOrchestrator (Fachada principal)
                                   │
          ┌────────────────────────┼────────────────────────┐
          ▼                        ▼                        ▼
     UserService          ConversationService        PromptService
          │                        │                        │
          └──────────────┬─────────┴──────────────┬─────────┘
                         ▼                        ▼
                 MessageService            AIProviderFacade
                                                 │
                          ┌──────────────────────┼───────────────────────┐
                          ▼                      ▼                       ▼
                     OllamaProvider        OpenAIProvider         GrokProvider

Observa que ningún canal habla directamente con la IA.

Todos hablan con:

ConversationOrchestrator

Ese será el corazón del framework.

Entonces ¿qué hacemos primero?

No empezaría por la IA.

Primero necesitamos tener dónde guardar una conversación.

Primera entidad importante: Conversation

No es solamente una tabla.

Debe representar una conversación viva.

Usuario

↓

Conversation

↓

Message

↓

Message

↓

Message

↓

Summary

## Modelo que te propongo
model Conversation {
  id String @id @default(uuid())
  userId String
  user User @relation(fields:[userId],references:[id])
  status ConversationStatus @default(ACTIVE)
  title String?
  summary String?
  aiProvider String?
  model String?
  lastMessageAt DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  messages Message[]
}

Observa algunas cosas interesantes.

aiProvider: OLLAMA o OPENAI
model: 
    qwen3:4b
    llama3.1
    gpt-4.1

Así una conversación puede comenzar con Ollama y luego cambiar a GPT si el usuario lo decide.

summary
Aquí vivirá el resumen generado por otra IA.

status
No me gusta guardar booleanos.
Prefiero:
ACTIVE
CLOSED
ARCHIVED

### Segunda entidad
Message
model Message {
  id String @id @default(uuid())
  conversationId String
  conversation Conversation @relation(fields:[conversationId],references:[id])
  role MessageRole
  content String
  tokens Int?
  promptTokens Int?
  completionTokens Int?
  createdAt DateTime @default(now())
}

role
No usaría strings.
USER
ASSISTANT
SYSTEM

¿Por qué guardar tokens?

Porque después podremos saber:
La conversación tiene 14000 tokens.

Entonces automáticamente:

↓

Resumen

↓

Vaciar historial

↓

Guardar summary

Eso era justamente uno de tus requerimientos.

### Luego
Prompt

Esta tabla será muy poderosa.

model Prompt {
  id String @id @default(uuid())
  name String @unique
  description String?
  content String
  active Boolean @default(true)
  createdAt DateTime @default(now())
}

Ejemplo

name: MAIN_ASSISTANT

content: Eres un asistente jurídico...

Otro

SUMMARY

contenido: Eres un experto resumidor...

No habrá prompts en el código.

Todo estará en la base.

Después aparece el verdadero cerebro
ConversationOrchestrator

Será algo así:

process(channel, externalId, message)

Internamente hará:

Buscar usuario

↓

Crear usuario si no existe

↓

Buscar conversación

↓

Crear conversación

↓

Guardar mensaje

↓

Obtener prompt

↓

Consultar IA

↓

Guardar respuesta

↓

Responder al canal

Observa que el canal no sabe absolutamente nada.

Mi propuesta
No construiría Conversation igual que User.

User era un CRUD.

Conversation no es un CRUD.

Conversation es un agregado de dominio (Aggregate Root en DDD).

Yo empezaría creando primero las entidades de persistencia (Conversation, Message y Prompt) y sus repositorios, pero sin exponer endpoints CRUD completos.

El primer caso de uso importante sería algo como:

ProcessIncomingMessageUseCase

porque refleja el comportamiento real del chatbot. Ese caso de uso será el núcleo del sistema y utilizará internamente Conversation, Message, User, Prompt y el AIProvider. Creo que ese enfoque encaja mucho mejor con el tipo de aplicación que estás construyendo que modelar conversaciones como un CRUD tradicional.

---------------------------------------------------------------------------------------------------------------

¡Sí, por supuesto! No hace falta que Docker funcione para seguir avanzando con la arquitectura. Podemos dejar ese problema para más adelante.

De hecho, ya tenemos:

✅ Configuración
✅ Prisma
✅ Repositories
✅ Use Cases
✅ Controllers
✅ Logger
✅ Validaciones
✅ Usuario

Ahora podemos empezar con el núcleo del chatbot.

Mi propuesta

En lugar de crear un CRUD de Conversation, vamos a diseñar el flujo real de un chatbot.

## Paso 1: Modelar el dominio

Las entidades principales serán:

User
│
├── Conversation
│       │
│       ├── Message
│       └── Summary
│
└── Channel

Y por otro lado:

Prompt

AIProvider

ConversationOrchestrator

## Paso 2: Crear las interfaces del dominio

Igual que hicimos con IUserRepository, vamos a crear:

src/
└── domain/
    ├── repositories/
    │   ├── IConversationRepository.js
    │   ├── IMessageRepository.js
    │   └── IPromptRepository.js
    │
    ├── ai/
    │   └── IAIProvider.js
    │
    └── entities/
        ├── Conversation.js
        ├── Message.js
        └── Prompt.js

Por ahora las entidades pueden ser simples clases con sus propiedades.

Por ejemplo:

export default class Conversation {
    constructor(data) {
        Object.assign(this, data);
    }
}

Más adelante podremos agregar reglas de negocio (por ejemplo, saber si una conversación está activa, si necesita resumirse, etc.).

## Paso 3: El primer servicio importante

En vez de crear un ConversationController, vamos a crear el servicio que coordinará todo.

src/
└── application/
    └── services/
        ConversationOrchestrator.js

Al principio tendrá un método muy simple:

async process({
    channel,
    externalId,
    message
}) {

}

Ese método será el corazón del framework.

Más adelante hará algo así:

Buscar usuario
      │
      ▼
Crear usuario si no existe
      │
      ▼
Buscar conversación activa
      │
      ▼
Crear conversación si no existe
      │
      ▼
Guardar mensaje del usuario
      │
      ▼
Obtener prompt
      │
      ▼
Enviar a la IA
      │
      ▼
Guardar respuesta
      │
      ▼
Responder al canal

Observa que ningún canal (WhatsApp, Telegram, Web) hablará directamente con la IA. Todos pasarán por este orquestador.

Mi sugerencia

En este punto dejaría de pensar en términos de CRUD. Ya tenemos un ejemplo (User) para eso.

A partir de ahora construiremos el framework alrededor de casos de uso reales del chatbot. Eso hará que la arquitectura sea mucho más limpia y flexible.

El próximo objetivo será implementar este flujo:
POST /chat

↓

ConversationOrchestrator.process()

↓

(temporalmente)
return "Hola, soy el chatbot"

Aunque todavía no use Ollama, ya tendremos el esqueleto completo del framework. Luego solo tendremos que reemplazar esa respuesta fija por una llamada al IAIProvider, sin cambiar el resto de la arquitectura.

Creo que ese es el siguiente gran paso para que el proyecto empiece a sentirse como un verdadero framework de chatbot.

----------------------------------------------------------------------------------------------

entonces que va en IAIProvider.js, Message.js, Prompt.js

Muy buena pregunta. Aquí es donde empezamos a separar el dominio de la infraestructura.

Mi idea no es que estas clases sean simplemente un reflejo de Prisma. Quiero que representen el negocio del chatbot.

## 1. IAIProvider.js

Esta es la interfaz que deberán implementar todos los proveedores de IA.

src/
└── domain/
    └── ai/
        IAIProvider.js
export default class IAIProvider {

    async generateResponse(conversation, prompt) {
        throw new Error("Method not implemented.");
    }

    async summarize(conversation, prompt) {
        throw new Error("Method not implemented.");
    }

}
¿Por qué solo dos métodos?

Porque independientemente de si usas:

Ollama
OpenAI
Claude
Gemini
Grok

todos hacen dos cosas principales:

responder
resumir

Después tendremos:

OllamaProvider
class OllamaProvider extends IAIProvider {

    async generateResponse(conversation, prompt) {
        ...
    }

    async summarize(conversation, prompt) {
        ...
    }

}

y otro:

OpenAIProvider
## 2. Message.js

Esta no debería ser una copia de la tabla.

Debe representar un mensaje del dominio.

src/
└── domain/
    └── entities/
        Message.js
export default class Message {

    constructor({
        id,
        conversationId,
        role,
        content,
        tokens = 0,
        promptTokens = 0,
        completionTokens = 0,
        createdAt = new Date()
    }) {

        this.id = id;
        this.conversationId = conversationId;
        this.role = role;
        this.content = content;
        this.tokens = tokens;
        this.promptTokens = promptTokens;
        this.completionTokens = completionTokens;
        this.createdAt = createdAt;

    }

}
Más adelante

Podrá tener reglas propias.

isFromUser() {
    return this.role === "USER";
}

isAssistant() {
    return this.role === "ASSISTANT";
}

o

hasTokens() {
    return this.tokens > 0;
}
## 3. Prompt.js

Esta clase será muy importante.

export default class Prompt {

    constructor({
        id,
        name,
        description,
        content,
        active = true
    }) {

        this.id = id;
        this.name = name;
        this.description = description;
        this.content = content;
        this.active = active;

    }

}

Después podremos hacer cosas como:

isActive() {
    return this.active;
}

o

variables() {

    const regex = /\{\{(.*?)\}\}/g;

    return [...this.content.matchAll(regex)]
        .map(match => match[1]);

}

Si el prompt es:

Hola {{name}}

Hoy es {{date}}

la función devolvería:

[
    "name",
    "date"
]

Esto nos permitirá tener prompts dinámicos.

Yo agregaría una clase más
Conversation.js

Porque será el centro del dominio.

export default class Conversation {

    constructor({
        id,
        userId,
        status,
        summary = "",
        aiProvider,
        model,
        messages = []
    }) {

        this.id = id;
        this.userId = userId;
        this.status = status;
        this.summary = summary;
        this.aiProvider = aiProvider;
        this.model = model;
        this.messages = messages;

    }

    addMessage(message) {

        this.messages.push(message);

    }

    totalTokens() {

        return this.messages.reduce(

            (total, message) => total + (message.tokens || 0),

            0

        );

    }

    needsSummary(limit) {

        return this.totalTokens() >= limit;

    }

}

Fíjate que esta clase ya empieza a tener comportamiento, no solo datos.

¿Por qué hacer esto si Prisma ya tiene modelos?

Porque Prisma representa la base de datos, mientras que estas clases representan el negocio.

Por ejemplo:

const conversation = await conversationRepository.findById(id);

if (conversation.needsSummary(12000)) {

    ...

}

Es mucho más expresivo que escribir:

if (conversation.messages.reduce(...) > 12000)

por todos lados.

Mi recomendación

Aquí sí empezaría a aplicar un poco de DDD (Domain-Driven Design), pero sin exagerar. No necesitamos entidades complejas con cientos de métodos.

Mi regla sería:

Entidades del dominio (Conversation, Message, Prompt) contienen datos y reglas de negocio relacionadas con ellas.
Repositorios se encargan únicamente de persistir y recuperar esas entidades.
Use Cases orquestan el flujo entre entidades, repositorios y proveedores externos.

Ese equilibrio mantiene el código limpio y hace que el dominio del chatbot sea fácil de entender y de extender con nuevas capacidades.

-------------------------------------------------------------------------------------------------

Perfecto. Ahora empieza la parte que realmente convierte tu proyecto en un framework de chatbot.

Hasta ahora construimos infraestructura. A partir de este punto construiremos el dominio.

Y aquí quiero cambiar un poco el enfoque respecto a lo que hicimos con User.

Lo que NO quiero

No quiero que hagamos esto:

Conversation

↓

CRUD

↓

Controller

↓

Repository

Porque una conversación no es un CRUD.

Lo que SÍ quiero

Quiero que construyamos el flujo real del chatbot.

Mensaje

↓

ConversationOrchestrator

↓

Conversation

↓

Message

↓

Prompt

↓

AI

↓

Respuesta
El verdadero corazón del sistema

Todo el framework girará alrededor de una sola clase.

ConversationOrchestrator

Será equivalente a lo que en otros frameworks llaman:

Chat Engine
Assistant Engine
Conversation Engine
¿Qué hace?

Imagina que llega un WhatsApp.

"Hola"

El adaptador simplemente hace:

await orchestrator.process({

    channel:"WHATSAPP",

    externalId:"5493511111111",

    text:"Hola"

});

Y listo.

El adaptador no sabe:

Prisma
Prompt
Ollama
GPT
Logger

Nada.

Entonces...

No empecemos implementando IA.

Primero implementemos el esqueleto.

application/services/
ConversationOrchestrator.js
export default class ConversationOrchestrator {

    constructor({

        userRepository,

        conversationRepository,

        messageRepository,

        promptRepository,

        aiProvider,

        logger

    }){

        this.userRepository = userRepository;

        this.conversationRepository = conversationRepository;

        this.messageRepository = messageRepository;

        this.promptRepository = promptRepository;

        this.aiProvider = aiProvider;

        this.logger = logger.child(this.constructor.name);

    }

}

Observa una cosa.

Ya no recibe:

repository

Recibe un objeto.

Porque pronto tendrá muchas dependencias.

Ahora solamente un método
async process(request){

}
Y dentro iremos agregando pasos.

Primero:

async process(request){

    this.logger.info({

        event: EventNames.MESSAGE_RECEIVED,

        metadata:{

            channel:request.channel,

            externalId:request.externalId

        }

    });

}

Nada más.

Todavía no responde.

Solo loguea.

Luego

Paso 2.

Buscar usuario.

const user = await this.userRepository.findByExternalId(

    request.externalId

);

Todavía no crear conversación.

Solo buscar.

Luego

Si no existe.

const user = await this.userRepository.create(...);
Luego

Buscar conversación.

Luego

Guardar mensaje.

Luego

IA.

Luego

Guardar respuesta.

¿Por qué hacerlo así?

Porque construiremos el chatbot igual que se construye un compilador.

Primero funciona:

↓

log

↓

buscar usuario

↓

crear usuario

↓

buscar conversación

↓

crear conversación

↓

guardar mensaje

↓

IA

↓

respuesta

Cada paso se prueba por separado.

Nunca agregaremos cinco cosas juntas.

Antes de escribir ConversationOrchestrator...

Hay una pieza que todavía nos falta y que considero importante: ConversationContext.

No quiero pasar un objeto cualquiera como:

{
    channel,
    externalId,
    text
}

Prefiero definir una clase del dominio que represente una solicitud de conversación.

Por ejemplo:

export default class ConversationContext {

    constructor({
        channel,
        externalUserId,
        text,
        attachments = [],
        metadata = {},
        timestamp = new Date()
    }) {
        this.channel = channel;
        this.externalUserId = externalUserId;
        this.text = text;
        this.attachments = attachments;
        this.metadata = metadata;
        this.timestamp = timestamp;
    }

}

Más adelante podremos añadir:

ubicación,
imágenes,
audios,
documentos,
IDs del mensaje del proveedor,
información del canal,

sin modificar la firma de process() ni romper los adaptadores.

Mi propuesta

Antes de escribir una sola línea del ConversationOrchestrator, construiría estas tres piezas:

ConversationContext
ConversationOrchestrator
ProcessIncomingMessageUseCase

Con eso ya tendremos definido el flujo principal del framework. Después simplemente iremos reemplazando cada paso "vacío" (buscar usuario, crear conversación, llamar a la IA...) por implementaciones reales, una a una. Ese enfoque hace que el crecimiento del proyecto sea mucho más ordenado y fácil de probar.

------------------------------------------------------------------------------------------------------------

donde va ConversationContext

Muy buena pregunta. Aquí hay una decisión de arquitectura importante.

Mi recomendación: ConversationContext es un objeto del dominio

No es una entidad que se guarde en la base de datos, sino un objeto que representa el contexto de una conversación entrante. En DDD esto suele llamarse un Value Object.

Yo lo ubicaría así:

src/
├── domain/
│   ├── entities/
│   │   ├── User.js
│   │   ├── Conversation.js
│   │   ├── Message.js
│   │   └── Prompt.js
│   │
│   ├── value-objects/
│   │   └── ConversationContext.js   ← aquí
│   │
│   ├── repositories/
│   └── ai/
ConversationContext.js
export default class ConversationContext {

    constructor({
        channel,
        externalUserId,
        text,
        attachments = [],
        metadata = {},
        timestamp = new Date()
    }) {

        this.channel = channel;
        this.externalUserId = externalUserId;
        this.text = text;
        this.attachments = attachments;
        this.metadata = metadata;
        this.timestamp = timestamp;

    }

}
¿Por qué no en entities?

Porque no tiene identidad.

Una entidad tiene un id y vive en la base de datos.

Ejemplos:

User
Conversation
Message
Prompt

ConversationContext simplemente describe una petición.

Es como un sobre que contiene información.

¿Qué hará WhatsApp?
const context = new ConversationContext({

    channel: "WHATSAPP",

    externalUserId: phone,

    text: message,

    metadata: {

        providerMessageId: "...",

        phone

    }

});

await orchestrator.process(context);
¿Qué hará Telegram?

Exactamente lo mismo.

const context = new ConversationContext({

    channel: "TELEGRAM",

    externalUserId: telegramId,

    text: message

});

await orchestrator.process(context);
¿Qué hará un endpoint REST?
const context = new ConversationContext(req.body);

await orchestrator.process(context);
Una mejora que propondría

Como ya usamos Zod, haría que ConversationContext siempre nazca válido.

Por ejemplo:

import { conversationContextSchema } from "../../shared/validation/conversation.schemas.js";

export default class ConversationContext {

    constructor(data) {

        Object.assign(
            this,
            conversationContextSchema.parse(data)
        );

    }

}

Así cualquier adaptador (WhatsApp, Telegram, API REST, WebSocket) crea un ConversationContext que ya viene validado y el ConversationOrchestrator puede asumir que siempre recibe datos correctos.

Un pequeño ajuste a la estructura

Como el proyecto está creciendo, yo reorganizaría el dominio así:

src/
└── domain/
    ├── entities/
    ├── value-objects/
    ├── repositories/
    ├── ai/
    ├── logger/
    └── enums/

En enums/ movería cosas como:

ConversationStatus
MessageRole
ChannelType
AIProviderType

De esa forma evitamos usar strings ("USER", "ACTIVE", "WHATSAPP") repartidos por todo el proyecto y el dominio queda mucho más consistente. Es una estructura que escala muy bien cuando el framework empiece a soportar más canales y proveedores de IA.

-------------------------------------------------------------------------------------------------------------

no tengo nada de lo que me dices que ponga en enums
Eso es porque todavía no los creamos 😄. Me adelanté un poco pensando en cómo va a quedar el framework terminado.

No los necesitamos todavía.

De hecho, si seguimos agregando infraestructura, vamos a terminar con muchas carpetas vacías. Yo prefiero construirlas cuando realmente las vayamos a usar.

Entonces volvamos un paso atrás

Hasta ahora tienes algo como:

src/
├── application/
├── config/
├── container/
├── domain/
│   ├── ai/
│   ├── entities/
│   ├── logger/
│   ├── repositories/
│   └── value-objects/
├── infrastructure/
├── interfaces/
└── shared/

Y eso está perfecto.

No crees enums todavía.

Lo mismo con ConversationContext

Tampoco lo usaría todavía.

Porque todavía no tenemos:

WhatsApp
Telegram
Socket.io

Todavía estamos construyendo el motor.

Creo que es momento de cambiar la estrategia

Hasta ahora fuimos creando la infraestructura primero.

Ahora quiero empezar a construir el chatbot de adentro hacia afuera.

Paso 1

Crear ConversationRepository.

No el controller.

No las rutas.

Solo el repository.

¿Por qué?

Porque todo el framework va a depender de él.

Empecemos por Prisma

Muéstrame cómo quedó finalmente tu modelo Conversation y Message en schema.prisma.

Quiero ver algo parecido a esto:

model Conversation {

}

y

model Message {

}
Porque después vamos a implementar
PrismaConversationRepository

↓

findActiveByUser()

↓

create()

↓

updateSummary()

↓

close()

y

PrismaMessageRepository

↓

create()

↓

findLastMessages()

↓

countTokens()
Mi recomendación

Creo que ya tenemos suficiente infraestructura.

A partir de ahora quiero que cada cosa nueva que hagamos se use inmediatamente.

Es decir:

Conversation (modelo)

↓

Repository

↓

Service

↓

Lo usa ConversationOrchestrator

Así no tendremos clases "preparadas para el futuro" que todavía no participan en el flujo del chatbot.

Ese enfoque nos va a permitir tener un chatbot funcionando mucho antes, e iremos mejorándolo paso a paso.

-----------------------------------------------------------------------------------------------------------------

model Conversation {
  id String @id @default(uuid())

  userId String
  user   User               @relation(fields: [userId], references: [id])
  status ConversationStatus @default(ACTIVE)

  channelId String
  channel   Channel @relation(fields: [channelId], references: [id])

  summary String?

  messages Message[]

  title String?
  aiProvider String?
  model String?
  lastMessageAt DateTime?
  updatedAt DateTime @updatedAt
  createdAt           DateTime             @default(now())
  conversationSummary ConversationSummary?
}

model Message {
  id             String       @id @default(uuid())
  conversationId String
  role           MessageRole
  content        String
  tokens         Int?
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  createdAt      DateTime     @default(now())
  promptTokens Int?
  completionTokens Int?
}

Los modelos están bien para continuar. Ya puedes implementar los repositorios de Conversation y Message.

Hay un detalle importante: tienes summary dentro de Conversation y además una relación conversationSummary. Eso duplica el mismo concepto. Por ahora puedes mantener ambos, pero más adelante convendrá elegir uno. Como tu requisito original pedía un campo summary en la conversación, usaremos Conversation.summary.

1. IConversationRepository.js

Ubicación:

src/domain/repositories/IConversationRepository.js
import IRepository from "./IRepository.js";

export default class IConversationRepository extends IRepository {
    async findActiveByUser(userId, channelId) {
        throw new Error("Method not implemented.");
    }

    async updateSummary(id, summary) {
        throw new Error("Method not implemented.");
    }

    async updateLastMessageAt(id, date) {
        throw new Error("Method not implemented.");
    }

    async close(id) {
        throw new Error("Method not implemented.");
    }
}

Incluimos channelId porque un usuario puede tener una conversación activa diferente en WhatsApp, Telegram o Web.

2. IMessageRepository.js

Ubicación:

src/domain/repositories/IMessageRepository.js
import IRepository from "./IRepository.js";

export default class IMessageRepository extends IRepository {
    async findByConversation(conversationId) {
        throw new Error("Method not implemented.");
    }

    async findLastMessages(conversationId, limit = 20) {
        throw new Error("Method not implemented.");
    }

    async sumTokens(conversationId) {
        throw new Error("Method not implemented.");
    }
}
3. PrismaConversationRepository.js

Ubicación:

src/infraestructure/repositories/prisma/PrismaConversationRepository.js

Mantengo infraestructure porque así parece llamarse actualmente tu carpeta, aunque la escritura habitual es infrastructure.

import BaseRepository from "../BaseRepository.js";

export default class PrismaConversationRepository extends BaseRepository {
    constructor(prisma) {
        super(prisma, "conversation");
    }

    async findActiveByUser(userId, channelId) {
        return this.model.findFirst({
            where: {
                userId,
                channelId,
                status: "ACTIVE",
            },
            orderBy: {
                updatedAt: "desc",
            },
        });
    }

    async updateSummary(id, summary) {
        return this.model.update({
            where: { id },
            data: {
                summary,
            },
        });
    }

    async updateLastMessageAt(id, date = new Date()) {
        return this.model.update({
            where: { id },
            data: {
                lastMessageAt: date,
            },
        });
    }

    async close(id) {
        return this.model.update({
            where: { id },
            data: {
                status: "CLOSED",
            },
        });
    }
}

Esto supone que tu BaseRepository resuelve el modelo así:

export default class BaseRepository {
    constructor(prisma, modelName) {
        this.prisma = prisma;
        this.model = prisma[modelName];
    }

    async findById(id) {
        return this.model.findUnique({
            where: { id },
        });
    }

    async findAll() {
        return this.model.findMany();
    }

    async create(data) {
        return this.model.create({
            data,
        });
    }

    async update(id, data) {
        return this.model.update({
            where: { id },
            data,
        });
    }

    async delete(id) {
        return this.model.delete({
            where: { id },
        });
    }
}
4. PrismaMessageRepository.js

Ubicación:

src/infraestructure/repositories/prisma/PrismaMessageRepository.js
import BaseRepository from "../BaseRepository.js";

export default class PrismaMessageRepository extends BaseRepository {
    constructor(prisma) {
        super(prisma, "message");
    }

    async findByConversation(conversationId) {
        return this.model.findMany({
            where: {
                conversationId,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
    }

    async findLastMessages(conversationId, limit = 20) {
        const messages = await this.model.findMany({
            where: {
                conversationId,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: limit,
        });

        return messages.reverse();
    }

    async sumTokens(conversationId) {
        const result = await this.model.aggregate({
            where: {
                conversationId,
            },
            _sum: {
                tokens: true,
            },
        });

        return result._sum.tokens ?? 0;
    }
}

El reverse() es necesario porque Prisma trae primero los mensajes más recientes, pero para enviarlos a la IA normalmente necesitamos el orden cronológico.

5. Actualizar RepositoryFactory.js
import database from "../database/PrismaDatabase.js";

import PrismaUserRepository from "./prisma/PrismaUserRepository.js";
import PrismaConversationRepository from "./prisma/PrismaConversationRepository.js";
import PrismaMessageRepository from "./prisma/PrismaMessageRepository.js";

class RepositoryFactory {
    constructor() {
        this.prisma = database.getClient();
    }

    user() {
        return new PrismaUserRepository(this.prisma);
    }

    conversation() {
        return new PrismaConversationRepository(this.prisma);
    }

    message() {
        return new PrismaMessageRepository(this.prisma);
    }
}

export default new RepositoryFactory();

Tu PrismaUserRepository actualmente no recibe prisma en el constructor, así que deberías unificarlo:

import BaseRepository from "../BaseRepository.js";

export default class PrismaUserRepository extends BaseRepository {
    constructor(prisma) {
        super(prisma, "user");
    }

    async findByExternalId(externalId, channelId) {
        return this.model.findFirst({
            where: {
                externalId,
                channelId,
            },
        });
    }

    async create(data) {
        return this.model.create({
            data: {
                externalId: data.externalId,
                name: data.name,
                channel: {
                    connect: {
                        name: data.channel,
                    },
                },
            },
        });
    }
}

Con esto ya quedan disponibles los tres repositorios que necesita el núcleo:

UserRepository
ConversationRepository
MessageRepository

El siguiente paso concreto es crear un servicio pequeño que haga solamente esto:

buscar conversación activa
→ crearla si no existe
→ guardar un mensaje

Todavía sin Ollama. Así probamos primero la persistencia completa de una conversación.

----------------------------------------------------------------------------------------------------

bueno, volvamos al chatbot, ya solucione el problema, como seguimos? dijiste algo de crear un servicio pequeño

Sí. Ahora conviene crear un servicio pequeño que pruebe el núcleo sin meter Ollama todavía.

La idea es implementar este flujo:

buscar conversación activa
→ crearla si no existe
→ guardar el mensaje
→ actualizar lastMessageAt
1. Crear ConversationService.js

Ubicación:

src/application/services/ConversationService.js
export default class ConversationService {
    constructor({
        conversationRepository,
        messageRepository,
        logger,
    }) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.logger = logger.child(this.constructor.name);
    }

    async registerIncomingMessage({
        userId,
        channelId,
        text,
        role = "USER",
        tokens = null,
    }) {
        let conversation =
            await this.conversationRepository.findActiveByUser(
                userId,
                channelId
            );

        if (!conversation) {
            conversation = await this.conversationRepository.create({
                userId,
                channelId,
                status: "ACTIVE",
                lastMessageAt: new Date(),
            });

            this.logger.info({
                event: "CONVERSATION_CREATED",
                metadata: {
                    conversationId: conversation.id,
                    userId,
                    channelId,
                },
            });
        }

        const message = await this.messageRepository.create({
            conversationId: conversation.id,
            role,
            content: text,
            tokens,
        });

        await this.conversationRepository.updateLastMessageAt(
            conversation.id
        );

        this.logger.info({
            event: "MESSAGE_RECEIVED",
            metadata: {
                messageId: message.id,
                conversationId: conversation.id,
                userId,
                channelId,
            },
        });

        return {
            conversation,
            message,
        };
    }
}
2. Registrar los repositorios en el Container

Tu container.js debería incorporar Conversation y Message:

import RepositoryFactory from "../infraestructure/repositories/RepositoryFactory.js";
import LoggerFactory from "../infraestructure/logger/LoggerFactory.js";

import CreateUserUseCase from "../application/usecases/users/CreateUserUseCase.js";
import FindUserUseCase from "../application/usecases/users/FindUserUseCase.js";
import ConversationService from "../application/services/ConversationService.js";

class Container {
    constructor() {
        this.logger = LoggerFactory.create();

        const userRepository = RepositoryFactory.user();
        const conversationRepository = RepositoryFactory.conversation();
        const messageRepository = RepositoryFactory.message();

        this.createUserUseCase = new CreateUserUseCase(
            userRepository,
            this.logger
        );

        this.findUserUseCase = new FindUserUseCase(
            userRepository,
            this.logger
        );

        this.conversationService = new ConversationService({
            conversationRepository,
            messageRepository,
            logger: this.logger,
        });
    }
}

export default new Container();
3. Crear un endpoint temporal para probarlo

Crea:

src/interfaces/http/controllers/ChatController.js
import ApiResponse from "../../../shared/response/ApiResponse.js";

export default class ChatController {
    constructor(conversationService) {
        this.conversationService = conversationService;
    }

    async receive(req, res) {
        const result =
            await this.conversationService.registerIncomingMessage({
                userId: req.body.userId,
                channelId: req.body.channelId,
                text: req.body.text,
            });

        res.status(201).json(
            ApiResponse.success(
                result,
                "Mensaje registrado correctamente"
            )
        );
    }
}
4. Crear chat.routes.js

Ubicación:

src/interfaces/http/routes/chat.routes.js
import { Router } from "express";

import container from "../../../container/container.js";
import ChatController from "../controllers/ChatController.js";
import asyncHandler from "../../../shared/middleware/asyncHandler.js";

const router = Router();

const controller = new ChatController(
    container.conversationService
);

router.post(
    "/",
    asyncHandler(controller.receive.bind(controller))
);

export default router;
5. Registrar la ruta en app.js
import chatRoutes from "./interfaces/http/routes/chat.routes.js";

app.use("/chat", chatRoutes);
6. Probar

Haz un POST a:

POST http://localhost:3000/chat

Body:

{
  "userId": "UUID_DE_UN_USUARIO_EXISTENTE",
  "channelId": "UUID_DE_UN_CANAL_EXISTENTE",
  "text": "Hola"
}

La primera vez debería:

crear una conversación activa,
guardar el mensaje,
devolver ambos registros.

La segunda vez, usando el mismo userId y channelId, debería reutilizar la conversación activa y crear solo otro mensaje.

El siguiente paso será mejorar este endpoint para que reciba externalUserId y channel, busque o cree al usuario automáticamente y recién después llame a este servicio. Ahí empezará a tomar forma el verdadero ConversationOrchestrator.

-----------------------------------------------------------------------------------------------------

se creo ok

Perfecto. Entonces ya validaste este flujo:

POST /chat
   ↓
ChatController
   ↓
ConversationService
   ↓
buscar conversación activa
   ↓
crear conversación si no existe
   ↓
guardar Message
   ↓
actualizar lastMessageAt
   ↓
PostgreSQL

El siguiente paso es hacer que /chat deje de recibir directamente userId y channelId, porque WhatsApp o Telegram no van a conocer esos UUID internos.

Quiero que empiece a recibir algo más parecido a esto:

{
  "externalUserId": "5493511111111",
  "channel": "WHATSAPP",
  "name": "Veronica",
  "text": "Hola"
}

Y que el sistema resuelva automáticamente:

externalUserId + channel
        ↓
buscar usuario
        ↓
si no existe → crearlo
        ↓
obtener userId + channelId
        ↓
ConversationService

Ahí sí conviene crear el ConversationOrchestrator.

Podemos hacer ahora una primera versión que solamente coordine User + Conversation + Message, todavía sin Ollama. Después de comprobar que funciona, le agregamos el proveedor de IA.

--------------------------------------------------------------------------------------------------------------

Entonces avancemos con la primera versión del ConversationOrchestrator. Por ahora su responsabilidad será coordinar User → Conversation → Message; todavía no metemos Ollama.

1. Crear ConversationOrchestrator.js

Ubicación:

src/
└── application/
    └── services/
        ├── ConversationService.js
        └── ConversationOrchestrator.js
export default class ConversationOrchestrator {
    constructor({
        userRepository,
        conversationService,
        logger
    }) {
        this.userRepository = userRepository;
        this.conversationService = conversationService;
        this.logger = logger.child(this.constructor.name);
    }


    async process({
        externalUserId,
        channel,
        name,
        text
    }) {
        // Lo implementamos por pasos
    }
}
2. Primer problema: necesitamos resolver el Channel

Nuestro User actualmente tiene:

channelId String
channel   Channel @relation(fields: [channelId], references: [id])

Por lo tanto, para recibir:

{
    "channel": "WHATSAPP"
}

necesitamos encontrar primero el registro correspondiente de Channel.

Aquí sí conviene agregar ChannelRepository.

Crea:

src/domain/repositories/IChannelRepository.js
import IRepository from "./IRepository.js";


export default class IChannelRepository extends IRepository {
    async findByName(name) {
        throw new Error("Method not implemented.");
    }
}

Y:

src/infraestructure/repositories/prisma/PrismaChannelRepository.js
import BaseRepository from "../BaseRepository.js";


export default class PrismaChannelRepository extends BaseRepository {
    constructor(prisma) {
        super(prisma, "channel");
    }


    async findByName(name) {
        return this.model.findUnique({
            where: {
                name
            }
        });
    }
}

En RepositoryFactory.js:

import PrismaChannelRepository from "./prisma/PrismaChannelRepository.js";

y agrega:

channel() {
    return new PrismaChannelRepository(this.prisma);
}
3. Ahora sí completamos el Orchestrator
export default class ConversationOrchestrator {
    constructor({
        userRepository,
        channelRepository,
        conversationService,
        logger
    }) {
        this.userRepository = userRepository;
        this.channelRepository = channelRepository;
        this.conversationService = conversationService;
        this.logger = logger.child(this.constructor.name);
    }


    async process({
        externalUserId,
        channel,
        name,
        text
    }) {
        const channelEntity =
            await this.channelRepository.findByName(channel);


        if (!channelEntity) {
            throw new Error(`Canal ${channel} no encontrado`);
        }


        let user =
            await this.userRepository.findByExternalId(
                externalUserId,
                channelEntity.id
            );


        if (!user) {
            user = await this.userRepository.create({
                externalId: externalUserId,
                name,
                channel: {
                    connect: {
                        id: channelEntity.id
                    }
                }
            });


            this.logger.info({
                event: "USER_CREATED",
                metadata: {
                    userId: user.id,
                    channel: channelEntity.name
                }
            });
        }


        return this.conversationService.registerIncomingMessage({
            userId: user.id,
            channelId: channelEntity.id,
            text
        });
    }
}
4. Ojo con tu PrismaUserRepository

Antes habíamos personalizado create() para recibir channel como nombre. Ahora eso nos estorba un poco.

Para mantener el repositorio genérico, yo dejaría:

async create(data) {
    return this.model.create({
        data
    });
}

O directamente eliminaría ese método si ya lo hereda de BaseRepository.

Así el Orchestrator puede mandar:

{
    externalId: externalUserId,
    name,
    channel: {
        connect: {
            id: channelEntity.id
        }
    }
}
5. Registrar todo en container.js

Agrega:

import ConversationOrchestrator
    from "../application/services/ConversationOrchestrator.js";

Y después de crear los repositories:

const userRepository = RepositoryFactory.user();
const conversationRepository = RepositoryFactory.conversation();
const messageRepository = RepositoryFactory.message();
const channelRepository = RepositoryFactory.channel();

Tu ConversationService sigue igual:

this.conversationService = new ConversationService({
    conversationRepository,
    messageRepository,
    logger: this.logger
});

Y debajo:

this.conversationOrchestrator = new ConversationOrchestrator({
    userRepository,
    channelRepository,
    conversationService: this.conversationService,
    logger: this.logger
});
6. Cambiar ChatController

Ya no debe llamar directamente a ConversationService.

export default class ChatController {
    constructor(conversationOrchestrator) {
        this.conversationOrchestrator = conversationOrchestrator;
    }


    async receive(req, res) {
        const result =
            await this.conversationOrchestrator.process(req.body);


        res.status(201).json(result);
    }
}

Y al crearlo:

const controller = new ChatController(
    container.conversationOrchestrator
);

Ahora tu endpoint cambia conceptualmente de:

{
    "userId": "uuid...",
    "channelId": "uuid...",
    "text": "Hola"
}

a algo mucho más apropiado para un chatbot:

{
    "externalUserId": "123456",
    "channel": "WHATSAPP",
    "name": "Veronica",
    "text": "Hola"
}

El sistema resuelve internamente los UUID.

Primero probaría exactamente esto. Cuando funcione, el siguiente paso será muy bueno: agregar IAIProvider → OllamaProvider y hacer que ese "Hola" finalmente genere una respuesta real con qwen3:4b.

---------------------------------------------------------------------------------------------------------------------------------------------------------

listo, solucionado

Perfecto. Entonces ya tenemos funcionando el flujo:

POST /chat
   ↓
ChatController
   ↓
ConversationOrchestrator
   ↓
buscar Channel
   ↓
buscar/crear User
   ↓
ConversationService
   ↓
buscar/crear Conversation
   ↓
guardar Message

Y si mandas varios mensajes con el mismo externalUserId + channel, debería reutilizar la conversación ACTIVE.

El siguiente paso que haría es conectar la IA, pero de forma desacoplada como venimos diseñando:

ConversationOrchestrator
        ↓
    AIService
        ↓
   IAIProvider
        ↓
  OllamaProvider
        ↓
     Ollama
        ↓
    qwen3:4b

Ya tenemos IAIProvider.js, así que ahora podemos implementar OllamaProvider, crear un AIProviderFactory y registrarlo en el Container. Después modificaremos el flujo para que:

"Hola"
  ↓
guardar USER Message
  ↓
recuperar historial
  ↓
Qwen3:4b
  ↓
guardar ASSISTANT Message
  ↓
devolver respuesta

Yo empezaría únicamente por OllamaProvider y lo probaría aislado antes de conectarlo al ConversationOrchestrator. Así, si Ollama falla, sabemos que el problema está en la integración con IA y no en Conversation/Message.

---------------------------------------------------------------------------------------------------------------------------------

CONTENT:
Hola, soy Qwen, un modelo de lenguaje de gran tamaño desarrollado por el laboratorio Tongyi. ¿En qué puedo ayudarte?

Perfecto. Eso confirma que ya funciona todo el camino:

Node
→ Container
→ AIProviderFactory
→ OllamaProvider
→ LangChain
→ Ollama
→ qwen3:4b
→ respuesta

Ahora sí podemos conectar la IA al flujo real del chatbot.

El siguiente cambio sería que ConversationService además de guardar el mensaje del usuario, recupere el historial reciente. Después ConversationOrchestrator llama a aiProvider.generate(...), guarda la respuesta como ASSISTANT y la devuelve.

Yo lo haría en este orden:

ConversationService.getHistory(conversationId)

ConversationOrchestrator arma los mensajes:

[
  { role: "system", content: "Eres un asistente de consultas." },
  ...history.map(...)
]
aiProvider.generate(messages)

guardar:

{
  role: "ASSISTANT",
  content: response.content
}
devolver response.content desde POST /chat

Y recién después reemplazamos el "Eres un asistente de consultas." hardcodeado por el PromptRepository, que era uno de tus requisitos originales.

Si quieres, seguimos ahora con ese paso y te doy el código exacto para integrar OllamaProvider dentro de ConversationOrchestrator.

---------------------------------------------------------------------------------------------------------

ok

Ahora conectemos Ollama al flujo real, pero manteniendo bien separadas las responsabilidades.

Queremos llegar a:

POST /chat
   ↓
ConversationOrchestrator
   ↓
buscar/crear User
   ↓
ConversationService
   ├── buscar/crear Conversation
   └── guardar USER Message
   ↓
recuperar historial
   ↓
OllamaProvider.generate()
   ↓
guardar ASSISTANT Message
   ↓
devolver respuesta
1. Ampliar ConversationService

Ya tienes registerIncomingMessage(). Agreguemos dos métodos:

async getHistory(conversationId, limit = 20) {
    return this.messageRepository.findLastMessages(
        conversationId,
        limit
    );
}


async registerAssistantMessage({
    conversationId,
    text,
    tokens = null,
    promptTokens = null,
    completionTokens = null
}) {
    const message = await this.messageRepository.create({
        conversationId,
        role: "ASSISTANT",
        content: text,
        tokens,
        promptTokens,
        completionTokens
    });


    await this.conversationRepository.updateLastMessageAt(
        conversationId
    );


    return message;
}

Entonces ConversationService queda responsable de operaciones relacionadas con Conversation/Message.

2. Inyectar aiProvider al Orchestrator

En container.js ya deberías tener:

this.aiProvider = AIProviderFactory.create(
    configService.config.ai,
    this.logger
);

Ahora cambia:

this.conversationOrchestrator = new ConversationOrchestrator({
    userRepository,
    channelRepository,
    conversationService: this.conversationService,
    logger: this.logger
});

por:

this.conversationOrchestrator = new ConversationOrchestrator({
    userRepository,
    channelRepository,
    conversationService: this.conversationService,
    aiProvider: this.aiProvider,
    logger: this.logger
});
3. Recibirlo en ConversationOrchestrator
constructor({
    userRepository,
    channelRepository,
    conversationService,
    aiProvider,
    logger
}) {
    this.userRepository = userRepository;
    this.channelRepository = channelRepository;
    this.conversationService = conversationService;
    this.aiProvider = aiProvider;


    this.logger = logger.child(this.constructor.name);
}

Recuerda lo que nos pasó antes: no alcanza con recibir:

aiProvider

hay que asignarlo:

this.aiProvider = aiProvider;
4. Modificar process()

La primera parte que ya funciona la dejamos prácticamente igual:

async process({
    externalUserId,
    channel,
    name,
    text
}) {
    const channelEntity =
        await this.channelRepository.findByName(channel);


    if (!channelEntity) {
        throw new Error(`Canal ${channel} no encontrado`);
    }


    let user =
        await this.userRepository.findByExternalId(
            externalUserId,
            channelEntity.id
        );


    if (!user) {
        user = await this.userRepository.create({
            externalId: externalUserId,
            name,
            channel: {
                connect: {
                    id: channelEntity.id
                }
            }
        });
    }


    // 1. Guardamos el mensaje USER
    const { conversation } =
        await this.conversationService.registerIncomingMessage({
            userId: user.id,
            channelId: channelEntity.id,
            text
        });


    // 2. Recuperamos el historial
    const history =
        await this.conversationService.getHistory(
            conversation.id
        );


    // 3. Lo convertimos al formato esperado por la IA
    const messages = [
        {
            role: "system",
            content: "Eres un asistente útil. Responde siempre en español."
        },
        ...history.map(message => ({
            role: message.role.toLowerCase(),
            content: message.content
        }))
    ];


    // 4. Llamamos a Ollama
    const aiResponse =
        await this.aiProvider.generate(messages);


    // 5. Guardamos la respuesta
    const assistantMessage =
        await this.conversationService.registerAssistantMessage({
            conversationId: conversation.id,
            text: aiResponse.content
        });


    // 6. Respondemos
    return {
        conversationId: conversation.id,
        message: assistantMessage
    };
}

Hay un detalle interesante acá:

Prisma guarda:

USER
ASSISTANT
SYSTEM

pero LangChain recibe:

user
assistant
system

Por eso hacemos:

role: message.role.toLowerCase()
5. Probar /chat

Ahora manda exactamente el mismo request que ya te funcionaba:

{
    "externalUserId": "usuario-test-001",
    "channel": "WEB",
    "name": "Usuario Test",
    "text": "Hola, mi nombre es Juan"
}

Deberías recibir algo parecido a:

{
    "conversationId": "uuid...",
    "message": {
        "id": "uuid...",
        "conversationId": "uuid...",
        "role": "ASSISTANT",
        "content": "¡Hola Juan! ¿En qué puedo ayudarte?",
        "tokens": null,
        "promptTokens": null,
        "completionTokens": null
    }
}

Ahora haz una segunda petición:

{
    "externalUserId": "usuario-test-001",
    "channel": "WEB",
    "name": "Usuario Test",
    "text": "¿Cómo me llamo?"
}

Aquí está la prueba importante.

Como ConversationService recupera los últimos mensajes de la misma conversación, Qwen debería poder responder:

Te llamas Juan.

Si eso ocurre, acabamos de implementar la memoria de corto plazo del chatbot.

Después de comprobar esto

No agregaría todavía más funcionalidades. El siguiente paso sería sacar esto:

content: "Eres un asistente útil. Responde siempre en español."

del código.

Ahí implementaremos PromptRepository, para que personalidad, instrucciones y prompts del chatbot estén almacenados/configurados externamente y el ConversationOrchestrator no tenga prompts hardcodeados.

-----------------------------------------------------------------------------------------------------------------

ya está funcionando el flujo completo con Ollama: se guarda el mensaje del usuario, recuperas historial, Qwen responde y estás recibiendo response.content.

Ese texto:

¡Hola! Parece que te gusta repetir las frases 😄 ¿En qué puedo ayudarte hoy?

es justamente la respuesta generada por qwen3:4b.

Ahora haría una prueba importante de memoria corta. Envía primero:

{
  "externalUserId": "usuario-test-001",
  "channel": "WEB",
  "name": "Usuario Test",
  "text": "Mi color favorito es el verde"
}

y luego:

{
  "externalUserId": "usuario-test-001",
  "channel": "WEB",
  "name": "Usuario Test",
  "text": "¿Cuál es mi color favorito?"
}

Si responde “verde”, confirmamos que el historial de la conversación se está enviando correctamente al modelo.

El siguiente paso ya sería sacar este prompt hardcodeado:

{
  role: "system",
  content: "Eres un asistente útil. Responde siempre en español."
}

y leerlo desde PostgreSQL mediante PromptRepository, que era uno de los requisitos centrales del chatbot.

------------------------------------------------------------------------------------------------

Sigamos con PromptRepository + PromptService, para sacar el prompt hardcodeado del ConversationOrchestrator.

1. Repositorio de prompts

Crea:

src/domain/repositories/IPromptRepository.js
import IRepository from "./IRepository.js";

export default class IPromptRepository extends IRepository {
    async findActiveByName(name) {
        throw new Error("Method not implemented.");
    }
}

Luego:

src/infraestructure/repositories/prisma/PrismaPromptRepository.js
import BaseRepository from "../BaseRepository.js";

export default class PrismaPromptRepository extends BaseRepository {
    constructor(prisma) {
        super(prisma, "prompt");
    }

    async findActiveByName(name) {
        return this.model.findFirst({
            where: {
                name,
                active: true
            }
        });
    }
}

En RepositoryFactory.js agrega:

import PrismaPromptRepository from "./prisma/PrismaPromptRepository.js";

y:

prompt() {
    return new PrismaPromptRepository(this.prisma);
}
2. Crear PromptService

Ubicación:

src/application/services/PromptService.js
export default class PromptService {
    constructor({
        promptRepository,
        logger
    }) {
        this.promptRepository = promptRepository;
        this.logger = logger.child(this.constructor.name);
    }

    async getSystemPrompt() {
        const prompt =
            await this.promptRepository.findActiveByName("SYSTEM");

        if (!prompt) {
            throw new Error("No existe un prompt SYSTEM activo");
        }

        return prompt.content;
    }
}
3. Registrar PromptService en el container

En container.js:

import PromptService from "../application/services/PromptService.js";

Luego:

const promptRepository = RepositoryFactory.prompt();

this.promptService = new PromptService({
    promptRepository,
    logger: this.logger
});

Y al crear el orchestrator:

this.conversationOrchestrator =
    new ConversationOrchestrator({
        userRepository,
        channelRepository,
        conversationService: this.conversationService,
        promptService: this.promptService,
        aiProvider: this.aiProvider,
        logger: this.logger
    });
4. Modificar ConversationOrchestrator

En el constructor:

constructor({
    userRepository,
    channelRepository,
    conversationService,
    promptService,
    aiProvider,
    logger
}) {
    this.userRepository = userRepository;
    this.channelRepository = channelRepository;
    this.conversationService = conversationService;
    this.promptService = promptService;
    this.aiProvider = aiProvider;

    this.logger = logger.child(this.constructor.name);
}

Y reemplaza esto:

{
    role: "system",
    content: "Eres un asistente útil. Responde siempre en español."
}

por:

const systemPrompt =
    await this.promptService.getSystemPrompt();

const messages = [
    {
        role: "system",
        content: systemPrompt
    },
    ...history.map(message => ({
        role: message.role.toLowerCase(),
        content: message.content
    }))
];
5. Crear el prompt en PostgreSQL

Puedes hacerlo desde Prisma Studio o SQL.

Por ejemplo:

INSERT INTO "Prompt" (
    "id",
    "name",
    "type",
    "content",
    "active",
    "createdAt",
    "updatedAt"
)
VALUES (
    gen_random_uuid(),
    'SYSTEM',
    'SYSTEM',
    'Eres un asistente de consultas. Responde siempre en español de forma clara y breve.',
    true,
    NOW(),
    NOW()
);

Si tu modelo Prompt tiene otros campos obligatorios, ajustamos ese INSERT.

6. Probar

Haz el mismo POST /chat.

Ahora la personalidad ya no viene del código:

POST /chat
   ↓
PromptService
   ↓
PromptRepository
   ↓
PostgreSQL
   ↓
SYSTEM prompt
   ↓
Ollama

Y lo mejor: puedes cambiar en DB:

Eres un asistente de consultas...

por:

Eres un asistente especializado en turnos médicos...

sin tocar el ConversationOrchestrator.

Después de esto, el siguiente paso natural es crear el segundo prompt, SUMMARY, y empezar a implementar el resumidor automático cuando la conversación supere cierto límite de tokens.

-----------------------------------------------------------------------------------------------------------------------------------------------------

Perfecto. Entonces sigamos con el punto que quedó pendiente: usar el prompt desde la base y dejar de tenerlo hardcodeado.

Como te apareció la columna type, yo aprovecharía eso y haría que el servicio busque por tipo en vez de por name, porque conceptualmente queda más claro para cosas como SYSTEM, SUMMARY, etc.

Por ejemplo, si tu tabla Prompt tiene algo parecido a:

model Prompt {
  id        String   @id @default(uuid())
  name      String
  type      String
  content   String
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

entonces cambia el repositorio a esto:

async findActiveByType(type) {
    return this.model.findFirst({
        where: {
            type,
            active: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });
}

En PromptService.js:

export default class PromptService {
    constructor({
        promptRepository,
        logger
    }) {
        this.promptRepository = promptRepository;
        this.logger = logger.child(this.constructor.name);
    }

    async getSystemPrompt() {
        const prompt =
            await this.promptRepository.findActiveByType("SYSTEM");

        if (!prompt) {
            throw new Error("No existe un prompt SYSTEM activo");
        }

        return prompt.content;
    }
}

Y en ConversationOrchestrator:

const systemPrompt =
    await this.promptService.getSystemPrompt();

const messages = [
    {
        role: "system",
        content: systemPrompt
    },
    ...history.map(message => ({
        role: message.role.toLowerCase(),
        content: message.content
    }))
];

const aiResponse =
    await this.aiProvider.generate(messages);

Ahora prueba cambiando el contenido del prompt en PostgreSQL, por ejemplo:

UPDATE "Prompt"
SET "content" =
    'Eres un asistente muy breve. Responde siempre en español y en máximo dos oraciones.'
WHERE "type" = 'SYSTEM'
  AND "active" = true;

Luego manda otra consulta al /chat.

Si Qwen empieza a responder más corto, ya confirmamos que el prompt se está leyendo dinámicamente desde PostgreSQL.

Después de eso, el siguiente paso que te recomiendo es implementar SUMMARY, porque ya tienes summaryLimit en la configuración. Ahí podremos evitar mandar todo el historial completo a Qwen cuando la conversación crezca.

---------------------------------------------------------------------------------------------









# Compilar
<!-- despues de cambiar prisma se hace  -->
npx prisma format
<!-- move_channel_to_conversation este nombre cambia segun la tarea  -->
npx prisma migrate dev --name move_channel_to_conversation 
<!-- si no funciona -->
npx prisma generate

<!-- si falla wsl -->
abrir administrador de tareas
ir a servicios
ir a servicios dentro
buscar wsl service
iniciar
<!-- para compilar con base y todo hay que levantar docker -->
1ERO ABRIR APLICACION DOCKER DESKTOP
docker compose up -d
docker ps
la 1er vez
npx prisma generate
npm run dev


BASE

INSERT INTO "Channel" ("id", "name")
VALUES (gen_random_uuid(), 'WEB');

SELECT * FROM "User";


INSERT INTO "Prompt" (
    "id",
    "name",
    "type",
    "content",
    "active",
    "createdAt",
    "updatedAt"
)
VALUES (
    gen_random_uuid(),
    'SYSTEM',
    'SYSTEM',
    'Eres un asistente de consultas. Responde siempre en español de forma clara y breve.',
    true,
    NOW(),
    NOW()
);

UPDATE "Prompt"
SET "content" =
    'Eres un asistente muy breve. Responde siempre en español y en máximo dos oraciones.'
WHERE "type" = 'SYSTEM'
  AND "active" = true;


POSTMAN

POST http://localhost:3000/chat
/*{
  "userId": "df7b9e45-ef33-403a-b92b-6afe7c0cb3dc",
  "channelId": "dd32e503-753a-4173-95dd-7933abf875f7",
  "text": "Hola"
}
{
    "externalUserId": "123456",
    "channel": "WEB",
    "name": "Veronica",
    "text": "Hola"
}*/
{
  "externalUserId": "usuario-test-001",
  "channel": "WEB",
  "name": "Usuario Test",
  "text": "¿Cuál es mi color favorito?"
}

GET http://localhost:3000/users/df7b9e45-ef33-403a-b92b-6afe7c0cb3dc
{
  "userId": "UUID_DE_UN_USUARIO_EXISTENTE",
  "channelId": "UUID_DE_UN_CANAL_EXISTENTE",
  "text": "Hola"
}

POST http://localhost:3000/users
{
  "externalId": "1",
  "name": "Veronica",
  "channel": "WEB"
}
/*{
    "externalId": "1",
    "name": "A"
}*/