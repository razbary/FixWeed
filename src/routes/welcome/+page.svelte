<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  onMount(() => {
    const setupComplete = localStorage.getItem('fixweed_setup');
    if (!setupComplete) {
      goto('/');
      return;
    }
  });
  
  function start() {
    goto('/track');
  }
</script>

<main>
  <div class="container">
    <div class="logo-block">
      <h1>FIX<br>WEED</h1>
    </div>
    
    <div class="welcome-panel">
      <div class="welcome-title">WHAT THIS IS</div>
      <p>
        A private tool to track your relationship with weed.
        No judgment. No rules. Just data.
      </p>
    </div>
    
    <div class="purpose-panel">
      <div class="section">
        <div class="section-title">FOR QUITTERS</div>
        <p>Track days clean. See progress. Build momentum.</p>
      </div>
      
      <div class="divider"></div>
      
      <div class="section">
        <div class="section-title">FOR MODERATORS</div>
        <p>Monitor usage. Find patterns. Take control.</p>
      </div>
      
      <div class="divider"></div>
      
      <div class="section">
        <div class="section-title">FOR ANYONE</div>
        <p>Your pace. Your goals. Your success.</p>
      </div>
    </div>
    
    <div class="privacy-box">
      <div class="privacy-line">100% ANONYMOUS</div>
      <div class="privacy-line">ZERO TRACKING</div>
      <div class="privacy-line">YOUR DATA ONLY</div>
    </div>
    
    <button on:click={start} class="start-btn">
      <span class="btn-text">START TRACKING</span>
      <span class="btn-arrow">→</span>
    </button>
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
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px 20px;
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
    max-width: 550px;
  }
  
  .logo-block {
    background: #000;
    border: 6px solid #fff;
    padding: 20px 25px;
    box-shadow: 
      inset 0 0 0 2px #000,
      8px 8px 0 rgba(255,255,255,0.3);
    transform: rotate(-1deg);
    margin-bottom: 25px;
    width: fit-content;
  }
  
  h1 {
    font-family: 'Arial Black', sans-serif;
    font-size: 2.5rem;
    line-height: 0.85;
    margin: 0;
    color: #fff;
    letter-spacing: -0.05em;
  }
  
  .welcome-panel {
    background: #fff;
    border: 6px solid #000;
    padding: 20px 25px;
    margin-bottom: 20px;
    box-shadow: 
      inset 0 0 0 2px #fff,
      8px 8px 0 rgba(255,255,255,0.2);
  }
  
  .welcome-title {
    font-family: 'Arial Black', sans-serif;
    font-size: 1rem;
    color: #000;
    margin-bottom: 10px;
    letter-spacing: 0.05em;
  }
  
  .welcome-panel p {
    font-size: 0.9rem;
    color: #000;
    line-height: 1.5;
    margin: 0;
    letter-spacing: 0.01em;
  }
  
  .purpose-panel {
    background: rgba(0,0,0,0.95);
    border: 4px solid #00ff00;
    padding: 16px 22px;
    margin-bottom: 20px;
    box-shadow: inset 0 0 0 2px #000;
  }
  
  .section {
    padding: 6px 0;
  }
  
  .section-title {
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    color: #00ff00;
    margin-bottom: 5px;
    font-family: 'Arial Black', sans-serif;
  }
  
  .section p {
    font-size: 0.8rem;
    color: #999;
    line-height: 1.4;
    margin: 0;
  }
  
  .divider {
    height: 1px;
    background: #222;
    margin: 10px 0;
  }
  
  .privacy-box {
    background: #000;
    border: 3px solid #333;
    padding: 12px 18px;
    margin-bottom: 25px;
    box-shadow: inset 0 0 0 1px #000;
  }
  
  .privacy-line {
    font-size: 0.65rem;
    letter-spacing: 0.25em;
    color: #666;
    line-height: 1.6;
  }
  
  .start-btn {
    width: 100%;
    background: #fff;
    border: none;
    padding: 20px 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    box-shadow: 
      inset -5px -5px 0 rgba(0,0,0,0.2),
      inset 5px 5px 0 rgba(255,255,255,0.8);
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
    font-size: 1.3rem;
    letter-spacing: 0.05em;
    color: #000;
  }
  
  .btn-arrow {
    font-size: 2rem;
    line-height: 1;
    color: #000;
  }
  
  @media (max-width: 480px) {
    main {
      padding: 30px 15px;
    }
    
    .logo-block {
      padding: 20px 25px;
      margin-bottom: 25px;
    }
    
    h1 {
      font-size: 2.5rem;
    }
    
    .welcome-panel {
      padding: 20px 22px;
      border-width: 5px;
    }
    
    .welcome-title {
      font-size: 1rem;
    }
    
    .welcome-panel p {
      font-size: 0.85rem;
    }
    
    .purpose-panel {
      padding: 18px 20px;
    }
    
    .start-btn {
      padding: 18px 25px;
    }
    
    .btn-text {
      font-size: 1.2rem;
    }
    
    .btn-arrow {
      font-size: 1.8rem;
    }
  }
  
  @media (min-width: 768px) {
    main {
      padding: 20px;
    }
    
    .container {
      max-width: 600px;
    }
    
    .logo-block {
      padding: 22px 30px;
      margin-bottom: 22px;
    }
    
    h1 {
      font-size: 2.8rem;
    }
    
    .welcome-panel {
      padding: 22px 28px;
      margin-bottom: 18px;
    }
    
    .welcome-title {
      font-size: 1.1rem;
      margin-bottom: 10px;
    }
    
    .welcome-panel p {
      font-size: 0.95rem;
    }
    
    .purpose-panel {
      padding: 18px 25px;
      margin-bottom: 18px;
    }
    
    .section-title {
      font-size: 0.7rem;
    }
    
    .section p {
      font-size: 0.85rem;
    }
    
    .privacy-box {
      padding: 12px 20px;
      margin-bottom: 22px;
    }
    
    .start-btn {
      padding: 20px 30px;
    }
    
    .btn-text {
      font-size: 1.4rem;
    }
    
    .btn-arrow {
      font-size: 2.2rem;
    }
  }
</style>

