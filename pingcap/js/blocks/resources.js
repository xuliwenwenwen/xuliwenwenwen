import { loadEmblaCarousel } from '../util/load-dependencies';
import { enableNavButtons } from '../util/embla/util';
import EmblaPagination from '../util/embla/pagination';
import SiteEvents, { SiteEventNames } from '../util/site-events';
import { isDesktopViewport, whenBelowDesktop } from '../util/viewport';

class BlockResources {
	constructor(el) {
		this.el = el;
		this.emblaInitialized = false;

		if (isDesktopViewport()) {
			whenBelowDesktop(() => this.initEmbla());
		} else {
			this.initEmbla();
		}
	}

	async initEmbla() {
		// skip the initialization if the initilialized flag has already been set
		if (this.emblaInitialized) {
			return;
		}

		try {
			const EmblaCarousel = await loadEmblaCarousel();
			const emblaRootEl = this.el.querySelector('.embla-instance');

			if (!emblaRootEl) {
				return;
			}

			const emblaEl = emblaRootEl.querySelector('.embla');
			const btnPrevEl = Array.from(this.el.querySelectorAll('.embla__nav-button--prev'));
			const btnNextEl = Array.from(this.el.querySelectorAll('.embla__nav-button--next'));
			const paginationEl = this.el.querySelector('.embla__pagination');

			const transitionSpeed = emblaRootEl
				? parseInt(emblaRootEl.getAttribute('data-transition-speed') || 10, 10)
				: 10;

			const instance = {
				embla: EmblaCarousel(emblaEl, {
					loop: false,
					speed: transitionSpeed,
					containScroll: 'keepSnaps'
				}),
				pagination: null
			};

			if (instance.embla) {
				instance.embla.on('init', () => {
					SiteEvents.publish(SiteEventNames.IMAGEBUDDY_TRIGGER_UPDATE);
				});

				if (btnPrevEl && btnNextEl) {
					enableNavButtons(instance.embla, btnPrevEl, btnNextEl);
				}

				if (paginationEl) {
					instance.pagination = new EmblaPagination(instance.embla, paginationEl, {
						buttonClassName: 'embla__pagination-button'
					});
				}
			}

			this.emblaInitialized = true;
		} catch (err) {
			console.error('Embla Carousel dynamic import failed', err);
		}
	}
}

export default BlockResources;
