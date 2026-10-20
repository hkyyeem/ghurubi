package com.ghurubi.watchface

import java.time.LocalDate
import kotlin.math.*

/** Sun math at sea level (zenith 90.833°), same convention as Umm Al-Qura. */
object SunMath {
    private fun rad(d: Double) = d * PI / 180
    private fun deg(r: Double) = r * 180 / PI
    private fun toMs(j: Double) = ((j - 2440587.5) * 86400000.0).toLong()

    /** Returns (julian transit, declination radians). */
    private fun base(date: LocalDate, lon: Double): Pair<Double, Double> {
        val jdNoon = date.toEpochDay() + 2440587.5 + 0.5
        val n = ceil(jdNoon - 2451545.0 + 0.0008)
        val jStar = n - lon / 360.0
        val m = (357.5291 + 0.98560028 * jStar) % 360
        val c = 1.9148 * sin(rad(m)) + 0.02 * sin(rad(2 * m)) + 0.0003 * sin(rad(3 * m))
        val l = (m + c + 180 + 102.9372) % 360
        val jTransit = 2451545.0 + jStar + 0.0053 * sin(rad(m)) - 0.0069 * sin(rad(2 * l))
        return jTransit to asin(sin(rad(l)) * sin(rad(23.4397)))
    }

    /** Hour angle (degrees) at which the sun reaches altitude [alt]; null if never. */
    private fun hourAngle(alt: Double, lat: Double, d: Double): Double? {
        val cosW = (sin(rad(alt)) - sin(rad(lat)) * sin(d)) / (cos(rad(lat)) * cos(d))
        if (cosW < -1 || cosW > 1) return null
        return deg(acos(cosW))
    }

    /** Returns Pair(riseMillis, setMillis) or null in polar day/night. */
    fun riseSet(date: LocalDate, lat: Double, lon: Double): Pair<Long, Long>? {
        val (jt, d) = base(date, lon)
        val w = hourAngle(-0.833, lat, d) ?: return null
        return toMs(jt - w / 360) to toMs(jt + w / 360)
    }

    /** Umm Al-Qura: Fajr 18.5°, Asr one shadow (Shafi'i), Isha = Maghrib + 90 min. */
    fun prayers(date: LocalDate, lat: Double, lon: Double): List<Pair<String, Long>>? {
        val (jt, d) = base(date, lon)
        val set = hourAngle(-0.833, lat, d) ?: return null
        val fajr = hourAngle(-18.5, lat, d) ?: return null
        val asrAlt = deg(atan(1.0 / (1.0 + tan(abs(rad(lat) - d)))))
        val asr = hourAngle(asrAlt, lat, d) ?: return null
        val maghrib = toMs(jt + set / 360)
        return listOf(
            "الفجر" to toMs(jt - fajr / 360),
            "الظهر" to toMs(jt) + 60_000,
            "العصر" to toMs(jt + asr / 360),
            "المغرب" to maghrib,
            "العشاء" to maghrib + 90 * 60_000L,
        )
    }
}

data class GhurubiTime(val hours: Int, val minutes: Int, val seconds: Int, val isNight: Boolean, val fraction: Double)

object GhurubiClock {
    /** Night first: sunset = 00:00, sunrise = 12:00 (seasonal). */
    fun compute(now: Long, lat: Double, lon: Double, seasonal: Boolean): GhurubiTime {
        val today = java.time.Instant.ofEpochMilli(now).atZone(java.time.ZoneOffset.UTC).toLocalDate()
        val events = (-2..2).mapNotNull { SunMath.riseSet(today.plusDays(it.toLong()), lat, lon) }
        val sets = events.map { it.second }.sorted()
        val rises = events.map { it.first }.sorted()
        val last = sets.lastOrNull { it <= now }
        val next = sets.firstOrNull { it > now }
        if (last == null || next == null) return fromMillis(now % 86400000, 86400000, false)
        val rise = rises.firstOrNull { it in (last + 1) until next } ?: (last + (next - last) / 2)
        if (!seasonal) return fromMillis(now - last, next - last, now < rise)
        val h = 3600000.0
        val v = if (now < rise) (now - last).toDouble() / (rise - last) * 12 * h
                else 12 * h + (now - rise).toDouble() / (next - rise) * 12 * h
        return fromMillis(v.toLong(), (24 * h).toLong(), now < rise)
    }

    /** Next prayer after [now]: (name, millis). */
    fun nextPrayer(now: Long, lat: Double, lon: Double): Pair<String, Long>? {
        val today = java.time.Instant.ofEpochMilli(now).atZone(java.time.ZoneOffset.UTC).toLocalDate()
        return (-1..2).flatMap { SunMath.prayers(today.plusDays(it.toLong()), lat, lon) ?: emptyList() }
            .sortedBy { it.second }.firstOrNull { it.second > now }
    }

    private fun fromMillis(ms: Long, total: Long, night: Boolean): GhurubiTime {
        val s = (ms / 1000).toInt()
        return GhurubiTime((s / 3600) % 24, (s / 60) % 60, s % 60, night, ms.toDouble() / total)
    }
}
