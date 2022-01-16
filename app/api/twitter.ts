import { twitter__tweet_endpoint, twitter__user_endpoint } from "app/constatnts"
import { tweetIdParser } from "app/utils/twitter"
import { BlitzApiRequest, BlitzApiResponse } from "blitz"

const handler = async (req: BlitzApiRequest, res: BlitzApiResponse) => {
  const id = tweetIdParser(
    (req.query.url === undefined
      ? ""
      : typeof req.query.url !== "string"
      ? req.query.url[0]
      : req.query.url) as string
  )

  const token = process.env.TWITTER_BEARER_TOKEN
  const tweetParams = {
    ids: id,
    "tweet.fields": "author_id,public_metrics,created_at",
  }
  const userParams = {
    "user.fields": "profile_image_url",
  }

  const tweetResponse = await fetch(
    `${twitter__tweet_endpoint}${new URLSearchParams(tweetParams)}`,
    {
      headers: { authorization: `Bearer ${token}` },
    }
  )
  const tweet = (await tweetResponse.json()).data[0]

  const userResponse = await fetch(
    `${twitter__user_endpoint}${tweet.author_id}?${new URLSearchParams(userParams)}`,
    {
      headers: { authorization: `Bearer ${token}` },
    }
  )
  const user = (await userResponse.json()).data

  res.end(
    JSON.stringify({
      id: id,
      user: user,
      text: tweet.text,
      created_at: tweet.created_at,
      public_metrics: tweet.public_metrics,
    })
  )
}

export default handler
