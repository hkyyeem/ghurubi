package com.ghurubi.watchface

import android.Manifest
import android.app.Activity
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationManager
import android.os.Bundle
import android.view.Gravity
import android.widget.TextView

/** Opens once to grant location; stores rounded (city-level) coordinates for the watch face. */
class SetupActivity : Activity() {
    private lateinit var text: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        text = TextView(this).apply { gravity = Gravity.CENTER; textSize = 14f; setPadding(24, 24, 24, 24) }
        setContentView(text)
        text.text = "جارٍ تحديد الموقع…"
        if (checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(arrayOf(Manifest.permission.ACCESS_COARSE_LOCATION, Manifest.permission.ACCESS_FINE_LOCATION), 1)
        } else locate()
    }

    override fun onRequestPermissionsResult(rc: Int, p: Array<out String>, r: IntArray) {
        super.onRequestPermissionsResult(rc, p, r)
        if (r.any { it == PackageManager.PERMISSION_GRANTED }) locate()
        else text.text = "بدون إذن الموقع سيُستخدم موقع الرياض"
    }

    @Suppress("MissingPermission")
    private fun locate() {
        val lm = getSystemService(LocationManager::class.java)
        val last = lm.getProviders(true).mapNotNull { lm.getLastKnownLocation(it) }.maxByOrNull { it.time }
        if (last != null) save(last)
        val provider = if (lm.isProviderEnabled(LocationManager.GPS_PROVIDER)) LocationManager.GPS_PROVIDER
                       else LocationManager.NETWORK_PROVIDER
        runCatching { lm.getCurrentLocation(provider, null, mainExecutor) { it?.let(::save) } }
    }

    private fun save(l: Location) {
        // Round to ~1 km so time is city-level and stable
        val lat = Math.round(l.latitude * 100) / 100.0
        val lon = Math.round(l.longitude * 100) / 100.0
        Prefs.setLocation(this, lat, lon)
        text.text = "تم حفظ الموقع\n$lat, $lon\n\nاختر وجه Ghurubi من قائمة وجوه الساعة"
    }
}
