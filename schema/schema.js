// what look likes our graph, describes the data on this kind of graph, objects types and relations of the data
// responsible for 1. Book types, 2. Book relationship with authors, 3. root queries
// root quries==>how we describe the user can  initially jump to the graph and grab the data
const graphql = require("graphql");
const Book = require("../models/books");
const Author = require("../models/authors");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
  GraphQLInt,
} = graphql;
const _ = require("lodash"); //lodash is a library that helps to find the book in a tree structure

// // dummy data
// const books = [
//   { name: "Name of the Wind", genre: "Fantasy", id: "1", authorId: "1" },
//   { name: "The Final Empire", genre: "Fantasy", id: "2", authorId: "2" },
// ];
// const authors = [
//   { name: "Patrick Rothfuss", age: 44, id: "1" },

// ];

const BookType = new GraphQLObjectType({
  //==>this is the object type of the book
  name: "Book",
  // fields are the properties of the object like name, author, genre and id
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType, //relation to  author
      resolve(parent, args) {
        // return _.find(authors, { id: parent.authorId });
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLString },
    bookCollection: {
      //relation to books and filter the books by authorId
      type: GraphQLList(BookType),
      resolve(parent, args) {
        // return _.filter(books, { authorId: parent.id });
      },
    },
  }),
});

const RootQueries = new GraphQLObjectType({
  //==>this is the root query type
  name: "RootQueryTypes",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        // this function conatins the code is responsible for which data fetching from the database/other source/
        // responsible for looking at the actual data and returning whta is needed. then graphql will take the data and
        // sends back to the users the exact properties they wanted from that data.
        //return _.find(books, { id: args.id }); // find the exact book which come from client with the id
        return Book.findById(args.id);
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve: (parent, args) => {
        // return _.find(authors, { id: args.id });
        return Author.findById(args.id);
      },
    },
    allBooks: {
      // getting all books
      type: new GraphQLList(BookType),
      resolve: (parent, args) => {
        // return books;
        return Book.find({});
      },
    },
    allAuthors: {
      type: new GraphQLList(AuthorType),
      resolve: (parent, args) => {
        // return authors;
        return Author.find({});
      },
    },
  },
});

// mutation is used to create, update, delete data
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        let author = new Author({
          name: args.name,
          age: args.age,
        });
        return author.save();
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        let book = new Book({
          name: args.name,
          genre: args.genre,
        });
        return book.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  //==>this is the schema of the graph
  query: RootQueries,
  mutation: Mutation,
});
