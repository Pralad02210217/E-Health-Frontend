

export const uploadImage = async (file: any) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'E-Health'); // Replace with your upload preset

  const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data;
};