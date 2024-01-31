import axios from "axios";

export const getUnsplashImage = async (query: string) => {
  const imageResponse = await axios(
    `https://api.unsplash.com/search/photos?per_page=1&query=${query}&client_id=${process.env.UNSPPLASH_API_KEY}`
  );
  return imageResponse?.data?.results[0]?.urls?.small_s3;
};
