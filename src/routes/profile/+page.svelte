<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { syncToCloud } from '$lib/sync';
  
  let smokingDuration = '';
  let smokingUnit = 'years';
  let frequency = '';
  let method = '';
  let amountPerSession = '';
  let source = '';
  let longestBreakDuration = '';
  let longestBreakUnit = 'days';
  let error = '';
  
  $: amountOptions = getAmountOptions(method);
  
  $: {
    // Reset amount when method changes
    if (method) {
      amountPerSession = '';
    }
  }
  
  function getAmountOptions(method: string) {
    switch (method) {
      case 'Joint':
      case 'Blunt':
        return ['0.5g', '1g', '1.5g', '2g', '2g+'];
      case 'Bong':
      case 'Pipe/Bowl':
        return ['Small bowl', 'Full bowl', 'Multiple bowls', 'All day'];
      case 'Vape (dry herb)':
        return ['Few hits', 'Full session', 'Multiple sessions', 'All day'];
      case 'Vape (cartridge)':
        return ['Few hits', 'Heavy session', 'Most of the day', 'All day'];
      case 'Dab rig':
        return ['Small dab', 'Average dab', 'Large dab', 'Multiple dabs'];
      case 'Edibles':
        return ['5-10mg', '10-25mg', '25-50mg', '50-100mg', '100mg+'];
      case 'Multiple methods':
        return ['Light use', 'Moderate use', 'Heavy use', 'All day'];
      default:
        return ['Light', 'Moderate', 'Heavy'];
    }
  }
  
  onMount(() => {
    const setupComplete = localStorage.getItem('fixweed_setup');
    if (!setupComplete) {
      goto('/');
      return;
    }
    
    // Check if profile already exists
    const existingProfile = localStorage.getItem('fixweed_profile');
    if (existingProfile) {
      goto('/welcome');
    }
  });
  
  async function saveProfile() {
    error = '';
    
    // Validate at least some fields are filled
    if (!smokingDuration && !frequency && !amountPerSession) {
      error = 'PLEASE ANSWER AT LEAST A FEW QUESTIONS';
      return;
    }
    
    const profile = {
      smokingDuration: smokingDuration ? `${smokingDuration} ${smokingUnit}` : '',
      frequency: frequency,
      amountPerSession: amountPerSession,
      method: method,
      source: source,
      longestBreak: longestBreakDuration === '0' ? 'Never' : 
                    longestBreakDuration ? `${longestBreakDuration} ${longestBreakUnit}` : '',
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('fixweed_profile', JSON.stringify(profile));
    
    const setup = localStorage.getItem('fixweed_setup');
    if (setup === 'encrypted') {
      const username = localStorage.getItem('fixweed_username');
      const key = localStorage.getItem('fixweed_key');
      if (username && key) {
        await syncToCloud(username, key);
      }
    }
    
    goto('/welcome');
  }
  
  async function skip() {
    // Save empty profile so they don't see this again
    localStorage.setItem('fixweed_profile', JSON.stringify({ skipped: true }));
    
    const setup = localStorage.getItem('fixweed_setup');
    if (setup === 'encrypted') {
      const username = localStorage.getItem('fixweed_username');
      const key = localStorage.getItem('fixweed_key');
      if (username && key) {
        await syncToCloud(username, key);
      }
    }
    
    goto('/welcome');
  }
</script>

<main>
  <div class="top-bar">
    <div class="progress">PROFILE SETUP</div>
  </div>
  
  <div class="container">
    <h1>YOUR HABITS</h1>
    
    <p class="info-desc">
      Help us understand your usage. All anonymous.
    </p>
    
    <div class="form">
      <div class="input-group">
        <label for="duration">HOW LONG HAVE YOU BEEN SMOKING?</label>
        <div class="multi-select">
          <select id="duration" bind:value={smokingDuration}>
            <option value="">-</option>
            {#each Array(30) as _, i}
              <option value={i + 1}>{i + 1}</option>
            {/each}
          </select>
          <select bind:value={smokingUnit}>
            <option value="days">days</option>
            <option value="weeks">weeks</option>
            <option value="months">months</option>
            <option value="years">years</option>
          </select>
        </div>
      </div>
      
      <div class="input-group">
        <label for="frequency">HOW OFTEN DO YOU SMOKE?</label>
        <select id="frequency" bind:value={frequency}>
          <option value="">-</option>
          <option value="All day / Constantly">All day / Constantly</option>
          <option value="Every hour">Every hour</option>
          <option value="Every 2 hours">Every 2 hours</option>
          <option value="Every 3-4 hours">Every 3-4 hours</option>
          <option value="Multiple times daily">Multiple times daily</option>
          <option value="Once daily">Once daily</option>
          <option value="Few times a week">Few times a week</option>
          <option value="Weekends only">Weekends only</option>
          <option value="Once a week">Once a week</option>
          <option value="Few times a month">Few times a month</option>
          <option value="Rarely">Rarely</option>
        </select>
      </div>
      
      <div class="input-group">
        <label for="method">HOW DO YOU SMOKE?</label>
        <select id="method" bind:value={method}>
          <option value="">-</option>
          <option value="Joint">Joint</option>
          <option value="Blunt">Blunt</option>
          <option value="Bong">Bong</option>
          <option value="Pipe/Bowl">Pipe/Bowl</option>
          <option value="Vape (dry herb)">Vape (dry herb)</option>
          <option value="Vape (cartridge)">Vape (cartridge)</option>
          <option value="Dab rig">Dab rig</option>
          <option value="Edibles">Edibles</option>
          <option value="Multiple methods">Multiple methods</option>
        </select>
      </div>
      
      <div class="input-group">
        <label for="amount">HOW MUCH PER SESSION?</label>
        <select id="amount" bind:value={amountPerSession}>
          <option value="">-</option>
          {#each amountOptions as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </div>
      
      <div class="input-group">
        <label for="source">WHERE DO YOU GET YOUR WEED?</label>
        <select id="source" bind:value={source}>
          <option value="">-</option>
          <option value="Legal dispensary">Legal dispensary</option>
          <option value="Grey area dispensary">Grey area dispensary</option>
          <option value="Dealer">Dealer</option>
          <option value="Friend">Friend</option>
          <option value="Grow my own">Grow my own</option>
          <option value="Medical card">Medical card</option>
          <option value="Online/delivery">Online/delivery</option>
        </select>
      </div>
      
      <div class="input-group">
        <label for="break">LONGEST BREAK YOU'VE TAKEN?</label>
        {#if longestBreakDuration === '0'}
          <select id="break" bind:value={longestBreakDuration}>
            <option value="">-</option>
            <option value="0">Never taken a break</option>
            {#each Array(100) as _, i}
              <option value={i + 1}>{i + 1}</option>
            {/each}
          </select>
        {:else}
          <div class="multi-select">
            <select id="break" bind:value={longestBreakDuration}>
              <option value="">-</option>
              <option value="0">Never taken a break</option>
              {#each Array(100) as _, i}
                <option value={i + 1}>{i + 1}</option>
              {/each}
            </select>
            <select bind:value={longestBreakUnit}>
              <option value="days">days</option>
              <option value="weeks">weeks</option>
              <option value="months">months</option>
              <option value="years">years</option>
            </select>
          </div>
        {/if}
      </div>
      
      {#if error}
        <div class="error">{error}</div>
      {/if}
      
      <button on:click={saveProfile} class="save-btn">
        SAVE & CONTINUE
      </button>
      
      <button on:click={skip} class="skip-btn">
        SKIP FOR NOW
      </button>
    </div>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: #000;
    font-family: 'Courier New', monospace;
  }
  
  main {
    min-height: 100vh;
  }
  
  .top-bar {
    padding: 15px 20px;
    border-bottom: 2px solid #222;
    background: #000;
  }
  
  .progress {
    color: #00ff00;
    font-size: 0.8rem;
    letter-spacing: 0.3em;
  }
  
  .container {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
  }
  
  h1 {
    font-family: 'Arial Black', sans-serif;
    font-size: 1.7rem;
    color: #fff;
    margin: 0 0 8px 0;
    letter-spacing: -0.02em;
  }
  
  .info-desc {
    font-size: 0.85rem;
    color: #999;
    margin: 0 0 18px 0;
  }
  
  .form {
    background: rgba(0,0,0,0.95);
    border: 5px solid #fff;
    padding: 20px 18px;
    box-shadow: inset 0 0 0 2px #000;
  }
  
  .input-group {
    margin-bottom: 16px;
  }
  
  .input-group:last-of-type {
    margin-bottom: 0;
  }
  
  label {
    display: block;
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    color: #00ff00;
    margin-bottom: 6px;
  }
  
  select {
    width: 100%;
    background: #000;
    border: 3px solid #fff;
    color: #fff;
    padding: 12px 10px;
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
    box-shadow: inset 0 0 0 2px #000;
    box-sizing: border-box;
    cursor: pointer;
    min-height: 44px;
  }
  
  select:focus {
    outline: none;
    border-color: #00ff00;
  }
  
  .multi-select {
    display: flex;
    gap: 10px;
  }
  
  .multi-select select {
    flex: 1;
  }
  
  .multi-select select:first-child {
    flex: 2;
  }
  
  .error {
    background: #ff0000;
    color: #fff;
    padding: 10px;
    margin: 16px 0;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    text-align: center;
  }
  
  .save-btn {
    width: 100%;
    background: #fff;
    border: none;
    padding: 16px 15px;
    font-family: 'Arial Black', sans-serif;
    font-size: 1rem;
    letter-spacing: 0.05em;
    cursor: pointer;
    box-shadow: 
      inset -4px -4px 0 rgba(0,0,0,0.2),
      inset 4px 4px 0 rgba(255,255,255,0.8);
    color: #000;
    margin: 16px 0 10px 0;
    min-height: 44px;
  }
  
  .save-btn:active {
    background: #00ff00;
    box-shadow: 
      inset 4px 4px 0 rgba(0,0,0,0.3),
      inset -4px -4px 0 rgba(255,255,255,0.5);
  }
  
  .skip-btn {
    width: 100%;
    background: transparent;
    border: none;
    color: #666;
    padding: 12px;
    font-size: 0.8rem;
    letter-spacing: 0.2em;
    cursor: pointer;
    font-family: 'Courier New', monospace;
  }
  
  .skip-btn:hover {
    color: #999;
  }
  
  @media (min-width: 768px) {
    .container {
      padding: 30px 40px;
    }
    
    h1 {
      font-size: 2rem;
      margin-bottom: 12px;
    }
    
    .info-desc {
      font-size: 0.9rem;
      margin-bottom: 25px;
    }
    
    .form {
      padding: 30px 25px;
    }
    
    label {
      font-size: 0.75rem;
    }
    
    select {
      padding: 12px;
      font-size: 0.9rem;
    }
    
    .save-btn {
      padding: 18px;
      font-size: 1.1rem;
    }
  }
  
  @media (max-width: 480px) {
    h1 {
      font-size: 1.5rem;
    }
    
    .form {
      padding: 15px;
    }
    
    select {
      font-size: 0.8rem;
    }
  }
</style>

