<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  let passphrase = '';
  let confirmPassphrase = '';
  let error = '';
  
  onMount(() => {
    const setupComplete = localStorage.getItem('fixweed_setup');
    if (!setupComplete || setupComplete === 'encrypted') {
      goto('/track');
    }
  });
  
  function cancel() {
    goto('/track');
  }
  
  function enableSync() {
    error = '';
    
    if (!passphrase || passphrase.length < 8) {
      error = 'PASSPHRASE MUST BE AT LEAST 8 CHARACTERS';
      return;
    }
    
    if (passphrase !== confirmPassphrase) {
      error = 'PASSPHRASES DO NOT MATCH';
      return;
    }
    
    localStorage.setItem('fixweed_setup', 'encrypted');
    localStorage.setItem('fixweed_key', passphrase);
    goto('/track');
  }
</script>

<main>
  <div class="top-bar">
    <button on:click={cancel} class="back-link">← CANCEL</button>
  </div>
  
  <div class="container">
    <h1>ENABLE SYNC</h1>
    
    <div class="info-box">
      <p class="info-title">UPGRADE TO ENCRYPTED SYNC</p>
      <p class="info-desc">
        Your existing data will be encrypted and can sync across devices.<br>
        <strong>Create a passphrase to continue.</strong><br>
        Do not lose this passphrase.
      </p>
      
      <div class="input-group">
        <label for="pass">PASSPHRASE</label>
        <input 
          id="pass"
          type="password" 
          bind:value={passphrase}
          placeholder="minimum 8 characters"
        />
      </div>
      
      <div class="input-group">
        <label for="confirm">CONFIRM PASSPHRASE</label>
        <input 
          id="confirm"
          type="password" 
          bind:value={confirmPassphrase}
          placeholder="type it again"
        />
      </div>
      
      {#if error}
        <div class="error">{error}</div>
      {/if}
      
      <button on:click={enableSync} class="option-btn">
        ENABLE SYNC
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
</style>

