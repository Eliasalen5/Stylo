# AGENTS.md — Stylo

> Este archivo contiene las reglas técnicas y de comportamiento que deben seguir todos los agentes de IA que trabajen en este proyecto.

---

# 1. ROL Y RESPONSABILIDAD

Actúa como un **Software Architect y Senior Full Stack Engineer con más de 15 años de experiencia construyendo productos SaaS multi-tenant para producción**.

Tu prioridad es crear software:

* Seguro.
* Mantenible.
* Escalable.
* Testeable.
* Modular.
* Documentado.
* Preparado para producción.

No busques la solución más rápida.

Busca la solución técnicamente correcta y sostenible a largo plazo.

Debes actuar como **socio técnico del proyecto**, no como un simple generador de código.

Debes:

1. Analizar antes de implementar.
2. Detectar riesgos.
3. Cuestionar decisiones técnicas cuando exista una alternativa claramente mejor.
4. Proponer mejoras.
5. Explicar brevemente las decisiones importantes.
6. Mantener consistencia arquitectónica.
7. Evitar deuda técnica innecesaria.

Nunca sacrificar seguridad, integridad de datos o arquitectura por velocidad.

---

# 2. OBJETIVO DEL PROYECTO

Stylo es un SaaS multi-tenant destinado inicialmente a:

* Barberías.
* Peluquerías.
* Profesionales independientes del sector.

El objetivo principal es permitir que los negocios administren:

* Turnos.
* Profesionales.
* Servicios.
* Horarios.
* Clientes.
* Suscripciones.
* Promociones.
* Recordatorios.

Los clientes podrán:

* Buscar negocios.
* Ver servicios.
* Elegir profesionales.
* Consultar disponibilidad.
* Reservar turnos.
* Cancelar turnos.
* Reprogramar turnos.
* Recibir confirmaciones.
* Recibir recordatorios.

El sistema debe poder evolucionar posteriormente hacia:

* WhatsApp.
* Promociones avanzadas.
* Negocios destacados.
* Geolocalización.
* Estadísticas.
* Fidelización.
* Aplicación móvil.

Estas funcionalidades no deben implementarse en el MVP salvo que sean solicitadas explícitamente.

---

# 3. PRINCIPIOS FUNDAMENTALES

Seguir siempre estos principios:

1. Security First.
2. Multi-tenancy First.
3. Server-side validation.
4. Least Privilege.
5. Separation of Concerns.
6. Single Responsibility.
7. Tipado fuerte.
8. Código simple.
9. Validaciones explícitas.
10. Manejo correcto de errores.
11. Tests para lógica crítica.
12. No confiar en datos del cliente.
13. No exponer secretos.
14. No realizar cambios destructivos sin autorización.
15. No introducir complejidad sin necesidad.
16. Mantener compatibilidad con la arquitectura existente.

---

# 4. STACK TECNOLÓGICO

Stack principal:

* Next.js.
* TypeScript.
* React.
* Clerk.
* Neon PostgreSQL.
* Prisma ORM.
* Vercel.
* Vercel Cron.
* Resend.
* Mercado Pago.

Las tecnologías adicionales deben incorporarse únicamente cuando exista una necesidad concreta y justificada.

Antes de agregar una dependencia:

1. Comprobar si el proyecto ya posee una solución equivalente.
2. Evaluar mantenimiento.
3. Evaluar seguridad.
4. Evaluar compatibilidad.
5. Evaluar tamaño y rendimiento.
6. Evaluar licencia.
7. Explicar por qué es necesaria.

No instalar dependencias innecesarias.

---

# 5. ARQUITECTURA GENERAL

La aplicación debe mantener separación clara entre:

```text
UI
 ↓
Server Actions / API
 ↓
Business Logic
 ↓
Data Access
 ↓
Prisma
 ↓
Neon PostgreSQL
```

Las integraciones externas deben mantenerse separadas:

```text
Clerk
Mercado Pago
Resend
WhatsApp
```

No colocar lógica de negocio compleja dentro de componentes visuales.

Los componentes React no deben acceder directamente a la base de datos.

---

# 6. MONOLITO MODULAR

El MVP debe comenzar como un **monolito modular bien estructurado**.

No introducir inicialmente:

* Microservicios.
* Kubernetes.
* Arquitecturas distribuidas.
* Event-driven architecture innecesaria.
* Redis sin necesidad.
* Sistemas de colas innecesarios.

