export const typeDefs = `#graphql
 type Users {
  id: ID!
  email: String!
  password: String
  username: String!
  name: String
  profilePic: String
  posts: [Posts!]
  postVotes: [PostVotes!]
  postComments: [PostComments!]
  commentVotes: [CommentVotes!]
}

type Posts {
  id: ID!
  title: String!
  content: String!
  userId: ID!
  user: Users!
  createdAt: DateTime!
  updatedAt: DateTime!
  tags: [Tags!]
  postVotes: [PostVotes!]
  postComments: [PostComments!]
}

type Tags {
  id: ID!
  name: String!
  posts: [Posts!]
}

enum UserVote {
  UP
  DOWN
}

type PostVotes {
  id: ID!
  postId: ID!
  post: Posts!
  userId: ID!
  user: Users!
  type: UserVote!
  createdAt: DateTime!
}

type PostComments {
  id: ID!
  postId: ID!
  post: Posts!
  userId: ID!
  user: Users!
  parentId: ID
  parent: PostComments
  content: String!
  createdAt: DateTime!
  updatedAt: DateTime!
  commentVotes: [CommentVotes!]
  replies: [PostComments!]
}

type CommentVotes {
  id: ID!
  commentId: ID!
  comment: PostComments!
  userId: ID!
  user: Users!
  type: UserVote!
  createdAt: DateTime!
}

type Query {
  user(id: ID!): Users
  users: [Users!]!
  post(id: ID!): Posts
  posts: [Posts!]!
  tag(id: ID!): Tags
  tags: [Tags!]!
  postComment(id: ID!): PostComments
  postComments(postId: ID!): [PostComments!]!
}

type Mutation {
  createUser(email: String!, password: String!, username: String!, name: String, profilePic: String): Users!
  updateUser(id: ID!, email: String, password: String, username: String, name: String, profilePic: String): Users!
  deleteUser(id: ID!): Boolean!

  createPost(title: String!, content: String!, userId: ID!, tagIds: [ID!]): Posts!
  updatePost(id: ID!, title: String, content: String, tagIds: [ID!]): Posts!
  deletePost(id: ID!): Boolean!

  createTag(name: String!): Tags!
  deleteTag(id: ID!): Boolean!

  createPostVote(postId: ID!, userId: ID!, type: UserVote!): PostVotes!
  updatePostVote(id: ID!, type: UserVote!): PostVotes!
  deletePostVote(id: ID!): Boolean!

  createPostComment(postId: ID!, userId: ID!, parentId: ID, content: String!): PostComments!
  updatePostComment(id: ID!, content: String!): PostComments!
  deletePostComment(id: ID!): Boolean!

  createCommentVote(commentId: ID!, userId: ID!, type: UserVote!): CommentVotes!
  updateCommentVote(id: ID!, type: UserVote!): CommentVotes!
  deleteCommentVote(id: ID!): Boolean!
}

scalar DateTime

scalar DateTime
`;
