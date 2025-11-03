<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  let hasExistingData = false;
  let username = '';
  
  onMount(() => {
    const setupComplete = localStorage.getItem('fixweed_setup');
    hasExistingData = !!setupComplete;
    if (hasExistingData) {
      username = localStorage.getItem('fixweed_username') || '';
    }
  });
  
  function handleStart() {
    const setupComplete = localStorage.getItem('fixweed_setup');
    
    if (setupComplete === 'encrypted') {
      // User already has sync enabled, go straight to track
      goto('/track');
    } else {
      // New user or local-only user, go to setup
      // Setup page will show appropriate options
      goto('/setup');
    }
  }
  
  function startFresh() {
    if (confirm('Are you sure? This will delete all your data and cannot be undone.')) {
      localStorage.clear();
      hasExistingData = false;
    }
  }
</script>

<main>
  <div class="container">
    <div class="title-section">
      <h1>FIX<br>WEED</h1>
      <div class="line"></div>
    </div>
    
    <div class="message-block">
      <p class="statement">
        YOUR WEED.<br>
        YOUR USAGE.<br>
        YOUR TERMS.
      </p>
    </div>
    
    <div class="info-panels">
      <div class="panel">
        <div class="panel-num">100%</div>
        <div class="panel-text">ANONYMOUS</div>
      </div>
      
      <div class="panel">
        <div class="panel-num">0</div>
        <div class="panel-text">TRACKING</div>
      </div>
      
      <div class="panel">
        <div class="panel-num">0</div>
        <div class="panel-text">JUDGMENT</div>
      </div>
    </div>
    
    <div class="cta-section">
      <button on:click={handleStart} class="start-btn">
        <span class="btn-text">{hasExistingData ? (username ? `CONTINUE (${username})` : 'CONTINUE') : 'TAKE CONTROL'}</span>
        <span class="btn-arrow">→</span>
      </button>
      
      {#if hasExistingData}
        <button on:click={startFresh} class="fresh-btn">
          START FRESH
        </button>
      {/if}
      
      <p class="disclaimer">
        NO COOKIES · NO ANALYTICS · NO TRACKING<br>
        DATA STORED LOCALLY OR ENCRYPTED ON YOUR TERMS
      </p>
    </div>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: #000;
    font-family: 'Courier New', monospace;
    overflow-x: hidden;
  }
  
  main {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: 
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(255,255,255,0.02) 2px,
        rgba(255,255,255,0.02) 4px
      );
  }
  
  .container {
    width: 100%;
    max-width: 500px;
  }
  
  .title-section {
    margin-bottom: 60px;
  }
  
  h1 {
    font-family: 'Arial Black', sans-serif;
    font-size: clamp(4rem, 15vw, 6rem);
    line-height: 0.85;
    margin: 0 0 20px 0;
    color: #fff;
    letter-spacing: -0.05em;
  }
  
  .line {
    height: 8px;
    background: #fff;
    width: 60%;
  }
  
  .message-block {
    background: #fff;
    border: 8px solid #000;
    padding: 30px 25px;
    margin-bottom: 40px;
    box-shadow: 
      inset 0 0 0 3px #fff,
      12px 12px 0 rgba(255,255,255,0.2);
  }
  
  .statement {
    font-family: 'Arial Black', sans-serif;
    font-size: 1.5rem;
    line-height: 1.2;
    margin: 0;
    color: #000;
    letter-spacing: -0.02em;
  }
  
  .info-panels {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin-bottom: 50px;
  }
  
  .panel {
    background: rgba(0,0,0,0.95);
    border: 4px solid #fff;
    padding: 20px 10px;
    text-align: center;
    box-shadow: inset 0 0 0 2px #000;
  }
  
  .panel-num {
    font-family: 'Arial Black', sans-serif;
    font-size: 2rem;
    color: #00ff00;
    line-height: 1;
    margin-bottom: 8px;
  }
  
  .panel-text {
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    color: #999;
  }
  
  .cta-section {
    margin-top: 50px;
  }
  
  .start-btn {
    width: 100%;
    background: #fff;
    border: none;
    padding: 25px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    box-shadow: 
      inset -5px -5px 0 rgba(0,0,0,0.2),
      inset 5px 5px 0 rgba(255,255,255,0.8);
    margin-bottom: 20px;
    min-height: 44px;
  }
  
  .start-btn:active {
    background: #00ff00;
    box-shadow: 
      inset 5px 5px 0 rgba(0,0,0,0.3),
      inset -5px -5px 0 rgba(255,255,255,0.5);
  }
  
  .btn-text {
    font-family: 'Arial Black', sans-serif;
    font-size: 1.6rem;
    letter-spacing: 0.05em;
    color: #000;
  }
  
  .btn-arrow {
    font-size: 2.5rem;
    line-height: 1;
    color: #000;
  }
  
  .fresh-btn {
    width: 100%;
    background: transparent;
    border: 2px solid #333;
    color: #666;
    padding: 15px;
    margin-top: 15px;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  
  .fresh-btn:hover {
    border-color: #ff0000;
    color: #ff0000;
  }
  
  .fresh-btn:active {
    background: #ff0000;
    color: #fff;
    border-color: #ff0000;
  }
  
  .disclaimer {
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    color: #666;
    text-align: center;
    line-height: 1.6;
    margin: 0;
  }
  
  @media (max-width: 480px) {
    h1 {
      font-size: clamp(3rem, 12vw, 4rem);
    }
    
    .message-block {
      padding: 20px 18px;
      border-width: 6px;
    }
    
    .statement {
      font-size: 1.2rem;
    }
    
    .info-panels {
      gap: 10px;
    }
    
    .panel {
      padding: 15px 8px;
    }
    
    .panel-num {
      font-size: 1.5rem;
    }
    
    .start-btn {
      padding: 20px 25px;
    }
    
    .btn-text {
      font-size: 1.3rem;
    }
    
    .btn-arrow {
      font-size: 2rem;
    }
  }
  
  @media (min-width: 768px) {
    .container {
      max-width: 600px;
    }
    
    .message-block {
      padding: 35px 30px;
    }
    
    .statement {
      font-size: 1.7rem;
    }
    
    .panel {
      padding: 25px 15px;
    }
  }
</style>
