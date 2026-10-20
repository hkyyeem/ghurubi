package com.ghurubi.watchface

import android.content.Context
import android.graphics.*
import android.view.SurfaceHolder
import androidx.wear.watchface.*
import androidx.wear.watchface.style.CurrentUserStyleRepository
import java.time.DayOfWeek
import java.time.ZonedDateTime
import kotlin.math.*

class GhurubiRenderer(
    private val context: Context,
    surfaceHolder: SurfaceHolder,
    watchState: WatchState,
    repo: CurrentUserStyleRepository
) : Renderer.CanvasRenderer2<GhurubiRenderer.Assets>(
    surfaceHolder, repo, watchState, CanvasType.HARDWARE, 1000L, false
) {
    class Assets : Renderer.SharedAssets { override fun onDestroy() {} }
    override suspend fun createSharedAssets() = Assets()

    // Mode colors: equal = indigo night / gold day, seasonal = teal night / amber day
    private val EQUAL_NIGHT = Color.parseColor("#5FA8FF")
    private val EQUAL_DAY = Color.parseColor("#F5B942")
    private val SEASONAL_NIGHT = Color.parseColor("#2DD4BF")
    private val SEASONAL_DAY = Color.parseColor("#FB923C")

    private val stroke = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE; strokeCap = Paint.Cap.ROUND }
    private val fill = Paint(Paint.ANTI_ALIAS_FLAG)
    private val text = Paint(Paint.ANTI_ALIAS_FLAG).apply { textAlign = Paint.Align.CENTER }

    private val days = mapOf(
        DayOfWeek.SATURDAY to "السبت", DayOfWeek.SUNDAY to "الأحد", DayOfWeek.MONDAY to "الاثنين",
        DayOfWeek.TUESDAY to "الثلاثاء", DayOfWeek.WEDNESDAY to "الأربعاء", DayOfWeek.THURSDAY to "الخميس",
        DayOfWeek.FRIDAY to "الجمعة"
    )

    override fun render(canvas: Canvas, bounds: Rect, zonedDateTime: ZonedDateTime, sharedAssets: Assets) {
        val ambient = renderParameters.drawMode == DrawMode.AMBIENT
        val seasonal = Prefs.seasonal(context)
        val lat = Prefs.lat(context); val lon = Prefs.lon(context)
        val now = zonedDateTime.toInstant().toEpochMilli()
        val t = GhurubiClock.compute(now, lat, lon, seasonal)
        val cx = bounds.exactCenterX(); val cy = bounds.exactCenterY(); val r = min(cx, cy)
        val dim = if (ambient) 140 else 255
        val accent = if (ambient) Color.WHITE else when {
            seasonal && t.isNight -> SEASONAL_NIGHT
            seasonal -> SEASONAL_DAY
            t.isNight -> EQUAL_NIGHT
            else -> EQUAL_DAY
        }
        canvas.drawColor(Color.BLACK)

        // Ticks: 12 at top = sunset / sunrise
        stroke.color = Color.WHITE
        for (i in 0 until 60) {
            val a = Math.toRadians(i * 6.0 - 90)
            val major = i % 5 == 0
            stroke.strokeWidth = if (major) r * 0.02f else r * 0.008f
            stroke.alpha = if (major) dim else dim / 3
            val r1 = r * (if (major) 0.86f else 0.9f); val r2 = r * 0.95f
            canvas.drawLine(cx + r1 * cos(a).toFloat(), cy + r1 * sin(a).toFloat(), cx + r2 * cos(a).toFloat(), cy + r2 * sin(a).toFloat(), stroke)
        }
        text.color = accent; text.textSize = r * 0.13f; text.alpha = dim
        canvas.drawText("12", cx, cy - r * 0.62f, text)

        // Progress arc in mode color
        if (!ambient) {
            stroke.color = accent; stroke.strokeWidth = r * 0.015f; stroke.alpha = 220
            val o = RectF(cx - r * 0.98f, cy - r * 0.98f, cx + r * 0.98f, cy + r * 0.98f)
            canvas.drawArc(o, -90f, (t.fraction * 360).toFloat(), false, stroke)
        }

        // Top third: natural day label (night after sunset belongs to the next day)
        val dayDate = if (t.isNight && zonedDateTime.hour >= 12) zonedDateTime.plusDays(1) else zonedDateTime
        val label = (if (t.isNight) "ليلة " else "نهار ") + days[dayDate.dayOfWeek]
        text.color = accent; text.textSize = r * 0.13f; text.alpha = dim
        canvas.drawText(label, cx, cy - r * 0.32f, text)

        // Bottom third, line 1: next prayer (no emoji)
        val mode = Prefs.prayerMode(context)
        if (mode != 2) GhurubiClock.nextPrayer(now, lat, lon)?.let { (name, at) ->
            val line = if (mode == 0) {
                val p = GhurubiClock.compute(at, lat, lon, seasonal)
                "$name %02d:%02d".format(p.hours, p.minutes)
            } else {
                val mins = ((at - now) / 60000).toInt()
                "$name بعد %d:%02d".format(mins / 60, mins % 60)
            }
            text.color = Color.WHITE; text.textSize = r * 0.12f; text.alpha = dim
            canvas.drawText(line, cx, cy + r * 0.40f, text)
        }

        // Hands on the 12-hour dial, drawn from Ghurubi time.
        val hourDeg = (t.hours % 12) * 30.0 + t.minutes * 0.5
        val minDeg = t.minutes * 6.0 + t.seconds * 0.1
        hand(canvas, cx, cy, hourDeg, r * 0.45f, r * 0.045f, dim, Color.WHITE)
        hand(canvas, cx, cy, minDeg, r * 0.7f, r * 0.03f, dim, Color.WHITE)
        if (!ambient) hand(canvas, cx, cy, t.seconds * 6.0, r * 0.78f, r * 0.01f, 255, accent)
        fill.color = accent; fill.alpha = dim
        canvas.drawCircle(cx, cy, r * 0.035f, fill)
    }

    private fun hand(c: Canvas, cx: Float, cy: Float, deg: Double, len: Float, w: Float, a: Int, col: Int) {
        val rad = Math.toRadians(deg - 90)
        stroke.color = col; stroke.strokeWidth = w; stroke.alpha = a
        c.drawLine(cx, cy, cx + len * cos(rad).toFloat(), cy + len * sin(rad).toFloat(), stroke)
    }

    override fun renderHighlightLayer(canvas: Canvas, bounds: Rect, zonedDateTime: ZonedDateTime, sharedAssets: Assets) {
        canvas.drawColor(renderParameters.highlightLayer!!.backgroundTint)
    }
}