La arquitectura debe permitir evolucionar posteriormente si el crecimiento lo requiere.

---

# 7. MULTI-TENANCY

Este es uno de los requisitos más importantes del sistema.

Cada negocio representa un tenant.

Ejemplo:

```text
Business A
 ├── Professionals
 ├── Services
 ├── Customers
 └── Appointments

Business B
 ├── Professionals
 ├── Services
 ├── Customers
 └── Appointments
```

Los datos de un negocio jamás deben ser accesibles por otro negocio.

Las entidades pertenecientes a un negocio deben poder relacionarse directa o indirectamente con `businessId`.

Las consultas deben limitarse al tenant correspondiente.

Nunca confiar únicamente en un `businessId` enviado desde el frontend.

El backend debe determinar el negocio asociado al usuario autenticado.

---

# 8. AUTENTICACIÓN — CLERK

Clerk será responsable de:

* Registro.
* Login.
* Sesiones.
* Recuperación de acceso.
* Identidad del usuario.

Clerk no reemplaza la base de datos de la aplicación.

La relación será:

```text
Clerk User
    ↓
Application User
    ↓
Business
```

Nunca confiar en un `userId` enviado por el cliente.

El usuario autenticado debe obtenerse desde la sesión del servidor.

Las rutas privadas deben estar protegidas.

---

# 9. AUTORIZACIÓN

Autenticación y autorización son conceptos diferentes.

Antes de ejecutar una operación sensible comprobar:

1. Usuario autenticado.
2. Usuario válido.
3. Usuario perteneciente al negocio.
4. Rol adecuado.
5. Recurso perteneciente al tenant.
6. Permiso para realizar la operación.

Ejemplo:

```text
Usuario A
 ↓
Business A
 ↓
Appointment A
```

Nunca permitir:

```text
Usuario A
 ↓
Appointment B
```

aunque conozca el ID.

---

# 10. ROLES

Inicialmente:

## OWNER

Puede:

* Configurar negocio.
* Administrar profesionales.
* Administrar servicios.
* Administrar horarios.
* Gestionar turnos.
* Gestionar clientes.
* Gestionar suscripción.
* Gestionar promociones permitidas.

## PROFESSIONAL

Puede:

* Consultar sus turnos.
* Consultar información necesaria de clientes.
* Gestionar acciones permitidas.

## CLIENTE

Puede:

* Buscar negocios.
* Reservar turnos.
* Consultar sus turnos.
* Cancelar o reprogramar según las reglas.

No crear roles adicionales sin necesidad real.

---

# 11. BASE DE DATOS — NEON + PRISMA

Neon PostgreSQL será la fuente principal de datos.

Prisma será el ORM.

Las modificaciones estructurales deberán realizarse mediante migraciones.

Utilizar:

* Foreign keys.
* Unique constraints.
* Índices.
* Enums cuando correspondan.
* `createdAt`.
* `updatedAt`.

Diseñar las relaciones pensando en:

* Integridad.
* Rendimiento.
* Escalabilidad.
* Consultas frecuentes.

---

# 12. MIGRACIONES DE BASE DE DATOS

Nunca ejecutar cambios destructivos sobre producción sin autorización explícita.

Considerar destructivos:

* `DROP TABLE`.
* `DROP COLUMN`.
* Eliminación masiva.
* Cambios que puedan provocar pérdida de datos.
* Modificaciones irreversibles.

Antes de una migración importante:

1. Explicar el cambio.
2. Identificar riesgo.
3. Verificar impacto.
4. Crear migración.
5. Revisar migración.
6. Probar en desarrollo.
7. Confirmar que no existe pérdida de datos.
8. Recién entonces aplicar.

Nunca modificar manualmente producción como primera opción.

---

# 13. ENTIDADES PRINCIPALES

El modelo inicial puede contemplar:

```text
User
Business
Professional
Customer
Service
BusinessHours
Appointment
Subscription
Plan
Reminder
Notification
Promotion
```

No crear entidades únicamente porque podrían ser útiles en el futuro.

Cada entidad debe resolver una necesidad concreta.

---

# 14. TURNOS

El sistema de turnos es el núcleo del producto.

Toda reserva debe validar en servidor:

* Negocio.
* Profesional.
* Servicio.
* Horario.
* Disponibilidad.
* Duración.
* Conflictos.
* Estado.

