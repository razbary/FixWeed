<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  let isLocalOnly = false;
  let username = '';
  let showProfilePrompt = false;
  let profile: any = null;
  let insights: string[] = [];
  
  onMount(() => {
    const setupComplete = localStorage.getItem('fixweed_setup');
    if (!setupComplete) {
      goto('/');
      return;
    }
    
    isLocalOnly = setupComplete === 'local_only';
    username = localStorage.getItem('fixweed_username') || '';
    
    // Check if profile exists
    const profileData = localStorage.getItem('fixweed_profile');
    if (profileData) {
      try {
        profile = JSON.parse(profileData);
        if (!profile.skipped) {
          insights = generateInsights(profile);
        }
        showProfilePrompt = false;
      } catch {
        showProfilePrompt = true;
      }
    } else {
      showProfilePrompt = true;
    }
  });
  
  function generateInsights(prof: any): string[] {
    const results: string[] = [];
    
    if (prof.frequency) {
      results.push(`FREQUENCY: ${prof.frequency}`);
    }
    
    if (prof.method) {
      results.push(`METHOD: ${prof.method}`);
    }
    
    if (prof.amountPerSession) {
      results.push(`AMOUNT: ${prof.amountPerSession}`);
    }
    
    if (prof.smokingDuration) {
      results.push(`SMOKING FOR: ${prof.smokingDuration}`);
    }
    
    if (prof.longestBreak) {
      results.push(`LONGEST BREAK: ${prof.longestBreak}`);
    }
    
    if (prof.source) {
      results.push(`SOURCE: ${prof.source}`);
    }
    
    return results;
  }
  
  function goToEnableSync() {
    goto('/enable-sync');
  }
  
  function goToProfile() {
    goto('/profile');
  }
  
  function dismissProfilePrompt() {
    showProfilePrompt = false;
  }
</script>

