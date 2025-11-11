import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import type { OpenGraph } from '@astrolib/seo';

const load = async function () {
  let images: Record<string, () => Promise<unknown>> | undefined = undefined;
  try {
    images = import.meta.glob('~/assets/images/**/*.{jpeg,jpg,png,tiff,webp,gif,svg,JPEG,JPG,PNG,TIFF,WEBP,GIF,SVG}');
  } catch (e) {
    // continue regardless of error
  }
  return images;
};

let _images: Record<string, () => Promise<unknown>> | undefined = undefined;

/** */
export const fetchLocalImages = async () => {
  _images = _images || (await load());
  return _images;
};

/** */
export const findImage = async (
  imagePath?: string | ImageMetadata | null
): Promise<string | ImageMetadata | undefined | null> => {
  // Not string
  if (typeof imagePath !== 'string') {
    return imagePath;
  }

  // Absolute paths
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
    return imagePath;
  }

  // Relative paths or not "~/assets/"
  if (!imagePath.startsWith('~/assets/images')) {
    return imagePath;
  }

  const images = await fetchLocalImages();
  const key = imagePath.replace('~/', '/src/');

  return images && typeof images[key] === 'function'
    ? ((await images[key]()) as { default: ImageMetadata })['default']
    : null;
};

/** */
export const adaptOpenGraphImages = async (
  openGraph: OpenGraph = {},
  astroSite: URL | undefined = new URL('')
): Promise<OpenGraph> => {
  if (!openGraph?.images?.length) {
    return openGraph;
  }

  const images = openGraph.images;
  const defaultWidth = 1200;
  const defaultHeight = 626;

  const adaptedImages = await Promise.all(
    images.map(async (image) => {
      if (image?.url && typeof image.url === 'string') {
        // For Open Graph images, use direct URLs instead of processed images
        if (image.url.startsWith('~/assets/images/')) {
          const directUrl = image.url.replace('~/assets/images/', '/');
          return {
            url: String(new URL(directUrl, astroSite)),
            width: image?.width || defaultWidth,
            height: image?.height || defaultHeight,
          };
        }
        
        // For other images, use the original processing
        const resolvedImage = (await findImage(image.url)) as ImageMetadata | undefined;
        if (!resolvedImage) {
          return {
            url: '',
          };
        }

        const targetWidth = typeof image?.width === 'number' ? image.width : resolvedImage.width ?? defaultWidth;
        const targetHeight = typeof image?.height === 'number' ? image.height : resolvedImage.height ?? defaultHeight;

        const generatedImage = await getImage({
          src: resolvedImage,
          alt: 'Placeholder alt',
          width: targetWidth,
          height: targetHeight,
        });

        if (typeof generatedImage === 'object' && 'src' in generatedImage) {
          return {
            url: typeof generatedImage.src === 'string' ? String(new URL(generatedImage.src, astroSite)) : '',
            width: targetWidth,
            height: targetHeight,
          };
        }
        return {
          url: '',
        };
      }

      return {
        url: '',
      };
    })
  );

  return { ...openGraph, ...(adaptedImages ? { images: adaptedImages } : {}) };
};
