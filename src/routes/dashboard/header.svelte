<script lang="ts">
  import ThemeToggler from '$lib/components/ThemeToggler.svelte';

  let showSettings = false;
</script>

<header class="mb-4 bg-white shadow-sm dark:bg-gray-500/10">
  <div class="container flex items-center justify-between py-8">
    <a href="/dashboard" class="flex items-center space-x-2 text-xl font-semibold text-primary-500">
      <span>Knowledge AI</span>
      <span class="text-base font-normal text-gray-400">Dashboard</span>
    </a>
    <div id="header-nav" class="flex flex-shrink-0 items-center gap-4 text-sm font-medium">
      <ThemeToggler />
      <div class="relative">
        <a
          href="/dashboard/settings"
          on:click|preventDefault|stopPropagation={() => {
            showSettings = !showSettings;
            document.addEventListener('click', () => (showSettings = false));
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-5 w-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </a>
        <div
          class="absolute {showSettings
            ? 'flex'
            : 'hidden'} right-0 top-6 min-w-[100px] rounded-lg bg-gray-50 py-2 shadow-md dark:bg-[#222]"
        >
          <a href="/auth/logout" class="w-full px-4 py-2 hover:bg-gray-500/10">Logout</a>
        </div>
      </div>
    </div>
  </div>
</header>
