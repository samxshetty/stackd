export const isNative = !!(window.Capacitor?.isNativePlatform?.())

export const saveNote = async (noteId, url) => {
  if (!isNative) return false
  try {
    const { Filesystem, Directory } = await import('@capacitor/filesystem')
    const { Preferences } = await import('@capacitor/preferences')
    const response = await fetch(url)
    const blob = await response.blob()
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result.split(',')[1])
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
    await Filesystem.writeFile({
      path: `stackd/${noteId}.pdf`,
      data: base64,
      directory: Directory.Documents,
      recursive: true
    })
    return `stackd/${noteId}.pdf`
  } catch (err) {
    console.error('Save failed:', err)
    return false
  }
}

export const getSavedNotes = async () => {
  if (!isNative) return {}
  try {
    const { Preferences } = await import('@capacitor/preferences')
    const { value } = await Preferences.get({ key: 'savedNotes' })
    return value ? JSON.parse(value) : {}
  } catch {
    return {}
  }
}

export const setSavedNotes = async (notes) => {
  if (!isNative) return
  try {
    const { Preferences } = await import('@capacitor/preferences')
    await Preferences.set({ key: 'savedNotes', value: JSON.stringify(notes) })
  } catch (err) {
    console.error('Save preferences failed:', err)
  }
}

export const readLocalPDF = async (localPath) => {
  if (!isNative) return null
  try {
    const { Filesystem, Directory } = await import('@capacitor/filesystem')
    const result = await Filesystem.readFile({
      path: localPath,
      directory: Directory.Documents
    })
    return `data:application/pdf;base64,${result.data}`
  } catch {
    return null
  }
}

export const openBrowser = async (url) => {
  if (!isNative) {
    window.location.href = url
    return
  }
  try {
    const { Browser } = await import('@capacitor/browser')
    await Browser.open({ url })
  } catch {
    window.location.href = url
  }
}