export function useCloudinary() {
  const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const preset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET

  /**
   * @param {File} file  from <input type="file">
   * @returns {Promise<string>} secure_url
   */
  async function uploadImage(file) {
    if (!(file instanceof File)) throw new Error('uploadImage expects a File')
    if (!cloud || !preset) throw new Error('Missing Cloudinary env vars')

    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', preset)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
      method: 'POST',
      body: form
    })
    if (!res.ok) throw new Error('Cloudinary upload failed')
    const data = await res.json()
    return data.secure_url
  }

  return { uploadImage }
}
