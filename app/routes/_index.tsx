import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Await, useLoaderData, Link, type MetaFunction, useNavigate } from '@remix-run/react';
import { Suspense, useEffect, useState } from 'react';
import type {
  RecommendedProductsQuery,
  RecommendedBlogPostsQuery
} from 'storefrontapi.generated';
import * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';
import ProductCard from '~/components/product/ProductCard';
import { ArrowButton } from '~/components/foundational/ArrowButton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel';
import DashDivider from '~/components/foundational/DashDivider';

import FacebookIcon from '~/assets/social-icons/facebook.svg'
import YoutubeIcon from '~/assets/social-icons/youtube.svg'
import TiktokIcon from '~/assets/social-icons/tiktok.svg'
import InstagramIcon from '~/assets/social-icons/instagram.svg'
import LightBlueBubble from '~/assets/foundational/light_blue_bubbles.svg'

import { ArticleCard } from '~/components/blog/ArticleCard';
import TrustBox from '~/components/trustpilot/TrustPilotWidget';
import { isMobileViewport } from '~/lib/utils';

export type Viewport = 'desktop' | 'mobile';

export const meta: MetaFunction = () => {
  return [{ title: 'JENNYCHEM | Home' }];
};

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context;
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);
  const blog = storefront.query(RECOMMENDED_BLOG_POSTS_QUERY);

  return defer({ recommendedProducts, blog });
}

