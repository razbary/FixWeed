<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { getRandomStrain } from '$lib/strains';
  import { loadFromCloud, syncToCloud } from '$lib/sync';
  
  let step = 1;
  let generatedStrain = '';
  let userConfirmation = '';
  let username = '';
  let error = '';
  let isReturningUser = false;
  let isRecovery = false;
  let recoveryStrain = '';
  let recoveryUsername = '';
  let isLoading = false;
  
  onMount(() => {
    const setupComplete = localStorage.getItem('fixweed_setup');
    if (setupComplete === 'encrypted') {
      // User already has sync, go to track
      goto('/track');
    } else if (setupComplete === 'local_only') {
      isReturningUser = true;
      // Show returning user the option to enable sync
    }
    // If no setup, show new user flow
  });
  
  function skipSync() {
    localStorage.setItem('fixweed_setup', 'local_only');
    goto('/profile');
  }
  
  function nextStepGenerate() {
    if (step === 1) {
      isRecovery = false;
      generatedStrain = getRandomStrain();
      step = 2;
    }
  }
  
  function nextStepRecover() {
    if (step === 1) {
      isRecovery = true;
      step = 2;
    }
  }
  
  async function setupSync() {
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
    
    goto('/profile');
  }
  
  async function recoverData() {
    error = '';
    isLoading = true;
    
    if (!recoveryUsername || recoveryUsername.trim().length === 0) {
      error = 'PLEASE ENTER YOUR USERNAME';
      isLoading = false;
      return;
    }
    
    if (!recoveryStrain || recoveryStrain.trim().length === 0) {
      error = 'PLEASE ENTER YOUR STRAIN NAME';
      isLoading = false;
      return;
    }
    
    localStorage.setItem('fixweed_setup', 'encrypted');
    localStorage.setItem('fixweed_key', recoveryStrain.trim());
    localStorage.setItem('fixweed_username', recoveryUsername.trim());
    
    const loaded = await loadFromCloud(recoveryUsername.trim(), recoveryStrain.trim());
    
    isLoading = false;
    
    if (!loaded) {
      error = 'RECOVERY FAILED - CHECK USERNAME & STRAIN';
      return;
    }
    
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
  <div class="progress-bar">
    <div class="progress-fill" style="width: {step === 1 ? '50%' : '100%'}"></div>
  </div>
  
  <div class="top-bar">
    <a href="/" class="back-link">← BACK</a>
  </div>
  
  <div class="container">
    {#if step === 1}
      <div class="step">
        <h1>{isReturningUser ? 'STORAGE OPTIONS' : 'STORAGE'}</h1>
        
        {#if isReturningUser}
          <p class="info-desc" style="margin-bottom: 20px; color: #999;">
            Existing data found. Choose storage method:
          </p>
        {/if}
        
        <div class="info-box compact">
          <p class="info-title">{isReturningUser ? 'SYNC' : 'NEW SYNC'}</p>
          <p class="info-desc">
            Create new encrypted account
          </p>
          <button on:click={nextStepGenerate} class="option-btn">
            {isReturningUser ? 'ENABLE SYNC' : 'GENERATE STRAIN'}
          </button>
        </div>
        
        <div class="divider">OR</div>
        
        <div class="info-box compact">
          <p class="info-title">RESTORE FROM SYNC</p>
          <p class="info-desc">
            Load existing synced data
          </p>
          <button on:click={nextStepRecover} class="option-btn">
            ENTER STRAIN
          </button>
        </div>
        
        <div class="divider">OR</div>
        
        <div class="info-box compact warning">
          <p class="info-title">{isReturningUser ? 'LOCAL ONLY' : 'LOCAL ONLY'}</p>
          <p class="info-desc">
            This device only · Can be inconsistent · Not recommended
          </p>
          <p class="info-desc" style="margin-top: 10px; font-size: 0.75rem; color: #777;">
            If concerned about data saved in any database: this option is 100% isolated, nothing stored on servers.
          </p>
          <button on:click={skipSync} class="option-btn secondary">
            {isReturningUser ? 'KEEP LOCAL' : 'USE LOCAL'}
          </button>
        </div>
      </div>
    {:else}
      <div class="step">
        {#if isRecovery}
          <h1>RECOVER DATA</h1>
          
          <div class="info-box">
            <p class="info-desc">
              Enter your details to recover your data.
            </p>
            
            <div class="input-group">
              <label for="recovery-name">USERNAME</label>
              <input 
                id="recovery-name"
                type="text" 
                bind:value={recoveryUsername}
                placeholder="enter your username"
                autocomplete="off"
              />
            </div>
            
            <div class="input-group">
              <label for="recovery">YOUR STRAIN NAME</label>
              <input 
                id="recovery"
                type="text" 
                bind:value={recoveryStrain}
                placeholder="enter your strain name"
                autocomplete="off"
              />
            </div>
            
            {#if error}
              <div class="error">{error}</div>
            {/if}
            
            <button on:click={recoverData} class="option-btn" disabled={isLoading}>
              {isLoading ? 'LOADING...' : 'RECOVER DATA'}
            </button>
            
            <button on:click={() => step = 1} class="back-btn">
              ← BACK
            </button>
          </div>
        {:else}
          <h1>YOUR SYNC KEY</h1>
          
          <div class="info-box">
            <p class="info-desc">
              Choose a username and save your strain key.
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
            
            <button on:click={setupSync} class="option-btn">
              CONFIRM & ENABLE SYNC
            </button>
            
            <button on:click={() => step = 1} class="back-btn">
              ← BACK
            </button>
          </div>
        {/if}
      </div>
    {/if}
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
  
  .progress-bar {
    height: 8px;
    background: #222;
    border-bottom: 2px solid #fff;
  }
  
  .progress-fill {
    height: 100%;
    background: #00ff00;
    transition: none;
  }
  
  .top-bar {
    padding: 15px 20px;
    border-bottom: 2px solid #222;
  }
  
  .back-link {
    color: #999;
    text-decoration: none;
    font-size: 0.9rem;
    letter-spacing: 0.2em;
    display: inline-block;
  }
  
  .back-link:hover {
    color: #fff;
  }
  
  .container {
    padding: 30px 20px;
    max-width: 500px;
    margin: 0 auto;
  }
  
  h1 {
    font-family: 'Arial Black', sans-serif;
    font-size: 2rem;
    color: #fff;
    margin: 0 0 25px 0;
    letter-spacing: -0.02em;
  }
  
  .info-box {
    background: rgba(0,0,0,0.95);
    border: 5px solid #fff;
    padding: 25px;
    margin-bottom: 25px;
    box-shadow: inset 0 0 0 2px #000;
  }
  
  .info-box.compact {
    padding: 18px 20px;
    margin-bottom: 18px;
  }
  
  .info-box.warning {
    border-color: #444;
    opacity: 0.7;
  }
  
  .info-box.warning .info-title {
    color: #888;
  }
  
  .info-box.warning .info-desc {
    color: #666;
  }
  
  .info-title {
    font-family: 'Arial Black', sans-serif;
    font-size: 1rem;
    color: #00ff00;
    margin: 0 0 8px 0;
    letter-spacing: 0.05em;
  }
  
  .info-desc {
    font-size: 0.8rem;
    line-height: 1.4;
    color: #999;
    margin: 0 0 15px 0;
  }
  
  .info-desc strong {
    color: #fff;
  }
  
  .divider {
    text-align: center;
    font-size: 0.8rem;
    color: #666;
    margin: 15px 0;
    letter-spacing: 0.3em;
  }
  
  .option-btn {
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
    min-height: 44px;
  }
  
  .option-btn:active {
    background: #00ff00;
    box-shadow: 
      inset 4px 4px 0 rgba(0,0,0,0.3),
      inset -4px -4px 0 rgba(255,255,255,0.5);
  }
  
  .option-btn.secondary {
    background: #000;
    color: #fff;
    border: 3px solid #fff;
  }
  
  .option-btn.secondary:active {
    background: #00ff00;
    color: #000;
  }
  
  .option-btn-small {
    width: 100%;
    background: transparent;
    border: 1px solid #444;
    color: #666;
    padding: 10px;
    margin-top: 10px;
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    cursor: pointer;
  }
  
  .option-btn-small:hover {
    border-color: #fff;
    color: #fff;
  }
  
  .option-btn-small:active {
    background: rgba(255,255,255,0.1);
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
  
  .back-btn {
    width: 100%;
    background: transparent;
    border: none;
    color: #666;
    padding: 15px;
    font-size: 0.9rem;
    letter-spacing: 0.2em;
    cursor: pointer;
    margin-top: 10px;
  }
  
  .back-btn:hover {
    color: #999;
  }
  
  @media (min-width: 768px) {
    .container {
      padding: 40px;
      max-width: 600px;
    }
    
    h1 {
      font-size: 2.5rem;
      margin-bottom: 30px;
    }
    
    .info-box {
      padding: 30px;
    }
    
    .info-title {
      font-size: 1.2rem;
    }
    
    .info-desc {
      font-size: 0.85rem;
    }
    
    .option-btn {
      padding: 18px;
      font-size: 1.1rem;
    }
    
    .strain-name {
      font-size: 2.2rem;
    }
    
    input {
      padding: 18px;
      font-size: 1.1rem;
    }
  }
  
  @media (max-width: 480px) {
    h1 {
      font-size: 1.6rem;
    }
    
    .info-box {
      padding: 18px 15px;
      border-width: 4px;
    }
    
    .info-box.compact {
      padding: 15px;
    }
    
    .strain-name {
      font-size: 1.5rem;
    }
    
    .option-btn {
      font-size: 0.9rem;
    }
    
    input {
      padding: 12px;
      font-size: 0.9rem;
    }
  }
</style>

