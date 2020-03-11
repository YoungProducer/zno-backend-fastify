// Code generated by Prisma (prisma@1.34.10). DO NOT EDIT.
  // Please don't change this file manually but run `prisma generate` to update it.
  // For more information, please read the docs: https://www.prisma.io/docs/prisma-client/

export const typeDefs = /* GraphQL */ `type AggregateSubject {
  count: Int!
}

type AggregateSubjectConfig {
  count: Int!
}

type AggregateToken {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type BatchPayload {
  count: Long!
}

type Exams {
  trainings: [String!]!
  sessions: [String!]!
}

input ExamsCreateInput {
  trainings: ExamsCreatetrainingsInput
  sessions: ExamsCreatesessionsInput
}

input ExamsCreateOneInput {
  create: ExamsCreateInput
}

input ExamsCreatesessionsInput {
  set: [String!]
}

input ExamsCreatetrainingsInput {
  set: [String!]
}

input ExamsUpdateDataInput {
  trainings: ExamsUpdatetrainingsInput
  sessions: ExamsUpdatesessionsInput
}

input ExamsUpdateOneInput {
  create: ExamsCreateInput
  update: ExamsUpdateDataInput
  upsert: ExamsUpsertNestedInput
  delete: Boolean
  disconnect: Boolean
}

input ExamsUpdatesessionsInput {
  set: [String!]
}

input ExamsUpdatetrainingsInput {
  set: [String!]
}

input ExamsUpsertNestedInput {
  update: ExamsUpdateDataInput!
  create: ExamsCreateInput!
}

input ExamsWhereInput {
  AND: [ExamsWhereInput!]
}

scalar Long

type Mutation {
  createSubject(data: SubjectCreateInput!): Subject!
  updateSubject(data: SubjectUpdateInput!, where: SubjectWhereUniqueInput!): Subject
  updateManySubjects(data: SubjectUpdateManyMutationInput!, where: SubjectWhereInput): BatchPayload!
  upsertSubject(where: SubjectWhereUniqueInput!, create: SubjectCreateInput!, update: SubjectUpdateInput!): Subject!
  deleteSubject(where: SubjectWhereUniqueInput!): Subject
  deleteManySubjects(where: SubjectWhereInput): BatchPayload!
  createSubjectConfig(data: SubjectConfigCreateInput!): SubjectConfig!
  updateSubjectConfig(data: SubjectConfigUpdateInput!, where: SubjectConfigWhereUniqueInput!): SubjectConfig
  updateManySubjectConfigs(data: SubjectConfigUpdateManyMutationInput!, where: SubjectConfigWhereInput): BatchPayload!
  upsertSubjectConfig(where: SubjectConfigWhereUniqueInput!, create: SubjectConfigCreateInput!, update: SubjectConfigUpdateInput!): SubjectConfig!
  deleteSubjectConfig(where: SubjectConfigWhereUniqueInput!): SubjectConfig
  deleteManySubjectConfigs(where: SubjectConfigWhereInput): BatchPayload!
  createToken(data: TokenCreateInput!): Token!
  updateToken(data: TokenUpdateInput!, where: TokenWhereUniqueInput!): Token
  updateManyTokens(data: TokenUpdateManyMutationInput!, where: TokenWhereInput): BatchPayload!
  upsertToken(where: TokenWhereUniqueInput!, create: TokenCreateInput!, update: TokenUpdateInput!): Token!
  deleteToken(where: TokenWhereUniqueInput!): Token
  deleteManyTokens(where: TokenWhereInput): BatchPayload!
  createUser(data: UserCreateInput!): User!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateManyUsers(data: UserUpdateManyMutationInput!, where: UserWhereInput): BatchPayload!
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  deleteUser(where: UserWhereUniqueInput!): User
  deleteManyUsers(where: UserWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Query {
  subject(where: SubjectWhereUniqueInput!): Subject
  subjects(where: SubjectWhereInput, orderBy: SubjectOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Subject]!
  subjectsConnection(where: SubjectWhereInput, orderBy: SubjectOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): SubjectConnection!
  subjectConfig(where: SubjectConfigWhereUniqueInput!): SubjectConfig
  subjectConfigs(where: SubjectConfigWhereInput, orderBy: SubjectConfigOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [SubjectConfig]!
  subjectConfigsConnection(where: SubjectConfigWhereInput, orderBy: SubjectConfigOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): SubjectConfigConnection!
  token(where: TokenWhereUniqueInput!): Token
  tokens(where: TokenWhereInput, orderBy: TokenOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Token]!
  tokensConnection(where: TokenWhereInput, orderBy: TokenOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): TokenConnection!
  user(where: UserWhereUniqueInput!): User
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  node(id: ID!): Node
}

enum Role {
  ADMIN
  DEFAULT_USER
}

type Subject {
  id: ID!
  name: String!
  isSubSubject: Boolean!
  parent: Subject
}

type SubjectConfig {
  id: ID!
  subject: Subject!
  themes: [String!]!
  subSubjects: [SubSubject!]
  exams: Exams
}

type SubjectConfigConnection {
  pageInfo: PageInfo!
  edges: [SubjectConfigEdge]!
  aggregate: AggregateSubjectConfig!
}

input SubjectConfigCreateInput {
  id: ID
  subject: SubjectCreateOneInput!
  themes: SubjectConfigCreatethemesInput
  subSubjects: SubSubjectCreateManyInput
  exams: ExamsCreateOneInput
}

input SubjectConfigCreatethemesInput {
  set: [String!]
}

type SubjectConfigEdge {
  node: SubjectConfig!
  cursor: String!
}

enum SubjectConfigOrderByInput {
  id_ASC
  id_DESC
}

type SubjectConfigPreviousValues {
  id: ID!
  themes: [String!]!
}

type SubjectConfigSubscriptionPayload {
  mutation: MutationType!
  node: SubjectConfig
  updatedFields: [String!]
  previousValues: SubjectConfigPreviousValues
}

input SubjectConfigSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: SubjectConfigWhereInput
  AND: [SubjectConfigSubscriptionWhereInput!]
}

input SubjectConfigUpdateInput {
  subject: SubjectUpdateOneRequiredInput
  themes: SubjectConfigUpdatethemesInput
  subSubjects: SubSubjectUpdateManyInput
  exams: ExamsUpdateOneInput
}

input SubjectConfigUpdateManyMutationInput {
  themes: SubjectConfigUpdatethemesInput
}

input SubjectConfigUpdatethemesInput {
  set: [String!]
}

input SubjectConfigWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  subject: SubjectWhereInput
  subSubjects_some: SubSubjectWhereInput
  subSubjects_every: SubSubjectRestrictedWhereInput
  subSubjects_none: SubSubjectRestrictedWhereInput
  exams: ExamsWhereInput
  AND: [SubjectConfigWhereInput!]
}

input SubjectConfigWhereUniqueInput {
  id: ID
}

type SubjectConnection {
  pageInfo: PageInfo!
  edges: [SubjectEdge]!
  aggregate: AggregateSubject!
}

input SubjectCreateInput {
  id: ID
  name: String!
  isSubSubject: Boolean
  parent: SubjectCreateOneInput
}

input SubjectCreateOneInput {
  create: SubjectCreateInput
  connect: SubjectWhereUniqueInput
}

type SubjectEdge {
  node: Subject!
  cursor: String!
}

enum SubjectOrderByInput {
  id_ASC
  id_DESC
  name_ASC
  name_DESC
  isSubSubject_ASC
  isSubSubject_DESC
}

type SubjectPreviousValues {
  id: ID!
  name: String!
  isSubSubject: Boolean!
}

type SubjectSubscriptionPayload {
  mutation: MutationType!
  node: Subject
  updatedFields: [String!]
  previousValues: SubjectPreviousValues
}

input SubjectSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: SubjectWhereInput
  AND: [SubjectSubscriptionWhereInput!]
}

input SubjectUpdateDataInput {
  name: String
  isSubSubject: Boolean
  parent: SubjectUpdateOneInput
}

input SubjectUpdateInput {
  name: String
  isSubSubject: Boolean
  parent: SubjectUpdateOneInput
}

input SubjectUpdateManyMutationInput {
  name: String
  isSubSubject: Boolean
}

input SubjectUpdateOneInput {
  create: SubjectCreateInput
  update: SubjectUpdateDataInput
  upsert: SubjectUpsertNestedInput
  delete: Boolean
  disconnect: Boolean
  connect: SubjectWhereUniqueInput
}

input SubjectUpdateOneRequiredInput {
  create: SubjectCreateInput
  update: SubjectUpdateDataInput
  upsert: SubjectUpsertNestedInput
  connect: SubjectWhereUniqueInput
}

input SubjectUpsertNestedInput {
  update: SubjectUpdateDataInput!
  create: SubjectCreateInput!
}

input SubjectWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  isSubSubject: Boolean
  isSubSubject_not: Boolean
  parent: SubjectWhereInput
  AND: [SubjectWhereInput!]
}

input SubjectWhereUniqueInput {
  id: ID
  name: String
}

type Subscription {
  subject(where: SubjectSubscriptionWhereInput): SubjectSubscriptionPayload
  subjectConfig(where: SubjectConfigSubscriptionWhereInput): SubjectConfigSubscriptionPayload
  token(where: TokenSubscriptionWhereInput): TokenSubscriptionPayload
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
}

type SubSubject {
  subject: Subject!
  themes: [String!]!
}

input SubSubjectCreateInput {
  subject: SubjectCreateOneInput!
  themes: SubSubjectCreatethemesInput
}

input SubSubjectCreateManyInput {
  create: [SubSubjectCreateInput!]
}

input SubSubjectCreatethemesInput {
  set: [String!]
}

input SubSubjectRestrictedWhereInput {
  AND: [SubSubjectRestrictedWhereInput!]
}

input SubSubjectScalarWhereInput {
  AND: [SubSubjectScalarWhereInput!]
  OR: [SubSubjectScalarWhereInput!]
  NOT: [SubSubjectScalarWhereInput!]
}

input SubSubjectUpdateManyDataInput {
  themes: SubSubjectUpdatethemesInput
}

input SubSubjectUpdateManyInput {
  create: [SubSubjectCreateInput!]
  deleteMany: [SubSubjectScalarWhereInput!]
  updateMany: [SubSubjectUpdateManyWithWhereNestedInput!]
}

input SubSubjectUpdateManyWithWhereNestedInput {
  where: SubSubjectScalarWhereInput!
  data: SubSubjectUpdateManyDataInput!
}

input SubSubjectUpdatethemesInput {
  set: [String!]
}

input SubSubjectWhereInput {
  subject: SubjectWhereInput
  AND: [SubSubjectWhereInput!]
}

type Token {
  id: ID!
  token: String!
  loginId: String!
  user: User!
}

type TokenConnection {
  pageInfo: PageInfo!
  edges: [TokenEdge]!
  aggregate: AggregateToken!
}

input TokenCreateInput {
  id: ID
  token: String!
  loginId: String!
  user: UserCreateOneWithoutRefreshTokensInput!
}

input TokenCreateManyWithoutUserInput {
  create: [TokenCreateWithoutUserInput!]
  connect: [TokenWhereUniqueInput!]
}

input TokenCreateWithoutUserInput {
  id: ID
  token: String!
  loginId: String!
}

type TokenEdge {
  node: Token!
  cursor: String!
}

enum TokenOrderByInput {
  id_ASC
  id_DESC
  token_ASC
  token_DESC
  loginId_ASC
  loginId_DESC
}

type TokenPreviousValues {
  id: ID!
  token: String!
  loginId: String!
}

input TokenScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  token: String
  token_not: String
  token_in: [String!]
  token_not_in: [String!]
  token_lt: String
  token_lte: String
  token_gt: String
  token_gte: String
  token_contains: String
  token_not_contains: String
  token_starts_with: String
  token_not_starts_with: String
  token_ends_with: String
  token_not_ends_with: String
  loginId: String
  loginId_not: String
  loginId_in: [String!]
  loginId_not_in: [String!]
  loginId_lt: String
  loginId_lte: String
  loginId_gt: String
  loginId_gte: String
  loginId_contains: String
  loginId_not_contains: String
  loginId_starts_with: String
  loginId_not_starts_with: String
  loginId_ends_with: String
  loginId_not_ends_with: String
  AND: [TokenScalarWhereInput!]
  OR: [TokenScalarWhereInput!]
  NOT: [TokenScalarWhereInput!]
}

type TokenSubscriptionPayload {
  mutation: MutationType!
  node: Token
  updatedFields: [String!]
  previousValues: TokenPreviousValues
}

input TokenSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: TokenWhereInput
  AND: [TokenSubscriptionWhereInput!]
}

input TokenUpdateInput {
  token: String
  loginId: String
  user: UserUpdateOneRequiredWithoutRefreshTokensInput
}

input TokenUpdateManyDataInput {
  token: String
  loginId: String
}

input TokenUpdateManyMutationInput {
  token: String
  loginId: String
}

input TokenUpdateManyWithoutUserInput {
  create: [TokenCreateWithoutUserInput!]
  delete: [TokenWhereUniqueInput!]
  connect: [TokenWhereUniqueInput!]
  set: [TokenWhereUniqueInput!]
  disconnect: [TokenWhereUniqueInput!]
  update: [TokenUpdateWithWhereUniqueWithoutUserInput!]
  upsert: [TokenUpsertWithWhereUniqueWithoutUserInput!]
  deleteMany: [TokenScalarWhereInput!]
  updateMany: [TokenUpdateManyWithWhereNestedInput!]
}

input TokenUpdateManyWithWhereNestedInput {
  where: TokenScalarWhereInput!
  data: TokenUpdateManyDataInput!
}

input TokenUpdateWithoutUserDataInput {
  token: String
  loginId: String
}

input TokenUpdateWithWhereUniqueWithoutUserInput {
  where: TokenWhereUniqueInput!
  data: TokenUpdateWithoutUserDataInput!
}

input TokenUpsertWithWhereUniqueWithoutUserInput {
  where: TokenWhereUniqueInput!
  update: TokenUpdateWithoutUserDataInput!
  create: TokenCreateWithoutUserInput!
}

input TokenWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  token: String
  token_not: String
  token_in: [String!]
  token_not_in: [String!]
  token_lt: String
  token_lte: String
  token_gt: String
  token_gte: String
  token_contains: String
  token_not_contains: String
  token_starts_with: String
  token_not_starts_with: String
  token_ends_with: String
  token_not_ends_with: String
  loginId: String
  loginId_not: String
  loginId_in: [String!]
  loginId_not_in: [String!]
  loginId_lt: String
  loginId_lte: String
  loginId_gt: String
  loginId_gte: String
  loginId_contains: String
  loginId_not_contains: String
  loginId_starts_with: String
  loginId_not_starts_with: String
  loginId_ends_with: String
  loginId_not_ends_with: String
  user: UserWhereInput
  AND: [TokenWhereInput!]
}

input TokenWhereUniqueInput {
  id: ID
  token: String
  loginId: String
}

type User {
  id: ID!
  email: String!
  password: String!
  role: Role!
  refreshTokens(where: TokenWhereInput, orderBy: TokenOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Token!]
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  id: ID
  email: String!
  password: String!
  role: Role!
  refreshTokens: TokenCreateManyWithoutUserInput
}

input UserCreateOneWithoutRefreshTokensInput {
  create: UserCreateWithoutRefreshTokensInput
  connect: UserWhereUniqueInput
}

input UserCreateWithoutRefreshTokensInput {
  id: ID
  email: String!
  password: String!
  role: Role!
}

type UserEdge {
  node: User!
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  email_ASC
  email_DESC
  password_ASC
  password_DESC
  role_ASC
  role_DESC
}

type UserPreviousValues {
  id: ID!
  email: String!
  password: String!
  role: Role!
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: UserWhereInput
  AND: [UserSubscriptionWhereInput!]
}

input UserUpdateInput {
  email: String
  password: String
  role: Role
  refreshTokens: TokenUpdateManyWithoutUserInput
}

input UserUpdateManyMutationInput {
  email: String
  password: String
  role: Role
}

input UserUpdateOneRequiredWithoutRefreshTokensInput {
  create: UserCreateWithoutRefreshTokensInput
  update: UserUpdateWithoutRefreshTokensDataInput
  upsert: UserUpsertWithoutRefreshTokensInput
  connect: UserWhereUniqueInput
}

input UserUpdateWithoutRefreshTokensDataInput {
  email: String
  password: String
  role: Role
}

input UserUpsertWithoutRefreshTokensInput {
  update: UserUpdateWithoutRefreshTokensDataInput!
  create: UserCreateWithoutRefreshTokensInput!
}

input UserWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  password: String
  password_not: String
  password_in: [String!]
  password_not_in: [String!]
  password_lt: String
  password_lte: String
  password_gt: String
  password_gte: String
  password_contains: String
  password_not_contains: String
  password_starts_with: String
  password_not_starts_with: String
  password_ends_with: String
  password_not_ends_with: String
  role: Role
  role_not: Role
  role_in: [Role!]
  role_not_in: [Role!]
  refreshTokens_some: TokenWhereInput
  AND: [UserWhereInput!]
}

input UserWhereUniqueInput {
  id: ID
  email: String
}
`