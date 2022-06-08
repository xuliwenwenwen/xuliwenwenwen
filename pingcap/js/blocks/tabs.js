import SiteEvents, { SiteEventNames } from '../util/site-events';

class BlockTabs {
	constructor(el) {
		this.el = el;
		this.navBtnEls = Array.from(this.el.querySelectorAll('.block-tabs__nav-button'));

		this.navBtnEls.forEach((btnEl) => {
			btnEl.addEventListener('click', (e) => {
				if (!e.currentTarget || e.currentTarget.classList.contains('active')) {
					return;
				}

				this.switchDesktopSectionId(e.currentTarget.getAttribute('data-section-id') ?? '');
			});
		});
	}

	switchDesktopSectionId(sectionId) {
		if (!sectionId) {
			return;
		}

		const desktopMainEl = this.el.querySelector('.block-tabs__desktop-main');
		const template = this.el.querySelector(`template#${sectionId}`);

		if (!desktopMainEl || !template) {
			return;
		}

		// clone the template content
		const tmplClone = template.content.cloneNode(true);

		// remove all existing content from the desktop content area
		while (desktopMainEl.firstChild) {
			desktopMainEl.removeChild(desktopMainEl.firstChild);
		}

		// append the template clone to the desktop content area
		desktopMainEl.appendChild(tmplClone);

		// update the "active" class for the nav button elements
		this.navBtnEls.forEach((navBtnEl) => {
			if (navBtnEl.getAttribute('data-section-id') === sectionId) {
				navBtnEl.classList.add('active');
			} else {
				navBtnEl.classList.remove('active');
			}
		});

		SiteEvents.publish(SiteEventNames.IMAGEBUDDY_TRIGGER_UPDATE);
	}
}

export default BlockTabs;
