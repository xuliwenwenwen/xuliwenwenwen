import ImageBuddy from 'imagebuddy';

import Modal from './components/modal';
import GetStarted from './components/get-started';
import StatsCarousel from './components/stats-carousel';
import DropdownMenuClickActivate from './components/dropdown-menu-click-activate';

import BannerDefaultVideo from './components/banner-default-video';

import PostsListBlog from './components/posts-list/posts-list-blog';
import PostsListCaseStudy from './components/posts-list/posts-list-case-study';
import PostsListAuthor from './components/posts-list/posts-list-author';
import PostsListSearch from './components/posts-list/posts-list-search';

import BlockTestimonials from './blocks/testimonials';
import BlockOpenPositions from './blocks/open-positions';
import BlockTabs from './blocks/tabs';
import BlockStats from './blocks/stats';
import BlockResources from './blocks/resources';
import BlockCTA from './blocks/cta';
import BlockPricing from './blocks/pricing';

import TemplateFrontPage from './templates/front-page';

import { processExternalLinks } from './util/general-util';
import ScrollWatcher from './util/scroll-watcher';
import SiteEvents, { SiteEventNames } from './util/site-events';
import { createSingleUseObserver } from './util/intersection-observer';
import setupEventDelegators from './util/setup-event-delegators';
import { showVideoModal } from './util/modal-helpers';
import { loadPrismJS } from './util/load-dependencies';
import {
	autodetectCodeElLanguage,
	getRequestedLanguages,
	loadLanguage,
	loadPlugin,
	loadTheme
} from './util/prism-js';
import MobileMenus from './util/mobile-menus';

class App {
	constructor() {
		this.instances = {
			components: {
				getStarted: [],
				statsCarousel: [],
				dropdownMenuClickActivate: [],
				bannerDefaultVideo: null,
				postsListBlog: [],
				postsListCaseStudy: [],
				postsListAuthor: [],
				postsListSearch: []
			},
			templates: {
				frontPage: null
			},
			blocks: {
				testimonials: [],
				openPositions: [],
				tabs: [],
				stats: [],
				resources: [],
				cta: [],
				pricing: []
			},
			scrollWatcher: null,
			imageBuddy: null
		};

		this.init();
		this.initComponents();
		this.initTemplates();
		this.initBlocks();
		this.initSocialShare();
		this.initSyntaxHighlighting();
	}

	init() {
		processExternalLinks({
			target: '_blank',
			rel: 'noopener'
		});

		Modal.setDefaults({
			closeDuration: 400,
			closeButtonContent: `
				<svg xmlns="http://www.w3.org/2000/svg" class="modal__close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<line x1="18" y1="6" x2="6" y2="18"></line>
					<line x1="6" y1="6" x2="18" y2="18"></line>
				</svg>
			`.trim()
		});

		/**
		 * Setup event delegators
		 */
		setupEventDelegators('body', {
			'js--trigger-video-modal': (el) => {
				const videoUrl = el.href || '';

				showVideoModal(videoUrl);
			}
		});

		this.scrollWatcher = new ScrollWatcher((params) => {
			ScrollWatcher.defaultCallback(params, 100);
		});

		// mobile menu button handler
		const btnMobileMenu = document.querySelector('.site-header__mobile-menu-button');

		if (btnMobileMenu) {
			btnMobileMenu.addEventListener('click', () => {
				if (MobileMenus.isOpen()) {
					MobileMenus.closeAll();
				} else {
					MobileMenus.openDefault();
				}
			});
		}

		// mobile menu CTA button handler
		const btnMobileMenuCTA = document.querySelector('.site-header__cta-mobile-button');

		if (btnMobileMenuCTA) {
			btnMobileMenuCTA.addEventListener('click', () => {
				if (MobileMenus.isOpen()) {
					MobileMenus.closeAll();
				} else {
					MobileMenus.openCTA();
				}
			});
		}

		// mobile filter categories handler
		const tagTitle = document.querySelectorAll('.tmpl-archive-sidebar .tag-container-title');

		if(tagTitle) {
			tagTitle.forEach(function(item) {
				item.addEventListener('click', function() {
					if(item.parentElement.classList.contains('open')) {
						item.parentElement.classList.remove('open');
					} else {
						item.parentElement.classList.add('open');
					}
				});
			});
		}

		// initialize ImageBuddy and setup events
		this.instances.imageBuddy = new ImageBuddy({
			lazyLoad: true
			// debug: true
		});

		SiteEvents.subscribe(SiteEventNames.IMAGEBUDDY_TRIGGER_UPDATE, (opts) => {
			this.instances.imageBuddy.update(opts || {});
		});

		// remove "banner-animate" classes on page load
		const bannerAnimateEls = Array.from(document.querySelectorAll('.banner-animate'));

		bannerAnimateEls.forEach((el) => el.classList.remove('banner-animate'));
	}

