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

# Compilar
docker compose up -d
docker ps


