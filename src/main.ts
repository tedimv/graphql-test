import { ApolloServer, ApolloServerOptions, BaseContext } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { MikroORM, SqlEntityManager, EntityManager } from '@mikro-orm/postgresql';
import { IDatabaseDriver, Connection } from '@mikro-orm/core'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'; // or any other driver package
import { User } from './entities/user';
import { Contact } from './entities/contact';



// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type User {
    id: Int
    name: String
    contacts: [Contact]
  }

  type Contact {
    id: Int
    email: String
    phone: String
    user: User
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    getUsers: [User]
    getContacts: [Contact]
  }

  type Mutation {
    createUser(name: String): User
    createContact(email: String!, phone: String, user: Int): Contact
  }
`;

function createResolvers(em: Awaited<ReturnType<typeof MikroORM.init<PostgreSqlDriver>>>['em']): ApolloServerOptions<BaseContext>['resolvers'] {

  const resolvers: ApolloServerOptions<BaseContext>['resolvers'] = {
    Query: {
      getUsers: async (_, args) => {
        const fork = em.fork();
        const [users, count] = await fork.findAndCount(User, {});
        return users;
      },
      getContacts: async (_, args) => {
        const fork = em.fork();
        const [contacts, count] = await fork.findAndCount(Contact, {});
        return contacts;
      }
    },
    Mutation: {
      createUser: async (_, args) => {
        const fork = em.fork()
        const user = await fork.create(User, { name: args.name });
        await fork.persistAndFlush(user);
        return user;
      },
      createContact: async (_, args) => {
        const fork = em.fork()
        const contact = await fork.create(Contact, args);
        await fork.persistAndFlush(contact);
        return contact;
      }
    },
  };

  return resolvers;
}

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.



// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests

async function main() {
  const orm = await MikroORM.init<PostgreSqlDriver>({
    entities: [User, Contact],
    dbName: 'graphql',
    type: 'postgresql',
    user: 'mapmota',
    password: 'aslPLZ123@'
  });
  await orm.migrator.createMigration();
  await orm.migrator.up();
  await orm.connect();

  const resolvers = createResolvers(orm.em);

  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`🚀  Server ready at: ${url}`);
}

main()