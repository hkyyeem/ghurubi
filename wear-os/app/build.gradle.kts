plugins { id("com.android.application"); id("org.jetbrains.kotlin.android") }
android {
    namespace = "com.ghurubi.watchface"
    compileSdk = 34
    defaultConfig { applicationId = "com.ghurubi.watchface"; minSdk = 30; targetSdk = 34; versionCode = 2; versionName = "0.2" }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
    kotlinOptions { jvmTarget = "17" }
}
dependencies {
    implementation("androidx.wear.watchface:watchface:1.2.1")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")
}
