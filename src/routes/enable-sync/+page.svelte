<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { getRandomStrain } from '$lib/strains';
  import { syncToCloud } from '$lib/sync';
  
  let generatedStrain = '';
  let userConfirmation = '';
  let username = '';
  let error = '';
  
  onMount(() => {
    const setupComplete = localStorage.getItem('fixweed_setup');
    if (!setupComplete || setupComplete === 'encrypted') {
      goto('/track');
    }
    generatedStrain = getRandomStrain();
  });
  
  function cancel() {
    goto('/track');
  }
  
  async function enableSync() {
    error = '';
    
    if (!username || username.trim().length === 0) {
      error = 'PLEASE ENTER A USERNAME';
      return;
    }
    
    if (userConfirmation.toLowerCase().trim() !== generatedStrain.toLowerCase().trim()) {
      error = 'STRAIN NAME DOES NOT MATCH';
      return;
    }
    
    localStorage.setItem('fixweed_setup', 'encrypted');
    localStorage.setItem('fixweed_key', generatedStrain);
    localStorage.setItem('fixweed_username', username.trim());
    
    await syncToCloud(username.trim(), generatedStrain);
    
    const existingProfile = localStorage.getItem('fixweed_profile');
    if (existingProfile) {
      goto('/track');
    } else {
      goto('/profile');
    }
  }
  
  function changeStrain() {
    generatedStrain = getRandomStrain();
    userConfirmation = '';
    error = '';
  }
</script>

