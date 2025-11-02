<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  let sessions = 0;
  let days = 0;
  let avg = 0;
  let isLocalOnly = false;
  let showSyncPrompt = false;
  
  onMount(() => {
    const setupComplete = localStorage.getItem('fixweed_setup');
    if (!setupComplete) {
      goto('/');
      return;
    }
    
    isLocalOnly = setupComplete === 'local_only';
    const dismissed = localStorage.getItem('fixweed_sync_dismissed');
    showSyncPrompt = isLocalOnly && !dismissed;
    
    loadData();
  });
  
  function loadData() {
    const data = localStorage.getItem('fixweed_data');
    if (data) {
      const parsed = JSON.parse(data);
      sessions = parsed.sessions || 0;
      days = parsed.days || 0;
      avg = sessions > 0 && days > 0 ? (sessions / days).toFixed(1) : 0;
    }
  }
  
  function logUse() {
    sessions += 1;
    
    const today = new Date().toDateString();
    const lastLog = localStorage.getItem('fixweed_lastlog');
    
    if (lastLog !== today) {
      days += 1;
      localStorage.setItem('fixweed_lastlog', today);
    }
    
    const data = { sessions, days };
    localStorage.setItem('fixweed_data', JSON.stringify(data));
    
    avg = days > 0 ? (sessions / days).toFixed(1) : 0;
  }
  
  function dismissSyncPrompt() {
    showSyncPrompt = false;
    localStorage.setItem('fixweed_sync_dismissed', 'true');
  }
  
  function goToEnableSync() {
    goto('/enable-sync');
  }
</script>

