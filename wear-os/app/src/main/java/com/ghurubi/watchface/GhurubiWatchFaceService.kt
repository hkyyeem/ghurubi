package com.ghurubi.watchface

import android.view.SurfaceHolder
import androidx.wear.watchface.*
import androidx.wear.watchface.style.CurrentUserStyleRepository

class GhurubiWatchFaceService : WatchFaceService() {
    override suspend fun createWatchFace(
        surfaceHolder: SurfaceHolder,
        watchState: WatchState,
        complicationSlotsManager: ComplicationSlotsManager,
        currentUserStyleRepository: CurrentUserStyleRepository
    ): WatchFace {
        val renderer = GhurubiRenderer(this, surfaceHolder, watchState, currentUserStyleRepository)
        return WatchFace(WatchFaceType.ANALOG, renderer).setTapListener(object : WatchFace.TapListener {
            override fun onTapEvent(tapType: Int, tapEvent: TapEvent, complicationSlot: ComplicationSlot?) {
                if (tapType != TapType.UP) return
                val ctx = this@GhurubiWatchFaceService
                // Bottom area: cycle prayer line (time -> countdown -> hidden). Elsewhere: seasonal <-> equal.
                if (tapEvent.yPos > renderer.screenBounds.height() * 0.72) Prefs.cyclePrayerMode(ctx)
                else Prefs.toggleSeasonal(ctx)
                renderer.invalidate()
            }
        })
    }
}
