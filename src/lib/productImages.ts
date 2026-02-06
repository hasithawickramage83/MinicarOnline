import ferrariImg from '@/assets/product-ferrari.jpg';
import lamboImg from '@/assets/product-lambo.jpg';
import porscheImg from '@/assets/product-porsche.jpg';
import bmwImg from '@/assets/product-bmw.jpg';
import mercedesImg from '@/assets/product-mercedes.jpg';
import mclarenImg from '@/assets/product-mclaren.jpg';

const productImages: Record<string, string> = {
  Ferrari: ferrariImg,
  Lamborghini: lamboImg,
  Porsche: porscheImg,
  BMW: bmwImg,
  Mercedes: mercedesImg,
  McLaren: mclarenImg,
  Audi: porscheImg, // Fallback to similar style
  Toyota: bmwImg, // Fallback
  Nissan: ferrariImg, // Fallback
  Ford: mercedesImg, // Fallback
  Chevrolet: mclarenImg, // Fallback
  Bugatti: lamboImg, // Fallback
};

export const getProductImage = (model: string): string => {
  return productImages[model] || ferrariImg;
};

export default productImages;
