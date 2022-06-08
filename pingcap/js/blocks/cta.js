import { submitHubspotForm } from '../util/hubspot';

class BlockCTA {
	constructor(el) {
		this.el = el;
		this.subscribeFormEl = this.el.querySelector('.block-cta__subscribe-form');

		if (this.subscribeFormEl) {
			this.subscribeFormEl.addEventListener('submit', this.subscribeSubmitHandler);
		}
	}

	subscribeSubmitHandler = async (e) => {
		e.preventDefault();

		const formEl = e.target;

		if (!formEl) {
			return;
		}

		formEl.removeAttribute('data-error');

		const hsPortalId = this.subscribeFormEl.getAttribute('data-hs-portal-id') ?? '';
		const hsFormId = this.subscribeFormEl.getAttribute('data-hs-form-id') ?? '';

		if (!hsPortalId || !hsFormId) {
			return;
		}

		const hsNameField = this.subscribeFormEl.getAttribute('data-hs-name-field') ?? '';
		const hsEmailField = this.subscribeFormEl.getAttribute('data-hs-email-field') ?? '';

		const nameInputEl = e.target.querySelector('input[name="cta_name"]');
		const emailInputEl = e.target.querySelector('input[name="cta_email"]');
		const buttonEl = e.target.querySelector('button[type="submit"]');

		const nameValue = nameInputEl ? nameInputEl.value.trim() : '';
		const emailValue = emailInputEl ? emailInputEl.value.trim() : '';

		if (!nameValue) {
			formEl.setAttribute('data-error', 'Please enter your name');
			return;
		}

		if (!emailValue) {
			formEl.setAttribute('data-error', 'Please enter your email address');
			return;
		}

		formEl.classList.add('loading');

		nameInputEl.disabled = true;
		emailInputEl.disabled = true;

		if (buttonEl) {
			buttonEl.disabled = true;
		}

		try {
			const postData = [];

			if (hsNameField) {
				postData.push({ name: hsNameField, value: nameValue });
			}

			if (hsEmailField) {
				postData.push({ name: hsEmailField, value: emailValue });
			}

			const res = await submitHubspotForm(postData, hsPortalId, hsFormId);

			const successMsg =
				res.inlineMessage ?? '<p>Thanks for subscribing to PingCAP blog posts.</p>';

			const successEl = document.createElement('div');
			successEl.classList.add('block-cta__subscribe-success');
			successEl.innerHTML = successMsg;

			formEl.parentNode.append(successEl);
			formEl.remove();
		} catch (err) {
			console.error(err);

			formEl.setAttribute(
				'data-error',
				err instanceof Error ? err.message : 'An error occurred'
			);
		}

		formEl.classList.remove('loading');

		nameInputEl.disabled = false;
		emailInputEl.disabled = false;

		if (buttonEl) {
			buttonEl.disabled = false;
		}
	};
}

export default BlockCTA;
