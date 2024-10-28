<script>
	import Nav from './nav.svelte';
	import { darkMode } from '$lib/store/store';
	// stub data out
	const navItems = [
		{
			name: 'PROJECTS',
			href: '/'
		},
		{
			name: 'ART',
			href: '/'
		},
		{
			name: 'ABOUT',
			href: '/'
		},
	];

	let toggleDarkMode = () => {
		darkMode.set(!$darkMode);
		document.querySelector(':root').classList.toggle('dark-mode');
	};
</script>

<header>
	<main>

		<Nav {navItems} />

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div on:click={() => toggleDarkMode()} class="darkMode">
		<p class:selected={$darkMode == false}>day</p>
		<p class="selected">/</p>
		<p class:selected={$darkMode == true}>night</p>
	</div>
</main>
</header>

<style>
	header {
		user-select: none;
		color: var(--primary);
		/* border-bottom: solid 1px var(--primary-50);
		background: var(--background);
		box-shadow: 0px -1px 8px var(--orimary-50); */
	}

	main {
		margin: auto;
		max-width: 100vw;
		display: flex;
		justify-content: space-between;
		align-items: center;

		padding: 20px 10px;
		font-size: 14px;
		height: calc(3 * var(--margin));
		font-family: nb-architekt;
		font-weight: 500;
	}

	.darkMode {
		display: flex;
	}

	.app_link {
		opacity: 0.3;
	}

	.darkMode p {
		line-height: 110%;
		font-size: 15px;
		letter-spacing: 0.1em;
		padding: 10px;
		cursor: pointer;
		opacity: 0.4;
	}

	.darkMode p.selected {
		opacity: 1;
	}

	@media only screen and (max-width: 768px) {

	}
</style>