<main>
  <div class="top-bar">
    <a href="/" class="home-link">←</a>
    <div class="page-title">{username ? `${username.toUpperCase()}'S INSIGHT HUB` : 'INSIGHT HUB'}</div>
  </div>
  
  {#if showProfilePrompt}
    <div class="profile-banner">
      <div class="banner-content">
        <div class="banner-text">
          <div class="banner-title">SET UP STONER PROFILE?</div>
          <div class="banner-desc">See your usage patterns (anonymous)</div>
        </div>
        <div class="banner-actions">
          <button on:click={goToProfile} class="banner-btn setup">SETUP</button>
          <button on:click={dismissProfilePrompt} class="banner-btn dismiss">×</button>
        </div>
      </div>
    </div>
  {/if}
  
  <div class="content">
    {#if insights.length > 0}
      <div class="title-block">
        <h1>FIX<br>WEED</h1>
        <div class="blurb">
          quit on your timeline.<br>no rules, no shame.<br>just honest tracking.
        </div>
      </div>
      
      <div class="insights-panel">
        <div class="insights-title">YOUR PROFILE</div>
        {#each insights as insight}
          <div class="insight-item">{insight}</div>
        {/each}
      </div>
      
      {#if isLocalOnly}
        <button on:click={goToEnableSync} class="enable-sync-small">
          ENABLE SYNC →
        </button>
      {/if}
    {:else}
      <div class="empty-state">
        <div class="empty-title">NO PROFILE DATA</div>
        <div class="empty-desc">Set up your profile to see your details</div>
        <button on:click={goToProfile} class="setup-profile-btn">
          SETUP PROFILE
        </button>
      </div>
    {/if}
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
  
  .top-bar {
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
  
  .page-title {
    font-family: 'Arial Black', sans-serif;
    font-size: clamp(0.65rem, 3.5vw, 1.2rem);
    letter-spacing: 0.15em;
    color: #000;
    text-align: center;
    flex: 1;
    padding: 0 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .profile-banner {
    position: fixed;
    top: 68px;
    left: 0;
    right: 0;
    z-index: 90;
    background: #fff;
    border-bottom: 4px solid #000;
    padding: 12px 20px;
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
    font-size: 0.85rem;
    color: #000;
    letter-spacing: 0.05em;
    margin-bottom: 2px;
  }
  
  .banner-desc {
    font-size: 0.65rem;
    color: #000;
    opacity: 0.6;
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
    font-size: 0.75rem;
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
    font-size: 1.1rem;
    line-height: 1;
  }
  
  .content {
    padding: 80px 20px 40px;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .title-block {
    background: #000;
    border: 6px solid #fff;
    padding: 20px 25px;
    box-shadow: 
      inset 0 0 0 2px #000,
      8px 8px 0 rgba(255,255,255,0.3);
    transform: rotate(-1deg);
    margin-bottom: 30px;
  }
  
  .blurb {
    font-size: 0.75rem;
    color: #999;
    line-height: 1.6;
    letter-spacing: 0.02em;
    margin-top: 15px;
  }
  
  h1 {
    font-size: 2.5rem;
    font-weight: 900;
    line-height: 0.85;
    margin: 0;
    color: #fff;
    font-family: 'Arial Black', sans-serif;
    letter-spacing: -0.05em;
  }
  
  .insights-panel {
    background: rgba(0,0,0,0.95);
    border: 4px solid #00ff00;
    padding: 18px 20px;
    box-shadow: inset 0 0 0 2px #000;
    margin-bottom: 25px;
  }
  
  .insights-title {
    font-size: 0.7rem;
    letter-spacing: 0.25em;
    color: #00ff00;
    margin-bottom: 12px;
    font-family: 'Arial Black', sans-serif;
  }
  
  .insight-item {
    font-size: 0.8rem;
    color: #999;
    margin-bottom: 6px;
    letter-spacing: 0.05em;
    line-height: 1.5;
  }
  
  .insight-item:last-child {
    margin-bottom: 0;
  }
  
  .empty-state {
    text-align: center;
    padding: 60px 20px;
  }
  
  .empty-title {
    font-family: 'Arial Black', sans-serif;
    font-size: 1.5rem;
    color: #fff;
    margin-bottom: 15px;
    letter-spacing: 0.1em;
  }
  
  .empty-desc {
    font-size: 0.9rem;
    color: #999;
    margin-bottom: 30px;
  }
  
  .setup-profile-btn {
    background: #fff;
    border: none;
    padding: 18px 30px;
    font-family: 'Arial Black', sans-serif;
    font-size: 1rem;
    letter-spacing: 0.1em;
    cursor: pointer;
    box-shadow: 
      inset -4px -4px 0 rgba(0,0,0,0.2),
      inset 4px 4px 0 rgba(255,255,255,0.8);
    color: #000;
  }
  
  .setup-profile-btn:active {
    background: #00ff00;
    box-shadow: 
      inset 4px 4px 0 rgba(0,0,0,0.3),
      inset -4px -4px 0 rgba(255,255,255,0.5);
  }
  
  .enable-sync-small {
    width: 100%;
    background: transparent;
    border: 1px solid #444;
    color: #666;
    padding: 10px;
    margin-top: 15px;
    font-family: 'Courier New', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    cursor: pointer;
  }
  
  .enable-sync-small:hover {
    border-color: #00ff00;
    color: #00ff00;
  }
  
  .enable-sync-small:active {
    background: #00ff00;
    color: #000;
    border-color: #00ff00;
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
  
  @media (min-width: 600px) {
    .title-block {
      display: flex;
      gap: 25px;
      align-items: center;
    }
    
    .blurb {
      margin-top: 0;
      flex: 1;
    }
  }
  
  @media (min-width: 768px) {
    .content {
      padding: 100px 40px 60px;
    }
    
    h1 {
      font-size: 3rem;
    }
    
    .title-block {
      padding: 25px 35px;
      gap: 30px;
    }
    
    .blurb {
      font-size: 0.85rem;
    }
    
    .insights-panel {
      padding: 25px 30px;
    }
    
    .page-title {
      letter-spacing: 0.3em;
    }
  }
</style>

