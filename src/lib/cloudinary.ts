

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

export const uploadVideo = async (file: any) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'E-Health'); // Replace with your upload preset
  formData.append('resource_type', 'video'); // Set resource type to 'video' for video uploads
  
  const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data;
};