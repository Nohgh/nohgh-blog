import fs from 'fs'
import RSS from 'rss'
import { SITE_URL } from '@app/lib/constants'
import { getAllPosts } from '@domain/posts'

const SITE_TITLE = 'Nohgh Blog'
const SITE_DESCRIPTION = '안녕하세요. 노기훈의 블로그입니다.'

async function generateRssFeed() {
  const posts = getAllPosts()

  const feedOptions = {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.xml`,
    language: 'ko',
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}, Nohgh`,
  }

  const feed = new RSS(feedOptions)

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.content.substring(0, 200),
      url: `${SITE_URL}/posts/${post.slug}`,
      guid: post.slug,
      date: post.date,
      author: 'Nohgh',
    })
  })

  fs.writeFileSync('./public/feed.xml', feed.xml({ indent: true }))
  console.log('RSS feed generated successfully at public/feed.xml')
}

generateRssFeed()
