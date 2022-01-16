import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetTweetsInput
  extends Pick<Prisma.TweetFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetTweetsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: tweets,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.tweet.count({ where }),
      query: (paginateArgs) => db.tweet.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      tweets,
      nextPage,
      hasMore,
      count,
    }
  }
)