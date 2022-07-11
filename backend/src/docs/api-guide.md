# Graphql API Guidelines

### Table of contents

Common
== Common

Auth API
File API
Payment API
Project API
ProcessCategory API
ProjectFile API
ProjectParticipant API
QuestionBoard API
QuestionComment API
Schedule API
User API

```
f6b2-team5-server
├── backend
│   ├── Dockerfile
│   ├── README.md
│   ├── docker-compose.dev.yaml
│   ├── docker-compose.prod.yaml
│   ├── docker-compose.yaml
│   ├── gcp-upload-file.json
│   ├── nest-cli.json
│   ├── package.json
│   ├── src
│   │   ├── apis
│   │   │   ├── auth
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.resolver.ts
│   │   │   │   └── auth.service.ts
│   │   │   ├── chatting
│   │   │   │   ├── chatting.resolver.ts
│   │   │   │   ├── chatting.service.ts
│   │   │   │   └── entities
│   │   │   │       ├── chat.entity.ts
│   │   │   │       ├── room.entity.ts
│   │   │   │       └── user.entity.ts
│   │   │   ├── file
│   │   │   │   ├── file.module.ts
│   │   │   │   ├── file.resolver.ts
│   │   │   │   └── file.service.ts
│   │   │   ├── iamport
│   │   │   │   └── iamport.service.ts
│   │   │   ├── payment
│   │   │   │   ├── entities
│   │   │   │   │   └── payment.entity.ts
│   │   │   │   ├── payment.module.ts
│   │   │   │   ├── payment.resolver.ts
│   │   │   │   └── payment.service.ts
│   │   │   ├── processCategory
│   │   │   │   ├── entities
│   │   │   │   │   └── processCategory.entity.ts
│   │   │   │   ├── processCategory.module.ts
│   │   │   │   ├── processCategory.resolver.ts
│   │   │   │   └── processCategory.service.ts
│   │   │   ├── projectAddress
│   │   │   │   ├── dto
│   │   │   │   │   └── create.projectAddress.ts
│   │   │   │   └── entities
│   │   │   │       └── projectAddress.entity.ts
│   │   │   ├── projectFile
│   │   │   │   ├── dto
│   │   │   │   │   └── updateProjectFile.input.ts
│   │   │   │   ├── entities
│   │   │   │   │   └── projectFile.entity.ts
│   │   │   │   ├── projectFile.module.ts
│   │   │   │   ├── projectFile.resolver.ts
│   │   │   │   └── projectFile.service.ts
│   │   │   ├── projectParticipants
│   │   │   │   ├── entities
│   │   │   │   │   └── projectParticipant.entity.ts
│   │   │   │   ├── projectParticipant.module.ts
│   │   │   │   ├── projectParticipant.resolver.ts
│   │   │   │   └── projectParticipant.service.ts
│   │   │   ├── projects
│   │   │   │   ├── dto
│   │   │   │   │   ├── createProject.input.ts
│   │   │   │   │   └── updateProject.input.ts
│   │   │   │   ├── entities
│   │   │   │   │   └── project.entity.ts
│   │   │   │   ├── project.module.ts
│   │   │   │   ├── project.resolver.ts
│   │   │   │   └── project.service.ts
│   │   │   ├── questionBoards
│   │   │   │   ├── dto
│   │   │   │   │   ├── createQuestionBoard.input.ts
│   │   │   │   │   └── updateQuestionBoard.input.ts
│   │   │   │   ├── entities
│   │   │   │   │   └── questionBoard.entity.ts
│   │   │   │   ├── questionboards.module.ts
│   │   │   │   ├── questionboards.resolver.ts
│   │   │   │   └── questionboards.service.ts
│   │   │   ├── questionComments
│   │   │   │   ├── dto
│   │   │   │   │   ├── createQuestionComment.input.ts
│   │   │   │   │   └── updateQuestionComment.input.ts
│   │   │   │   ├── entities
│   │   │   │   │   └── questionComment.entity.ts
│   │   │   │   ├── questionComment.module.ts
│   │   │   │   ├── questionComment.resolver.ts
│   │   │   │   └── questionComment.service.ts
│   │   │   ├── schedule
│   │   │   │   ├── dto
│   │   │   │   │   ├── createSchedule.input.ts
│   │   │   │   │   └── updateSchedule.input.ts
│   │   │   │   ├── entities
│   │   │   │   │   └── schedule.entity.ts
│   │   │   │   ├── schedule.module.ts
│   │   │   │   ├── schedule.resolver.ts
│   │   │   │   └── schedule.service.ts
│   │   │   └── users
│   │   │       ├── dto
│   │   │       │   ├── createUser.input.ts
│   │   │       │   └── updateUser.input.ts
│   │   │       ├── entities
│   │   │       │   └── users.entity.ts
│   │   │       ├── user.module.ts
│   │   │       ├── user.resolver.ts
│   │   │       └── user.service.ts
│   │   ├── app.controller.spec.ts
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   ├── chat
│   │   │   ├── chat.gateway.ts
│   │   │   └── chat.module.ts
│   │   ├── chat.gateway.spec.ts
│   │   ├── common
│   │   │   ├── auth
│   │   │   │   ├── gql-auth.guard.ts
│   │   │   │   ├── gql-user.parm.ts
│   │   │   │   ├── jwt-access.strategy.ts
│   │   │   │   ├── jwt-refresh.strategy.ts
│   │   │   │   ├── jwt-social-google.strategy.ts
│   │   │   │   ├── jwt-social-kakao.strategy.ts
│   │   │   │   └── jwt-social-naver.strategy.ts
│   │   │   ├── filter
│   │   │   │   └── http-exception.filter.ts
│   │   │   └── graphql
│   │   │       └── schema.gql
│   │   ├── docs
│   │   │   └── api-guide.md
│   │   └── main.ts
│   ├── static
│   │   └── index.html
│   ├── test
│   │   ├── app.e2e-spec.ts
│   │   └── jest-e2e.json
│   ├── tsconfig.build.json
│   ├── tsconfig.json
│   └── yarn.lock
├── cloudbuild.yaml
└── frontend
    ├── email.html
    ├── img
    │   ├── back-ground.jpg
    │   ├── facebook.png
    │   ├── google.png
    │   ├── kakao.png
    │   ├── menu-back-ground.jpg
    │   ├── naver.png
    │   ├── starbucks.png
    │   └── user-back-ground.jpg
    ├── login
    │   ├── index.css
    │   └── index.html
    └── payment.html
```
