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
Verificar que este funcionando:
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

La arquitectura que propongo
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

Objetivo

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

Paso 1 - Crear la carpeta
src/
│
└── shared/
    ├── errors/
    ├── middleware/
    └── response/
Paso 2 - AppError

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

Paso 3 - NotFoundError

NotFoundError.js

import AppError from "./AppError.js";

export default class NotFoundError extends AppError {

    constructor(message = "Recurso no encontrado") {

        super(message, 404, "NOT_FOUND");

    }

}
Paso 4 - ValidationError
import AppError from "./AppError.js";

export default class ValidationError extends AppError {

    constructor(message = "Datos inválidos") {

        super(message, 400, "VALIDATION_ERROR");

    }

}
Paso 5 - ConflictError

Lo vamos a necesitar cuando exista un usuario.

import AppError from "./AppError.js";

export default class ConflictError extends AppError {

    constructor(message = "Conflicto") {

        super(message,409,"CONFLICT");

    }

}
Paso 6 - ApiResponse

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

Paso 7 - Error Middleware

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
Paso 8 - Registrar el middleware

En app.js, siempre al final:

import errorHandler from "./shared/middleware/errorHandler.js";

...

app.use(errorHandler);

Debe ir después de todas las rutas.

Paso 9 - Modificar el controlador

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

Paso 10 - Empezar a usar AppError

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

Paso 1

Crea una carpeta nueva

src/
│
├── shared/
│
└── interfaces/
    └── http/
        └── validators/
Paso 2
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
Paso 3

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

Paso 4

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

Nivel 1 - Validaciones básicas (ya lo hicimos)
const createUserSchema = z.object({
    externalId: z.string().min(1),
    name: z.string().min(2),
    channel: z.string().min(1)
});
Nivel 2 - Mensajes personalizados

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

Nivel 3 - Enum

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

Nivel 4 - Schemas reutilizables

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

Nivel 5 - Validar parámetros

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

Nivel 6 - Separar Create y Update

Nunca reutilizaría el mismo schema.

CreateUserSchema
UpdateUserSchema

Porque en Update normalmente:

todos los campos son opcionales

Mientras que Create:

son obligatorios.
Nivel 7 - DTO

Aquí empieza a parecerse a un framework profesional.

En lugar de pasar:

req.body

Pasamos un DTO validado.

CreateUserDTO
const dto = createUserSchema.parse(req.body);

await createUserUseCase.execute(dto);

Ya nunca llega información inválida al UseCase.

Nivel 8 - Validaciones de negocio

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


# Compilar
<!-- para que funcione la base hay que levantar docker -->
docker compose up -d
docker ps

<!-- despues de cambiar prisma se hace  -->
npx prisma format
<!-- move_channel_to_conversation este nombre cambia segun la tarea  -->
npx prisma migrate dev --name move_channel_to_conversation 
<!-- si no funciona -->
npx prisma generate

npm run dev