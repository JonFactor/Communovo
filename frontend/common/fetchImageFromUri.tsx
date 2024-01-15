// convert the images uri to an image or blob
export const fetchImageFromUri = async (uri: string): Promise<Blob> => {
  const response = await fetch(uri);
  const blob = await response.blob();

  return blob;
};
