// Visitor tracking script to be included in all pages
(function() {
  'use strict';

  // Only track in browser environment
  if (typeof window === 'undefined') return;

  // Configuration
  const config = {
    trackEndpoint: '/api/visitor/track',
    sessionDuration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    debounceTime: 1000, // 1 second debounce
    maxRetries: 3,
    retryDelay: 2000 // 2 seconds
  };

  let isTracking = false;
  let retryCount = 0;

  // Get current page information
  function getPageInfo() {
    return {
      url: window.location.href,
      path: window.location.pathname,
      title: document.title,
      referrer: document.referrer,
      timestamp: Date.now()
    };
  }

  // Send tracking data to server
  async function sendTrackingData(data, isRetrying = false) {
    if (isTracking && !isRetrying) {
      console.log('📊 Tracking already in progress, skipping...');
      return;
    }

    try {
      isTracking = true;
      
      const response = await fetch(config.trackEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Visitor tracked successfully:', result);
      
      // Reset retry count on success
      retryCount = 0;
      
      // Store current session info
      if (result.visitor) {
        window.visitorSession = result.visitor;
      }
      
    } catch (error) {
      console.error('❌ Tracking failed:', error);
      
      // Retry logic
      if (!isRetrying && retryCount < config.maxRetries) {
        retryCount++;
        console.log(`🔄 Retrying tracking (${retryCount}/${config.maxRetries})...`);
        
        setTimeout(() => {
          sendTrackingData(data, true);
        }, config.retryDelay * retryCount);
      }
    } finally {
      isTracking = false;
    }
  }

  // Debounced tracking function
  let trackingTimeout = null;
  function debouncedTrack() {
    if (trackingTimeout) {
      clearTimeout(trackingTimeout);
    }
    
    trackingTimeout = setTimeout(() => {
      const pageData = getPageInfo();
      sendTrackingData(pageData);
    }, config.debounceTime);
  }

  // Initialize tracking
  function initTracking() {
    console.log('🚀 Initializing visitor tracking...');
    
    // Track initial page load
    const initialData = getPageInfo();
    sendTrackingData({
      ...initialData,
      eventType: 'page_view',
      isInitialLoad: true
    });

    // Track page changes (for SPA navigation)
    let lastPath = window.location.pathname;
    
    // Override pushState for SPA tracking
    const originalPushState = window.history.pushState;
    window.history.pushState = function() {
      setTimeout(() => {
        const newPath = window.location.pathname;
        if (newPath !== lastPath) {
          lastPath = newPath;
          const pageData = getPageInfo();
          sendTrackingData({
            ...pageData,
            eventType: 'navigation',
            previousPath: lastPath
          });
        }
      }, 100);
      
      return originalPushState.apply(this, arguments);
    };

    // Override replaceState for SPA tracking
    const originalReplaceState = window.history.replaceState;
    window.history.replaceState = function() {
      setTimeout(() => {
        const newPath = window.location.pathname;
        if (newPath !== lastPath) {
          lastPath = newPath;
          const pageData = getPageInfo();
          sendTrackingData({
            ...pageData,
            eventType: 'navigation',
            previousPath: lastPath
          });
        }
      }, 100);
      
      return originalReplaceState.apply(this, arguments);
    };

    // Listen for popstate (browser back/forward)
    window.addEventListener('popstate', function(event) {
      setTimeout(() => {
        const newPath = window.location.pathname;
        if (newPath !== lastPath) {
          lastPath = newPath;
          const pageData = getPageInfo();
          sendTrackingData({
            ...pageData,
            eventType: 'navigation',
            previousPath: lastPath
          });
        }
      }, 100);
    });

    // Track page visibility changes (tab focus/blur)
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'visible') {
        const pageData = getPageInfo();
        sendTrackingData({
          ...pageData,
          eventType: 'page_focus',
          timeOnPage: performance.now()
        });
      }
    });

    // Track page unload
    window.addEventListener('beforeunload', function() {
      const pageData = getPageInfo();
      navigator.sendBeacon(config.trackEndpoint, JSON.stringify({
        ...pageData,
        eventType: 'page_unload',
        timeOnPage: performance.now()
      }));
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', function() {
      const scrollDepth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
      }
    });

    // Track engagement time
    let engagementStartTime = Date.now();
    let isActive = true;

    document.addEventListener('mousemove', function() {
      if (!isActive) {
        isActive = true;
        engagementStartTime = Date.now();
      }
    });

    document.addEventListener('keypress', function() {
      if (!isActive) {
        isActive = true;
        engagementStartTime = Date.now();
      }
    });

    // Track inactivity
    let inactivityTimer = null;
    function resetInactivityTimer() {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      
      inactivityTimer = setTimeout(() => {
        if (isActive) {
          isActive = false;
          const pageData = getPageInfo();
          sendTrackingData({
            ...pageData,
            eventType: 'user_inactive',
            activeTime: Date.now() - engagementStartTime
          });
        }
      }, 30000); // 30 seconds of inactivity
    }

    // Reset inactivity timer on user activity
    ['mousemove', 'keypress', 'scroll', 'click', 'touchstart'].forEach(event => {
      document.addEventListener(event, resetInactivityTimer);
    });

    // Initialize inactivity tracking
    resetInactivityTimer();

    console.log('✅ Visitor tracking initialized');
  }

  // Start tracking when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracking);
  } else {
    initTracking();
  }

})();
