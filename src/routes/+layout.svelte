<script>
	import './app.css';

	import { onMount } from 'svelte';
	import { screenType, iframe } from '$lib/store/store';

	import Header from '$lib/components/header/header.svelte';
	import Footer from '$lib/components/footer/footer.svelte';

	import Experience from '$lib/three-d/Experience.js'

	onMount(async () => {

		const experience = new Experience(document.querySelector('canvas.webgl'))

		// ---------------------------------------------------------------------------
		// HEIGHT
		// ---------------------------------------------------------------------------

		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);

		window.addEventListener('resize', () => {
			let vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		});

		// ---------------------------------------------------------------------------
		// SCREEN
		// ---------------------------------------------------------------------------
		const ua = navigator.userAgent;
		if (
			/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)
		) {
			// phone
			screenType.set(1);
		} else if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
			// tablet
			screenType.set(2);
		} else {
			//laptop
			screenType.set(3);
		}

		if (window.location !== window.parent.location) {
			// The page is in an iframe
			iframe.set(true);
		}
	});
</script>

<canvas class="webgl"></canvas>

<div class="app">
	{#if $screenType}
	<!-- <header>
		<Header />
	</header> -->

	<main>
		<slot />
	</main>

	<!-- <footer>
		<Footer />
	</footer> -->
	{/if}
</div>


<style>
	.app {
		display: flex;
		flex-direction: column;
		height: 100%;
		height: calc(var(--vh, 1vh) * 100);
	}

	.webgl {
		position: absolute;
		z-index: 0;
	}

	header {
		position: absolute;
		top: 0;
		width: 100%;
	}

	footer {
		position: absolute;
		bottom: 0;
		width: 100%;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: calc(4 * var(--margin)) calc(4 * var(--margin));
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	@media only screen and (max-width: 768px) {
		main {
			padding: calc(4 * var(--margin)) calc(3 * var(--margin));
		}
	}
</style>
