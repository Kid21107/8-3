
// ============ CONFIGURATION ============
const CONFIG = {
	recipientName: "Những cô gái Lớp 10A1",                      // Tên người nhận
	senderName: "Mỹ Nam A1",                            // Tên người gửi
	photoSrc: "",                        // Đặt đường dẫn ảnh tại đây
	giftVideoSrc: "",                   // Video quà (mp4). Để trống = dùng src trong HTML (gift.mp4)
	dateText: "",
	// Nội dung thư (dùng \n để xuống dòng). Có thể chỉnh sửa trực tiếp trong HTML nếu muốn định dạng đặc biệt hơn.
	message: `Nhân ngày 8/3, em xin chúc cô và tất cả các bạn nữ lớp 10A1 luôn thật nhiều sức khỏe, luôn vui vẻ, xinh đẹp và tràn đầy năng lượng mỗi ngày. Cảm ơn cô vì đã luôn tận tâm dạy dỗ, quan tâm và đồng hành cùng lớp trong học tập cũng như trong cuộc sống. Chúc cô luôn hạnh phúc, thành công và mãi là người truyền cảm hứng cho chúng em.

Chúc các bạn nữ của lớp 10A1 luôn tự tin, học tốt và giữ mãi những nụ cười rạng rỡ. Mong rằng chúng ta sẽ cùng nhau tạo thêm thật nhiều kỷ niệm đẹp, đáng nhớ trong quãng thời gian học tập dưới mái trường và cùng nhau xây dựng một tập thể lớp thật đoàn kết, vui vẻ. Chúc cô và các bạn nữ có một ngày 8/3 thật ý nghĩa, tràn ngập niềm vui và hạnh phúc. 🌸💐`
};
// =======================================


// === INTRO Ban đầu có thể sửa nội dung hoặc thêm dòng nếu muốn ===
const INTRO_LINES = [
	{ text: "Tụi mình có nhũng lời chúc muốn gửi đến các bạn....", pause: 2200 },
	{ text: "Đó là", pause: 1600, dots: true },
	{ text: "Chúc mừng ngày 8/3!", pause: 1800 },
];

function runIntro() {
	const screen = document.getElementById('introScreen');
	const line = document.getElementById('introLine');
	const heart = document.getElementById('introHeart');

	// show heart
	if (heart) {
		setTimeout(() => heart.classList.add('show'), 300);
	}

	let i = 0;
	function showNext() {
		if (i >= INTRO_LINES.length) {
			// Done — hide intro, show envelope
			line.classList.add('fade-out');
			if (heart) heart.style.opacity = '0';
			setTimeout(() => {
				screen.classList.add('hidden');
			}, 700);
			return;
		}

		const item = INTRO_LINES[i];
		// Reset line
		line.classList.remove('show', 'fade-out');
		line.textContent = '';

		// Small delay between lines
		setTimeout(() => {
			if (item.dots) {
				// Type with trailing dots animation
				line.innerHTML = item.text + ' <span class="intro-dot">.</span><span class="intro-dot">.</span><span class="intro-dot">.</span>';
			} else {
				line.textContent = item.text;
			}
			line.classList.add('show');
			i++;

			setTimeout(() => {
				line.classList.add('fade-out');
				setTimeout(showNext, 500);
			}, item.pause);
		}, 300);
	}

	showNext();
}

let typingInterval;
let titleInterval;
let typingCursor;

function setDate() {
	const el = document.getElementById('letterDate');
	if (!el) return;

	const custom = (CONFIG.dateText || '').trim();
	if (custom) {
		el.textContent = custom;
		return;
	}

	// If user already typed something (contenteditable) or hard-coded it in HTML, don't overwrite.
	if ((el.textContent || '').trim()) return;

	const now = new Date();
	el.textContent = now.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function createPetals() {
	const container = document.getElementById('petals');
	if (!container) return;
	if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	for (let i = 0; i < 28; i++) {
		const p = document.createElement('div');
		p.className = 'petal';
		p.style.left = Math.random() * 100 + 'vw';
		p.style.animationDuration = (6 + Math.random() * 6) + 's';
		p.style.animationDelay = (Math.random() * 6) + 's';
		p.style.width = (8 + Math.random() * 10) + 'px';
		p.style.height = (12 + Math.random() * 10) + 'px';
		container.appendChild(p);
	}
}

function burstHearts(cx, cy) {
	const container = document.getElementById('heartsBurst');
	container.innerHTML = '';
	const emojis = ['❤️','💕','🌸'];
	for (let i = 0; i < 18; i++) {
		const h = document.createElement('span');
		h.className = 'burst-heart';
		h.textContent = emojis[Math.floor(Math.random()*emojis.length)];
		const angle = (Math.PI * 2 * i) / 18;
		const dist = 80 + Math.random() * 80;
		h.style.left = cx + 'px';
		h.style.top = cy + 'px';
		h.style.setProperty('--tx', Math.cos(angle)*dist + 'px');
		h.style.setProperty('--ty', Math.sin(angle)*dist + 'px');
		h.style.animationDelay = (Math.random()*0.3) + 's';
		container.appendChild(h);
		setTimeout(() => h.remove(), 2000);
	}
}

function openLetterPopup() {
	const overlay = document.getElementById('letterOverlay');
	if (!overlay) return;

	// Start music on user gesture when possible.
	startMusic();

	// Show floating hearts above the envelope (template-like)
	const valentines = document.getElementById('valentines');
	// On touch devices, avoid the "card slides out" effect that can look like the letter is sticking out.
	const canHover = !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
	if (valentines && canHover) valentines.classList.add('is-open');

	// Burst hearts from the card position
	const card = document.getElementById('openCard');
	if (card) {
		const rect = card.getBoundingClientRect();
		burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2);
	}

	overlay.classList.add('visible');
	overlay.setAttribute('aria-hidden', 'false');
	setGiftButtonVisible(false);

	applyLetterPhoto();
	startLetterTyping();
}