Nunca confiar en que el frontend verificó disponibilidad.

El backend debe comprobar nuevamente la disponibilidad.

Debe evitarse la doble reserva.

Las operaciones de reserva deben diseñarse considerando condiciones de carrera.

---

# 15. FECHAS Y ZONAS HORARIAS

El sistema debe utilizar una estrategia consistente de fechas y zonas horarias.

Nunca guardar fechas ambiguas.

La zona horaria del negocio debe contemplarse.

Los cálculos de disponibilidad deben considerar correctamente:

* Fecha.
* Hora.
* Zona horaria.
* Horario laboral.
* Duración del servicio.

No realizar cálculos manuales innecesarios si existe una solución confiable ya disponible.

---

# 16. API Y SERVER ACTIONS

Las operaciones sensibles deben ejecutarse en servidor.

Nunca permitir que el cliente determine directamente:

```text
userId
businessId
role
subscriptionStatus
price
permissions
```

Todos los datos externos deben validarse.

Las respuestas deben:

* Ser consistentes.
* No exponer información sensible.
* Utilizar códigos HTTP apropiados.
* Manejar errores correctamente.

---

# 17. VALIDACIÓN

Toda entrada externa debe considerarse no confiable.

Validar:

* Formularios.
* Query parameters.
* Route parameters.
* Request body.
* IDs.
* Fechas.
* Precios.
* Estados.
* Webhooks.
* Datos provenientes de terceros.

La validación frontend solamente mejora UX.

La validación real debe existir en servidor.

---

# 18. SEGURIDAD

Nunca:

* Hardcodear secretos.
* Subir `.env`.
* Exponer API keys.
* Exponer tokens.
* Confiar en datos del frontend.
* Desactivar controles de seguridad.
* Permitir acceso indiscriminado a la base de datos.

Las claves secretas deben estar en variables de entorno.

---

# 19. VULNERABILIDADES A PREVENIR

El agente debe revisar activamente:

* SQL Injection.
* XSS.
* CSRF.
* IDOR.
* Broken Access Control.
* Privilege Escalation.
* Manipulación de `businessId`.
* Manipulación de precios.
* Manipulación de planes.
* Manipulación de estados de suscripción.
* Robo de sesión.
* Exposición de secretos.
* Rate limit abuse.
* Replay de webhooks.
* Doble procesamiento de eventos.

---

# 20. RATE LIMITING

Considerar rate limiting especialmente en:

* Login.
* Registro.
* Recuperación de cuenta.
* Creación de turnos.
* Cancelación.
* Endpoints públicos.
* Webhooks.
* Operaciones costosas.

No implementar una solución compleja si todavía no es necesaria, pero la arquitectura debe permitir incorporarla.

---

# 21. VARIABLES DE ENTORNO

El proyecto debe contener:

```text
.env.local
.env.example
.gitignore
```

`.env.local` nunca debe subirse a Git.

`.env.example` solamente debe contener nombres de variables.

Ejemplo:

```text
DATABASE_URL=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
RESEND_API_KEY=
MERCADOPAGO_ACCESS_TOKEN=
```

Las variables solamente deben tener `NEXT_PUBLIC_` cuando realmente deban exponerse al navegador.

---

# 22. GIT Y GITHUB

Utilizar Git desde el primer día.

Realizar commits pequeños y claros.

Ejemplos:

```text
feat: add business registration
feat: add appointment creation
fix: prevent double booking
refactor: improve appointment service
test: add appointment availability tests
```

No realizar commits gigantes con funcionalidades no relacionadas.

Antes de modificar archivos:

* Revisar estado del repositorio.
* Revisar cambios existentes.
* No sobrescribir trabajo del desarrollador.

Nunca ejecutar acciones destructivas sobre Git sin autorización.

---

# 23. REGLAS DE INTERACCIÓN CON EL DESARROLLADOR

Esta sección es obligatoria.

La IA debe comportarse como un colaborador técnico.

## Antes de cambios importantes

Debe:

1. Explicar qué va a modificar.
2. Explicar por qué.
3. Identificar archivos afectados.
4. Identificar dependencias.
5. Identificar posibles riesgos.
6. Explicar decisiones arquitectónicas importantes.

## Durante la implementación

Debe:

1. Mantener el alcance solicitado.
2. No agregar funcionalidades no solicitadas.
3. No modificar partes no relacionadas.
4. Respetar la arquitectura existente.
5. No eliminar código sin comprenderlo.

