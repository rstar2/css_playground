const thumbs = document.querySelectorAll('.thumbnail')
const lightbox = document.querySelector('.lightbox')
const lightboxImg = document.querySelector('.lightbox-image')
const figcaption = document.createElement('figcaption')

// functions to open/close lightbox and fetch caption data
async function openLightbox(image) {
    const imageID = image.getAttribute('data-thumbID')
    const caption = {
        artist: `Artist: ${imageID}`,
        artistURL: `Artist URL: ${imageID}`,
        imageURL: `Image URL: ${imageID}`,
    }

    figcaption.classList.add('figcaption')
    figcaption.innerHTML = `
        <p>Photo by <a href="${caption.artistURL}">${caption.artist}</a> on <a href="${caption.imageURL}">Unsplash</a></p>
    `
    lightboxImg.append(image)
    lightboxImg.append(figcaption)
}

function closeLightbox(image) {
    const galleryParentID = image.getAttribute('data-thumbID')
    const galleryParent = document.getElementById(`${galleryParentID}`)

    galleryParent.append(image)
    lightboxImg.removeChild(figcaption)
}

thumbs.forEach((thumb) => {
    thumb.addEventListener('click', (e) => {
        const image = e.target

        if(!document.startViewTransition) {
            openLightbox(image)
            return
        }

        image.style.viewTransitionName = 'selected-img'

        document.startViewTransition(() => {
            openLightbox(image)
        })


    })
})

lightboxImg.addEventListener('click', async (e) => {
    const image = e.target

    if(!document.startViewTransition) {
        closeLightbox(image)
        return
    }

    const animation = document.startViewTransition(() => {
        closeLightbox(image)
    })

    await animation.finished
    image.style.viewTransitionName = 'none'
})

