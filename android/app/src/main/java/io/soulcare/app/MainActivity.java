package io.soulcare.app;

import android.content.res.AssetManager;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.annotation.Nullable;

import com.getcapacitor.BridgeActivity;

import java.io.IOException;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "SoulCareApp";
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Complete startup process, then override WebView configuration
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                configureWebView();
            }
        }, 100); // Short delay to ensure bridge is fully setup
    }
    
    private void configureWebView() {
        try {
            // Check if public/index.html exists
            AssetManager assetManager = getAssets();
            String[] files = assetManager.list("public");
            boolean hasIndexHtml = false;
            
            for (String file : files) {
                if (file.equals("index.html")) {
                    hasIndexHtml = true;
                    break;
                }
            }
            
            // Get WebView from bridge
            WebView webView = this.bridge.getWebView();
            WebSettings settings = webView.getSettings();
            
            // Force extreme settings to prevent any external loading
            settings.setJavaScriptEnabled(true);
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(true);
            settings.setMediaPlaybackRequiresUserGesture(false);
            settings.setAllowFileAccess(true);
            settings.setAllowContentAccess(true);
            settings.setLoadsImagesAutomatically(true);
            settings.setUseWideViewPort(true);
            
            // Force disable network loads and caching
            settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
            settings.setBlockNetworkLoads(true); // Completely block network - only use assets
            settings.setBlockNetworkImage(true); // Block network images
            
            // Clear all caches brutally
            webView.clearCache(true);
            webView.clearHistory();
            webView.clearFormData();
            webView.clearSslPreferences();
            
            // Override WebViewClient to force local content
            webView.setWebViewClient(new WebViewClient() {
                @Override
                public void onPageFinished(WebView view, String url) {
                    super.onPageFinished(view, url);
                    Log.d(TAG, "Page finished loading: " + url);
                }
                
                @Override
                public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                    Uri uri = request.getUrl();
                    String path = uri.getPath();
                    String scheme = uri.getScheme();
                    String host = uri.getHost();
                    
                    Log.d(TAG, "Loading URL: " + uri.toString());
                    
                    // If it's trying to load anything from a web host, redirect to local assets
                    if (scheme != null && (scheme.equals("http") || scheme.equals("https"))) {
                        Log.d(TAG, "Blocked web request: " + uri.toString());
                        view.loadUrl("file:///android_asset/public/index.html");
                        return true;
                    }
                    
                    return false; // Let the WebView handle file:// URLs
                }
            });
            
            // Force direct loading of our local content
            String assetPath = hasIndexHtml 
                ? "file:///android_asset/public/index.html" 
                : "file:///android_asset/index.html";
                
            Log.d(TAG, "Loading direct asset path: " + assetPath);
            webView.loadUrl(assetPath);
            
        } catch (IOException e) {
            Log.e(TAG, "Error configuring WebView: " + e.getMessage());
        }
    }
}