export default function Homepage() {
  const { blog, recommendedProducts } = useLoaderData<typeof loader>();
  const [isMobile, setIsMobile] = useState(isMobileViewport());

  useEffect(() => {
    const handleResize = () => setIsMobile(isMobileViewport());

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Hero
        title="Outdoor Surface Cleaners"
        subtitle='Giving your vehicle a showroom look without 
        damaging or effecting its paintwork, while 
        keeping it’s gloss finish.'
        ctaOnClick={() => { return 'b' }}
        ctaText='Shop Collection'
        backgroundImage='https://cdn.shopify.com/s/files/1/0032/5474/7185/files/washer_man.png?v=1717245774'
      />
      <BestSellingProducts products={recommendedProducts} />
      <TrustPilotBanner />
      <GetSocial viewport={isMobile ? 'mobile' : 'desktop'} />
      <Tips blog={blog} />
      <WhyOurFormula />
    </>
  );
}

function NavigateToProductPageButton({ handle }: { handle: string }) {
  const navigate = useNavigate();
  return <ArrowButton label="VIEW ALL SIZES" onClick={() => navigate(`/products/${handle}`)} />
}

function Hero({
  title,
  subtitle,
  ctaText,
  ctaOnClick,
  backgroundImage
}: Readonly<{
  title: string,
  subtitle: string,
  ctaText: string,
  ctaOnClick: () => void,
  backgroundImage: string
}>) {
  return <div
    className="relative bg-cover bg-center "
    style={{ backgroundImage: `url(${backgroundImage})`, height: '700px' }}
  >
    <div style={{ background: 'linear-gradient(to right, rgba(11,21,57,0.75), transparent )' }} className="absolute w-8/12 inset-0 "></div>
    <div className='container flex items-center justify-left h-full p-10'>
      <div className="relative z-10 text-left text-white max-w-2xl">
        <h1 className="text-9xl font-display mb-4">{title}</h1>
        <div className='w-16'><DashDivider /></div>
        <p className="text-xl mb-8">{subtitle}</p>
        <ArrowButton label={ctaText} onClick={ctaOnClick} />
      </div>
    </div>
  </div>
}

function BestSellingProducts({
  products,
}: Readonly<{
  products: Promise<RecommendedProductsQuery>;
}>) {

  const [currentLastIndex, setCurrentLastIndex] = useState<number>(0);

  return (
    <div className="flex flex-col items-center p-10 container">
      <h2 className='text-center text-6xl text-jc-dark-blue font-display'>Our Best Sellers</h2>
      <DashDivider />
      <Suspense fallback={<div>Loading...</div>}>
        <Carousel opts={{
          align: "start",
          loop: true,
        }}
          className="w-full max-w-6xl my-6"
        >
          <CarouselContent className="-ml-2">
            <Await resolve={products}>
              {({ products }) => (
                <>
                  {products.nodes.map((product) => (
                    <CarouselItem key={product.id} className="pl-2 md:basis-1/3 lg:basis-1/5">
                      <ProductCard
                        imageData={product.images.nodes[0] as StorefrontAPI.Image}
                        title={product.title}
                        handle={product.handle}
                        ActionElement={NavigateToProductPageButton}
                      />
                    </CarouselItem>
                  ))}
                </>
              )}
            </Await>
          </CarouselContent>
          <CarouselNext skip={2} currentLastIndex={currentLastIndex} setLastIndex={setCurrentLastIndex} iconClassName='text-jc-light-blue' style={{ top: "40%", right: "-4rem" }} />
          <CarouselPrevious skip={2} currentLastIndex={currentLastIndex} setLastIndex={setCurrentLastIndex} iconClassName='text-jc-light-blue' style={{ top: "40%", left: "-4.5rem" }} />
        </Carousel>
      </Suspense>
      <br />
    </div>
  );
}

function TrustPilotBanner({ }: {}) {
  return <BlueBubbleBackground>
    <div className='p-10 container'>
      <TrustBox />
    </div>
  </BlueBubbleBackground>
}

function GetSocial({ viewport = 'desktop' }: { viewport?: Viewport }) {
  if (viewport === 'mobile') {
    return <div className='flex flex-col items-center p-6 container text-center'>
      <h1 className='text-center text-8xl text-jc-dark-blue font-display'>Get Social & Share <span className='text-jc-light-blue'>!</span></h1>
      <DashDivider />
      <div className="w-full h-auto my-4 shadow">
        <img src="https://placehold.co/400x400" alt="grid-1" />
      </div>
      <span className='mb-2'>
        Follow us on social media to see our products in action, followed by the final result. Also to see what new products we currently
        have in development, along with limited time offers.<br /><br />

        We also like to see what you can achieve by using our products.
        Use the hashtag <span className='text-jc-light-blue'>#jennychem</span> when posting to show your results!
      </span>
      <div className="flex flex-row gap-1 my-2">
        <a href="https://google.com"><img alt="Facebook" src={FacebookIcon} /></a>
        <a href="https://google.com"><img alt="Youtube" src={YoutubeIcon} /></a>
        <a href="https://google.com"><img alt="Instagram" src={InstagramIcon} /></a>
        <a href="https://google.com"><img alt="Tiktok" src={TiktokIcon} /></a>
      </div>
    </div>
  } else {
    return <div className='flex flex-row-reverse p-10 container'>
      <div className='grid grid-cols-4 grid-rows-2 gap-4 p-4'>
        <div className="w-48 h-auto shadow">
          <img src="https://placehold.co/400x400" alt="grid-1" />
        </div>
        <div className="w-48 h-auto shadow">
          <img src="https://placehold.co/400x400" alt="grid-2" />
        </div>
        <div className="w-48 h-auto shadow">
          <img src="https://placehold.co/400x400" alt="grid-3" />
        </div>
        <div className="w-48 h-auto shadow">
          <img src="https://placehold.co/400x400" alt="grid-4" />
        </div>
        <div className="w-48 h-auto shadow">
          <img src="https://placehold.co/400x400" alt="grid-5" />
        </div>
        <div className="w-48 h-auto shadow">
          <img src="https://placehold.co/400x400" alt="grid-6" />
        </div>
        <div className="w-48 h-auto shadow">
          <img src="https://placehold.co/400x400" alt="grid-7" />
        </div>
        <div className="w-48 h-auto shadow">
          <img src="https://placehold.co/400x400" alt="grid-8" />
        </div>
      </div>
      <div className='flex-1 p-4 text-jc-dark-blue'>
        <h1 className='text-8xl font-display'>Get Social & Share <span className='text-jc-light-blue'>!</span></h1>
        <div className='w-16'><DashDivider /></div>
        <span>
          Follow us on social media to see our products in action, followed by the final result. Also to see what new products we currently
          have in development, along with limited time offers.<br /><br />

          We also like to see what you can achieve by using our products.
          Use the hashtag <span className='text-jc-light-blue'>#jennychem</span> when posting to show your results!
        </span>
        <div className="flex flex-row gap-1 my-2">
          <a href="https://google.com"><img alt="Facebook" src={FacebookIcon} /></a>
          <a href="https://google.com"><img alt="Youtube" src={YoutubeIcon} /></a>
          <a href="https://google.com"><img alt="Instagram" src={InstagramIcon} /></a>
          <a href="https://google.com"><img alt="Tiktok" src={TiktokIcon} /></a>
        </div>
      </div>
    </div>
  }
}

function Tips({ blog }: Readonly<{
  blog: Promise<RecommendedBlogPostsQuery>
}>) {

  const [currentLastIndex, setCurrentLastIndex] = useState<number>(0);

  return <BlueBubbleBackground>
    <div className="flex flex-col items-center p-10 container ">
      <h2 className='text-center text-6xl text-jc-light-blue font-display'>Tips & Tricks <span className='text-white'>When It Comes To Cleaning</span></h2>
      <DashDivider />
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={blog}>
          {({ blog }) => (
            <Carousel opts={{
              align: "start",
              loop: true,
            }}
              className="w-full max-w-6xl my-6"
            >
              <CarouselContent className="-ml-2">
                {blog?.articles.nodes.map((article) => (
                  <CarouselItem key={article.id} className="pl-2 md:basis-1/3 lg:basis-1/4">
                    <ArticleCard
                      title={article.title}
                      publishedAt={new Date(article.publishedAt)}
                      imageUrl={article.image?.url || undefined}
                      onClick={() => { return '' }}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext skip={2} currentLastIndex={currentLastIndex} setLastIndex={setCurrentLastIndex} iconClassName='text-jc-light-blue' style={{ top: "40%", right: "-4rem" }} />
              <CarouselPrevious skip={2} currentLastIndex={currentLastIndex} setLastIndex={setCurrentLastIndex} iconClassName='text-jc-light-blue' style={{ top: "40%", left: "-4.5rem" }} />
            </Carousel>
          )}
        </Await>
      </Suspense>
    </div>
  </BlueBubbleBackground >
}

function WhyOurFormula({ }: {}) {
  return <div className='flex flex-row p-10 container'>
    <div className='p-4 w-2/3'>
      <div className="shadow">
        <img src="https://placehold.co/900x500" alt="grid-1" />
      </div>
    </div>
    <div className='flex-1 p-4 text-jc-dark-blue'>
      <h1 className='font-display text-8xl'>Why Our Formula <span className="text-jc-light-blue">?</span></h1>
      <div className='w-8'><DashDivider /></div>
      <p>Jennychem is one of the UK’s leading cleaning products suppliers for both businesses and consumers. We are a family oriented business that has been in operation for more than 25 years. <br /><br />
        Providing a vast range of products, including vehicle care and kitchen sanitation. All our products are formulated and then manufactured on site within the UK.</p>
      <div className='mt-3'><ArrowButton label="About Us" onClick={() => ''} /></div>
    </div>
  </div>
}

function BlueBubbleBackground({ children }: { children: React.ReactNode }) {
  return <div className='relative bg-jc-dark-blue-100 overflow-hidden z-0'>
    <img src={LightBlueBubble} alt="left Bubble Background" className='absolute z-1' style={{ width: '50%', left: '-20%', top: '-30%' }} />
    <img src={LightBlueBubble} alt="right Bubble Background" className='absolute z-1' style={{ width: '50%', right: '-20%', top: '-30%' }} />
    <div className='z-2'>{children}</div>
  </div>
}

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

const RECOMMENDED_BLOG_POSTS_QUERY = `#graphql
  query RecommendedBlogPosts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
        blog(handle: "news") {
          id
          seo {
            title
            description
          }
          articles(first: 20) {
            nodes {
              id
              title
              image {
              	id
                url
              }
              publishedAt
              excerpt
              seo {
                title
                description
              }
            }
          }
        }
    }
`;
