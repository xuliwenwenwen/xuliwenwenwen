import { wpAPIget } from '../util/wp-rest-api';

class BlockOpenPositions {
	constructor(el) {
		this.el = el;
		this.groupsEl = this.el.querySelector('.block-open-positions__groups');
		this.templateGroup = this.el.querySelector('.block-open-positions__template-group');
		this.templateCard = this.el.querySelector('.block-open-positions__template-card');

		if (!this.templateGroup || !this.templateCard) {
			return;
		}

		this.loadResults();
	}

	async loadResults() {
		try {
			const res = await wpAPIget('pingcap/v1/careers');

			const groups = Array.isArray(res.body) ? res.body : [];

			groups.forEach((group) => {
				const groupEl = this.createGroupEl(group);

				if (groupEl) {
					this.groupsEl.appendChild(groupEl);
				}
			});
		} catch (err) {
			console.error(err);
		}

		this.groupsEl.classList.remove('loading');
	}

	createGroupEl(group) {
		const groupName = group.group ?? '';
		const records = Array.isArray(group.records) ? group.records : [];

		if (!groupName || !records) {
			return null;
		}

		const groupEl = this.templateGroup.content.cloneNode(true);
		const groupTitleEl = groupEl.querySelector('.block-open-positions__group-title');
		const groupCardsEl = groupEl.querySelector('.block-open-positions__group-cards');

		if (groupTitleEl) {
			groupTitleEl.textContent = groupName;
		}

		if (groupCardsEl) {
			records.forEach((record) => {
				const cardEl = this.createCardEl(record);

				if (cardEl) {
					groupCardsEl.appendChild(cardEl);
				}
			});
		}

		return groupEl;
	}

	createCardEl(record) {
		const cardEl = this.templateCard.content.cloneNode(true);
		const cardLinkEl = cardEl.querySelector('a.block-open-positions__card');
		const cardTitleEl = cardEl.querySelector('.block-open-positions__card-title');
		const cardDescEl = cardEl.querySelector('.block-open-positions__card-desc');

		const url = record.url ?? '';
		const title = record.title ?? '';
		const descParts = [];

		if (!cardLinkEl || !url) {
			return null;
		}

		if (!title) {
			return null;
		}

		if (record.location) {
			descParts.push(record.location);
		}

		if (record.commitment) {
			descParts.push(record.commitment);
		}

		cardLinkEl.setAttribute('href', url);

		if (cardTitleEl) {
			cardTitleEl.textContent = title;
		}

		if (cardDescEl) {
			cardDescEl.textContent = descParts.join('/');
		}

		return cardEl;
	}
}

export default BlockOpenPositions;
