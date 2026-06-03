/* ============================================================
   main.js — António Bré Portfolio 2026
   ============================================================ */
(function () {
	'use strict';

	/* --------------------------------------------------
     AVAILABILITY STATUS — 3 estados com cores
     Muda CURRENT_STATUS para forçar manualmente,
     ou deixa 'auto' para detecção por hora.
  -------------------------------------------------- */
	const STATUSES = {
		available: {
			label: 'Available for Work',
			color: '#22c55e',
			glow: 'rgba(34,197,94,.22)',
			glowFar: 'rgba(34,197,94,.07)',
		},
		sleeping: {
			label: 'Just Sleeping',
			color: '#ef4444',
			glow: 'rgba(239,68,68,.22)',
			glowFar: 'rgba(239,68,68,.07)',
		},
		studying: {
			label: 'Studying / Working',
			color: '#3b82f6',
			glow: 'rgba(59,130,246,.22)',
			glowFar: 'rgba(59,130,246,.07)',
		},
	};

	// ✏️ 'available' | 'sleeping' | 'studying' | 'auto'
	const CURRENT_STATUS = 'auto';

	function resolveStatus() {
		if (CURRENT_STATUS !== 'auto')
			return STATUSES[CURRENT_STATUS] || STATUSES.available;
		const h = new Date().toLocaleString('en-GB', {
			hour: 'numeric',
			hour12: false,
			timeZone: 'Europe/Lisbon',
		});
		const hour = parseInt(h, 10);
		if (hour >= 0 && hour < 8) return STATUSES.sleeping;
		if (hour >= 22 && hour < 24) return STATUSES.sleeping;
		if (hour >= 9 && hour < 18) return STATUSES.studying;
		return STATUSES.available;
	}

	function applyStatus() {
		const s = resolveStatus();
		const lbl = document.getElementById('availLabel');
		if (!lbl) return;
		// fade label ao mudar
		lbl.style.opacity = '0';
		setTimeout(() => {
			lbl.textContent = s.label;
			lbl.style.opacity = '1';
		}, 200);
		document.documentElement.style.setProperty('--status-color', s.color);
		document.documentElement.style.setProperty('--status-glow', s.glow);
		document.documentElement.style.setProperty('--status-glow-far', s.glowFar);
	}
	applyStatus();
	setInterval(applyStatus, 60_000);

	/* --------------------------------------------------
     DYNAMIC DATES — birthday 11/11/2008
     Age, sports years, projects milestone, footer date
  -------------------------------------------------- */
	(function () {
		const BIRTHDAY = new Date(2008, 10, 11); // 11 Nov 2008
		const BASKET_START = new Date(2016, 0, 1); // 2016
		const BOARD_START = new Date(2019, 0, 1); // 2019

		function yearsElapsed(since) {
			const now = new Date();
			let years = now.getFullYear() - since.getFullYear();
			const m = now.getMonth() - since.getMonth();
			if (m < 0 || (m === 0 && now.getDate() < since.getDate())) years--;
			return years;
		}

		// Age
		const age = yearsElapsed(BIRTHDAY);
		document
			.querySelectorAll('#bioAge, #captionAge, #contactAge')
			.forEach((el) => {
				if (el) el.textContent = age;
			});

		// Basketball & Bodyboard years (based on birthday anniversary)
		const basketYearsEl = document.getElementById('basketYears');
		const boardYearsEl = document.getElementById('bodyboardYears');
		if (basketYearsEl) basketYearsEl.textContent = yearsElapsed(BASKET_START);
		if (boardYearsEl) boardYearsEl.textContent = yearsElapsed(BOARD_START);

		// Projects milestone: show the last reached multiple of 5
		const TOTAL_PROJECTS = window._PORTFOLIO_PROJ_TOTAL || 8; // set below after data
		const milestone = Math.floor(TOTAL_PROJECTS / 5) * 5;
		const statProjEl = document.getElementById('statProjects');
		if (statProjEl)
			statProjEl.textContent =
				milestone > 0 ? milestone + '+' : TOTAL_PROJECTS + '';

		// Footer "Last updated" — always current month & year
		const footerUpdEl = document.getElementById('footerUpdated');
		if (footerUpdEl) {
			footerUpdEl.textContent = new Date().toLocaleDateString('en-GB', {
				month: 'long',
				year: 'numeric',
			});
		}
	})();

	(function () {
		const u = 'antonio.mtbre';
		const d = 'email.com';
		const email = u + '@' + d;
		const el = document.getElementById('emailLink');
		const disp = document.getElementById('emailDisplay');
		if (el) el.href = 'mailto:' + email;
		if (disp) disp.textContent = email;
	})();

	/* --------------------------------------------------
     CURSOR — apenas em dispositivos com hover real
  -------------------------------------------------- */
	const hasHover = window.matchMedia('(hover: hover)').matches;
	const cursorEl = document.getElementById('cursor');
	const ringEl = document.getElementById('cring');
	let mx = 0,
		my = 0,
		rx = 0,
		ry = 0;

	if (hasHover && cursorEl && ringEl) {
		document.addEventListener('mousemove', (e) => {
			mx = e.clientX;
			my = e.clientY;
			cursorEl.style.left = mx + 'px';
			cursorEl.style.top = my + 'px';
			const el = document.elementFromPoint(mx, my);
			const dark =
				el &&
				!!el.closest(
					'#about, #testimonials, #casestudy footer, .proj-card:hover, .bottom-nav',
				);
			document.body.classList.toggle('on-dark', dark);
		});

		(function animateRing() {
			rx += (mx - rx) * 0.12;
			ry += (my - ry) * 0.12;
			ringEl.style.left = rx + 'px';
			ringEl.style.top = ry + 'px';
			requestAnimationFrame(animateRing);
		})();

		document.addEventListener('mouseover', (e) => {
			const isInteractive = e.target.closest(
				'a, button, .proj-card, .proj-row, .c-link, .s-link, .tool-tag, .case-cta, .cs-acc-trigger',
			);
			cursorEl.style.width = isInteractive ? '16px' : '10px';
			cursorEl.style.height = isInteractive ? '16px' : '10px';
			ringEl.style.width = isInteractive ? '48px' : '34px';
			ringEl.style.height = isInteractive ? '48px' : '34px';
		});
	}

	/* --------------------------------------------------
     LOADER
  -------------------------------------------------- */
	window.addEventListener('load', () => {
		setTimeout(() => {
			const l = document.getElementById('loader');
			if (l) l.classList.add('hide');
		}, 900);
	});

	/* --------------------------------------------------
     FADE-IN ON SCROLL
  -------------------------------------------------- */
	const fadeObs = new IntersectionObserver(
		(entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) {
					e.target.classList.add('visible');
					fadeObs.unobserve(e.target);
				}
			});
		},
		{ threshold: 0.08 },
	);
	document.querySelectorAll('.fade-in').forEach((el) => fadeObs.observe(el));

	/* --------------------------------------------------
     LOCAL TIME — Lisbon
  -------------------------------------------------- */
	function updateTime() {
		const el = document.getElementById('localtime');
		if (!el) return;
		el.textContent = new Date().toLocaleTimeString('en-GB', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			timeZone: 'Europe/Lisbon',
		});
	}
	updateTime();
	setInterval(updateTime, 1000);

	/* --------------------------------------------------
     ACTIVE NAV
  -------------------------------------------------- */
	const navIds = [
		'home',
		'about',
		'projects',
		'casestudy',
		'testimonials',
		'contact',
	];
	window.addEventListener(
		'scroll',
		() => {
			let current = 'home';
			navIds.forEach((id) => {
				const el = document.getElementById(id);
				if (el && window.scrollY >= el.offsetTop - 300) current = id;
			});
			document.querySelectorAll('.bottom-nav a').forEach((a) => {
				a.classList.toggle('active', a.getAttribute('href') === '#' + current);
			});
		},
		{ passive: true },
	);

	/* --------------------------------------------------
     SMOOTH SCROLL
  -------------------------------------------------- */
	document.querySelectorAll('a[href^="#"]').forEach((a) => {
		a.addEventListener('click', (e) => {
			const id = a.getAttribute('href').slice(1);
			const t = document.getElementById(id);
			if (t) {
				e.preventDefault();
				t.scrollIntoView({ behavior: 'smooth' });
			}
		});
	});

	/* --------------------------------------------------
     PROJECTS DATA — edita aqui para adicionar projetos
  -------------------------------------------------- */

	const POSTERS = [
		{
			name: 'Neemias Queta',
			type: 'Poster Design · NBA',
			src: 'assets/images/DesignNeemias.webp',
			alt: 'Basketball player Neemias Queta poster',
			tools: ['Photoshop', '7 Hours'],
		},
		{
			name: 'Endrick',
			type: 'Poster Design · Football',
			src: 'assets/images/DesignEndrick.webp',
			alt: 'Football player Endrick poster',
			tools: ['Photoshop', '1 Hour'],
		},
		{
			name: 'Rayan Cherki',
			type: 'Poster Design · Football',
			src: 'assets/images/DesignCherki.webp',
			alt: 'Football player Rayan Cherki poster',
			tools: ['Photoshop', '1 Hour'],
		},
		{
			name: 'Richard Rios',
			type: 'Poster Design · Football',
			src: 'assets/images/DesignRichardRios.webp',
			alt: 'Football player Richard Rios poster',
			tools: ['Photoshop', '2 Hour'],
		},
		{
			name: 'Bruno Fernandes',
			type: 'Poster Design · Football',
			src: 'assets/images/DesignBrunoFernandes.webp',
			alt: 'Football player Bruno Fernandes poster',
			tools: ['Photoshop', '2 Hour'],
		},
	];

	// ➕ To add a game: { emoji, type, name, desc, obj, tools, url, caseId }
	// caseId links the card to a case study tab (tab id without "tab-")
	const GAMES = [
		{
			type: 'Full Game Development · PAP 18/20',
			name: 'Happy Groceries: Night Shift',
			desc: 'A complete end-to-end development project encompassing front-end, back-end, and original art. Awarded a final grade of 18/20 for technical execution and creative excellence.',
			obj: 'Goal: Design an accessible grocery management simulator featuring custom pixel art and a fully polished gameplay loop.',
			tools: ['Unity', 'C#', 'Aseprite'],
			url: 'https://happy-groceries.itch.io/happy-groceries',
			caseId: 'hg',
		},
		{
			type: 'UI Design · Game Assets',
			name: 'Roblox Game Assets',
			desc: 'Professional UI design and graphic asset creation for the Roblox ecosystem. Delivered high-fidelity, optimized components that align with the visual identity of active games.',
			obj: 'Goal: Enhance player immersion and usability through modern, functional interface design and consistent visual assets.',
			tools: ['Roblox Studio', 'UI Design', 'Photoshop'],
			url: '',
			caseId: 'rb',
		},
		{
			type: 'Visual Identity · Concept',
			name: 'Brand Identity',
			desc: 'Comprehensive visual identity systems for both real-world businesses and conceptual brands. Includes logo design, color theory, typography, and high-quality mockups in real-world contexts.',
			obj: 'Goal: Build scalable, strategically coherent brand ecosystems treated with professional-grade industry standards.',
			tools: ['Photoshop', 'Brand Design', 'Art Direction'],
			url: '',
			caseId: 'bi',
		},
		{
			type: 'Print Advertising · Design',
			name: 'Advertising',
			desc: 'Design and production of print advertising materials for real-world clients. Covers layout, typography, and visual hierarchy to communicate messages with clarity and impact.',
			obj: "Goal: Produce compelling, print-ready advertising pieces that convey the client's message effectively across diverse audiences.",
			tools: ['Photoshop', 'InDesign', 'Print Design'],
			url: '',
			caseId: 'ad',
		},
		// Club Identity — comentado até o trabalho estar pronto
		/*{
      type: 'Sports Branding · Concept', name: 'Club Identity',
      desc: 'End-to-end visual identity systems for sports clubs, including matchday creative, weekly schedules, and special edition posters with a focus on consistency.',
      obj: 'Goal: Develop professional, strategically aligned club designs that enhance fan engagement and institutional presence.',
      tools: ['Photoshop', 'Club Design', 'Art Direction'], url: '',
      caseId: 'ci'
    },*/
	];

	/* --------------------------------------------------
     RENDER PROJECTS
  -------------------------------------------------- */
	const projCountEl = document.getElementById('projCount');
	if (projCountEl)
		projCountEl.textContent =
			String(POSTERS.length + GAMES.length).padStart(2, '0') + ' Projects';

	// Update the dynamic projects milestone stat now that we know the total
	(function () {
		const total = POSTERS.length + GAMES.length;
		const milestone = Math.floor(total / 5) * 5;
		const el = document.getElementById('statProjects');
		if (el) el.textContent = milestone > 0 ? milestone + '+' : total + '';
	})();

	// Render posters
	const posterList = document.getElementById('posterList');
	if (posterList) {
		POSTERS.forEach((p, i) => {
			const row = document.createElement('div');
			row.className = 'proj-row poster-row';
			row.dataset.idx = i;
			row.setAttribute('role', 'listitem');
			row.setAttribute('tabindex', '0');
			row.setAttribute('aria-label', `Open poster: ${p.name}`);
			row.innerHTML = `
        <div class="proj-row-meta">
          <div class="proj-row-num">${String(i + 1).padStart(2, '0')}</div>
          <div class="proj-row-type">${p.type}</div>
        </div>
        <div class="proj-row-name">${p.name}</div>
        <div class="proj-row-tools">${p.tools.map((t) => `<span class="proj-card-tool">${t}</span>`).join('')}</div>
        <div class="proj-row-arrow" aria-hidden="true">↗</div>
        <div class="poster-preview" aria-hidden="true"><img src="${p.src}" alt="${p.alt}" loading="lazy"></div>
      `;
			// Teclado: Enter abre o viewer
			row.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					openPoster(i);
				}
			});
			posterList.appendChild(row);
		});
	}

	// Render games
	const gameGrid = document.getElementById('gameGrid');
	if (gameGrid) {
		GAMES.forEach((g, i) => {
			const globalNum = String(POSTERS.length + i + 1).padStart(2, '0');
			const card = document.createElement('div');
			card.className = 'proj-card';
			card.setAttribute('role', 'listitem');
			card.setAttribute('tabindex', '0');
			card.setAttribute('aria-label', `Open ${g.name}`);

			// Click: if has caseId, go to that case tab; else open url
			card.addEventListener('click', () => {
				if (g.caseId) {
					// activate the right tab
					const targetTab = document.getElementById('tab-' + g.caseId);
					const targetPanel = document.getElementById('panel-' + g.caseId);
					if (targetTab && targetPanel) {
						document.querySelectorAll('.case-tab').forEach((t) => {
							t.classList.remove('active');
							t.setAttribute('aria-selected', 'false');
						});
						document
							.querySelectorAll('.case-panel')
							.forEach((p) => p.classList.add('case-panel--hidden'));
						targetTab.classList.add('active');
						targetTab.setAttribute('aria-selected', 'true');
						targetPanel.classList.remove('case-panel--hidden');
					}
					const cs = document.getElementById('casestudy');
					if (cs) cs.scrollIntoView({ behavior: 'smooth' });
				} else if (g.url) {
					window.open(g.url, '_blank', 'noopener');
				}
			});
			card.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') card.click();
			});

			card.innerHTML = `
        <div class="proj-body">
          <div class="proj-card-num">${globalNum}</div>
          <div class="proj-card-type">${g.type}</div>
          <div class="proj-card-name">${g.name}</div>
          <div class="proj-card-desc">${g.desc}</div>
          <div class="proj-card-obj">${g.obj}</div>
          <div class="proj-tools">${g.tools.map((t) => `<span class="proj-card-tool">${t}</span>`).join('')}</div>
          <div class="proj-card-case-hint">${g.caseId ? 'View case study ↗' : ''}</div>
        </div>
      `;
			gameGrid.appendChild(card);
		});
	}

	/* --------------------------------------------------
     POSTER VIEWER
  -------------------------------------------------- */
	const viewer = document.getElementById('posterViewer');
	const vImg = document.getElementById('posterViewerImg');
	const vClose = document.getElementById('posterViewerClose');
	const vPrev = document.getElementById('posterViewerPrev');
	const vNext = document.getElementById('posterViewerNext');
	let curPoster = 0;

	function openPoster(idx) {
		curPoster = ((idx % POSTERS.length) + POSTERS.length) % POSTERS.length;
		vImg.src = POSTERS[curPoster].src;
		vImg.alt = POSTERS[curPoster].alt;
		viewer.classList.add('open');
		viewer.setAttribute('aria-hidden', 'false');
		document.body.style.overflow = 'hidden';
		vClose.focus();
	}
	function closePoster() {
		viewer.classList.remove('open');
		viewer.setAttribute('aria-hidden', 'true');
		document.body.style.overflow = '';
	}

	document.addEventListener('click', (e) => {
		const row = e.target.closest('.poster-row');
		if (row) openPoster(parseInt(row.dataset.idx) || 0);
	});
	if (vClose) vClose.addEventListener('click', closePoster);
	if (vPrev) vPrev.addEventListener('click', () => openPoster(curPoster - 1));
	if (vNext) vNext.addEventListener('click', () => openPoster(curPoster + 1));
	if (viewer)
		viewer.addEventListener('click', (e) => {
			if (e.target === viewer) closePoster();
		});
	document.addEventListener('keydown', (e) => {
		if (!viewer || !viewer.classList.contains('open')) return;
		if (e.key === 'Escape') closePoster();
		if (e.key === 'ArrowLeft') openPoster(curPoster - 1);
		if (e.key === 'ArrowRight') openPoster(curPoster + 1);
	});

	/* Poster preview parallax */
	document.addEventListener('mousemove', (e) => {
		const row = e.target.closest('.poster-row');
		if (!row) return;
		const preview = row.querySelector('.poster-preview');
		if (!preview) return;
		const rect = row.getBoundingClientRect();
		const relY = (e.clientY - rect.top - rect.height / 2) / rect.height;
		preview.style.marginTop = relY * 16 + 'px';
	});
	document.addEventListener(
		'mouseleave',
		(e) => {
			const row = e.target.closest?.('.poster-row');
			if (row) {
				const p = row.querySelector('.poster-preview');
				if (p) p.style.marginTop = '0px';
			}
		},
		true,
	);

	/* --------------------------------------------------
     TESTIMONIALS
  -------------------------------------------------- */
	const testimonials = [
		/*{
      text: "Placeholder",
      name: "Miguel Ribeiro",
      role: "Brand Manager at AC Alfenense",
      initials: "MR",
      photo: "" // ex: "assets/images/testimonials/miguel-ribeiro.webp"
    },*/
		{
			text: 'Placeholder',
			name: 'Eleven Degre',
			role: 'Roblox Game Developer',
			initials: 'ED',
			photo: '', // ex: "assets/images/testimonials/eleven-degre.webp"
		},
		// Carla Malafaya — comentado temporariamente
		/*{
      text: "Placeholder",
      name: "Carla Malafaya",
      role: "Course Director & Teacher at Systems & Programming",
      initials: "CM",
      photo: "" // ex: "assets/images/testimonials/carla-malafaya.webp"
    },*/
		/*{
      text: "Placeholder",
      name: "José Dias",
      role: "Teacher at Systems & Programming",
      initials: "JD",
      photo: "" // ex: "assets/images/testimonials/jose-dias.webp"
    },*/
		{
			text: 'Placeholder',
			name: 'Luis Torres',
			role: 'Owner of Happy Bubbles Laundry',
			initials: 'LT',
			photo: '', // ex: "assets/images/testimonials/lourenco-teixeira.webp"
		},
	];

	const testiList = document.getElementById('testiList');
	if (testiList) {
		const useScroll = testimonials.length >= 4;
		if (useScroll) testiList.classList.add('testi-cards--scroll');

		testimonials.forEach((t, i) => {
			const item = document.createElement('div');
			item.className = 'testi-item';
			item.setAttribute('role', 'listitem');
			item.innerHTML = `
        <div class="testi-item-body">
          <p class="testi-text">"${t.text}"</p>
        </div>
        <div class="testi-item-footer">
          <div class="testi-avatar" aria-hidden="true">
            ${
							t.photo
								? `<img src="${t.photo}" alt="${t.name}" class="testi-avatar-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"><span class="testi-avatar-initials" style="display:none">${t.initials}</span>`
								: `<span class="testi-avatar-initials">${t.initials}</span>`
						}
          </div>
          <div>
            <div class="testi-author-name">${t.name}</div>
            <div class="testi-author-role">${t.role}</div>
          </div>
        </div>
      `;
			testiList.appendChild(item);
		});

		if (useScroll) {
			const hint = document.getElementById('testiScrollHint');
			if (hint) hint.classList.add('visible');

			let isDown = false,
				startX = 0,
				scrollLeft = 0;
			testiList.addEventListener('mousedown', (e) => {
				isDown = true;
				testiList.classList.add('dragging');
				startX = e.pageX - testiList.offsetLeft;
				scrollLeft = testiList.scrollLeft;
			});
			testiList.addEventListener('mouseleave', () => {
				isDown = false;
				testiList.classList.remove('dragging');
			});
			testiList.addEventListener('mouseup', () => {
				isDown = false;
				testiList.classList.remove('dragging');
			});
			testiList.addEventListener('mousemove', (e) => {
				if (!isDown) return;
				e.preventDefault();
				testiList.scrollLeft =
					scrollLeft - (e.pageX - testiList.offsetLeft - startX) * 1.2;
			});
		}
	}

	/* --------------------------------------------------
     LINK TREE
  -------------------------------------------------- */
	const defaultLinks = [
		{ name: 'Instagram', url: 'https://instagram.com/vlg.bre' },
		{ name: 'Behance', url: 'https://behance.net/antniobr' },
		{ name: 'GitHub', url: 'https://github.com/tobre63' },
		{
			name: 'LinkedIn',
			url: 'https://www.linkedin.com/in/ant%C3%B3nio-br%C3%A9-55a3a43a7/',
		},
	];

	const ltLinks = defaultLinks;
	const ltBtn = document.getElementById('linkTreeBtn');
	const ltOverlay = document.getElementById('linkTreeOverlay');
	const ltPanel = document.getElementById('linkTreePanel');
	const ltClose = document.getElementById('linkTreeClose');
	const ltLinksEl = document.getElementById('linkTreeLinks');
	let ltOpen = false;

	function renderLT() {
		if (!ltLinksEl) return;
		ltLinksEl.innerHTML = '';
		ltLinks.forEach((link, i) => {
			const a = document.createElement('a');
			a.className = 'lt-link-item';
			a.href = link.url;
			a.target = '_blank';
			a.rel = 'noopener';
			a.style.animationDelay = i * 0.05 + 's';
			a.innerHTML = `${link.name} <span class="lt-arrow" aria-hidden="true">↗</span>`;
			ltLinksEl.appendChild(a);
		});
	}

	function openLT() {
		ltOpen = true;
		renderLT();
		ltOverlay.classList.add('open');
		ltPanel.classList.add('open');
		ltPanel.setAttribute('aria-hidden', 'false');
		ltBtn.setAttribute('aria-expanded', 'true');
		ltClose.focus();
	}
	function closeLT() {
		ltOpen = false;
		ltOverlay.classList.remove('open');
		ltPanel.classList.remove('open');
		ltPanel.setAttribute('aria-hidden', 'true');
		ltBtn.setAttribute('aria-expanded', 'false');
		ltBtn.focus();
	}

	if (ltBtn)
		ltBtn.addEventListener('click', () => (ltOpen ? closeLT() : openLT()));
	if (ltClose) ltClose.addEventListener('click', closeLT);
	if (ltOverlay) ltOverlay.addEventListener('click', closeLT);
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && ltOpen) closeLT();
	});

	/* --------------------------------------------------
     CASE STUDY TABS
  -------------------------------------------------- */
	const caseTabs = document.querySelectorAll('.case-tab');
	const casePanels = document.querySelectorAll('.case-panel');

	caseTabs.forEach((tab) => {
		tab.addEventListener('click', () => {
			const target = tab.getAttribute('aria-controls');
			caseTabs.forEach((t) => {
				t.classList.remove('active');
				t.setAttribute('aria-selected', 'false');
			});
			casePanels.forEach((p) => p.classList.add('case-panel--hidden'));
			tab.classList.add('active');
			tab.setAttribute('aria-selected', 'true');
			const panel = document.getElementById(target);
			if (panel) panel.classList.remove('case-panel--hidden');
		});
	});

	/* --------------------------------------------------
     ACCORDION — sub-items inside Brand Identity & Club Identity panels
     Each .cs-acc-trigger toggles its sibling .cs-acc-body open/closed.
     Only one item per accordion group can be open at a time.
  -------------------------------------------------- */
	document.querySelectorAll('.cs-accordion').forEach((accordion) => {
		const items = accordion.querySelectorAll('.cs-accordion-item');

		items.forEach((item) => {
			const trigger = item.querySelector('.cs-acc-trigger');
			const body = item.querySelector('.cs-acc-body');
			if (!trigger || !body) return;

			// Wrap existing body content in an inner div for the grid animation
			const inner = document.createElement('div');
			inner.className = 'cs-acc-body-inner';
			while (body.firstChild) inner.appendChild(body.firstChild);
			body.appendChild(inner);

			// Remove the HTML hidden attribute — CSS handles display via grid
			body.removeAttribute('hidden');

			trigger.addEventListener('click', () => {
				const isOpen = trigger.getAttribute('aria-expanded') === 'true';

				// Close all items in this accordion
				items.forEach((other) => {
					const otherTrigger = other.querySelector('.cs-acc-trigger');
					const otherBody = other.querySelector('.cs-acc-body');
					if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
					if (otherBody) otherBody.classList.remove('open');
				});

				// If was closed, open this one
				if (!isOpen) {
					trigger.setAttribute('aria-expanded', 'true');
					body.classList.add('open');
				}
			});
		});
	});

	/* --------------------------------------------------
     SCROLL PROGRESS BAR
  -------------------------------------------------- */
	const progressBar = document.getElementById('scroll-progress');
	if (progressBar) {
		window.addEventListener(
			'scroll',
			() => {
				const scrollTop = window.scrollY;
				const docHeight =
					document.documentElement.scrollHeight - window.innerHeight;
				const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
				progressBar.style.width = pct + '%';
			},
			{ passive: true },
		);
	}
})();