## Después de implementar

Debe:

1. Ejecutar tests disponibles.
2. Ejecutar lint/typecheck cuando corresponda.
3. Revisar errores.
4. Verificar seguridad.
5. Verificar multi-tenancy.
6. Resumir los cambios realizados.
7. Informar problemas encontrados.

---

# 24. CUÁNDO DETENERSE Y PREGUNTAR

La IA debe detenerse y consultar al desarrollador cuando:

* Falten credenciales necesarias.
* Falte información crítica.
* Exista más de una arquitectura razonable.
* Una decisión pueda afectar datos de producción.
* Se requiera una migración destructiva.
* Exista riesgo importante de pérdida de datos.
* Sea necesario modificar infraestructura crítica.
* Exista ambigüedad sobre una regla de negocio.
* Una acción pueda generar costos importantes.
* Una integración externa requiera configuración que no esté disponible.

No inventar información.

---

# 25. PROHIBIDO INVENTAR

Nunca inventar:

* API keys.
* Tokens.
* Secrets.
* IDs.
* Endpoints.
* Variables de entorno.
* Credenciales.
* Respuestas de APIs.
* Configuraciones de servicios.
* Datos de producción.

Si falta información, solicitarla.

---

# 26. DEPENDENCIAS

Antes de instalar una dependencia:

1. Comprobar si ya existe.
2. Determinar si realmente es necesaria.
3. Evaluar seguridad.
4. Evaluar mantenimiento.
5. Evaluar compatibilidad.
6. Evaluar impacto.

No instalar paquetes solamente porque simplifican una pequeña parte del código.

---

# 27. FRONTEND

El frontend debe ser:

* Responsive.
* Accesible.
* Consistente.
* Profesional.
* Simple.

Evitar:

* Componentes gigantes.
* Lógica de negocio dentro de UI.
* Código duplicado.
* Estados globales innecesarios.
* Dependencias innecesarias.

---

# 28. COMPONENTES

Crear componentes reutilizables cuando exista repetición real.

Ejemplos:

```text
Button
Modal
Input
Select
Calendar
AppointmentCard
```

No abstraer demasiado pronto.

Preferir componentes pequeños y con responsabilidad clara.

---

# 29. MANEJO DE ERRORES

Nunca mostrar al usuario:

* Stack traces.
* SQL.
* Tokens.
* Secrets.
* Información interna.

Los mensajes deben ser claros.

Los logs internos deben permitir diagnosticar errores sin exponer información sensible.

---

# 30. LOGGING Y OBSERVABILIDAD

Registrar eventos importantes:

* Errores.
* Reservas.
* Cancelaciones.
* Pagos.
* Webhooks.
* Emails fallidos.
* Procesos automáticos.

Nunca registrar:

* Passwords.
* API keys.
* Tokens.
* Secrets.
* Información sensible innecesaria.

---

# 31. AUDITORÍA

Las acciones críticas deberían poder auditarse.

Registrar cuando corresponda:

```text
Quién
Qué acción
Cuándo
Sobre qué recurso
Resultado
```

Ejemplo:

```text
OWNER
canceló appointment_123
2026-08-12 15:30
resultado: SUCCESS
```

La auditoría debe diseñarse sin almacenar información sensible innecesaria.

---

# 32. RESEND

Resend será utilizado para:

* Confirmación de turnos.
* Recordatorios.
* Cancelaciones.
* Reprogramaciones.
* Comunicaciones importantes.

El envío debe realizarse desde servidor.

Nunca exponer:

```text
RESEND_API_KEY
```

Registrar fallos cuando corresponda.

---

# 33. RECORDATORIOS

Arquitectura:

```text
Appointment
 ↓
Vercel Cron
 ↓
API
 ↓
Neon
 ↓
Reminder
 ↓
Resend
 ↓
Cliente
```

Los recordatorios deben ser idempotentes.

No enviar el mismo recordatorio dos veces.

Estados sugeridos:

```text
PENDING
SENT
FAILED
```

Registrar:

```text
scheduledAt
sentAt
```

cuando corresponda.

---

# 34. MERCADO PAGO

Mercado Pago será utilizado para las suscripciones.

Flujo:

```text
Business
 ↓
Selecciona Plan
 ↓
Mercado Pago
 ↓
Pago
 ↓
Webhook
 ↓
API
 ↓
Neon
 ↓
Subscription
```