function closeLetterPopup() {
	const overlay = document.getElementById('letterOverlay');
	if (!overlay) return;
	overlay.classList.remove('visible');
	overlay.setAttribute('aria-hidden', 'true');
	setGiftButtonVisible(false);
	const valentines = document.getElementById('valentines');
	if (valentines) valentines.classList.remove('is-open');
	stopTyping();
}

function stopTyping() {
	if (typingInterval) {
		clearInterval(typingInterval);
		typingInterval = undefined;
	}
	if (titleInterval) {
		clearInterval(titleInterval);
		titleInterval = undefined;
	}
	if (typingCursor) {
		typingCursor.remove();
		typingCursor = undefined;
	}
}

function applyLetterPhoto() {
	const img = document.getElementById('letterImg');
	if (!img) return;
	const wrapper = img.closest('.letter-photo');

	const configSrc = (CONFIG.photoSrc || '').trim();
	const htmlSrc = (img.getAttribute('src') || '').trim();
	const finalSrc = configSrc || htmlSrc;

	if (finalSrc) {
		img.src = finalSrc;
		img.style.display = 'block';
		if (wrapper) wrapper.classList.add('has-photo');
	} else {
		img.style.display = 'none';
		if (wrapper) wrapper.classList.remove('has-photo');
	}
}

function startLetterTyping() {
	stopTyping();
	setGiftButtonVisible(false);

	const greetingEl = document.getElementById('letterGreeting');
	const bodyEl = document.getElementById('letterBody');
	const sigEl = document.getElementById('letterSig');
	if (!bodyEl || !sigEl) return;

	if (greetingEl) greetingEl.textContent = `Gửi ${CONFIG.recipientName},`;
	bodyEl.textContent = '';
	sigEl.textContent = '';
	sigEl.style.opacity = '0';

	startMessageTyping(bodyEl, sigEl);
}

function startMessageTyping(bodyEl, sigEl) {
	const cursor = document.createElement('span');
	cursor.className = 'cursor';
	bodyEl.appendChild(cursor);
	typingCursor = cursor;

	const text = CONFIG.message;
	let i = 0;

	typingInterval = setInterval(() => {
		if (i < text.length) {
			const ch = text[i];
			cursor.before(ch === '\n' ? document.createElement('br') : document.createTextNode(ch));
			i++;
			return;
		}

		clearInterval(typingInterval);
		typingInterval = undefined;
		cursor.remove();
		typingCursor = undefined;

		setTimeout(() => {
			sigEl.textContent = CONFIG.senderName;
			sigEl.style.opacity = '1';
			setGiftButtonVisible(true);
		}, 350);
	}, 28);
}

function setGiftButtonVisible(visible) {
	const btn = document.getElementById('giftBtn');
	if (!btn) return;
	btn.classList.toggle('is-visible', !!visible);
	btn.disabled = !visible;
}

function applyGiftVideoSrc() {
	const video = document.getElementById('giftVideo');
	if (!video) return;
	const src = (CONFIG.giftVideoSrc || '').trim();
	if (!src) return;

	const source = video.querySelector('source');
	if (source) {
		source.src = src;
		video.load();
		return;
	}

	video.src = src;
	video.load();
}

function attemptFullscreen(video) {
	if (!video) return;
	const screen = document.getElementById('videoScreen');

	// Standard Fullscreen API (Android/desktop)
	const target = screen || video;
	const request =
		(target.requestFullscreen ||
			target.webkitRequestFullscreen ||
			target.msRequestFullscreen);
	if (typeof request === 'function') {
		try {
			request.call(target);
		} catch {
			// ignore
		}
	}

	// iOS Safari fallback
	if (typeof video.webkitEnterFullscreen === 'function') {
		try {
			video.webkitEnterFullscreen();
		} catch {
			// ignore
		}
	}
}