	async initComponents() {
		// get started
		Array.from(document.querySelectorAll('.get-started')).forEach((getStartedEl) => {
			this.instances.components.getStarted.push(new GetStarted(getStartedEl));
		});

		// stats carousel
		Array.from(document.querySelectorAll('.stats-carousel')).forEach((statsCarouselEl) => {
			this.instances.components.statsCarousel.push(new StatsCarousel(statsCarouselEl));
		});

		// dropdown menu click activate
		Array.from(
			document.querySelectorAll('.site-header__dropdown-menu-container--click-activate')
		).forEach((dropdownEl) => {
			this.instances.components.dropdownMenuClickActivate.push(
				new DropdownMenuClickActivate(dropdownEl)
			);
		});

		// banner default - video
		const bannerEl = document.querySelector('.banner-default--has-video');

		if (bannerEl) {
			this.instances.components.bannerDefaultVideo = new BannerDefaultVideo(bannerEl);
		}

		// posts list - blog
		Array.from(document.querySelectorAll('.posts-list-blog')).forEach((postsListBlogEl) => {
			this.instances.components.postsListBlog.push(new PostsListBlog(postsListBlogEl));
		});

		// posts list - case study
		Array.from(document.querySelectorAll('.posts-list-case-study')).forEach(
			(postsListCaseStudyEl) => {
				this.instances.components.postsListCaseStudy.push(
					new PostsListCaseStudy(postsListCaseStudyEl)
				);
			}
		);

		// posts list - author
		Array.from(document.querySelectorAll('.posts-list-author')).forEach((postsListAuthorEl) => {
			this.instances.components.postsListAuthor.push(new PostsListAuthor(postsListAuthorEl));
		});

		// posts list - search
		Array.from(document.querySelectorAll('.posts-list-search')).forEach((postsListSearchEl) => {
			this.instances.components.postsListSearch.push(new PostsListSearch(postsListSearchEl));
		});
	}

	initTemplates() {
		// front page
		const frontPageEl = document.querySelector('.tmpl-front-page');

		if (frontPageEl) {
			this.instances.templates.frontPage = new TemplateFrontPage(frontPageEl);
		}
	}

	initBlocks() {
		// setup block animation watchers
		const animateBlocks = document.querySelectorAll('.block-animate');

		if (animateBlocks && animateBlocks.length) {
			animateBlocks.forEach((watchEl) =>
				createSingleUseObserver(watchEl, (entry, el) => {
					el.classList.remove('block-animate');
				})
			);
		}

		// Testimonials
		Array.from(document.querySelectorAll('.block-testimonials')).forEach(
			(blockTestimonialsEl) => {
				this.instances.blocks.testimonials.push(new BlockTestimonials(blockTestimonialsEl));
			}
		);

		// Open Positions
		Array.from(document.querySelectorAll('.block-open-positions')).forEach(
			(blockOpenPositionsEl) => {
				this.instances.blocks.openPositions.push(
					new BlockOpenPositions(blockOpenPositionsEl)
				);
			}
		);

		// Tabs
		Array.from(document.querySelectorAll('.block-tabs')).forEach((blockTabsEl) => {
			this.instances.blocks.tabs.push(new BlockTabs(blockTabsEl));
		});

		// Stats
		Array.from(document.querySelectorAll('.block-stats')).forEach((blockStatsEl) => {
			this.instances.blocks.stats.push(new BlockStats(blockStatsEl));
		});

		// Resources
		Array.from(document.querySelectorAll('.block-resources')).forEach((blockResourcesEl) => {
			this.instances.blocks.resources.push(new BlockResources(blockResourcesEl));
		});

		// CTA
		Array.from(document.querySelectorAll('.block-cta')).forEach((blockCtaEl) => {
			this.instances.blocks.cta.push(new BlockCTA(blockCtaEl));
		});

		// Pricing
		Array.from(document.querySelectorAll('.block-pricing')).forEach((blockPricingEl) => {
			this.instances.blocks.pricing.push(new BlockPricing(blockPricingEl));
		});
		
		// Pricing - New
		Array.from(document.querySelectorAll('.block-pricing-new')).forEach((blockPricingEl) => {
			this.instances.blocks.pricing.push(new BlockPricing(blockPricingEl));
		});
	}

	initSocialShare() {
		const socialShareEls = document.querySelectorAll('[data-social-share]');

		Array.from(socialShareEls).forEach((el) => {
			el.addEventListener('click', (e) => {
				const site = el.getAttribute('data-social-share');
				const shareUrl = el.getAttribute('href');

				e.preventDefault();

				if (!shareUrl) {
					return;
				}

				window.open(shareUrl, `${site}Share`, 'width=626,height=436');
			});
		});
	}

	async initSyntaxHighlighting() {
		const codeEls = Array.from(document.getElementsByTagName('code'));

		if (!codeEls.length) {
			return;
		}

		try {
			await loadPrismJS();
		} catch (err) {
			console.error('PrismJS dynamic import failed', err);
			return;
		}

		if (!window.Prism || typeof window.Prism !== 'object') {
			console.error('PrismJS was not loaded successfully');
			return;
		}

		codeEls.forEach((codeEl) => {
			autodetectCodeElLanguage(codeEl, window.Prism);
		});

		const requestedLangs = getRequestedLanguages(codeEls);

		try {
			await loadTheme('prism-ateliersulphurpool-light');
		} catch (err) {
			console.error(err);
			return;
		}

		// load all requested languages in parallel
		await Promise.all(
			requestedLangs.map(async (lang) => {
				try {
					await loadLanguage(lang);
				} catch (err) {
					console.error(err);
				}
			})
		);

		// load plugins
		try {
			await loadPlugin('toolbar');
			await loadPlugin('copy-to-clipboard');
		} catch (err) {
			console.error(err);
		}

		if (window.Prism && typeof window.Prism === 'object') {
			window.Prism?.highlightAll();
		}
	}
}

export default App;