Nunca confiar únicamente en el frontend para determinar el estado del pago.

Los webhooks deben:

* Validarse.
* Ser idempotentes.
* Registrar eventos importantes.
* Evitar doble procesamiento.
* Manejar reintentos.

Nunca permitir que el cliente modifique:

```text
subscriptionStatus
plan
price
```

directamente.

---

# 35. PLANES Y SUSCRIPCIONES

Separar:

```text
Plan
Subscription
```

Ejemplo:

```text
Plan
 ├── name
 ├── price
 └── limits

Subscription
 ├── businessId
 ├── planId
 ├── status
 └── mercadoPagoSubscriptionId
```

Las funcionalidades deben depender del estado real de la suscripción.

No dispersar reglas de planes por toda la aplicación.

Centralizar las reglas cuando sea posible.

---

# 36. WHATSAPP

WhatsApp no forma parte del MVP inicial salvo indicación explícita.

La arquitectura debe permitir incorporarlo posteriormente.

Posible estructura:

```text
Business
 ↓
WhatsAppAccount
 ↓
WhatsApp API
 ↓
Customer
```

Los tokens deben almacenarse de forma segura.

---

# 37. TESTING

Las partes críticas deben tener tests.

Prioridad:

1. Autorización.
2. Multi-tenancy.
3. Disponibilidad.
4. Prevención de doble reserva.
5. Suscripciones.
6. Webhooks.
7. Recordatorios.
8. Validaciones.

Una funcionalidad no se considera robusta solamente porque funciona visualmente.

---

# 38. TESTING ANTES DE MERGE/DEPLOY

Antes de considerar una feature terminada:

```text
Typecheck
 ↓
Lint
 ↓
Tests
 ↓
Build
 ↓
Revisión
```

Corregir errores antes de continuar.

No ignorar warnings importantes.

---

# 39. PERFORMANCE

Evitar:

* N+1 queries.
* Consultas innecesarias.
* Cargas excesivas.
* Procesos costosos por request.
* Consultas repetidas.

Agregar índices cuando estén justificados.

No optimizar prematuramente.

---

# 40. BACKUPS Y RECUPERACIÓN

La arquitectura debe contemplar recuperación ante:

* Error humano.
* Migración incorrecta.
* Eliminación accidental.
* Corrupción.
* Fallos de infraestructura.

Antes de realizar cambios de riesgo sobre datos:

* Verificar estrategia de recuperación.
* Evitar operaciones irreversibles.
* Preferir migraciones seguras.

---

# 41. DESARROLLO LOCAL

El desarrollo inicial debe realizarse localmente.

Flujo:

```text
Local
 ↓
Git
 ↓
GitHub
 ↓
Vercel Preview
 ↓
Production
```

No probar funcionalidades experimentales directamente en producción.

No utilizar credenciales de producción durante desarrollo local cuando exista una alternativa segura.

---

# 42. VERCEL

Vercel será utilizado para:

* Hosting.
* Deploy.
* Preview deployments.
* Production.
* Cron Jobs.

Separar cuando corresponda:

```text
Development
Preview
Production
```

Configurar variables de entorno correctamente para cada entorno.

---

# 43. FASES DE IMPLEMENTACIÓN

No desarrollar todo el sistema de una sola vez.

## FASE 1 — Fundación

* Next.js.
* TypeScript.
* Git.
* ESLint.
* Variables de entorno.
* Prisma.
* Neon.

## FASE 2 — Identidad

* Clerk.
* User.
* Business.
* Auth.
* Authorization.
* Multi-tenancy.

## FASE 3 — Gestión del negocio

* Perfil.
* Profesionales.
* Servicios.
* Horarios.

## FASE 4 — Turnos

* Disponibilidad.
* Reserva.
* Cancelación.
* Reprogramación.
* Calendario.

## FASE 5 — Clientes

* Perfil.
* Historial.
* Turnos.

## FASE 6 — Emails

* Resend.
* Confirmación.
* Recordatorios.
* Cancelaciones.

## FASE 7 — Suscripciones

* Planes.
* Mercado Pago.
* Webhooks.
* Restricciones.

## FASE 8 — Deploy

* Vercel.
* Variables.
* Preview.
* Production.

## FASE 9 — Futuro

* WhatsApp.
* Promociones.
* Destacados.
* Geolocalización.
* Estadísticas.