<main>
  <div class="data-bar">
    <a href="/" class="home-link">←</a>
    <span class="stat">{days}D</span>
    <span class="stat">{sessions}×</span>
    <span class="stat">{avg}AVG</span>
  </div>
  
  {#if showSyncPrompt}
    <div class="sync-banner">
      <div class="banner-content">
        <div class="banner-text">
          <div class="banner-title">ENABLE SYNC?</div>
          <div class="banner-desc">Sync your data across devices with encryption</div>
        </div>
        <div class="banner-actions">
          <button on:click={goToEnableSync} class="banner-btn enable">ENABLE</button>
          <button on:click={dismissSyncPrompt} class="banner-btn dismiss">×</button>
        </div>
      </div>
    </div>
  {/if}
  
  <div class="title-block">
    <h1>FIX<br>WEED</h1>
    <div class="subtitle">USAGE TRACKER</div>
  </div>
  
  <div class="data-panel left">
    <div class="panel-label">YOUR DATA</div>
    <div class="data-num">{sessions}</div>
    <div class="data-label">SESSIONS</div>
  </div>
  
  <div class="data-panel right">
    <div class="panel-label">TRACKED</div>
    <div class="data-num">{days}</div>
    <div class="data-label">DAYS</div>
  </div>
  
  <div class="track-zone">
    <div class="track-inner">
      <button on:click={logUse} class="track-btn">
        <span class="btn-label">LOG USE</span>
        <span class="btn-arrow">→</span>
      </button>
      <div class="track-note">NO SHAME / NO JUDGMENT / JUST DATA</div>
      
      {#if isLocalOnly && !showSyncPrompt}
        <button on:click={goToEnableSync} class="enable-sync-small">
          ENABLE SYNC →
        </button>
      {/if}
    </div>
  </div>
  
  <div class="grid-overlay"></div>
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
    position: relative;
    background: 
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(255,255,255,0.02) 2px,
        rgba(255,255,255,0.02) 4px
      );
  }
  
  .data-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: #fff;
    border-bottom: 8px solid #000;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 40px;
    z-index: 100;
    box-shadow: 0 8px 0 rgba(0,0,0,0.3);
    padding: 0 20px;
  }
  
  .home-link {
    position: absolute;
    left: 20px;
    font-size: 1.8rem;
    color: #000;
    text-decoration: none;
    line-height: 1;
    padding: 5px;
  }
  
  .home-link:active {
    color: #00ff00;
  }
  
  .stat {
    font-family: 'Arial Black', sans-serif;
    font-size: 1.2rem;
    letter-spacing: -0.05em;
    color: #000;
  }
  
  .sync-banner {
    position: fixed;
    top: 68px;
    left: 0;
    right: 0;
    z-index: 90;
    background: #00ff00;
    border-bottom: 4px solid #000;
    padding: 15px 20px;
    box-shadow: 0 4px 0 rgba(0,0,0,0.2);
  }
  
  .banner-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
  }
  
  .banner-text {
    flex: 1;
  }
  
  .banner-title {
    font-family: 'Arial Black', sans-serif;
    font-size: 0.9rem;
    color: #000;
    letter-spacing: 0.05em;
    margin-bottom: 2px;
  }
  
  .banner-desc {
    font-size: 0.7rem;
    color: #000;
    opacity: 0.7;
  }
  
  .banner-actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  
  .banner-btn {
    background: #000;
    color: #fff;
    border: none;
    padding: 8px 15px;
    font-family: 'Arial Black', sans-serif;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    cursor: pointer;
    box-shadow: 
      inset -2px -2px 0 rgba(255,255,255,0.2),
      inset 2px 2px 0 rgba(0,0,0,0.5);
  }
  
  .banner-btn:active {
    box-shadow: 
      inset 2px 2px 0 rgba(0,0,0,0.5),
      inset -2px -2px 0 rgba(255,255,255,0.2);
  }
  
  .banner-btn.dismiss {
    padding: 8px 12px;
    font-size: 1.2rem;
    line-height: 1;
  }
  
  .title-block {
    position: fixed;
    top: 140px;
    left: 15px;
    z-index: 50;
    background: #000;
    border: 6px solid #fff;
    padding: 15px 20px;
    box-shadow: 
      inset 0 0 0 2px #000,
      8px 8px 0 rgba(255,255,255,0.3);
    transform: rotate(-2deg);
  }
  
  h1 {
    font-size: 3rem;
    font-weight: 900;
    line-height: 0.85;
    margin: 0;
    color: #fff;
    font-family: 'Arial Black', sans-serif;
    letter-spacing: -0.05em;
  }
  
  .subtitle {
    font-size: 0.65rem;
    letter-spacing: 0.3em;
    color: #00ff00;
    margin-top: 8px;
    font-weight: normal;
  }
  
  .data-panel {
    position: fixed;
    z-index: 40;
    background: rgba(0,0,0,0.95);
    border: 5px solid #fff;
    padding: 15px;
    box-shadow: inset 0 0 0 2px #000;
    min-width: 120px;
  }
  
  .data-panel.left {
    top: 300px;
    left: 20px;
    transform: rotate(1deg);
  }
  
  .data-panel.right {
    top: 400px;
    right: 20px;
    transform: rotate(-1.5deg);
  }
  
  .panel-label {
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    color: #666;
    margin-bottom: 5px;
  }
  
  .data-num {
    font-family: 'Arial Black', sans-serif;
    font-size: 3.5rem;
    line-height: 1;
    color: #fff;
    text-shadow: 3px 3px 0 rgba(0,255,0,0.3);
  }
  
  .data-label {
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    color: #999;
    margin-top: 2px;
  }
  
  .track-zone {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 60;
    background: #000;
    border-top: 8px solid #fff;
  }
  
  .track-inner {
    padding: 25px 20px 30px;
  }
  
  .track-btn {
    width: 100%;
    background: #fff;
    color: #000;
    border: none;
    padding: 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    box-shadow: 
      inset -4px -4px 0 rgba(0,0,0,0.2),
      inset 4px 4px 0 rgba(255,255,255,0.8);
  }
  
  .track-btn:active {
    background: #00ff00;
    box-shadow: 
      inset 4px 4px 0 rgba(0,0,0,0.3),
      inset -4px -4px 0 rgba(255,255,255,0.5);
  }
  
  .btn-label {
    font-family: 'Arial Black', sans-serif;
    font-size: 1.4rem;
    letter-spacing: 0.1em;
  }
  
  .btn-arrow {
    font-size: 2rem;
    line-height: 1;
  }
  
  .track-note {
    margin-top: 12px;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    color: #666;
    text-align: center;
  }
  
  .enable-sync-small {
    width: 100%;
    background: transparent;
    border: 2px solid #00ff00;
    color: #00ff00;
    padding: 12px;
    margin-top: 15px;
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  
  .enable-sync-small:active {
    background: #00ff00;
    color: #000;
  }
  
  .grid-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 2;
    background-image: 
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 19px,
        rgba(255,255,255,0.015) 19px,
        rgba(255,255,255,0.015) 20px
      ),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 19px,
        rgba(255,255,255,0.015) 19px,
        rgba(255,255,255,0.015) 20px
      );
  }
  
  @media (min-width: 768px) {
    .title-block {
      left: 40px;
      padding: 20px 30px;
      top: 140px;
    }
    
    h1 {
      font-size: 4rem;
    }
    
    .data-panel.left {
      left: 40px;
      top: 300px;
    }
    
    .data-panel.right {
      right: 40px;
      top: 400px;
    }
    
    .track-inner {
      max-width: 600px;
      margin: 0 auto;
    }
  }
</style>

