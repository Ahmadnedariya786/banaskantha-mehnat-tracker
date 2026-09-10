package com.mehnat.tracker

import android.app.DownloadManager
import android.content.Context
import android.content.Intent
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.Bundle
import android.os.Environment
import android.os.Handler
import android.os.Looper
import android.view.View
import android.webkit.CookieManager
import android.webkit.DownloadListener
import android.webkit.URLUtil
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.LinearLayout
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var splashScreen: LinearLayout
    private lateinit var errorScreen: LinearLayout
    private lateinit var retryButton: Button
    private val TARGET_URL = "https://banaskantha-mehnat-tracker.vercel.app"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        splashScreen = findViewById(R.id.splashScreen)
        errorScreen = findViewById(R.id.errorScreen)
        retryButton = findViewById(R.id.retryButton)

        setupWebView()

        retryButton.setOnClickListener {
            checkInternetAndLoad()
        }

        // Show splash for 2 seconds then check internet
        Handler(Looper.getMainLooper()).postDelayed({
            splashScreen.visibility = View.GONE
            checkInternetAndLoad()
        }, 2000)
    }

    private fun setupWebView() {
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.databaseEnabled = true
        webView.settings.allowFileAccess = true

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url.toString()
                if (url.startsWith("https://wa.me") || url.startsWith("mailto:") || url.startsWith("tel:")) {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        startActivity(intent)
                    } catch (e: Exception) {
                        Toast.makeText(this@MainActivity, "એપ ઉપલબ્ધ નથી", Toast.LENGTH_SHORT).show()
                    }
                    return true
                }
                return super.shouldOverrideUrlLoading(view, request)
            }
        }

        webView.addJavascriptInterface(AndroidDownloader(this), "AndroidDownloader")

        webView.webChromeClient = WebChromeClient()

        webView.setDownloadListener(DownloadListener { url, userAgent, contentDisposition, mimetype, contentLength ->
            if (url.startsWith("blob:")) {
                val js = """
                    (function() {
                        var xhr = new XMLHttpRequest();
                        xhr.open('GET', '$url', true);
                        xhr.responseType = 'blob';
                        xhr.onload = function(e) {
                            if (this.status == 200) {
                                var blob = this.response;
                                var reader = new FileReader();
                                reader.readAsDataURL(blob);
                                reader.onloadend = function() {
                                    var base64data = reader.result;
                                    var filename = window.AndroidPreparedFilename || 'download';
                                    var mime = window.AndroidPreparedMime || '$mimetype';
                                    window.AndroidDownloader.saveBase64(base64data, filename, mime);
                                }
                            }
                        };
                        xhr.send();
                    })();
                """.trimIndent()
                webView.evaluateJavascript(js, null)
                return@DownloadListener
            }

            try {
                val request = DownloadManager.Request(Uri.parse(url))
                request.setMimeType(mimetype)
                val cookies = CookieManager.getInstance().getCookie(url)
                request.addRequestHeader("cookie", cookies)
                request.addRequestHeader("User-Agent", userAgent)
                request.setDescription("Downloading file...")
                request.setTitle(URLUtil.guessFileName(url, contentDisposition, mimetype))
                request.allowScanningByMediaScanner()
                request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, URLUtil.guessFileName(url, contentDisposition, mimetype))
                
                val dm = getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
                dm.enqueue(request)
                Toast.makeText(applicationContext, "ડાઉનલોડ શરૂ થયું...", Toast.LENGTH_LONG).show()
            } catch (e: Exception) {
                Toast.makeText(applicationContext, "ડાઉનલોડ નિષ્ફળ: " + e.message, Toast.LENGTH_LONG).show()
            }
        })
    }

    inner class AndroidDownloader(private val context: Context) {
        @android.webkit.JavascriptInterface
        fun saveBase64(base64Data: String, filename: String, mimeType: String) {
            try {
                val pureBase64 = if (base64Data.contains(",")) base64Data.split(",")[1] else base64Data
                val bytes = android.util.Base64.decode(pureBase64, android.util.Base64.DEFAULT)
                
                val values = android.content.ContentValues().apply {
                    put(android.provider.MediaStore.MediaColumns.DISPLAY_NAME, filename)
                    put(android.provider.MediaStore.MediaColumns.MIME_TYPE, mimeType)
                    put(android.provider.MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
                }

                val uri = context.contentResolver.insert(android.provider.MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)
                if (uri != null) {
                    context.contentResolver.openOutputStream(uri)?.use {
                        it.write(bytes)
                    }
                    Handler(Looper.getMainLooper()).post {
                        Toast.makeText(context, "ડાઉનલોડ સફળ ✅", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    val file = java.io.File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), filename)
                    java.io.FileOutputStream(file).use {
                        it.write(bytes)
                    }
                    Handler(Looper.getMainLooper()).post {
                        Toast.makeText(context, "ડાઉનલોડ સફળ ✅", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                Handler(Looper.getMainLooper()).post {
                    Toast.makeText(context, "ડાઉનલોડ નિષ્ફળ ❌", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun checkInternetAndLoad() {
        if (isNetworkAvailable()) {
            errorScreen.visibility = View.GONE
            webView.visibility = View.VISIBLE
            webView.loadUrl(TARGET_URL)
        } else {
            webView.visibility = View.GONE
            errorScreen.visibility = View.VISIBLE
        }
    }

    private fun isNetworkAvailable(): Boolean {
        val connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val activeNetwork = connectivityManager.activeNetwork ?: return false
        val capabilities = connectivityManager.getNetworkCapabilities(activeNetwork) ?: return false
        return capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
    }

    override fun onBackPressed() {
        if (webView.visibility == View.VISIBLE && webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}