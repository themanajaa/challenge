import { nonNull, objectType, stringArg, extendType } from 'nexus';
import { connectionFromArraySlice, cursorToOffset } from 'graphql-relay';

export const PtDinteret = objectType({
  name: 'PtDinteret',
  definition(t) {
    t.string('id');
    t.int('index');
    t.string('title');
    t.string('url');
    t.string('description');
    t.string('imageUrl');
    t.string('category');
  },
});

export const LinksQuery = extendType({
  type: 'Query',
  definition(t) {
    t.connectionField('links', {
      type: PtDinteret,
      resolve: async (_, { after, first }, ctx) => {
        const offset = after ? cursorToOffset(after) + 1 : 0;
        if (isNaN(offset)) throw new Error('cursor is invalid');

        const [totalCount, items] = await Promise.all([
          ctx.prisma.link.count(),
          ctx.prisma.link.findMany({
            take: first,
            skip: offset,
          }),
        ]);

        return connectionFromArraySlice(
          items,
          { first, after },
          { sliceStart: offset, arrayLength: totalCount }
        );
      },
    });
  },
});

// graphql/types/PtDinteret.ts
export const CreateLinkMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createLink', {
      type: PtDinteret,
      args: {
        title: nonNull(stringArg()),
        url: nonNull(stringArg()),
        imageUrl: nonNull(stringArg()),
        category: nonNull(stringArg()),
        description: nonNull(stringArg()),
      },
      async resolve(_parent, args, ctx) {
        if (!ctx.user) {
          throw new Error(`You need to be logged in to perform an action`)
        }

        const user = await ctx.prisma.user.findUnique({
          where: {
            email: ctx.user.email,
          },
        });

        if (user.role !== 'ADMIN') {
          throw new Error(`You do not have permission to perform action`);
        }

        const newLink = {
          title: args.title,
          url: args.url,
          imageUrl: args.imageUrl,
          category: args.category,
          description: args.description,
        };

        return await ctx.prisma.link.create({
          data: newLink,
        });
      },
    });
  },
});