function openGiftVideo() {
	const screen = document.getElementById('videoScreen');
	const overlay = document.getElementById('letterOverlay');
	const video = document.getElementById('giftVideo');
	if (!screen || !video) return;

	// Close letter UI, open video UI
	if (overlay) {
		overlay.classList.remove('visible');
		overlay.setAttribute('aria-hidden', 'true');
	}
	setGiftButtonVisible(false);
	stopTyping();

	screen.classList.add('visible');
	screen.setAttribute('aria-hidden', 'false');

	video.currentTime = 0;
	attemptFullscreen(video);

	const p = video.play();
	if (p && typeof p.catch === 'function') {
		p.catch(() => {
			// Some browsers require a second tap to start playback.
		});
	}
}

function closeGiftVideo() {
	const screen = document.getElementById('videoScreen');
	const video = document.getElementById('giftVideo');
	if (!screen || !video) return;

	// Try to exit fullscreen if we're in it.
	const exit =
		(document.exitFullscreen ||
			document.webkitExitFullscreen ||
			document.msExitFullscreen);
	if (document.fullscreenElement && typeof exit === 'function') {
		try {
			exit.call(document);
		} catch {
			// ignore
		}
	}

	if (typeof video.webkitExitFullscreen === 'function') {
		try {
			video.webkitExitFullscreen();
		} catch {
			// ignore
		}
	}

	try {
		video.pause();
	} catch {
		// ignore
	}

	screen.classList.remove('visible');
	screen.setAttribute('aria-hidden', 'true');
}

let musicPlaying = false;

function startMusic() {
	const audio = document.getElementById('bgMusic');
	if (!audio) return Promise.resolve(false);

	audio.volume = 0.3;
	const p = audio.play();
	if (p && typeof p.then === 'function') {
		return p
			.then(() => {
				musicPlaying = true;
				return true;
			})
			.catch(() => false);
	}

	// Older browsers may not return a promise
	musicPlaying = true;
	return Promise.resolve(true);
}

// If autoplay is blocked on load, retry at the first user interaction (tap/click/keydown).
function armAutoplayRetry() {
	const attempt = () => {
		startMusic().then((ok) => {
			if (ok) cleanup();
		});
	};

	const cleanup = () => {
		document.removeEventListener('pointerdown', attempt);
		document.removeEventListener('keydown', attempt);
	};

	document.addEventListener('pointerdown', attempt, { passive: true });
	document.addEventListener('keydown', attempt);
}

setDate();
runIntro();
createPetals();
applyGiftVideoSrc();
armAutoplayRetry();
startMusic();

// Events for template-like initial letter
(function initLetterEvents() {
	const card = document.getElementById('openCard');
	const valentines = document.getElementById('valentines');
	const overlay = document.getElementById('letterOverlay');
	const giftBtn = document.getElementById('giftBtn');
	const videoExitBtn = document.getElementById('videoExitBtn');
	const giftVideo = document.getElementById('giftVideo');
	let lastTouchAt = 0;

	const openFromTap = (e) => {
		// Avoid double-fire: touchstart is often followed by a synthetic click.
		if (e && e.type === 'touchstart') {
			lastTouchAt = Date.now();
			if (e.cancelable) e.preventDefault();
		}
		if (e && e.type === 'click' && Date.now() - lastTouchAt < 650) return;
		openLetterPopup();
	};

	if (card) {
		card.addEventListener('click', openLetterPopup);
		card.addEventListener('touchstart', openFromTap, { passive: false });
		card.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				openLetterPopup();
			}
		});
	}

	// On mobile, decorative layers can sit above the card; handle taps on the whole envelope area.
	if (valentines) {
		valentines.addEventListener('click', openFromTap);
		valentines.addEventListener('touchstart', openFromTap, { passive: false });
	}

	if (overlay) {
		overlay.addEventListener('click', (e) => {
			if (e.target === overlay) closeLetterPopup();
		});
	}

	if (giftBtn) {
		giftBtn.addEventListener('click', openGiftVideo);
	}

	if (videoExitBtn) {
		videoExitBtn.addEventListener('click', closeGiftVideo);
	}

	if (giftVideo) {
		giftVideo.addEventListener('ended', closeGiftVideo);
		giftVideo.addEventListener('webkitendfullscreen', () => {
			// iOS Safari: user taps "Done" to exit native fullscreen
			closeGiftVideo();
		});
	}

	document.addEventListener('keydown', (e) => {
		if (e.key !== 'Escape') return;
		const screen = document.getElementById('videoScreen');
		if (screen && screen.classList.contains('visible')) closeGiftVideo();
	});
})();