<main>
  <div class="top-bar">
    <button on:click={cancel} class="back-link">← CANCEL</button>
  </div>
  
  <div class="container">
    <h1>ENABLE SYNC</h1>
    
    <div class="info-box">
      <p class="info-title">YOUR SYNC KEY</p>
      <p class="info-desc">
        Choose a username and save your strain key. Your existing data will be encrypted.
      </p>
      
      <div class="input-group">
        <label for="username">USERNAME</label>
        <input 
          id="username"
          type="text" 
          bind:value={username}
          placeholder="choose a username"
          autocomplete="off"
        />
      </div>
      
      <div class="strain-display">
        <div class="strain-label">YOUR STRAIN</div>
        <div class="strain-name">{generatedStrain}</div>
        <button on:click={changeStrain} class="change-strain-btn">
          ⟳ CHANGE STRAIN
        </button>
      </div>
      
      <p class="info-desc" style="margin-top: 15px; margin-bottom: 8px;">
        <strong>SAVE THIS STRAIN. WE CANNOT RECOVER IT.</strong>
      </p>
      
      <div class="input-group">
        <label for="confirm">CONFIRM STRAIN</label>
        <input 
          id="confirm"
          type="text" 
          bind:value={userConfirmation}
          placeholder="type the strain name"
          autocomplete="off"
        />
      </div>
      
      {#if error}
        <div class="error">{error}</div>
      {/if}
      
      <button on:click={enableSync} class="option-btn">
        CONFIRM & ENABLE SYNC
      </button>
      
      <button on:click={cancel} class="cancel-btn">
        KEEP LOCAL ONLY
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
    padding: 0;
  }
  
  .top-bar {
    padding: 15px 20px;
    border-bottom: 2px solid #222;
  }
  
  .back-link {
    background: none;
    border: none;
    color: #999;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    letter-spacing: 0.2em;
    cursor: pointer;
    padding: 0;
  }
  
  .back-link:hover {
    color: #fff;
  }
  
  .container {
    padding: 40px 20px;
    max-width: 500px;
    margin: 0 auto;
  }
  
  h1 {
    font-family: 'Arial Black', sans-serif;
    font-size: 2.5rem;
    color: #fff;
    margin: 0 0 40px 0;
    letter-spacing: -0.02em;
  }
  
  .info-box {
    background: rgba(0,0,0,0.95);
    border: 5px solid #fff;
    padding: 25px;
    box-shadow: inset 0 0 0 2px #000;
  }
  
  .info-title {
    font-family: 'Arial Black', sans-serif;
    font-size: 1.2rem;
    color: #00ff00;
    margin: 0 0 15px 0;
    letter-spacing: 0.05em;
  }
  
  .info-desc {
    font-size: 0.9rem;
    line-height: 1.6;
    color: #999;
    margin: 0 0 25px 0;
  }
  
  .info-desc strong {
    color: #fff;
  }
  
  .strain-display {
    background: #000;
    border: 4px solid #00ff00;
    padding: 25px;
    text-align: center;
    margin: 20px 0;
    box-shadow: 
      inset 0 0 0 2px #000,
      0 0 20px rgba(0,255,0,0.3);
  }
  
  .strain-label {
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: #00ff00;
    margin-bottom: 10px;
  }
  
  .strain-name {
    font-family: 'Arial Black', sans-serif;
    font-size: 2rem;
    color: #fff;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    margin-bottom: 15px;
  }
  
  .change-strain-btn {
    background: transparent;
    border: 2px solid #00ff00;
    color: #00ff00;
    padding: 8px 15px;
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    cursor: pointer;
  }
  
  .change-strain-btn:hover {
    background: rgba(0,255,0,0.1);
  }
  
  .change-strain-btn:active {
    background: #00ff00;
    color: #000;
  }
  
  .input-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    color: #666;
    margin-bottom: 8px;
  }
  
  input {
    width: 100%;
    background: #000;
    border: 3px solid #fff;
    color: #fff;
    padding: 15px;
    font-family: 'Courier New', monospace;
    font-size: 1rem;
    box-shadow: inset 0 0 0 2px #000;
    box-sizing: border-box;
    min-height: 44px;
  }
  
  input::placeholder {
    color: #444;
  }
  
  input:focus {
    outline: none;
    border-color: #00ff00;
  }
  
  .error {
    background: #ff0000;
    color: #fff;
    padding: 12px;
    margin-bottom: 20px;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    text-align: center;
  }
  
  .option-btn {
    width: 100%;
    background: #fff;
    border: none;
    padding: 18px;
    font-family: 'Arial Black', sans-serif;
    font-size: 1.1rem;
    letter-spacing: 0.05em;
    cursor: pointer;
    box-shadow: 
      inset -4px -4px 0 rgba(0,0,0,0.2),
      inset 4px 4px 0 rgba(255,255,255,0.8);
    color: #000;
    margin-bottom: 15px;
    min-height: 44px;
  }
  
  .option-btn:active {
    background: #00ff00;
    box-shadow: 
      inset 4px 4px 0 rgba(0,0,0,0.3),
      inset -4px -4px 0 rgba(255,255,255,0.5);
  }
  
  .cancel-btn {
    width: 100%;
    background: transparent;
    border: none;
    color: #666;
    padding: 15px;
    font-size: 0.9rem;
    letter-spacing: 0.2em;
    cursor: pointer;
    font-family: 'Courier New', monospace;
  }
  
  .cancel-btn:hover {
    color: #999;
  }
  
  @media (min-width: 768px) {
    .container {
      padding: 50px 40px;
      max-width: 600px;
    }
    
    h1 {
      font-size: 3rem;
      margin-bottom: 50px;
    }
    
    .info-box {
      padding: 35px;
    }
    
    .info-title {
      font-size: 1.4rem;
    }
    
    .info-desc {
      font-size: 1rem;
    }
    
    .strain-name {
      font-size: 2.4rem;
    }
    
    input {
      padding: 18px;
      font-size: 1.1rem;
    }
    
    .option-btn {
      padding: 20px;
      font-size: 1.2rem;
    }
  }
  
  @media (max-width: 480px) {
    .container {
      padding: 30px 15px;
    }
    
    h1 {
      font-size: 1.8rem;
      margin-bottom: 30px;
    }
    
    .info-box {
      padding: 18px 15px;
      border-width: 4px;
    }
    
    .info-title {
      font-size: 1rem;
    }
    
    .info-desc {
      font-size: 0.8rem;
    }
    
    .strain-name {
      font-size: 1.5rem;
    }
    
    .option-btn {
      padding: 16px;
      font-size: 1rem;
    }
    
    input {
      padding: 12px;
      font-size: 0.9rem;
    }
  }
</style>

