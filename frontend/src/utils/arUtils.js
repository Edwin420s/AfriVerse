// AR Utility Functions for AfriVerse

export class ARUtils {
  static async checkARSupport() {
    if (typeof navigator === 'undefined') return false

    // Check for WebXR support
    if ('xr' in navigator) {
      try {
        const supported = await navigator.xr.isSessionSupported('immersive-ar')
        return supported
      } catch (error) {
        console.warn('WebXR AR check failed:', error)
      }
    }

    // Check for AR.js support
    if (this.checkARJSSupport()) {
      return true
    }

    // Check for device