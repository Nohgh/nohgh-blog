export class ImagePrefetcher {
  #cached = new Set<string>()

  has(image: string) {
    return this.#cached.has(image)
  }

  prefetch(image: string) {
    if (this.#cached.has(image)) return

    const img = new Image()

    img.onload = () => {
      this.#cached.add(image)
    }

    // error시 별도의 처리 x
    img.onerror = () => {}

    img.src = image
  }

  all(images: string[]) {
    images.forEach((image) => this.prefetch(image))
  }
}
