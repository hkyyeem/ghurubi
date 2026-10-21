package com.ghurubi.watchface

import android.content.Context

object Prefs {
    private fun p(c: Context) = c.getSharedPreferences("ghurubi", Context.MODE_PRIVATE)
    // Default: Riyadh city center
    fun lat(c: Context) = p(c).getFloat("lat", 24.7136f).toDouble()
    fun lon(c: Context) = p(c).getFloat("lon", 46.6753f).toDouble()
    fun setLocation(c: Context, lat: Double, lon: Double) =
        p(c).edit().putFloat("lat", lat.toFloat()).putFloat("lon", lon.toFloat()).apply()
    fun seasonal(c: Context) = p(c).getBoolean("seasonal", true)
    fun toggleSeasonal(c: Context) = p(c).edit().putBoolean("seasonal", !seasonal(c)).apply()

    /** 0 = next prayer Ghurubi time, 1 = countdown, 2 = hidden */
    fun prayerMode(c: Context) = p(c).getInt("prayer_mode", 0)
    fun cyclePrayerMode(c: Context) = p(c).edit().putInt("prayer_mode", (prayerMode(c) + 1) % 3).apply()
}