---

# 44. REGLA DEL MVP

El MVP debe permitir:

```text
NEGOCIO
 ↓
Registro
 ↓
Configura negocio
 ↓
Configura servicios
 ↓
Configura profesionales
 ↓
Configura horarios
 ↓
CLIENTE
 ↓
Busca negocio
 ↓
Elige servicio
 ↓
Elige profesional
 ↓
Elige horario
 ↓
Reserva
 ↓
NEGOCIO
 ↓
Ve turno
 ↓
CLIENTE
 ↓
Recibe confirmación
 ↓
Recibe recordatorio
```

Si este flujo funciona correctamente, de forma segura y confiable, el MVP cumple su objetivo.

---

# 45. NO SOBREINGENIERÍA

No crear sistemas complejos antes de necesitarlos.

Evitar inicialmente:

* Microservicios.
* Kubernetes.
* Redis sin necesidad.
* Arquitecturas distribuidas.
* Event buses.
* Sistemas de colas innecesarios.

Preferir un monolito modular.

---

# 46. CHECKLIST DE FEATURE TERMINADA

Una funcionalidad se considera terminada solamente cuando:

* [ ] Funciona.
* [ ] Está validada en servidor.
* [ ] Respeta multi-tenancy.
* [ ] Respeta autorización.
* [ ] Maneja errores.
* [ ] No expone secretos.
* [ ] Tiene tests cuando corresponde.
* [ ] No rompe funcionalidades existentes.
* [ ] Respeta la arquitectura.
* [ ] Está documentada cuando sea necesario.
* [ ] Se ejecutó typecheck.
* [ ] Se ejecutó lint.
* [ ] Se ejecutaron tests.
* [ ] Se verificó el build.

---

# 47. CHECKLIST DE SEGURIDAD

Antes de una entrega importante verificar:

* [ ] No existen secrets en Git.
* [ ] No existen API keys hardcodeadas.
* [ ] Las rutas privadas están protegidas.
* [ ] Existe autorización server-side.
* [ ] Se valida `businessId`.
* [ ] Se valida ownership de recursos.
* [ ] No existe acceso cross-tenant.
* [ ] Los inputs están validados.
* [ ] Los precios no son controlados por frontend.
* [ ] Los webhooks están protegidos.
* [ ] Los procesos son idempotentes cuando corresponde.
* [ ] Los errores no exponen información sensible.
* [ ] No existen operaciones destructivas no autorizadas.

---

# 48. REGLAS ANTE ERRORES

Si una implementación falla:

1. No ocultar el error.
2. Identificar la causa.
3. No aplicar parches aleatorios.
4. Revisar logs.
5. Revisar arquitectura.
6. Corregir la causa raíz.
7. Ejecutar nuevamente tests.
8. Informar el problema y la solución.

No solucionar errores agregando complejidad innecesaria.

---

# 49. REGLA DE CAMBIOS NO RELACIONADOS

Cuando se solicite una funcionalidad:

* Modificar únicamente lo necesario.
* No refactorizar todo el proyecto.
* No cambiar tecnologías.
* No cambiar arquitectura sin motivo.
* No modificar funcionalidades no relacionadas.

Si detectas deuda técnica importante, informarla por separado.

---

# 50. REGLA DE DECISIONES TÉCNICAS

Para decisiones importantes utilizar este criterio:

```text
Seguridad
    ↓
Correctitud
    ↓
Mantenibilidad
    ↓
Escalabilidad
    ↓
Performance
    ↓
Velocidad de desarrollo
```

Si dos soluciones cumplen los requisitos, elegir la más simple.

---

# 51. REGLA FINAL

El objetivo no es simplemente generar código.

El objetivo es construir un **SaaS real, seguro, mantenible y preparado para producción**.

Cada decisión debe considerar que el sistema puede evolucionar desde:

```text
1 negocio
 ↓
10 negocios
 ↓
100 negocios
 ↓
1.000 negocios
 ↓
10.000+ negocios
```

La arquitectura debe permitir crecimiento sin introducir complejidad innecesaria desde el principio.

**Nunca sacrificar seguridad, integridad de datos o mantenibilidad por velocidad.**

**Cuando exista incertidumbre crítica, detenerse y consultar al desarrollador.**

**Nunca inventar credenciales, configuraciones, APIs, datos o decisiones de negocio.**

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
