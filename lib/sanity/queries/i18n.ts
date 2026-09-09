import { groq } from 'next-sanity'

export const translationsQuery = groq`
  *[_type == "translation.metadata" && references($id)][0] {
    translations[] {
      language,
      "doc": value->{
        _id,
        _type,
        language,
        title,
        "slug": slug.current,
        "postTypeSlug": postType->slug.current
      }
    }
  }
`

export const redirectsQuery = groq`
  *[_type == "redirect" && defined(source) && defined(destination)] {
    source,
    destination,
    permanent
  }
`

export const formByIdQuery = groq`
  *[_type == "form" && _id == $id][0] {
    _id,
    title,
    language,
    submitLabel,
    successMessage,
    notifyEmail,
    fields[]
  }
`

export const sitemapQuery = groq`
{
  "pages": *[_type == "page" && defined(slug.current) && (visibility == "public" || !defined(visibility)) && (!defined(publishDate) || publishDate <= now())] {
    "slug": slug.current,
    language,
    _updatedAt
  },
  "postTypes": *[_type == "postType" && hasArchive == true] {
    "slug": slug.current,
    language
  },
  "posts": *[_type == "post" && visibility == "public" && defined(slug.current)] {
    "slug": slug.current,
    "postTypeSlug": postType->slug.current,
    language,
    _updatedAt
  }
}
`
